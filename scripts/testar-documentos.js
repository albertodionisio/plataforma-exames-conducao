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
const styles = ler("styles.css");
const vercel = JSON.parse(ler("vercel.json"));
const headers = ler("_headers");

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
assert.match(app, /pdf-paginas/);
assert.match(app, /renderizarDocumentoPdf\\(caminho\\)/);
assert.match(app, /pdfjsLib\\.getDocument/);
assert.match(app, /pagina\\.render/);
assert.match(app, /data-action=\\'documento-download\\'/);
assert.match(app, /fetch\\(caminho, \\{ credentials: "same-origin" \\}\\)/);
assert.match(app, /link\\.download = ficheiro/);
assert.doesNotMatch(app, /<iframe class=\\'visualizador-pdf\\'/, "O leitor não deve depender do suporte PDF nativo do iframe.");
assert.match(app, /documento-toolbar/);
assert.match(app, /documento-voltar/);
assert.match(app, /documento-download/);
assert.match(app, /download='/, "O download deve ser uma acção explícita no controlo superior.");
assert.match(index, /pdf\\.js\\/3\\.11\\.174\\/pdf\\.min\\.js/, "PDF.js deve estar carregado antes da aplicação.");
assert.match(app, /document\.body && document\.body\.classList/);
assert.doesNotMatch(app, /Abrir em separador/, "Não deve existir um botão de abertura que provoque saída do leitor.");
assert.match(app, /codigodeestrada\.pdf/);
assert.match(app, /sinais\.pdf/);
assert.match(styles, /body\.documento-aberto \.barra-inferior/);
assert.match(styles, /\\.documento-toolbar/);
assert.match(styles, /\\.pdf-paginas/);
assert.match(styles, /\\.pdf-pagina/);
assert.match(styles, /\\.documento-download:disabled/);
assert.match(headers, /Content-Disposition: inline/);
assert.match(vercel.headers[0].headers.find(h => h.key === "Content-Disposition").value, /^inline$/);

verificarPdf("original/referencia/codigodeestrada.pdf");
verificarPdf("original/referencia/sinais.pdf");

assert.match(build, /original\/referencia\/codigodeestrada\.pdf/);
assert.match(build, /original\/referencia\/sinais\.pdf/);
assert.match(build, /"_headers"/);
assert.match(build, /PDF obrigatório em falta/);
assert.match(build, /O APK original não pode ser incluído/);

console.log("GER-029: barra inferior, rotas e dois PDFs de consulta validados.");
