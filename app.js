(function () {
  "use strict";
  var A = window.APP || {}, EX = window.EXAMES || {};
  var app = document.getElementById("app");
  var estado = null, timer = null;

  document.getElementById("nome").textContent = A.nome || "ESTRADA";
  document.title = (A.nome || "ESTRADA") + " — " + (A.slogan || "Exames de condução");

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }
  function nota(n) { return (Math.round(n * 10) / 10).toFixed(1).replace(".", ","); }
  function historico() {
    try { return JSON.parse(localStorage.getItem("hist") || "[]"); }
    catch (e) { return []; }
  }
  function guardar(t) {
    try {
      var h = historico();
      h.unshift(t);
      localStorage.setItem("hist", JSON.stringify(h.slice(0, 20)));
    } catch (e) {}
  }
  function testeAberto(n) {
    var intervalo = A.examesAbertosTeste;
    return A.modoTesteAcessoPago === true && Array.isArray(intervalo) &&
      intervalo.length === 2 && n >= intervalo[0] && n <= intervalo[1];
  }
  function temAcesso(n) { return n <= Number(A.gratuitos || 0) || testeAberto(n); }
  function pararRelogio() {
    if (timer !== null) { clearInterval(timer); timer = null; }
  }
  function rota() {
    pararRelogio();
    var h = location.hash.replace("#", "") || "/";
    if (h === "/exames") return catalogo();
    if (h === "/planos") return planos();
    if (h === "/resultado") return resultado();
    if (h === "/rever") return rever();
    if (h.indexOf("/exame/") === 0) return iniciar(parseInt(h.split("/")[2], 10));
    inicio();
  }
  function inicio() {
    var h = historico(), ult = h.length ?
      "<div class='card'><h2>Última tentativa</h2><p>Exame " + esc(h[0].n) +
      ": " + esc(h[0].certas) + " certas em " + esc(h[0].total) +
      " (" + nota(h[0].nota) + ").</p></div>" : "";
    app.innerHTML = "<h1>" + esc(A.slogan) + "</h1>" +
      "<p>Acede a " + esc(A.totalExames) + " exames, cada um com " +
      esc(A.perguntasPorExame) + " perguntas.</p>" +
      "<p><a class='btn' href='#/exames'>Ver exames</a> " +
      "<a class='btn sec' href='#/planos'>Planos</a></p>" + ult;
  }
  function catalogo() {
    var html = "<h1>Exames</h1><p>Os " + esc(A.gratuitos) +
      " primeiros são gratuitos. Durante a fase de testes, os Exames 31–51 estão temporariamente abertos.</p><div class='grelha'>";
    for (var n = 1; n <= Number(A.totalExames || 0); n++) {
      var pronto = Array.isArray(EX[n]), livre = temAcesso(n);
      var rotulo = !pronto ? "Em preparação" : (n <= A.gratuitos ? "Grátis" :
        (testeAberto(n) ? "Aberto para testes" : "Acesso por plano"));
      var destino = pronto && livre ? "#/exame/" + n : (pronto ? "#/planos" : "#/exames");
      html += "<a class='sim " + (livre ? "livre" : "bloq") + "' href='" + destino +
        "'><b>Exame " + n + "</b><small>" + rotulo + "</small></a>";
    }
    app.innerHTML = html + "</div>";
  }
  function planos() {
    app.innerHTML = "<section id='assinaturas-app' class='assinaturas-pagina' aria-label='Planos de assinatura'></section>";
    if (typeof window.renderizarPlanosEstrada === "function") window.renderizarPlanosEstrada();
    else app.innerHTML = "<h1>Planos</h1><div class='aviso'>Não foi possível carregar os planos.</div>";
  }
  function iniciar(n) {
    if (!n || n < 1 || n > Number(A.totalExames || 0)) return catalogo();
    if (!temAcesso(n)) {
      app.innerHTML = "<h1>Exame " + n + "</h1><div class='card'><p>Este exame está bloqueado e requer um plano de acesso.</p>" +
        "<p><a class='btn' href='#/planos'>Consultar planos</a> <a class='btn sec' href='#/exames'>Voltar aos exames</a></p></div>";
      return;
    }
    var Q = EX[n];
    if (!Array.isArray(Q) || Q.length !== Number(A.perguntasPorExame || 25)) {
      app.innerHTML = "<h1>Exame " + n + "</h1><div class='card'><p>Este exame ainda não está disponível integralmente.</p>" +
        "<a class='btn sec' href='#/exames'>Voltar</a></div>";
      return;
    }
    estado = { n:n, Q:Q, i:0, fim:Date.now() + Number(A.minutos || 60) * 60000, resp:{}, res:null };
    location.hash = "#/realizar";
    renderQuestao();
    timer = setInterval(tick, 1000);
  }
  function restante() { return Math.max(0, Math.ceil((estado.fim - Date.now()) / 1000)); }
  function tick() {
    if (!estado || estado.res) return pararRelogio();
    var el = document.getElementById("tempo");
    var r = restante();
    if (el) el.textContent = fmt(r);
    if (r <= 0) terminar("tempo");
  }
  function renderQuestao() {
    if (!estado || estado.res) return;
    var Q = estado.Q, q = Q[estado.i], sel = estado.resp[estado.i];
    var respondidas = Object.keys(estado.resp).length;
    var h = "<div class='estado'><span>Exame " + estado.n + " · Pergunta " +
      (estado.i + 1) + " de " + Q.length + "</span><span class='tempo' id='tempo'>" +
      fmt(restante()) + "</span></div>";
    h += "<div class='progresso' aria-label='Progresso'><span style='width:" +
      Math.round((respondidas / Q.length) * 100) + "%'></span></div>";
    h += "<h2>" + esc(q.enunciado) + "</h2>";
    if (q.imagem) h += q.imagem.src ?
      "<img class='img' src='" + esc(q.imagem.src) + "' alt='Imagem da pergunta'>" :
      "<div class='img pend'>Imagem em preparação</div>";
    h += "<div class='opcoes' role='group' aria-label='Alternativas'>";
    q.opcoes.forEach(function (o, k) {
      var escolhido = sel === k;
      h += "<button type='button' class='op" + (escolhido ? " seleccionado" : "") +
        "' data-action='responder' data-indice='" + k + "' aria-pressed='" + escolhido + "'>" +
        "<span class='letra'>" + String.fromCharCode(65 + k) + ")</span> " + esc(o) + "</button>";
    });
    h += "</div><div class='navegacao-exame'>";
    h += "<button class='btn sec' type='button' data-action='anterior'" +
      (estado.i === 0 ? " disabled" : "") + ">Anterior</button>";
    if (estado.i < Q.length - 1) h += "<button class='btn' type='button' data-action='proxima'>Próxima</button>";
    h += "</div><div class='rodape-exame'><span>" + respondidas + " de " + Q.length +
      " respondidas</span><button class='btn terminar' type='button' data-action='submeter'>Terminar e submeter</button></div>";
    app.innerHTML = h;
  }
  function terminar(motivo) {
    if (!estado || estado.res) return;
    pararRelogio();
    var certas = 0, respondidas = 0;
    estado.Q.forEach(function (q, i) {
      if (Object.prototype.hasOwnProperty.call(estado.resp, i)) {
        respondidas++;
        if (estado.resp[i] === q.correta) certas++;
      }
    });
    var erradas = respondidas - certas, branco = estado.Q.length - respondidas;
    estado.res = { certas:certas, erradas:erradas, branco:branco, total:estado.Q.length,
      nota:certas * Number(A.valorPorResposta || 0.8), n:estado.n, motivo:motivo || "manual",
      respostas:estado.Q.map(function (_, i) {
        return Object.prototype.hasOwnProperty.call(estado.resp, i) ? estado.resp[i] : null;
      }) };
    guardar({ n:estado.n, certas:certas, total:estado.Q.length, nota:estado.res.nota });
    location.hash = "#/resultado";
    resultado();
  }
  function semaforo(aprovado) {
    return "<div class='semaforo " + (aprovado ? "aprovado" : "reprovado") +
      "' role='img' aria-label='" + (aprovado ? "Semáforo verde: aprovado" : "Semáforo vermelho: reprovado") +
      "'><span class='luz vermelha'></span><span class='luz amarela'></span><span class='luz verde'></span></div>";
  }
  function resultado() {
    if (!estado || !estado.res) return inicio();
    var r = estado.res, aprovado = r.nota >= Number(A.limiar || 18);
    var h = "<h1>Resultado do Exame " + r.n + "</h1><div class='card resultado-card'>" +
      semaforo(aprovado) + "<div class='nota'>" + nota(r.nota) + " / 20 valores</div>" +
      "<h2 class='estado-final " + (aprovado ? "texto-aprovado" : "texto-reprovado") + "'>" +
      (aprovado ? "APROVADO" : "REPROVADO") + "</h2>" +
      "<p>Certas: <b>" + r.certas + "</b> · Erradas: <b>" + r.erradas +
      "</b> · Em branco: <b>" + r.branco + "</b></p>" +
      "<p>Tempo: " + (r.motivo === "tempo" ? "terminou; exame submetido automaticamente." : "submissão pelo candidato.") + "</p></div>" +
      "<p><a class='btn' href='#/rever'>Rever exame</a> " +
      "<a class='btn sec' href='#/exames'>Outros exames</a></p>";
    app.innerHTML = h;
  }
  function rever() {
    if (!estado || !estado.res) return resultado();
    var h = "<h1>Revisão do Exame " + estado.n + "</h1>" +
      "<p>Consulta as tuas respostas, a resposta correcta e a explicação de cada pergunta.</p>";
    estado.Q.forEach(function (q, i) {
      var sel = estado.res.respostas[i], acertou = sel === q.correta;
      h += "<article class='card revisao-pergunta'><h2>Pergunta " + (i + 1) + "</h2>" +
        "<p>" + esc(q.enunciado) + "</p>";
      if (q.imagem && q.imagem.src) h += "<img class='img' src='" + esc(q.imagem.src) + "' alt='Imagem da pergunta'>";
      h += "<ol type='A' class='lista-revisao'>";
      q.opcoes.forEach(function (o, k) {
        var classe = k === q.correta ? " resposta-correcta" : (k === sel ? " resposta-errada" : "");
        h += "<li class='" + classe + "'>" + esc(o);
        if (k === sel) h += " <b>(a tua resposta)</b>";
        if (k === q.correta) h += " <b>(resposta correcta)</b>";
        h += "</li>";
      });
      h += "</ol><p class='explicacao-revisao'>" + (sel === null ? "<b>Não respondida.</b> " :
        (acertou ? "<b>Resposta correcta.</b> " : "<b>Resposta incorrecta.</b> ")) +
        esc(q.explicacao) + "</p></article>";
    });
    h += "<p><a class='btn' href='#/resultado'>Voltar ao resultado</a> " +
      "<a class='btn sec' href='#/exames'>Catálogo</a></p>";
    app.innerHTML = h;
  }
  app.addEventListener("click", function (event) {
    var alvo = event.target;
    if (!alvo || !alvo.getAttribute) return;
    var acao = alvo.getAttribute("data-action");
    if (!acao || !estado || estado.res) return;
    if (acao === "responder") {
      var indice = Number(alvo.getAttribute("data-indice"));
      if (indice >= 0 && indice < 4) { estado.resp[estado.i] = indice; renderQuestao(); }
    } else if (acao === "anterior" && estado.i > 0) {
      estado.i--; renderQuestao();
    } else if (acao === "proxima" && estado.i < estado.Q.length - 1) {
      estado.i++; renderQuestao();
    } else if (acao === "submeter") terminar("manual");
  });
  window.addEventListener("hashchange", rota);
  rota();
})();