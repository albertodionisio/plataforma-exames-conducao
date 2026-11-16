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

assert.ok(html.includes("cache-bootstrap.js"), "index.html deve registar o bootstrap");
assert.ok(bootstrap.includes('serviceWorker.register("/service-worker.js"'), "bootstrap deve registar o Service Worker");
assert.ok(sw.includes("CACHE_DIAS = 30 * 24 * 60 * 60 * 1000"), "perguntas devem ter validade local de 30 dias");
assert.ok(sw.includes("CACHE_MEDIA_DIAS = 365 * 24 * 60 * 60 * 1000"), "media devem ter validade local de 365 dias");
assert.ok(sw.includes("CACHE_VERIFICACAO = 24 * 60 * 60 * 1000"), "a cache local deve revalidar no máximo uma vez por dia");
assert.ok(sw.includes("/data/exames/exame"), "cache deve reconhecer ficheiros de exames");
assert.ok(sw.includes("Nunca guardar sessões, autenticação, resultados ou dados pessoais"), "deve excluir dados privados");
assert.ok(netlify.includes("Netlify-CDN-Cache-Control"), "Netlify deve configurar cache partilhada");
assert.ok(netlify.includes("s-maxage=2592000"), "exames devem ter cache CDN de 30 dias");
assert.ok(netlify.includes("s-maxage=31536000"), "multimédia deve ter cache CDN de 365 dias");
assert.ok(build.includes('"service-worker.js"'), "build deve publicar o Service Worker");
assert.ok(build.includes('"cache-bootstrap.js"'), "build deve publicar o bootstrap");
console.log("Cache ESTRADA: verificações estáticas aprovadas.");
