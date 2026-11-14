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
const globalCss = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

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
assert.match(html, /data-theme-choice="light"/);
assert.match(html, /id="activar-notificacoes"/);
assert.match(html, /Conta ainda não disponível/);
assert.match(html, /não tem registo, início de sessão nem autenticação/);
assert.match(html, /últimas 20 tentativas/);
assert.match(html, /não está associado a uma conta nem é sincronizado/);
assert.match(css, /\.estado-conta/);
assert.match(css, /\.informacao-dados/);
assert.match(html, /id="desactivar-notificacoes"/);
assert.match(html, /id="testar-notificacao"/);
assert.match(html, /role="status" aria-live="polite"/);
assert.match(html, /não existem notificações push/i);
assert.match(js, /Notification\.requestPermission/);
assert.match(js, /window\.isSecureContext/);
assert.match(js, /Notification\.permission/);
assert.match(js, /estrada\.notificacoes\.ativas/);
assert.match(js, /new Notification/);
assert.match(css, /\.acoes-notificacoes/);
assert.match(html, /data-theme-choice="dark"/);
assert.match(js, /estrada\.tema/);
assert.match(js, /localStorage\.setItem/);
assert.match(css, /data-theme="dark"/);
assert.match(css, /--branco:#1b293d/, "Os cartões da página devem escurecer com o tema");
assert.match(globalCss, /data-theme="dark"/);
assert.match(appJs, /estrada\.tema/);
assert.ok(!/TODO|FIXME/i.test(html + css + js), "Remover marcadores de implementação");

console.log("DEF-001/DEF-002 PASSOU: estrutura, navegação, tema e persistência.");
