#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class FakeApp {
  constructor(){ this._html=""; this.listeners={}; }
  set innerHTML(v){ this._html=String(v); }
  get innerHTML(){ return this._html; }
  addEventListener(n,fn){ this.listeners[n]=fn; }
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
const location={get hash(){return hash;},set hash(v){hash=v;}};
const storage={};
const localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v;}};
let intervalCallback=null, agora=1700000000000;
class FakeDate extends Date { static now(){ return agora; } }
const window={APP:null,EXAMES:{},addEventListener:(n,fn)=>{listeners[n]=fn;}};
const fakeSetInterval=fn=>{intervalCallback=fn;return 1;};
const fakeClearInterval=()=>{intervalCallback=null;};
const context={window,document,location,localStorage,Date:FakeDate,Math,JSON,Object,Array,String,Number,
  setInterval:fakeSetInterval,clearInterval:fakeClearInterval,console};
vm.createContext(context);
const root=path.join(__dirname,"..");
vm.runInContext(fs.readFileSync(path.join(root,"config.js"),"utf8"),context);
for(const n of [1,...Array.from({length:21},(_,i)=>i+31)]){
  const file=path.join(root,"data","exames","exame"+n+".js");
  if(fs.existsSync(file))vm.runInContext(fs.readFileSync(file,"utf8"),context);
}
vm.runInContext(fs.readFileSync(path.join(root,"app.js"),"utf8"),context);
assert.equal(name.textContent,"ESTRADA");
assert.equal(typeof listeners.hashchange,"function");
hash="#/exames";listeners.hashchange();
assert.match(app.innerHTML,/Exame 38[\s\S]*Aberto para testes/);
assert.match(app.innerHTML,/Exame 39[\s\S]*Aberto para testes/);
assert.match(app.innerHTML,/Exame 40[\s\S]*Aberto para testes/);
assert.match(app.innerHTML,/Exame 41[\s\S]*Acesso por plano/);

hash="#/exame/39";listeners.hashchange();
assert.match(app.innerHTML,/Pergunta 1 de 25/);
assert.doesNotMatch(app.innerHTML,/Certo\.|Errado\.|explicacao/);
for(let i=0;i<25;i++){
  app.click("responder",{"data-indice":String(context.window.EXAMES[39][i].correta)});
  assert.doesNotMatch(app.innerHTML,/Certo\.|Errado\.|<div class='expl'/);
  if(i<24)app.click("proxima");
}
app.click("submeter");
assert.match(app.innerHTML,/20,0 \/ 20 valores/);
assert.match(app.innerHTML,/APROVADO/);
assert.match(app.innerHTML,/Rever exame/);
hash="#/rever";listeners.hashchange();
assert.match(app.innerHTML,/resposta correcta/);
assert.equal((app.innerHTML.match(/Pergunta \d+/g)||[]).length,25);

hash="#/exame/38";listeners.hashchange();
assert.match(app.innerHTML,/Pergunta 1 de 25/);
for(let i=0;i<25;i++){ if(i<24)app.click("proxima"); }
app.click("submeter");
assert.match(app.innerHTML,/0,0 \/ 20 valores/);
assert.match(app.innerHTML,/REPROVADO/);
assert.match(app.innerHTML,/Em branco: <b>25<\/b>/);
hash="#/rever";listeners.hashchange();
assert.match(app.innerHTML,/Não respondida/);

hash="#/exame/40";listeners.hashchange();
assert.match(app.innerHTML,/Pergunta 1 de 25/);
agora += (context.window.APP.minutos * 60000) + 1000;
intervalCallback();
assert.match(app.innerHTML,/exame submetido automaticamente/);
assert.ok(app.innerHTML.includes("Em branco: <b>25</b>"));

context.window.APP.modoTesteAcessoPago=false;
hash="#/exame/39";listeners.hashchange();
assert.match(app.innerHTML,/bloqueado e requer um plano/);
console.log("FE-002 PASSOU: acesso temporário 31–40, exame de 25 perguntas, ausência de feedback durante a prova, submissão, pontuação, aprovação/reprovação, respostas em branco e revisão pedagógica.");
