#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const base = path.join(root, "public", "definicoes");
const html = fs.readFileSync(path.join(base, "index.html"), "utf8");
const css = fs.readFileSync(path.join(base, "definicoes.css"), "utf8");
const js = fs.readFileSync(path.join(base, "definicoes.js"), "utf8");

const ids = ["personalizacao", "conta", "aprendizagem", "subscricao", "suporte", "sobre"];
for (const id of ids) {
  assert.match(html, new RegExp('id="' + id + '"'), "Falta a secção " + id);
  assert.match(html, new RegExp('href="#' + id + '"'), "Falta o atalho para " + id);
}
for (const label of [
  "Personalização", "Conta e segurança", "Aprendizagem",
  "Subscrição e pagamentos", "Ajuda e suporte", "Sobre o ESTRADA"
]) {
  assert.ok(html.includes(label), "Falta a categoria: " + label);
}
assert.match(html, /href="\.\.\/\.\.\/"/, "Deve existir uma ligação para voltar à aplicação");
assert.match(html, /href="\.\.\/\.\.\/#\/planos"/, "A ligação para os planos deve abrir a rota existente");
assert.match(html, /aria-label="Navegar pelas definições"/, "A navegação deve ter nome acessível");
assert.match(html, /role="note"/, "A página deve explicar o estado real das funcionalidades");
assert.match(js, /aria-current/);
assert.match(js, /hashchange/);
assert.match(css, /:focus-visible/);
assert.match(css, /@media \(max-width: 760px\)/);
assert.match(css, /@media \(max-width: 430px\)/);
assert.match(css, /prefers-reduced-motion/);
assert.ok(!/<button\b/i.test(html), "Não criar botões sem acção nesta etapa");
assert.ok(!/TODO|FIXME/i.test(html + css + js), "Remover marcadores de implementação");

console.log("DEF-001 PASSOU: seis categorias, atalhos internos, links existentes, acessibilidade básica e regras responsivas.");
