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
        this.className = this.className.split(/\\s+/).filter((item) => item && item !== name).join(" ");
      },
      contains: (name) => this.className.split(/\\s+/).includes(name)
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
const window = {};
const contexto = { window, document, Array, String };

vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../config.js"), "utf8"), contexto);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.js"), "utf8"), contexto);

const planos = window.APP.planos;
const cartoes = raiz.querySelectorAll(".plano-cartao");
assert.equal(cartoes.length, 5, "devem ser apresentados os cinco planos definidos em config.js");
assert.equal(typeof window.renderizarPlanosEstrada, "function", "o componente deve expor a função de renderização");
assert.equal(cartoes[0].classList.contains("plano-escolhido"), true, "o plano Free deve iniciar seleccionado");

const texto = raiz.textContent;
for (const plano of planos) {
  assert.ok(texto.includes(plano.nome), "falta o plano " + plano.nome);
  assert.ok(texto.includes(plano.preco), "falta o preço de " + plano.nome);
}
for (const beneficio of ["Com publicidade", "Publicidade reduzida", "Sem anúncios", "Atendimento prioritário", "Acesso sem limite de tempo", "Válido por 30 dias"]) {
  assert.ok(texto.includes(beneficio), "falta o benefício " + beneficio);
}
for (const cartao of cartoes) {
  assert.equal(cartao.querySelectorAll("button").length, 1, "cada plano deve ter um botão de adesão");
  assert.equal(cartao.querySelectorAll("li").length, 4, "cada plano deve apresentar quatro benefícios");
}

const radioMensal = raiz.querySelector("#estrada-plano-4");
radioMensal.click();
assert.equal(cartoes[4].classList.contains("plano-escolhido"), true, "seleccionar o radio deve destacar o cartão correspondente");
cartoes[4].querySelector("button").click();
const aviso = raiz.querySelector("#assinaturas-aviso");
assert.ok(aviso.textContent.includes("Mensal Completo foi seleccionado"), "o botão deve confirmar o plano escolhido");
assert.ok(aviso.textContent.includes("pagamentos ainda não estão activos"), "o botão não pode simular um pagamento");

cartoes[0].querySelector("button").click();
assert.ok(aviso.textContent.includes("O plano Free é gratuito"), "o plano gratuito deve apresentar o aviso próprio");
assert.equal(cartoes[0].classList.contains("plano-escolhido"), true, "o botão também deve actualizar a selecção visual");

const css = fs.readFileSync(path.join(__dirname, "../public/assinaturas/planos.css"), "utf8");
assert.ok(css.includes("@media(max-width:620px)"), "deve existir uma regra responsiva para telemóveis");
assert.ok(css.includes(":focus-visible"), "os controlos devem ter foco visível por teclado");
assert.ok(css.includes("prefers-reduced-motion"), "deve respeitar a preferência por movimento reduzido");
assert.ok(css.includes(".plano-preco{display:block"), "o preço deve ocupar a sua própria linha");
assert.ok(css.includes(".plano-periodicidade{display:block"), "a periodicidade deve ocupar a sua própria linha");

const preview = fs.readFileSync(path.join(__dirname, "../docs/referencias/assinatura/preview.html"), "utf8");
for (const recurso of ["../../../config.js", "../../../public/assinaturas/planos.css", "../../../public/assinaturas/planos.js"]) {
  assert.ok(preview.includes(recurso), "a demonstração deve carregar " + recurso);
}

console.log("FE-004 PASSOU: cinco planos, dados de config.js, benefícios, selecção, botões, aviso de pagamento inactivo, responsividade, foco de teclado e recursos da demonstração.");
