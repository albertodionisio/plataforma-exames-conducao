#!/usr/bin/env node
// Validador estrutural dos ficheiros de exames (data/exames/exameN.js).
// Sem dependências externas. Uso: node scripts/validar-exames.js
// Termina com código 1 se encontrar qualquer falha, 0 se tudo estiver correcto.
// Só lê os ficheiros; não altera nada.

"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var RAIZ = path.resolve(__dirname, "..");
var PASTA = path.join(RAIZ, "data", "exames");
var PERGUNTAS_POR_EXAME = 25;
var OPCOES_POR_PERGUNTA = 4;

function textoVazio(v) {
  return typeof v !== "string" || v.trim() === "";
}

function carregarExame(ficheiro) {
  // Os ficheiros são scripts de navegador: preenchem window.EXAMES[N].
  var sandbox = { window: {} };
  vm.createContext(sandbox);
  var codigo = fs.readFileSync(ficheiro, "utf8");
  vm.runInContext(codigo, sandbox, { filename: ficheiro, timeout: 5000 });
  return sandbox.window.EXAMES || {};
}

function validarPergunta(p, pos, contexto) {
  var erros = [];
  var rotulo = "pergunta na posição " + pos;
  if (p === null || typeof p !== "object") {
    return [rotulo + ": não é um objecto"];
  }

  if (typeof p.numero === "number" && isFinite(p.numero)) {
    rotulo = "pergunta " + p.numero + " (posição " + pos + ")";
  }

  if (typeof p.numero !== "number" || !isFinite(p.numero) || Math.floor(p.numero) !== p.numero) {
    erros.push(rotulo + ": 'numero' em falta ou não é um número inteiro");
  } else if (contexto.vistos[p.numero] !== undefined) {
    erros.push(rotulo + ": número repetido (já usado na posição " + contexto.vistos[p.numero] + ")");
  } else {
    contexto.vistos[p.numero] = pos;
  }

  if (textoVazio(p.enunciado)) {
    erros.push(rotulo + ": enunciado em falta");
  }

  if (!Array.isArray(p.opcoes)) {
    erros.push(rotulo + ": 'opcoes' em falta ou não é uma lista");
  } else {
    if (p.opcoes.length !== OPCOES_POR_PERGUNTA) {
      erros.push(rotulo + ": tem " + p.opcoes.length + " alternativas (esperado " + OPCOES_POR_PERGUNTA + ")");
    }
    p.opcoes.forEach(function (o, i) {
      if (textoVazio(o)) {
        erros.push(rotulo + ": alternativa " + (i + 1) + " vazia");
      }
    });
  }

  var n = Array.isArray(p.opcoes) ? p.opcoes.length : OPCOES_POR_PERGUNTA;
  if (typeof p.correta !== "number" || Math.floor(p.correta) !== p.correta) {
    erros.push(rotulo + ": 'correta' em falta ou não é um número inteiro");
  } else if (p.correta < 0 || p.correta >= n) {
    erros.push(rotulo + ": índice da resposta correcta inválido (" + p.correta + "; válido: 0 a " + (n - 1) + ")");
  }

  if (textoVazio(p.explicacao)) {
    erros.push(rotulo + ": explicação em falta");
  }

  if (p.imagem !== undefined && p.imagem !== null) {
    if (typeof p.imagem !== "object" || textoVazio(p.imagem.src)) {
      erros.push(rotulo + ": 'imagem' sem 'src'");
    } else {
      var destino = path.resolve(RAIZ, p.imagem.src);
      var dentro = destino === RAIZ || destino.indexOf(RAIZ + path.sep) === 0;
      if (!dentro) {
        erros.push(rotulo + ": imagem fora do repositório (" + p.imagem.src + ")");
      } else if (!fs.existsSync(destino) || !fs.statSync(destino).isFile()) {
        erros.push(rotulo + ": imagem não existe (" + p.imagem.src + ")");
      }
    }
  }

  return erros;
}

function validarFicheiro(nome) {
  var erros = [];
  var ficheiro = path.join(PASTA, nome);
  var numeroDoNome = Number(/^exame(\d+)\.js$/.exec(nome)[1]);
  var exames;

  try {
    exames = carregarExame(ficheiro);
  } catch (e) {
    return ["não foi possível ler o ficheiro: " + e.message];
  }

  var lista = exames[numeroDoNome];
  if (lista === undefined) {
    return ["não define window.EXAMES[" + numeroDoNome + "] (o número deve coincidir com o nome do ficheiro)"];
  }
  if (!Array.isArray(lista)) {
    return ["window.EXAMES[" + numeroDoNome + "] não é uma lista de perguntas"];
  }

  if (lista.length !== PERGUNTAS_POR_EXAME) {
    erros.push("tem " + lista.length + " perguntas (esperado " + PERGUNTAS_POR_EXAME + ")");
  }

  var contexto = { vistos: {} };
  lista.forEach(function (p, i) {
    validarPergunta(p, i + 1, contexto).forEach(function (e) { erros.push(e); });
  });

  return erros;
}

function main() {
  if (!fs.existsSync(PASTA)) {
    console.error("ERRO: a pasta data/exames/ não existe.");
    process.exit(1);
  }

  var ficheiros = fs.readdirSync(PASTA)
    .filter(function (f) { return /^exame\d+\.js$/.test(f); })
    .sort(function (a, b) {
      return Number(/\d+/.exec(a)[0]) - Number(/\d+/.exec(b)[0]);
    });

  if (ficheiros.length === 0) {
    console.error("ERRO: nenhum ficheiro exameN.js encontrado em data/exames/.");
    process.exit(1);
  }

  var totalErros = 0;
  var ficheirosComErros = 0;

  ficheiros.forEach(function (nome) {
    var erros = validarFicheiro(nome);
    if (erros.length === 0) {
      console.log("OK    " + nome);
    } else {
      ficheirosComErros++;
      totalErros += erros.length;
      console.log("FALHA " + nome + " (" + erros.length + (erros.length === 1 ? " problema" : " problemas") + ")");
      erros.forEach(function (e) { console.log("      - " + e); });
    }
  });

  console.log("");
  console.log(ficheiros.length + (ficheiros.length === 1 ? " ficheiro verificado" : " ficheiros verificados") +
    ", " + totalErros + (totalErros === 1 ? " problema" : " problemas") + ".");

  if (totalErros > 0) {
    console.log("Corrija os problemas acima antes de publicar.");
    process.exit(1);
  }
}

main();
