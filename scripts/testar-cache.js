#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sw = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
const bootstrap = fs.readFileSync(path.join(root, "cache-bootstrap.js"), "utf8");
const netlify = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
const build = fs.readFileSync(path.join(root, "scripts", "build-netlify.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

assert.match(html, /cache-bootstrap\.js/, "index.html deve registar o bootstrap");
assert.match(bootstrap, /serviceWorker\.register\("\/service-worker\.js"/, "bootstrap deve registar o Service Worker");
assert.match(sw, /CACHE_DIAS = 30 \* 24 \* 60 \* 60 \* 1000/, "perguntas devem ter validade local de 30 dias");
assert.match(sw, /CACHE_MEDIA_DIAS = 365 \* 24 \* 60 \* 60 \* 1000/, "media deve ter validade local de 365 dias");
assert.match(sw, /data\/exames\/exame/, "cache deve reconhecer ficheiros de exames");
assert.match(sw, /Nunca colocar sessões, autenticação, resultados ou dados pessoais em cache/, "deve excluir dados privados");
assert.match(netlify, /Netlify-CDN-Cache-Control/, "Netlify deve configurar cache partilhada");
assert.match(netlify, /s-maxage=2592000/, "exames devem ter cache CDN de 30 dias");
assert.match(netlify, /s-maxage=31536000/, "multimédia deve ter cache CDN de 365 dias");
assert.match(build, /service-worker\.js/, "build deve publicar o Service Worker");
assert.match(build, /cache-bootstrap\.js/, "build deve publicar o bootstrap");
console.log("Cache ESTRADA: verificações estáticas aprovadas.");
