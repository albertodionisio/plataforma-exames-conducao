(function () {
  var A = window.APP, EX = window.EXAMES || {};
  var app = document.getElementById("app");
  var estado = null, timer = null;

  document.getElementById("nome").textContent = A.nome;
  document.title = A.nome + " — " + A.slogan;

  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0"); }
  function nota(n) { return (Math.round(n * 10) / 10).toFixed(1).replace(".", ","); }
  function historico() { try { return JSON.parse(localStorage.getItem("hist") || "[]"); } catch (e) { return []; } }
  function guardar(t) { try { var h = historico(); h.unshift(t); localStorage.setItem("hist", JSON.stringify(h.slice(0, 20))); } catch (e) {} }

  function rota() {
    clearInterval(timer);
    var h = location.hash.replace("#", "") || "/";
    if (h === "/simulados") return catalogo();
    if (h === "/planos") return planos();
    if (h === "/resultado") return resultado();
    if (h.indexOf("/simulado/") === 0) return iniciar(parseInt(h.split("/")[2], 10));
    inicio();
  }

  function inicio() {
    var h = historico(), ult = h.length ? "<div class='card'><h2>Última tentativa</h2><p>Simulado " + h[0].n + ": " + h[0].certas + " certas em " + h[0].total + " (" + nota(h[0].nota) + ").</p></div>" : "";
    app.innerHTML = "<h1>" + esc(A.slogan) + "</h1>" +
      "<p>Pratica com " + A.totalSimulados + " simulados de " + A.perguntasPorSimulado + " perguntas, com explicação a cada resposta.</p>" +
      "<p><a class='btn' href='#/simulados'>Ver simulados</a> <a class='btn sec' href='#/planos'>Planos</a></p>" + ult +
      "<div class='aviso'>Versão em construção: o Simulado 1 já está disponível.</div>";
  }

  function catalogo() {
    var html = "<h1>Simulados</h1><p>Os " + A.gratuitos + " primeiros são gratuitos. Os restantes precisam de assinatura. Selecciona um exame bloqueado para conhecer os planos de acesso.</p><div class='grelha'>";
    for (var n = 1; n <= A.totalSimulados; n++) {
      var livre = n <= A.gratuitos, pronto = !!EX[n];
      html += "<a class='sim " + (livre ? "livre" : "bloq") + "' href='" + (livre ? "#/simulado/" + n : "#/planos") + "'><b>Simulado " + n + "</b><small>" + (livre ? (pronto ? "Grátis" : "Em breve") : "Acesso por plano") + "</small></a>";
    }
    app.innerHTML = html + "</div>";
  }

  function planos() {
    app.innerHTML = "<section id='assinaturas-app' class='assinaturas-pagina' aria-label='Planos de assinatura'></section>";
    if (typeof window.renderizarPlanosEstrada === "function") {
      window.renderizarPlanosEstrada();
    } else {
      app.innerHTML = "<h1>Planos</h1><div class='aviso'>Não foi possível carregar os planos. Actualiza a página e tenta novamente.</div>";
    }
  }

  function iniciar(n) {
    if (!n || n < 1 || n > A.totalSimulados) return catalogo();
    if (n > A.gratuitos) {
      app.innerHTML = "<h1>Simulado " + n + "</h1><div class='card'><p>Este simulado está bloqueado e requer um plano de acesso.</p><p><a class='btn' href='#/planos'>Consultar planos disponíveis</a> <a class='btn sec' href='#/simulados'>Voltar aos simulados</a></p></div>";
      return;
    }
    var Q = EX[n];
    if (!Q) {
      app.innerHTML = "<h1>Simulado " + n + "</h1><div class='card'><p>Este simulado está em preparação.</p><p><a class='btn sec' href='#/simulados'>Voltar</a></p></div>";
      return;
    }
    var agora = Date.now();
    estado = { n: n, Q: Q, i: 0, fim: agora + A.minutos * 60000, resp: {}, conf: {} };
    questao();
    timer = setInterval(tick, 1000);
  }

  function restante() { return Math.max(0, Math.round((estado.fim - Date.now()) / 1000)); }
  function tick() {
    var el = document.getElementById("tempo");
    if (restante() <= 0) { clearInterval(timer); return terminar(); }
    if (el) el.textContent = fmt(restante());
  }

  function questao() {
    var Q = estado.Q, q = Q[estado.i], conf = estado.conf[estado.i], sel = estado.resp[estado.i];
    var h = "<div class='estado'><span>Simulado " + estado.n + " · Pergunta " + (estado.i + 1) + " de " + Q.length + "</span><span class='tempo' id='tempo'>" + fmt(restante()) + "</span></div>";
    h += "<h2>" + esc(q.enunciado) + "</h2>";
    if (q.imagem) h += q.imagem.src ? "<img class='img' src='" + q.imagem.src + "' alt='Imagem da pergunta'>" : "<div class='img pend'>Imagem em preparação</div>";
    q.opcoes.forEach(function (o, k) {
      var cls = "op", marca = "";
      if (conf) {
        if (k === q.correta) { cls += " certa"; marca = "✓ "; }
        else if (k === sel) { cls += " errada"; marca = "✗ "; }
      }
      h += "<button class='" + cls + "' data-k='" + k + "'" + (conf ? " disabled" : "") + ">" + marca + String.fromCharCode(65 + k) + ") " + esc(o) + "</button>";
    });
    if (conf) {
      h += "<div class='expl'><b>" + (sel === q.correta ? "Certo." : "Errado.") + "</b> " + esc(q.explicacao) + "</div>";
      h += "<button class='btn' id='seg'>" + (estado.i < Q.length - 1 ? "Próxima" : "Terminar") + "</button>";
    }
    app.innerHTML = h;
    Array.prototype.forEach.call(app.querySelectorAll(".op"), function (b) {
      b.onclick = function () { estado.resp[estado.i] = parseInt(b.getAttribute("data-k"), 10); estado.conf[estado.i] = true; questao(); };
    });
    var s = document.getElementById("seg");
    if (s) s.onclick = function () { if (estado.i < Q.length - 1) { estado.i++; questao(); } else terminar(); };
  }

  function terminar() {
    clearInterval(timer);
    var Q = estado.Q, certas = 0, resp = 0;
    Q.forEach(function (q, i) { if (estado.conf[i]) { resp++; if (estado.resp[i] === q.correta) certas++; } });
    estado.res = { certas: certas, erradas: resp - certas, branco: Q.length - resp, total: Q.length, nota: certas * A.valorPorResposta, n: estado.n };
    guardar({ n: estado.n, certas: certas, total: Q.length, nota: estado.res.nota });
    location.hash = "#/resultado";
  }

  function resultado() {
    if (!estado || !estado.res) return inicio();
    var r = estado.res, h = "<h1>Resultado</h1><div class='card'><div class='nota'>" + nota(r.nota) + " / " + nota(r.total * A.valorPorResposta) + "</div>" +
      "<p>Certas: " + r.certas + " · Erradas: " + r.erradas + " · Em branco: " + r.branco + "</p>";
    if (r.total === A.perguntasPorSimulado) h += "<p>Resultado interno de treino: <b>" + (r.nota >= A.limiar ? "Aprovado" : "Não aprovado") + "</b> (limiar " + A.limiar + "/20).</p>";
    else h += "<p class='aviso'>Simulado de demonstração com " + r.total + " perguntas: ainda sem resultado de aprovação.</p>";
    h += "</div><a class='btn' href='#/simulado/" + r.n + "'>Repetir</a> <a class='btn sec' href='#/simulados'>Outros simulados</a>";
    app.innerHTML = h;
  }

  window.addEventListener("hashchange", rota);
  rota();
})();
