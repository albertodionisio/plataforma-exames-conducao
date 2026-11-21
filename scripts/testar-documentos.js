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
assert.ok(app.includes("pdf-paginas"));
assert.ok(app.includes("renderizarDocumentoPdf(caminho)"));
assert.ok(app.includes("pdfjsLib.getDocument"));
assert.ok(app.includes("pagina.render"));
assert.ok(app.includes("data-action='documento-download'"));
assert.ok(app.includes('"/downloads/codigo-da-estrada.pdf"'));
assert.ok(app.includes('"/downloads/sinais-de-transito.pdf"'));
assert.ok(app.includes("link.download = ficheiro"));
assert.ok(app.includes("link.click()"));
assert.ok(app.includes("fallbackNativo"));
assert.ok(app.includes("pdf-nativo"));
assert.ok(app.includes("download-accionado"));
assert.ok(!app.includes("<iframe class='visualizador-pdf'"), "O leitor não deve depender do suporte PDF nativo do iframe.");
assert.match(app, /documento-toolbar/);
assert.match(app, /documento-voltar/);
assert.match(app, /documento-download/);
assert.ok(index.includes("pdf.min.js"), "PDF.js deve estar carregado antes da aplicação.");
assert.match(app, /document\.body && document\.body\.classList/);
assert.doesNotMatch(app, /Abrir em separador/, "Não deve existir um botão de abertura que provoque saída do leitor.");
assert.match(app, /codigodeestrada\.pdf/);
assert.match(app, /sinais\.pdf/);
assert.match(styles, /body\.documento-aberto \.barra-inferior/);
assert.ok(styles.includes(".documento-toolbar"));
assert.ok(styles.includes(".pdf-paginas"));
assert.ok(styles.includes(".pdf-pagina"));
assert.ok(styles.includes(".documento-download:disabled"));
assert.match(headers, /Content-Disposition: inline/);
assert.match(headers, /\/downloads\/\*\.pdf[\s\S]*Content-Disposition: attachment/);
assert.match(vercel.headers.find(h => h.source === "/downloads/(.*)").headers.find(h => h.key === "Content-Disposition").value, /^attachment$/);
assert.ok(vercel.rewrites.find(r => r.source === "/downloads/codigo-da-estrada.pdf" && r.destination === "/original/referencia/codigodeestrada.pdf"));
assert.ok(vercel.rewrites.find(r => r.source === "/downloads/sinais-de-transito.pdf" && r.destination === "/original/referencia/sinais.pdf"));
assert.match(vercel.headers[0].headers.find(h => h.key === "Content-Disposition").value, /^inline$/);

verificarPdf("original/referencia/codigodeestrada.pdf");
verificarPdf("original/referencia/sinais.pdf");

assert.match(build, /original\/referencia\/codigodeestrada\.pdf/);
assert.match(build, /original\/referencia\/sinais\.pdf/);
assert.match(build, /downloads\/codigo-da-estrada\.pdf/);
assert.match(build, /downloads\/sinais-de-transito\.pdf/);
assert.match(build, /"_headers"/);
assert.match(build, /PDF obrigatório em falta/);
assert.match(build, /O APK original não pode ser incluído/);

console.log("GER-029: barra inferior, rotas e dois PDFs de consulta validados.");
