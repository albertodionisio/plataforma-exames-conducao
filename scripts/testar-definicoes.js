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

assert.match(html, /id="historico-exames"/);
assert.match(html, /id="resumo-progresso"/);
assert.match(html, /Perguntas guardadas/);
assert.match(html, /Ainda não existe uma função para guardar perguntas/);
assert.match(js, /localStorage\.getItem\("hist"\)/);
assert.match(js, /Array\.isArray\(dados\)/);
assert.match(js, /Tentativas/);
assert.match(js, /Melhor nota/);
assert.match(js, /sessionStorage\.getItem\("ultima"\)/);
assert.match(js, /Abrir o último resultado desta sessão/);
assert.match(css, /\.item-historico/);
assert.match(css, /\.resumo-progresso/);

assert.match(html, /src="\.\.\/\.\.\/config\.js"/);
assert.match(html, /id="estado-subscricao"/);
assert.match(html, /id="plano-individual"/);
assert.match(html, /Histórico de pagamentos/);
assert.match(html, /não cria subscrição nem efectua cobranças/);
assert.match(js, /modoTesteAcessoPago/);
assert.match(js, /examesAbertosTeste/);
assert.match(js, /Modo de testes activo/);
assert.match(js, /Não existe, nesta versão, uma conta ou serviço/);
assert.match(css, /\.estado-subscricao/);

const ajuda = fs.readFileSync(path.join(root, "public", "ajuda", "index.html"), "utf8");
const ajudaCss = fs.readFileSync(path.join(root, "public", "ajuda", "ajuda.css"), "utf8");
assert.match(html, /\.\.\/ajuda\/index\.html#faq/);
assert.match(html, /\.\.\/ajuda\/index\.html#contacto/);
assert.match(html, /\.\.\/ajuda\/index\.html#reportar/);
assert.match(html, /\.\.\/ajuda\/index\.html#termos/);
assert.match(html, /\.\.\/ajuda\/index\.html#privacidade/);
for (const id of ["faq","contacto","reportar","sobre","termos","privacidade","fontes"]) {
  assert.match(ajuda, new RegExp('id="' + id + '"'), "Falta a secção pública " + id);
}
assert.match(ajuda, /Atendimento ainda não disponível/);
assert.match(ajuda, /Documento ainda não publicado/);
assert.match(ajuda, /Não apresentamos contactos inventados/);
assert.match(ajudaCss, /@media\(max-width:520px\)/);
