#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const sw = read("service-worker.js");
const manager = read("public/cache-manager.js");
const index = read("index.html");
const vercel = read("vercel.json");
const netlify = read("netlify.toml");
const build = read("scripts/build-netlify.js");
const app = read("app.js");

assert.match(index, /public\/cache-manager\.js/, "index.html deve carregar o gestor de cache");
assert.match(manager, /serviceWorker\.register\("\/service-worker\.js"/, "o gestor deve registar o Service Worker");
assert.match(manager, /https:|localhost/, "o registo deve exigir contexto seguro");
assert.match(sw, /CACHE_VERSION = "v1-20261119"/, "a cache deve ter versão explícita");
assert.match(sw, /request\.method !== "GET"/, "apenas pedidos GET podem ser considerados");
assert.match(sw, /url\.origin !== self\.location\.origin/, "recursos externos não entram na cache local");
assert.match(sw, /path\\.startsWith\\("\\/api"\\)/, "API deve ser excluída");
assert.match(sw, /firestore|identitytoolkit|securetoken|payment|callback|webhook|auth/, "serviços privados devem ser excluídos");
assert.match(sw, /request\.headers\.has\("authorization"\)/, "pedidos autenticados devem ser excluídos");
assert.match(sw, /startsWith\(CACHE_PREFIX\).*name !== CACHE_NAME/s, "versões antigas devem ser removidas");
assert.match(vercel, /service-worker\.js/, "Vercel deve enviar cabeçalhos próprios para o Service Worker");
assert.match(vercel, /no-cache|no-store/, "HTML e Service Worker não devem ficar presos em cache");
assert.match(netlify, /service-worker\.js/, "Netlify deve enviar cabeçalhos próprios para o Service Worker");
assert.match(netlify, /no-cache|no-store/, "HTML e Service Worker não devem ficar presos em cache");
assert.match(build, /service-worker\.js/, "o build deve publicar o Service Worker");
assert.match(app, /localStorage\.setItem\(chaveEstadoExame\(n\)/, "a tentativa individual deve continuar guardada localmente");
assert.match(app, /localStorage\.setItem\("hist"/, "o histórico individual deve continuar local");
assert.doesNotMatch(sw, /caches\.open\([^)]*api/i, "não pode existir cache de API");
console.log("GER-023: testes estáticos de cache aprovados.");
