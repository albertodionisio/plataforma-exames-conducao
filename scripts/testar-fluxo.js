#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

(async function main() {
  class FakeApp {
    constructor(){ this._html=""; this.listeners={}; this.lastFocused=null; }
    set innerHTML(v){
      this._html=String(v);
      if (this._html.includes("id='tempo'")) timerNodes.tempo={textContent:""};
      else delete timerNodes.tempo;
    }
    get innerHTML(){ return this._html; }
    addEventListener(n,fn){ this.listeners[n]=fn; }
    querySelector(selector){
      if (selector === "#titulo-pergunta" && this._html.includes("id='titulo-pergunta'")) {
        return {focus:()=>{this.lastFocused="titulo";}};
      }
      const m=selector.match(/data-indice='(\d+)'/);
      if (m && this._html.includes("data-indice='"+m[1]+"'")) {
        return {focus:()=>{this.lastFocused="alternativa:"+m[1];}};
      }
      return null;
    }
    contains(node){
      for(let actual=node;actual;actual=actual.parentElement){
        if(actual===this)return true;
      }
      return false;
    }
    click(action, attrs={}, clickDescendant=false) {
      const values=Object.assign({"data-action":action},attrs);
      const actionNode={
        parentElement:this,
        getAttribute(k){return values[k]===undefined?null:String(values[k]);},
        matches(selector){
          if(selector==="[data-action]")return values["data-action"]!==undefined;
          const prefix='[data-action="';
          return selector.startsWith(prefix) && selector.endsWith('"]') &&
            String(values["data-action"])===selector.slice(prefix.length,-2);
        },
        closest(selector){
          for(let actual=this;actual;actual=actual.parentElement){
            if(typeof actual.matches==="function" && actual.matches(selector))return actual;
          }
          return null;
        }
      };
      // Reproduz tanto o clique no próprio controlo como o clique num SVG/texto
      // interno que deve subir até ao elemento que contém data-action.
      const target=clickDescendant?{
        parentElement:actionNode,
        matches(){return false;},
        closest:actionNode.closest
      }:actionNode;
      this.listeners.click({target});
    }
  }
  const app=new FakeApp(), name={textContent:""}, timerNodes={};
  const document={
    title:"",
    documentElement:{setAttribute(){},style:{}},
    getElementById(id){ if(id==="app")return app;if(id==="nome")return name;return timerNodes[id]||null; }
  };
  const listeners={};
  let hash="";
  const location={origin:"https://estrada.example",pathname:"/",
    get hash(){return hash;},
    set hash(v){
      if(hash===v)return;
      hash=v;
      queueMicrotask(()=>{if(typeof listeners.hashchange==="function")listeners.hashchange();});
    }
  };
  const storage={}, session={};
  const localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v;},removeItem:k=>{delete storage[k];}};
  const sessionStorage={getItem:k=>session[k]||null,setItem:(k,v)=>{session[k]=v;},removeItem:k=>{delete session[k];}};
  let intervalCallback=null, agora=1700000000000, confirmar=true;
  const confirmacoes=[];
  class FakeDate extends Date { static now(){ return agora; } }
  const authState={user:null,listener:null,calls:[]};
  function makeUser(email, verified, providerId) {
    return {uid:"uid-teste",email,emailVerified:verified,displayName:"Candidato",
      photoURL:null,providerData:[{providerId:providerId||"password"}],
      sendEmailVerification(){authState.calls.push({method:"verification"});return Promise.resolve();}};
  }
  authState.user=makeUser("candidato@estrada.test",true,"password");
  const fakeAuth={
    setPersistence(){return Promise.resolve();},
    onAuthStateChanged(fn){authState.listener=fn;queueMicrotask(()=>fn(authState.user));return ()=>{};},
    getRedirectResult(){return Promise.resolve(null);},
    signInWithEmailAndPassword(email,password){
      authState.calls.push({method:"login",email,password});
      authState.user=makeUser(email,true,"password");
      if(authState.listener)queueMicrotask(()=>authState.listener(authState.user));
      return Promise.resolve({user:authState.user});
    },
    createUserWithEmailAndPassword(email,password){
      authState.calls.push({method:"registo",email,password});
      authState.user=makeUser(email,false,"password");
      if(authState.listener)queueMicrotask(()=>authState.listener(authState.user));
      return Promise.resolve({user:authState.user});
    },
    signInWithPopup(provider){
      authState.calls.push({method:"google",provider:provider.providerId});
      authState.user=makeUser("google@estrada.test",true,"google.com");
      if(authState.listener)queueMicrotask(()=>authState.listener(authState.user));
      return Promise.resolve({user:authState.user});
    },
    signInWithRedirect(){return Promise.resolve();},
    sendPasswordResetEmail(email){authState.calls.push({method:"reset",email});return Promise.resolve();},
    signOut(){
      authState.user=null;
      if(authState.listener)queueMicrotask(()=>authState.listener(null));
      return Promise.resolve();
    }
  };
  const authFactory=()=>fakeAuth;
  authFactory.Auth={Persistence:{LOCAL:"local"}};
  authFactory.GoogleAuthProvider=class {
    constructor(){this.providerId="google";}
    setCustomParameters(){}
  };
  const fakeDb={collection(){return {doc(){return {
    get(){return Promise.resolve({exists:false});},
    set(){return Promise.resolve();}
  };}};}};
  function firestoreFactory(){return fakeDb;}
  firestoreFactory.FieldValue={serverTimestamp(){return {__serverTimestamp:true};}};
  const firebase={apps:[],initializeApp(){const a={};this.apps.push(a);return a;},
    app(){return this.apps[0];},auth:authFactory,firestore:firestoreFactory};
  const window={APP:null,EXAMES:{},firebase,addEventListener:(n,fn)=>{listeners[n]=fn;}};
  const fakeSetInterval=fn=>{intervalCallback=fn;return 1;};
  const fakeClearInterval=()=>{intervalCallback=null;};
  const context={
    window,document,location,localStorage,sessionStorage,Date:FakeDate,Math,JSON,Object,Array,String,Number,
    setInterval:fakeSetInterval,clearInterval:fakeClearInterval,confirm:msg=>{confirmacoes.push(msg);return confirmar;},
    queueMicrotask,console
  };
  vm.createContext(context);
  const root=path.join(__dirname,"..");
  const appSource=fs.readFileSync(path.join(root,"app.js"),"utf8");
  const indexSource=fs.readFileSync(path.join(root,"index.html"),"utf8");
  for(let n=26;n<=30;n++){
    const tag=`<script src="data/exames/exame${n}.js"></script>`;
    assert.ok(indexSource.includes(tag), "O Exame "+n+" deve estar registado no index.html");
    assert.ok(indexSource.indexOf(tag)<indexSource.indexOf('<script src="app.js"></script>'), "O Exame "+n+" deve carregar antes de app.js");
  }
  vm.runInContext(fs.readFileSync(path.join(root,"config.js"),"utf8"),context);
  assert.equal(context.window.APP.modoTesteAcessoPago,true,
    "A configuração actual de testes deve manter os exames abertos");
  assert.deepEqual(Array.from(context.window.APP.examesAbertosTeste),[1,51],
    "O intervalo de testes deve abranger os Exames 1 a 51");
  for(const n of [1,...Array.from({length:5},(_,i)=>i+26),...Array.from({length:21},(_,i)=>i+31)]){
    const file=path.join(root,"data","exames","exame"+n+".js");
    if(fs.existsSync(file))vm.runInContext(fs.readFileSync(file,"utf8"),context);
  }
  vm.runInContext(appSource,context);
  async function navegar(destino){
    location.hash=destino;
    await new Promise(resolve=>setImmediate(resolve));
  }

  assert.equal(name.textContent,"ESTRADA");
  assert.equal(typeof listeners.hashchange,"function");
  await navegar("#/exames");
  for(let n=26;n<=30;n++)assert.ok(app.innerHTML.includes("Exame "+n) && app.innerHTML.includes("Aberto para testes"), "Exame "+n+" deve aparecer aberto no catálogo");
  for(let n=31;n<=51;n++)assert.ok(app.innerHTML.includes("Exame "+n) && app.innerHTML.includes("Aberto para testes"));
  for(let n=26;n<=30;n++){
    await navegar("#/exame/"+n);
    assert.match(app.innerHTML,/Pergunta 1 de 25/,"Exame "+n+" deve abrir com 25 perguntas");
    assert.ok(app.innerHTML.includes("public/exames/exame"+n+"/exame"+n+"_1.jpg"),"A imagem da primeira pergunta do Exame "+n+" deve ser apresentada");
  }
  for(let n=31;n<=51;n++){
    await navegar("#/exame/"+n);
    assert.match(app.innerHTML,/Pergunta 1 de 25/,"Exame "+n+" deve abrir com 25 perguntas");
    assert.match(app.innerHTML,/id='tempo'/,"Exame "+n+" deve mostrar o cronómetro");
    assert.ok(timerNodes.tempo,"O elemento do cronómetro deve existir no DOM simulado");
    assert.equal(typeof intervalCallback,"function","O cronómetro deve estar activo");
  }

  await navegar("#/exame/39");
  assert.match(app.innerHTML,/Pergunta 1 de 25/);
  assert.equal(app.lastFocused,"titulo","Ao abrir/mudar de pergunta, o foco deve ir para o título");
  assert.ok(!app.innerHTML.includes("Certo.") && !app.innerHTML.includes("Errado.") && !app.innerHTML.includes("explicacao"));
  const tempoInicial=timerNodes.tempo.textContent;
  agora+=1000;
  intervalCallback();
  assert.notEqual(timerNodes.tempo.textContent,tempoInicial,"O cronómetro deve actualizar o tempo");
  for(let i=0;i<25;i++){
    app.click("responder",{"data-indice":String(context.window.EXAMES[39][i].correta)});
    assert.ok(!app.innerHTML.includes("Certo.") && !app.innerHTML.includes("Errado.") && !app.innerHTML.includes("<div class='expl'"));
    if(i<24){
      assert.equal(app.lastFocused,"alternativa:"+context.window.EXAMES[39][i].correta,
        "Depois de responder, o foco deve regressar à alternativa escolhida");
      app.click("proxima");
    }
  }
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(app.innerHTML.includes("20,0 / 20 valores"));
  assert.match(app.innerHTML,/APROVADO/);
  assert.ok(app.innerHTML.includes("class='semaforo aprovado'"));
  assert.ok(app.innerHTML.includes("class='luz verde'"));
  const cssResultados=fs.readFileSync(path.join(root,"styles-resultados.css"),"utf8");
  assert.ok(cssResultados.includes(".semaforo.aprovado .luz.verde"));
  assert.ok(cssResultados.includes(".semaforo.reprovado .luz.vermelha"));
  assert.ok(cssResultados.includes("background:#555"));
  assert.match(app.innerHTML,/Rever exame/);
  assert.equal(intervalCallback,null,"O cronómetro deve parar após a submissão automática");
  assert.equal(JSON.parse(sessionStorage.getItem("ultima")).res.aprovado,true);

  // Simula recarregar a página já em #/resultado: o estado em memória desaparece.
  vm.runInContext(appSource,context);
  assert.ok(app.innerHTML.includes("20,0 / 20 valores"),"O resultado deve sobreviver ao recarregamento");
  await navegar("#/rever");
  assert.match(app.innerHTML,/resposta correcta/);
  assert.equal((app.innerHTML.match(/revisao-pergunta/g)||[]).length,25,
    "A revisão deve conter exactamente 25 perguntas");
  assert.match(app.innerHTML,/a tua resposta/);
  assert.equal((app.innerHTML.match(/explicacao-revisao/g)||[]).length,25,
    "A revisão deve explicar também as respostas certas");
  assert.equal(app.innerHTML.split("(resposta correcta)").length-1,25,
    "A resposta correcta deve estar identificada em cada pergunta");
  // Recarregar também na rota de revisão.
  vm.runInContext(appSource,context);
  await navegar("#/rever");
  assert.match(app.innerHTML,/Revisão do Exame 39/);

  // Confirma que a descrição da imagem é usada tanto no exame como na revisão.
  const descricaoImagem=context.window.EXAMES[1][0].imagem.descricao;
  await navegar("#/exame/1");
  assert.ok(app.innerHTML.includes("alt='"+descricaoImagem+"'"),
    "A imagem da pergunta deve usar imagem.descricao como texto alternativo");
  for(let i=0;i<25;i++){
    app.click("responder",{"data-indice":String(context.window.EXAMES[1][i].correta)});
    if(i<24)app.click("proxima");
  }
  await new Promise(resolve=>setImmediate(resolve));
  await navegar("#/rever");
  assert.ok(app.innerHTML.includes("alt='"+descricaoImagem+"'"),
    "A imagem na revisão deve usar imagem.descricao como texto alternativo");

  async function concluirComAcertos(n, certas){
    await navegar("#/exame/"+n);
    for(let i=0;i<25;i++){
      const correcta=context.window.EXAMES[n][i].correta;
      const resposta=i<certas?correcta:(correcta+1)%4;
      app.click("responder",{"data-indice":String(resposta)});
      if(i<24)app.click("proxima");
    }
    await new Promise(resolve=>setImmediate(resolve));
  }
  await concluirComAcertos(41,23);
  assert.ok(app.innerHTML.includes("18,4 / 20 valores"));
  assert.match(app.innerHTML,/APROVADO/);
  await concluirComAcertos(42,22);
  assert.ok(app.innerHTML.includes("17,6 / 20 valores"));
  assert.match(app.innerHTML,/REPROVADO/);
  assert.ok(app.innerHTML.includes("class='semaforo reprovado'"));
  assert.ok(app.innerHTML.includes("class='luz vermelha'"));

  // A submissão manual com perguntas em branco pede confirmação.
  await navegar("#/exame/38");
  confirmar=false;
  app.click("submeter");
  assert.equal(confirmacoes.length,1);
  assert.ok(confirmacoes[0].includes("25 pergunta(s) sem resposta"));
  assert.match(app.innerHTML,/Pergunta 1 de 25/,"Recusar a confirmação deve manter o exame aberto");
  confirmar=true;
  app.click("submeter");
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(app.innerHTML.includes("0,0 / 20 valores"));
  assert.match(app.innerHTML,/REPROVADO/);
  await navegar("#/rever");
  assert.match(app.innerHTML,/Não respondida/);

  // O fim do tempo submete automaticamente, sem pedir confirmação.
  await navegar("#/exame/40");
  assert.match(app.innerHTML,/Pergunta 1 de 25/);
  agora+=(context.window.APP.minutos*60000)+1000;
  intervalCallback();
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(app.innerHTML,/exame submetido automaticamente/);
  assert.ok(app.innerHTML.includes("Em branco: <b>25</b>"));

  // FE-013: isola o cenário de persistência de tentativas anteriores criadas nos testes de catálogo.
  localStorage.removeItem("estrada.exame.em-curso.43");
  localStorage.removeItem("estrada.exame.em-curso.46");
  // A tentativa activa deve sobreviver ao reload sem reiniciar o cronómetro.
  await navegar("#/exame/43");
  const respostaGuardada=context.window.EXAMES[43][0].correta;
  app.click("responder",{"data-indice":String(respostaGuardada)});
  app.click("proxima");
  const estadoGuardado=JSON.parse(localStorage.getItem("estrada.exame.em-curso.43"));
  assert.equal(estadoGuardado.n,43,"O exame activo deve ser guardado");
  assert.equal(estadoGuardado.i,1,"A pergunta actual deve ser guardada");
  assert.equal(estadoGuardado.resp[0],respostaGuardada,"A resposta anterior deve ser guardada");

  // Abrir outro exame não pode invalidar nem apagar a tentativa do Exame 43.
  const prazo43=estadoGuardado.fim;
  await navegar("#/exame/46");
  assert.match(app.innerHTML,/Exame 46 · Pergunta 1 de 25/,"Outro exame deve abrir sem ser bloqueado pela tentativa anterior");
  assert.ok(localStorage.getItem("estrada.exame.em-curso.43"),"A tentativa do Exame 43 deve continuar guardada ao abrir o Exame 46");
  const estado46=JSON.parse(localStorage.getItem("estrada.exame.em-curso.46"));
  assert.equal(estado46.n,46,"O Exame 46 deve ter uma chave de armazenamento independente");
  await navegar("#/exame/43");
  assert.match(app.innerHTML,/Exame 43 · Pergunta 2 de 25/,"Ao regressar ao Exame 43, deve recuperar a pergunta em que ficou");
  assert.equal(JSON.parse(localStorage.getItem("estrada.exame.em-curso.43")).fim,prazo43,"Alternar de exame não pode reiniciar o prazo original");

  agora+=30*60*1000+1000;
  vm.runInContext(appSource,context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(app.innerHTML,/Pergunta 2 de 25/,"Após reload deve retomar na pergunta actual");
  intervalCallback();
  assert.equal(timerNodes.tempo.textContent,"29:59","Após 30 minutos decorridos, o cronómetro deve mostrar o tempo real restante, não 60:00");
  app.click("anterior");
  assert.ok(app.innerHTML.includes("aria-pressed='true'"),"A resposta já seleccionada deve continuar seleccionada após reload");
  assert.equal(JSON.parse(localStorage.getItem("estrada.exame.em-curso.43")).resp[0],respostaGuardada);

  // Se o prazo terminar enquanto a página estiver fechada, o reload submete automaticamente.
  await navegar("#/exame/44");
  app.click("proxima");
  agora+=61*60*1000;
  vm.runInContext(appSource,context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(app.innerHTML.includes("exame submetido automaticamente"),"Uma tentativa expirada durante o reload deve ser submetida automaticamente");
  assert.ok(app.innerHTML.includes("Em branco: <b>25</b>"));
  assert.equal(localStorage.getItem("estrada.exame.em-curso.44"),null,"A tentativa do Exame 44 deve ser limpa após a submissão");

  // Um estado corrompido não pode iniciar silenciosamente uma tentativa do zero.
  localStorage.setItem("estrada.exame.em-curso.45","{estado-corrompido");
  confirmar=false;
  await navegar("#/exame/45");
  assert.match(app.innerHTML,/Não foi possível recuperar o exame/);
  assert.ok(!app.innerHTML.includes("Pergunta 1 de 25"),"Estado inválido não deve reiniciar o exame sem consentimento");
  confirmar=true;
  await navegar("#/exames");
  await navegar("#/exame/45");
  assert.match(app.innerHTML,/Pergunta 1 de 25/,"Depois de confirmar, deve ser possível iniciar uma nova tentativa");
  assert.ok(localStorage.getItem("estrada.exame.em-curso.45"),"A nova tentativa deve ser guardada");

  context.window.APP.modoTesteAcessoPago=false;
  await navegar("#/exames");
  assert.ok(app.innerHTML.includes("<a class='sim bloq' href='#/exame/39'><b>Exame 39</b>"),
    "O catálogo deve encaminhar todos os exames disponíveis para autenticação antes de verificar o acesso");
  await navegar("#/exame/39");
  assert.match(app.innerHTML,/bloqueado e requer um plano/);
  console.log("FE-002/FE-013 PASSOU: hashchange assíncrono, cronómetro, persistência da tentativa e do prazo após reload, respostas/pergunta restauradas, expiração durante ausência, submissão automática/manual, notas, semáforo, revisão e autenticação Firebase.");

  // BE-002: visitante pode navegar, mas precisa de autenticação Firebase antes de iniciar um exame.
  // Reabre temporariamente os exames no contexto isolado para testar a retoma após login.
  context.window.APP.modoTesteAcessoPago=true;
  context.window.APP.examesAbertosTeste=[1,51];
  authState.user=null;
  if(authState.listener)authState.listener(null);
  await navegar("#/exames");
  assert.match(app.innerHTML,/<h1>Exames<\/h1>/,"O catálogo deve continuar público");
  await navegar("#/exame/42");
  assert.equal(location.hash,"#/entrar","Visitante deve ser encaminhado para autenticação");
  assert.equal(localStorage.getItem("estrada.exame.pendente"),"42","O exame seleccionado deve ficar preservado");
  assert.match(app.innerHTML,/id='auth-form'/,"O ecrã de autenticação deve apresentar formulário real");
  app.click("auth-cancel",{},true); // clique num descendente: closest() deve encontrar o botão
  assert.equal(localStorage.getItem("estrada.exame.pendente"),null,"Cancelar deve limpar o exame pendente");
  await navegar("#/exames");
  await navegar("#/exame/42");
  assert.equal(localStorage.getItem("estrada.exame.pendente"),"42","Uma nova selecção deve ser guardada");
  assert.ok(app.innerHTML.includes("Continuar com Google"),"O botão Google deve estar disponível quando OAuth está activado");
  app.click("auth-google");
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(authState.calls.some(c=>c.method==="google" && c.provider==="google"),"O botão deve iniciar Firebase Google Auth");
  // Termina a sessão Google e selecciona novamente o exame para testar o fluxo email isoladamente.
  app.click("auth-logout");
  await new Promise(resolve=>setImmediate(resolve));
  await navegar("#/exames");
  await navegar("#/exame/42");
  app.click("auth-mode");
  assert.ok(app.innerHTML.includes("Criar conta"),"Deve existir modo de registo");
  const senhaCurta={"#auth-email":{value:"candidato@estrada.test"},"#auth-password":{value:"1234567"}};
  app.listeners.submit({target:{id:"auth-form",querySelector:s=>senhaCurta[s]},preventDefault(){}});
  assert.ok(app.innerHTML.includes("pelo menos 8 caracteres"),"O registo deve exigir palavra-passe com pelo menos 8 caracteres");
  const registoValido={"#auth-email":{value:"novo@estrada.test"},"#auth-password":{value:"senha-segura-123"}};
  app.listeners.submit({target:{id:"auth-form",querySelector:s=>registoValido[s]},preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(app.innerHTML.includes("confirmares o teu email"),"O registo deve informar que a confirmação por email é necessária");
  assert.ok(!app.innerHTML.includes("Pergunta 1 de 25"),"O registo sem confirmação não pode iniciar o exame");
  assert.ok(authState.calls.some(c=>c.method==="verification"),"O registo deve enviar verificação de email");
  app.click("auth-mode");
  const authInputs={"#auth-email":{value:"candidato@estrada.test"},"#auth-password":{value:"senha-segura-123"}};
  app.listeners.submit({target:{id:"auth-form",querySelector:s=>authInputs[s]},preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(location.hash,"#/exame/42","Após login deve retomar o exame seleccionado");
  assert.match(app.innerHTML,/Pergunta 1 de 25/,"O exame só deve começar depois do login");
  assert.equal(localStorage.getItem("estrada.exame.pendente"),null,"O destino pendente deve ser limpo após retomar");
  assert.ok(authState.calls.some(c=>c.method==="login"),"O login deve usar Firebase Authentication");
  app.click("auth-logout");
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(authState.user,null,"O logout deve terminar a sessão Firebase");
  console.log("BE-002 PASSOU: fluxo de exames preservado e autenticação Firebase simulada, incluindo visitante, email verificado, registo, Google, retoma e logout.");
})().catch(error=>{console.error(error);process.exitCode=1;});
