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
    click(action, attrs={}) {
      const values=Object.assign({"data-action":action},attrs);
      this.listeners.click({target:{getAttribute:k=>values[k]===undefined?null:String(values[k])}});
    }
  }
  const app=new FakeApp(), name={textContent:""}, timerNodes={};
  const document={
    title:"",
    getElementById(id){ if(id==="app")return app;if(id==="nome")return name;return timerNodes[id]||null; }
  };
  const listeners={};
  let hash="";
  const location={
    get hash(){return hash;},
    set hash(v){
      if(hash===v)return;
      hash=v;
      queueMicrotask(()=>{if(typeof listeners.hashchange==="function")listeners.hashchange();});
    }
  };
  const storage={}, session={};
  const localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v;}};
  const sessionStorage={getItem:k=>session[k]||null,setItem:(k,v)=>{session[k]=v;}};
  let intervalCallback=null, agora=1700000000000, confirmar=true;
  const confirmacoes=[];
  class FakeDate extends Date { static now(){ return agora; } }
  const window={APP:null,EXAMES:{},addEventListener:(n,fn)=>{listeners[n]=fn;}};
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
  vm.runInContext(fs.readFileSync(path.join(root,"config.js"),"utf8"),context);
  for(const n of [1,...Array.from({length:21},(_,i)=>i+31)]){
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
  for(let n=31;n<=51;n++)assert.ok(app.innerHTML.includes("Exame "+n) && app.innerHTML.includes("Aberto para testes"));
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
  assert.equal((app.innerHTML.match(/Pergunta [0-9]+/g)||[]).length,25);
  assert.match(app.innerHTML,/a tua resposta/);
  assert.equal((app.innerHTML.match(/explicacao-revisao/g)||[]).length,25,
    "A revisão deve explicar também as respostas certas");
  assert.equal((app.innerHTML.match(/resposta correcta/g)||[]).length,25);
  // Recarregar também na rota de revisão.
  vm.runInContext(appSource,context);
  await navegar("#/rever");
  assert.match(app.innerHTML,/Revisão do Exame 39/);

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

  context.window.APP.modoTesteAcessoPago=false;
  await navegar("#/exame/39");
  assert.match(app.innerHTML,/bloqueado e requer um plano/);
  console.log("FE-002 PASSOU: hashchange assíncrono, cronómetro, foco, ausência de feedback, submissão automática/manual, confirmação de brancas, notas 20,0/18,4/17,6, semáforo, revisão e persistência após recarregar.");
})().catch(error=>{console.error(error);process.exitCode=1;});
