#!/usr/bin/env node
"use strict";

// Gera apenas os ficheiros necessários à aplicação pública.
// Não publica o APK original, documentação interna, tarefas ou ferramentas.
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const files = [
  "index.html",
  "app.js",
  "config.js",
  "styles.css",
  "styles-resultados.css",
  "manifest.webmanifest"
];
const dirs = ["icons", "public"];
const required = [
  "index.html", "app.js", "config.js", "styles.css",
  "styles-resultados.css", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png",
  "public/assinaturas/planos.js", "public/assinaturas/planos.css"
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  if (!fs.existsSync(source)) throw new Error("Ficheiro obrigatório em falta: " + file);
  fs.copyFileSync(source, path.join(dist, file));
}
for (const dir of dirs) {
  const source = path.join(root, dir);
  if (!fs.existsSync(source)) throw new Error("Pasta obrigatória em falta: " + dir);
  fs.cpSync(source, path.join(dist, dir), { recursive: true });
}

const dataSource = path.join(root, "data", "exames");
const dataTarget = path.join(dist, "data", "exames");
fs.mkdirSync(dataTarget, { recursive: true });
const examFiles = fs.readdirSync(dataSource).filter(name => /^exame\d+\.js$/.test(name));
for (const name of examFiles) fs.copyFileSync(path.join(dataSource, name), path.join(dataTarget, name));

for (const file of required) {
  if (!fs.existsSync(path.join(dist, file))) throw new Error("Ficheiro não publicado: " + file);
}
for (let n = 26; n <= 51; n++) {
  const file = path.join(dataTarget, "exame" + n + ".js");
  if (!fs.existsSync(file)) throw new Error("Exame " + n + " não incluído na publicação.");
}
if (fs.existsSync(path.join(dist, "original", "Codigo_e_Sinais_de_Transito_1_1.apk"))) {
  throw new Error("O APK original não pode ser incluído na publicação.");
}

console.log("Build Netlify concluído: aplicação e Exames 26–51 incluídos; APK e documentação interna excluídos.");
