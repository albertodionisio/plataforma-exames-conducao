#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const ler = file => fs.readFileSync(path.join(root, file), "utf8");
const index = ler("index.html");
const app = ler("app.js");
const build = ler("scripts/build-netlify.js");

function verificarPdf(file) {
  const caminho = path.join(root, file);
  assert.ok(fs.existsSync(caminho), "PDF de consulta em falta: " + file);
  const fd = fs.openSync(caminho, "r");
  const header = Buffer.alloc(5);
  try { fs.readSync(fd, header, 0, 5, 0); } finally { fs.closeSync(fd); }
  assert.equal(header.toString("ascii"), "%PDF-", "Cabeçalho PDF inválido: " + file);
  assert.ok(fs.statSync(caminho).size > 1000, "PDF inesperadamente pequeno: " + file);
}

assert.match(index, /class="barra-inferior"/, "A barra inferior deve existir.");
assert.match(index, /href="#\/exames"/, "O troféu deve abrir o catálogo de exames.");
assert.match(index, /href="#\/codigo"/, "O livro deve abrir o Código da Estrada.");
assert.match(index, /href="#\/sinais"/, "O triângulo deve abrir os Sinais de Trânsito.");
assert.match(index, /item-inactivo[^>]*aria-disabled="true"/, "A prancheta deve permanecer inactiva.");
assert.match(index, /class="luz-vermelha"/, "O sinal triangular deve conter a luz vermelha.");
assert.match(index, /class="luz-amarela"/, "O sinal triangular deve conter a luz amarela.");
assert.match(index, /class="luz-verde"/, "O sinal triangular deve conter a luz verde.");

assert.match(app, /if \(h === "\/codigo"\) return codigoDaEstrada\(\);/);
assert.match(app, /if \(h === "\/sinais"\) return sinaisDeTransito\(\);/);
assert.match(app, /visualizador-pdf/);
assert.match(app, /codigodeestrada\.pdf/);
assert.match(app, /sinais\.pdf/);

verificarPdf("original/referencia/codigodeestrada.pdf");
verificarPdf("original/referencia/sinais.pdf");

assert.match(build, /original\/referencia\/codigodeestrada\.pdf/);
assert.match(build, /original\/referencia\/sinais\.pdf/);
assert.match(build, /PDF obrigatório em falta/);
assert.match(build, /O APK original não pode ser incluído/);

console.log("GER-029: barra inferior, rotas e dois PDFs de consulta validados.");
