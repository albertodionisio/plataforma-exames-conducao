#!/usr/bin/env node
"use strict";

// Teste sem dependências externas: executa o componente com um DOM mínimo
// para verificar conteúdo, selecção e avisos sem activar pagamentos.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class Elemento {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parent = null;
    this.attributes = {};
    this.listeners = {};
    this.className = "";
    this.id = "";
    this.value = "";
    this.checked = false;
    this._text = "";
    this.classList = {
      add: (name) => {
        if (!this.classList.contains(name)) this.className = (this.className + " " + name).trim();
      },
      remove: (name) => {
        this.className = this.className.split(/\s+/).filter((item) => item && item !== name).join(" ");
      },
      contains: (name) => this.className.split(/\s+/).includes(name)
    };
  }

  set textContent(value) {
    this._text = String(value);
    this.children = [];
  }

  get textContent() {
    return this._text + this.children.map((child) => child.textContent).join("");
  }

  set htmlFor(value) { this.attributes.for = value; }
  get htmlFor() { return this.attributes.for || ""; }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  replaceChildren() { this.children = []; }

  addEventListener(name, callback) {
    if (!this.listeners[name]) this.listeners[name] = [];
    this.listeners[name].push(callback);
  }

  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }

  descendants() {
    return this.children.flatMap((child) => [child, ...child.descendants()]);
  }

  querySelectorAll(selector) {
    const all = this.descendants();
    if (selector.startsWith(".")) return all.filter((item) => item.classList.contains(selector.slice(1)));
    return all.filter((item) => item.tagName.toLowerCase() === selector.toLowerCase());
  }

  querySelector(selector) {
    if (selector.startsWith("#")) return this.descendants().find((item) => item.id === selector.slice(1)) || null;
    if (selector.startsWith(".")) return this.querySelectorAll(selector)[0] || null;
    return this.querySelectorAll(selector)[0] || null;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (selector.startsWith(".") && current.classList.contains(selector.slice(1))) return current;
      current = current.parent;
    }
    return null;
  }

  click() {
    if (this.tagName === "INPUT") {
      this.checked = true;
      (this.listeners.change || []).forEach((callback) => callback({ target: this }));
      return;
    }
    (this.listeners.click || []).forEach((callback) => callback({ target: this, preventDefault() {} }));
  }
}

const raiz = new Elemento("main");
const document = {
  readyState: "complete",
  createElement: (tag) => new Elemento(tag),
  getElementById: (id) => id === "assinaturas-app" ? raiz : null,
  addEventListener() {}
};
const window = { addEventListener() {}, location: { navigatedTo: null, hash: "", search: "", assign(url) { this.navigatedTo = url; } }, firebase: { auth() { return { currentUser: null }; } } };
const contexto = { window, document, Array, String, URLSearchParams };

vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../config.js"), "utf8"), contexto);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8"), contexto);

const planos = window.APP.planos;
const cartoes = raiz.querySelectorAll(".plano-cartao");
assert.equal(cartoes.length, 5, "devem ser apresentados os cinco planos definidos em config.js");
assert.equal(typeof window.renderizarPlanosEstrada, "function", "o componente deve expor a função de renderização");
const planosSourceForIdempotency = fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8");
assert.ok(planosSourceForIdempotency.includes("function obterChaveCheckout(codigo)"), "o checkout deve gerar/recuperar uma chave por plano");
assert.ok(planosSourceForIdempotency.includes("window.sessionStorage.getItem(storageKey)"), "a chave deve sobreviver ao reload da página na mesma sessão");
assert.ok(planosSourceForIdempotency.includes('"Idempotency-Key": chaveIdempotencia'), "o browser deve enviar a chave ao backend");

assert.equal(cartoes[0].classList.contains("plano-escolhido"), true, "o plano Free deve iniciar seleccionado");

const texto = raiz.textContent;
for (const plano of planos) {
  assert.ok(texto.includes(plano.nome), "falta o plano " + plano.nome);
  assert.ok(texto.includes(plano.preco), "falta o preço de " + plano.nome);
}
for (const beneficio of ["Com publicidade", "Publicidade reduzida", "Sem anúncios", "Atendimento prioritário", "Acesso sem limite de tempo", "Válido por 30 dias", "Acesso aos Exames 1–3", "Acesso aos Exames 1–25", "Acesso aos Exames 1–50"]) {
  assert.ok(texto.includes(beneficio), "falta o benefício " + beneficio);
}
for (const cartao of cartoes) {
  assert.equal(cartao.querySelectorAll("button").length, 1, "cada plano deve ter um botão de adesão");
  assert.equal(cartao.querySelectorAll("li").length, 4, "cada plano deve apresentar quatro benefícios");
}

const botaoSemanal50 = cartoes[1].querySelector("button");
botaoSemanal50.click();
assert.equal(window.location.hash, "#/entrar", "um utilizador sem sessão deve ser encaminhado para autenticação antes de pagar");
assert.equal(cartoes[1].classList.contains("plano-escolhido"), true, "o plano de 50 MT deve ficar seleccionado antes da autenticação");
const codigoPlanos = fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8");
assert.match(codigoPlanos, /weekly_basic/);
assert.doesNotMatch(codigoPlanos, /criarRequestId|requestId:/, "a referência do pagamento deve ser gerada no servidor");
assert.match(codigoPlanos, /weekly_full/);
assert.match(codigoPlanos, /monthly_basic/);
assert.match(codigoPlanos, /monthly_full/);
assert.match(codigoPlanos, /fetch\("\/api\/payments\/create"/);
assert.match(codigoPlanos, /fetch\("\/api\/payments\/status/);
assert.match(codigoPlanos, /onAuthStateChanged/, "o retorno ePay deve aguardar a restauração da sessão Firebase");
assert.match(codigoPlanos, /PLANO ACTIVO/, "a assinatura deve ser identificada no cartão do plano correspondente");
assert.match(codigoPlanos, /O pagamento não será repetido/, "a interface deve desencorajar um segundo pagamento quando a sessão ainda não foi restaurada");

assert.doesNotMatch(codigoPlanos, /loja-jr5qps-p507/, "a interface não deve continuar a usar o checkout fixo");
window.location.hash = "";

const radioMensal = raiz.querySelector("#estrada-plano-4");
radioMensal.click();
assert.equal(cartoes[4].classList.contains("plano-escolhido"), true, "seleccionar o radio deve destacar o cartão correspondente");
cartoes[4].querySelector("button").click();
const aviso = raiz.querySelector("#assinaturas-aviso");
assert.equal(window.location.hash, "#/entrar", "o plano mensal também exige autenticação antes do checkout");

cartoes[0].querySelector("button").click();
assert.ok(aviso.textContent.includes("O plano Free é gratuito"), "o plano gratuito deve apresentar o aviso próprio");
assert.equal(window.location.hash, "#/exames", "o plano Free deve encaminhar para os exames");
assert.equal(cartoes[0].classList.contains("plano-escolhido"), true, "o botão também deve actualizar a selecção visual");

const css = fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.css"), "utf8");
assert.ok(css.includes("@media(max-width:620px)"), "deve existir uma regra responsiva para telemóveis");
assert.ok(css.includes(":focus-visible"), "os controlos devem ter foco visível por teclado");
assert.ok(css.includes("prefers-reduced-motion"), "deve respeitar a preferência por movimento reduzido");
assert.ok(css.includes(".plano-selo-activo"), "o selo do plano activo deve ter estilo próprio");

assert.ok(css.includes(".plano-preco{display:block"), "o preço deve ocupar a sua própria linha");
assert.ok(css.includes(".plano-periodicidade{display:block"), "a periodicidade deve ocupar a sua própria linha");

const preview = fs.readFileSync(path.join(__dirname, "../docs/referencias/assinatura/preview.html"), "utf8");
for (const recurso of ["../../../config.js", "../../../public/assinaturas/planos.css", "../../../public/assinaturas/planos.js"]) {
  assert.ok(preview.includes(recurso), "a demonstração deve carregar " + recurso);
}

console.log("BE-002/FE-004 PASSOU: cinco planos, dados de config.js, benefícios, selecção, autenticação obrigatória antes do checkout, endpoints individuais e estado do pagamento, plano Free e recursos da demonstração.");


async function testarSeloPlanoActivo() {
  const raizTeste = new Elemento("main");
  const agora = Date.now();
  const utilizador = { uid: "utilizador-teste" };
  const authTeste = {
    currentUser: null,
    onAuthStateChanged(callback) { callback(null); callback(utilizador); return function () {}; }
  };
  const confirmacoes = [];
  const windowTeste = {
    addEventListener() {},
    confirm(mensagem) { confirmacoes.push(mensagem); return false; },
    location: { search: "", hash: "" },
    firebase: {
      auth() { return authTeste; },
      firestore() {
        return {
          collection(nome) {
            assert.equal(nome, "subscriptions");
            return {
              doc(uid) {
                assert.equal(uid, utilizador.uid);
                return {
                  get() {
                    return Promise.resolve({
                      exists: true,
                      data() {
                        return {
                          uid: utilizador.uid,
                          status: "active",
                          planCode: "monthly_full",
                          exams: 50,
                          startsAt: { toMillis: () => agora - 1000 },
                          endsAt: { toMillis: () => agora + 86400000 },
                          graceUntil: { toMillis: () => agora + 86400000 }
                        };
                      }
                    });
                  }
                };
              }
            };
          }
        };
      }
    }
  };
  const contextoTeste = {
    window: windowTeste,
    document: {
      readyState: "complete",
      createElement: (tag) => new Elemento(tag),
      getElementById: (id) => id === "assinaturas-app" ? raizTeste : null,
      addEventListener() {}
    },
    Array, String, URLSearchParams
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../config.js"), "utf8"), contextoTeste);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8"), contextoTeste);
  await new Promise((resolve) => setImmediate(resolve));
  const cartaoActivo = raizTeste.querySelector("#estrada-plano-4").closest(".plano-cartao");
  assert.ok(cartaoActivo.querySelector(".plano-selo-activo"), "o plano Mensal Completo activo deve receber o selo");
  assert.equal(cartaoActivo.querySelector(".plano-selo-activo").textContent, "PLANO ACTIVO");
  assert.equal(raizTeste.querySelector("#estrada-plano-4").checked, true,
    "o radio do plano com subscrição activa deve ficar seleccionado");
  assert.equal(cartaoActivo.classList.contains("plano-escolhido"), true,
    "o cartão com subscrição activa deve receber o destaque de selecção");
  assert.equal(cartaoActivo.querySelector("button").textContent, "Plano activo",
    "o botão do plano activo deve deixar de pedir uma nova adesão");
  assert.equal(cartaoActivo.querySelector("button").disabled, true,
    "não deve ser possível iniciar outro pagamento para o mesmo plano activo");
  const botoesAlternativos = outrosCartoes.map((cartao) => cartao.querySelector("button"));
  assert.ok(botoesAlternativos.every((botao) => botao.textContent.startsWith("Mudar para ") || botao.textContent === "Aceder aos exames gratuitos"),
    "os restantes cartões devem indicar mudança de plano ou acesso gratuito, sem pedir adesão como se não houvesse subscrição");
  assert.equal(raizTeste.querySelector("#estrada-plano-0").closest(".plano-cartao").querySelector("button").textContent,
    "Aceder aos exames gratuitos",
    "o cartão Free deve permitir consultar exames gratuitos sem sugerir cancelamento do plano pago");
  assert.equal(raizTeste.querySelector("#estrada-plano-0").checked, false,
    "o plano Free não pode continuar seleccionado quando existe uma subscrição paga activa");
  assert.equal(raizTeste.querySelector("#estrada-plano-0").closest(".plano-cartao").classList.contains("plano-escolhido"), false,
    "o cartão Free deve perder o destaque quando outro plano está activo");
  const botaoMudanca = raizTeste.querySelector("#estrada-plano-1").closest(".plano-cartao").querySelector("button");
  botaoMudanca.click();
  assert.equal(confirmacoes.length, 1, "a mudança para outro plano deve pedir confirmação antes do checkout");
  assert.ok(confirmacoes[0].includes("Mensal Completo") && confirmacoes[0].includes("Semanal Básico") &&
    confirmacoes[0].includes("150 MT") && confirmacoes[0].includes("30 dias") &&
    confirmacoes[0].includes("período que ainda resta"),
    "a confirmação deve explicar plano actual, destino, preço, duração e preservação do período pago");
  assert.equal(botaoMudanca.textContent, "Mudar para Semanal Básico",
    "cancelar a confirmação deve manter a acção de mudança e não iniciar checkout");
  assert.equal(raizTeste.querySelector("#estrada-plano-4").checked, true,
    "cancelar a mudança não pode retirar a selecção do plano activo");
  const outrosCartoes = raizTeste.querySelectorAll(".plano-cartao").filter((cartao) => cartao !== cartaoActivo);
  assert.ok(outrosCartoes.every((cartao) => !cartao.querySelector(".plano-selo-activo")),
    "o selo não pode aparecer nos planos que não pertencem à assinatura activa");
}


async function testarSeloEmCarencia() {
  const raizTeste = new Elemento("main");
  const agora = Date.now();
  const utilizador = { uid: "utilizador-carencia" };
  const authTeste = {
    currentUser: null,
    onAuthStateChanged(callback) { callback(null); callback(utilizador); return function () {}; }
  };
  const assinatura = {
    uid: utilizador.uid,
    status: "active",
    planCode: "monthly_basic",
    exams: 25,
    startsAt: { toMillis: () => agora - 31 * 86400000 },
    endsAt: { toMillis: () => agora - 1000 },
    graceUntil: { toMillis: () => agora + 86400000 }
  };
  const windowTeste = {
    addEventListener() {},
    location: { search: "", hash: "" },
    firebase: {
      auth() { return authTeste; },
      firestore() {
        return { collection() { return { doc() { return {
          get: () => Promise.resolve({ exists: true, data: () => assinatura })
        }; } }; } };
      }
    }
  };
  const contextoTeste = {
    window: windowTeste,
    document: {
      readyState: "complete",
      createElement: (tag) => new Elemento(tag),
      getElementById: (id) => id === "assinaturas-app" ? raizTeste : null,
      addEventListener() {}
    },
    Array, String, URLSearchParams
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../config.js"), "utf8"), contextoTeste);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8"), contextoTeste);
  await new Promise((resolve) => setImmediate(resolve));
  const cartaoCarencia = raizTeste.querySelector("#estrada-plano-3").closest(".plano-cartao");
  assert.ok(cartaoCarencia.querySelector(".plano-selo-activo"), "o plano mensal Básico deve receber selo durante a carência");
  assert.equal(cartaoCarencia.querySelector(".plano-selo-activo").textContent, "EM CARÊNCIA");
  assert.equal(cartaoCarencia.querySelector("button").textContent, "Plano em carência",
    "o botão do plano em carência deve explicar o estado e impedir novo checkout do mesmo plano");
}

async function testarConsultaPagamentoAposLogin() {
  const raizTeste = new Elemento("main");
  const observadores = [];
  const utilizador = { uid: "utilizador-retorno", getIdToken: () => Promise.resolve("token-teste") };
  const authTeste = {
    currentUser: null,
    onAuthStateChanged(callback) { observadores.push(callback); callback(null); return function () {}; }
  };
  const windowTeste = {
    addEventListener() {},
    dispatchEvent() {},
    setTimeout() {},
    location: { search: "?payment=123e4567-e89b-12d3-a456-426614174000", hash: "" },
    firebase: {
      auth() { return authTeste; },
      firestore() {
        return { collection() { return { doc() { return { get: () => Promise.resolve({ exists: false }) }; } }; } };
      }
    }
  };
  const contextoTeste = {
    window: windowTeste,
    document: {
      readyState: "complete",
      createElement: (tag) => new Elemento(tag),
      getElementById: (id) => id === "assinaturas-app" ? raizTeste : null,
      addEventListener() {}
    },
    Array, String, URLSearchParams,
    Event: function Event(nome) { this.type = nome; },
    fetch: () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: "paid", planName: "Semanal Básico", subscriptionActivated: true })
    })
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../config.js"), "utf8"), contextoTeste);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8"), contextoTeste);
  assert.equal(observadores.length, 2, "o componente deve observar a restauração da assinatura e do retorno do pagamento");
  observadores.forEach((observar) => observar(utilizador));
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
  const aviso = raizTeste.querySelector("#assinaturas-aviso");
  assert.ok(aviso.textContent.includes("Pagamento confirmado"),
    "depois do login restaurado, a aplicação deve consultar a transacção e reconhecer o pagamento");
}

testarSeloPlanoActivo().then(testarSeloEmCarencia).then(testarConsultaPagamentoAposLogin).then(testarPagamentoPagoAguardaActivacao).then(() => {
  console.log("APROVADO: o selo PLANO ACTIVO aparece apenas no pacote associado à subscrição válida.");
  console.log("APROVADO: o selo EM CARÊNCIA aparece no plano correcto durante a carência válida.");
  console.log("APROVADO: o retorno ePay consulta o pagamento depois de a sessão Firebase ser restaurada.");
}).catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});


async function testarPagamentoPagoAguardaActivacao() {
  const raizTeste = new Elemento("main");
  const observadores = [];
  const agendamentos = [];
  const utilizador = { uid: "utilizador-activacao-pendente", getIdToken: () => Promise.resolve("token-teste") };
  const authTeste = {
    currentUser: null,
    onAuthStateChanged(callback) { observadores.push(callback); callback(null); return function () {}; }
  };
  const windowTeste = {
    addEventListener() {},
    dispatchEvent() { throw new Error("Não deve anunciar a activação antes de a subscrição existir."); },
    setTimeout(callback) { agendamentos.push(callback); },
    location: { search: "?payment=123e4567-e89b-12d3-a456-426614174000", hash: "" },
    firebase: {
      auth() { return authTeste; },
      firestore() {
        return { collection() { return { doc() { return { get: () => Promise.resolve({ exists: false }) }; } }; } };
      }
    }
  };
  const contextoTeste = {
    window: windowTeste,
    document: {
      readyState: "complete",
      createElement: tag => new Elemento(tag),
      getElementById: id => id === "assinaturas-app" ? raizTeste : null,
      addEventListener() {}
    },
    Array, String, URLSearchParams,
    Event: function Event(nome) { this.type = nome; },
    fetch: () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: "paid", planName: "Mensal Completo", subscriptionActivated: false, activationPending: true })
    })
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../config.js"), "utf8"), contextoTeste);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8"), contextoTeste);
  observadores.forEach(observar => observar(utilizador));
  await new Promise(resolve => setImmediate(resolve));
  await new Promise(resolve => setImmediate(resolve));
  const aviso = raizTeste.querySelector("#assinaturas-aviso");
  assert.ok(aviso.textContent.includes("a concluir a activação"),
    "pagamento paid sem subscrição activada deve indicar activação em curso");
  assert.ok(!aviso.textContent.includes("já foi activado"),
    "a interface não pode anunciar activação antes da confirmação");
  assert.equal(agendamentos.length, 1, "a consulta deve repetir-se para recuperar uma activação pendente");
}
