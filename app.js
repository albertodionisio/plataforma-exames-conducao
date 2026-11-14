(function () {
  "use strict";
  // DEF-002: carregar a preferência de aparência antes de desenhar a aplicação.
  try{var temaInicial=localStorage.getItem("estrada.tema")==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",temaInicial);document.documentElement.style.colorScheme=temaInicial;}catch(e){document.documentElement.setAttribute("data-theme","light");}
  window.addEventListener("storage",function(e){if(e.key==="estrada.tema"){var tema=e.newValue==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",tema);document.documentElement.style.colorScheme=tema;}});
  var A = window.APP || {}, EX = window.EXAMES || {};
  var app = document.getElementById("app");
  var estado = null, timer = null;
  var supabaseClient = null, authUser = null, authReady = false, authAvailable = false;
  var authMode = "login", authFeedback = "";

  function iniciarAuth() {
    try {
      if (!window.supabase || typeof window.supabase.createClient !== "function" ||
          !A.supabaseUrl || !A.supabasePublishableKey) {
        authReady = true;
        authAvailable = false;
        return Promise.resolve();
      }
      supabaseClient = window.supabase.createClient(A.supabaseUrl, A.supabasePublishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      authAvailable = true;
      supabaseClient.auth.onAuthStateChange(function (event, session) {
        authUser = session && session.user ? session.user : null;
        renderConta();
        if (event === "SIGNED_IN" && authUser) retomarExamePendente();
        if (event === "SIGNED_OUT" && location.hash.indexOf("#/exame/") === 0) rota();
      });
      return supabaseClient.auth.getSession().then(function (resultado) {
        authUser = resultado && resultado.data && resultado.data.session ?
          resultado.data.session.user : null;
        authReady = true;
        renderConta();
      }).catch(function () {
        authReady = true;
        authAvailable = false;
      });
    } catch (e) {
      authReady = true;
      authAvailable = false;
      return Promise.resolve();
    }
  }

  function renderConta() {
    var el = document.getElementById("conta-utilizador");
    if (!el) return;
    el.innerHTML = authUser ?
      "<span class='conta-email'>" + esc(authUser.email || "Conta autenticada") +
      "</span><button class='conta-sair' type='button' data-action='auth-logout'>Sair</button>" :
      "<a class='conta-entrar' href='#/entrar'>Entrar</a>";
  }

  function retomarExamePendente() {
    var n = null;
    try {
      n = Number(sessionStorage.getItem("estrada.exame.pendente"));
      if (n > 0) sessionStorage.removeItem("estrada.exame.pendente");
      else n = null;
    } catch (e) {}
    location.hash = n ? "#/exame/" + n : "#/exames";
    if (location.hash === (n ? "#/exame/" + n : "#/exames")) rota();
  }

  function telaAutenticacao() {
    if (!authAvailable) {
      app.innerHTML = "<h1>Entrar</h1><div class='card aviso'>O serviço de autenticação não está disponível neste momento. Tenta novamente mais tarde.</div><p><a class='btn sec' href='#/exames'>Voltar aos exames</a></p>";
      return;
    }
    var registo = authMode === "registo";
    app.innerHTML = "<section class='auth-card card' aria-labelledby='auth-titulo'>" +
      "<h1 id='auth-titulo'>" + (registo ? "Criar conta" : "Entrar na tua conta") + "</h1>" +
      "<p>" + (registo ? "Regista-te para começares a realizar exames." : "Inicia sessão para continuares para o exame seleccionado.") + "</p>" +
      "<form id='auth-form'>" +
      "<label for='auth-email'>Email</label><input id='auth-email' name='email' type='email' autocomplete='email' required maxlength='254'>" +
      "<label for='auth-password'>Palavra-passe</label><input id='auth-password' name='password' type='password' autocomplete='" + (registo ? "new-password" : "current-password") + "' minlength='8' required>" +
      "<button class='btn auth-submit' type='submit'>" + (registo ? "Criar conta" : "Entrar") + "</button></form>" +
      (authFeedback ? "<p class='auth-feedback' role='status'>" + esc(authFeedback) + "</p>" : "") +
      "<p class='auth-alternar'>" + (registo ? "Já tens conta?" : "Ainda não tens conta?") +
      " <button class='link-button' type='button' data-action='auth-mode'>" + (registo ? "Entrar" : "Criar conta") + "</button></p>" +
      "<button class='btn sec auth-google' type='button' disabled aria-disabled='true'>Continuar com Google — brevemente</button>" +
      "<p><a href='#/exames'>Voltar ao catálogo</a></p></section>";
  }

  function concluirAutenticacao(user) {
    authUser = user || authUser;
    authFeedback = "";
    renderConta();
    retomarExamePendente();
  }

  function terminarAutenticacao(event) {
    var form = event.target;
    if (!form || form.id !== "auth-form") return;
    event.preventDefault();
    if (!authAvailable || !supabaseClient) {
      authFeedback = "Serviço de autenticação indisponível.";
      return telaAutenticacao();
    }
    var emailEl = form.querySelector("#auth-email");
    var passwordEl = form.querySelector("#auth-password");
    var email = emailEl ? emailEl.value.trim() : "";
    var password = passwordEl ? passwordEl.value : "";
    if (!email || password.length < 8) {
      authFeedback = "Indica um email válido e uma palavra-passe com pelo menos 8 caracteres.";
      return telaAutenticacao();
    }
    authFeedback = "A processar...";
    telaAutenticacao();
    var pedido = authMode === "registo" ?
      supabaseClient.auth.signUp({ email: email, password: password,
        options: { emailRedirectTo: location.origin + location.pathname + "#/entrar" } }) :
      supabaseClient.auth.signInWithPassword({ email: email, password: password });
    pedido.then(function (resultado) {
      if (resultado.error) {
        authFeedback = resultado.error.message || "Não foi possível autenticar.";
        telaAutenticacao();
        return;
      }
      if (resultado.data && resultado.data.session && resultado.data.user) {
        concluirAutenticacao(resultado.data.user);
      } else if (authMode === "registo") {
        authFeedback = "Conta criada. Confirma o teu email através da mensagem enviada para concluir o registo.";
        telaAutenticacao();
      } else {
        authFeedback = "Não foi possível iniciar sessão. Tenta novamente.";
        telaAutenticacao();
      }
    }).catch(function () {
      authFeedback = "Ocorreu um erro de ligação. Tenta novamente.";
      telaAutenticacao();
    });
  }

  function sairDaConta() {
    if (supabaseClient) supabaseClient.auth.signOut().then(function (resultado) {
      if (resultado && resultado.error) {
        authFeedback = "Não foi possível terminar a sessão.";
      } else {
        authUser = null;
        renderConta();
        location.hash = "#/";
        rota();
      }
    }).catch(function () {
      authFeedback = "Não foi possível terminar a sessão.";
    });
  }

  document.getElementById("nome").textContent = A.nome || "ESTRADA";
  document.title = (A.nome || "ESTRADA") + " — " + (A.slogan || "Exames de condução");

  var botaoMenu = document.getElementById("menu-toggle");
  var navegacao = document.getElementById("navegacao");
  function fecharMenu() {
    if (!botaoMenu || !navegacao) return;
    navegacao.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
  }
  if (botaoMenu && navegacao) {
    botaoMenu.addEventListener("click", function () {
      var aberto = botaoMenu.getAttribute("aria-expanded") === "true";
      if (aberto) {
        fecharMenu();
      } else {
        navegacao.classList.add("aberto");
        botaoMenu.setAttribute("aria-expanded", "true");
        botaoMenu.setAttribute("aria-label", "Fechar menu");
      }
    });
    navegacao.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a") : null;
      if (link) fecharMenu();
    });
  }

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
  function restaurarUltimo() {
    if (estado !== null) return !!(estado && estado.res);
    try {
      var salvo = JSON.parse(sessionStorage.getItem("ultima") || "null");
      if (!salvo || !salvo.res || !Array.isArray(EX[salvo.n]) ||
          EX[salvo.n].length !== Number(A.perguntasPorExame || 25)) return false;
      estado = { n:salvo.n, Q:EX[salvo.n], i:0, fim:Date.now(), resp:{}, res:salvo.res };
      return true;
    } catch (e) { return false; }
  }
  function rota() {
    pararRelogio();
    var h = location.hash.replace("#", "") || "/";
    if (!authReady) { app.innerHTML = "<p>A carregar...</p>"; return; }
    if (h === "/entrar") return telaAutenticacao();
    if (h === "/exames") return catalogo();
    if (h === "/planos") return planos();
    if (h === "/resultado") return resultado();
    if (h === "/rever") return rever();
    if (h.indexOf("/exame/") === 0) return iniciar(parseInt(h.split("/")[2], 10));
    inicio();
  }
  function inicio() {
    var h = historico(), ult = h.length ?
      "<div class='card'><h2>Último exame</h2><p>Exame " + esc(h[0].n) +
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
      " primeiros são gratuitos. Durante a fase de testes, os Exames 1–51 estão temporariamente abertos.</p><div class='grelha'>";
    for (var n = 1; n <= Number(A.totalExames || 0); n++) {
      var pronto = Array.isArray(EX[n]), livre = temAcesso(n);
      var rotulo = !pronto ? "Em preparação" : (n <= A.gratuitos ? "Grátis" :
        (testeAberto(n) ? "Aberto para testes" : "Acesso por plano"));
      var destino = pronto ? "#/exame/" + n : "#/exames";
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
    if (!authReady) { app.innerHTML = "<p>A carregar...</p>"; return; }
    if (!authAvailable) {
      app.innerHTML = "<h1>Exame " + n + "</h1><div class='card aviso'>Não foi possível ligar ao serviço de autenticação. O exame não foi iniciado.</div><p><a class='btn sec' href='#/exames'>Voltar aos exames</a></p>";
      return;
    }
    if (!authUser) {
      try { sessionStorage.setItem("estrada.exame.pendente", String(n)); } catch (e) {}
      location.hash = "#/entrar";
      telaAutenticacao();
      return;
    }
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
  function renderQuestao(focoIndice) {
    if (!estado || estado.res) return;
    var Q = estado.Q, q = Q[estado.i], sel = estado.resp[estado.i];
    var respondidas = Object.keys(estado.resp).length;
    var h = "<div class='estado'><span>Exame " + estado.n + " · Pergunta " +
      (estado.i + 1) + " de " + Q.length + "</span><span class='tempo' id='tempo'>" +
      fmt(restante()) + "</span></div>";
    h += "<div class='progresso' aria-label='Progresso'><span style='width:" +
      Math.round((respondidas / Q.length) * 100) + "%'></span></div>";
    h += "<h2 id='titulo-pergunta' tabindex='-1'>" + esc(q.enunciado) + "</h2>";
    if (q.imagem) h += q.imagem.src ?
      "<img class='img' src='" + esc(q.imagem.src) + "' alt='" + esc(q.imagem.descricao || "Imagem da pergunta") + "'>" :
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
    var foco = typeof focoIndice === "number" ?
      app.querySelector("[data-action='responder'][data-indice='" + focoIndice + "']") :
      app.querySelector("#titulo-pergunta");
    if (foco && typeof foco.focus === "function") foco.focus();
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
    var notaFinal = Math.round(certas * Number(A.valorPorResposta || 0.8) * 10) / 10;
    var aprovado = estado.Q.length === Number(A.perguntasPorExame || 25) ?
      notaFinal >= Number(A.limiar || 18) : null;
    estado.res = { certas:certas, erradas:erradas, branco:branco, total:estado.Q.length,
      nota:notaFinal, aprovado:aprovado, n:estado.n, motivo:motivo || "manual",
      respostas:estado.Q.map(function (_, i) {
        return Object.prototype.hasOwnProperty.call(estado.resp, i) ? estado.resp[i] : null;
      }) };
    guardar({ n:estado.n, certas:certas, total:estado.Q.length, nota:estado.res.nota });
    try {
      sessionStorage.setItem("ultima", JSON.stringify({
        n:estado.n, respostas:estado.res.respostas, res:estado.res
      }));
    } catch (e) {}
    location.hash = "#/resultado";
    resultado();
  }
  function semaforo(aprovado) {
    return "<div class='semaforo " + (aprovado ? "aprovado" : "reprovado") +
      "' role='img' aria-label='" + (aprovado ? "Semáforo verde: aprovado" : "Semáforo vermelho: reprovado") +
      "'><span class='luz vermelha'></span><span class='luz amarela'></span><span class='luz verde'></span></div>";
  }
  function resultado() {
    if (estado === null) restaurarUltimo();
    if (!estado || !estado.res) return inicio();
    var r = estado.res, aprovado = typeof r.aprovado === "boolean" ? r.aprovado : null;
    var h = "<h1>Resultado do Exame " + r.n + "</h1><div class='card resultado-card'>" +
      (aprovado === null ? "" : semaforo(aprovado)) +
      "<div class='nota'>" + nota(r.nota) + " / 20 valores</div>" +
      (aprovado === null ? "" : "<h2 class='estado-final " + (aprovado ? "texto-aprovado" : "texto-reprovado") + "'>" +
      (aprovado ? "APROVADO" : "REPROVADO") + "</h2>") +
      "<p>Certas: <b>" + r.certas + "</b> · Erradas: <b>" + r.erradas +
      "</b> · Em branco: <b>" + r.branco + "</b></p>" +
      "<p>Tempo: " + (r.motivo === "tempo" ? "terminou; exame submetido automaticamente." : "submissão pelo candidato.") + "</p></div>" +
      "<p><a class='btn' href='#/rever'>Rever exame</a> " +
      "<a class='btn sec' href='#/exames'>Outros exames</a></p>";
    app.innerHTML = h;
  }
  function rever() {
    if (estado === null) restaurarUltimo();
    if (!estado || !estado.res) return resultado();
    var h = "<h1>Revisão do Exame " + estado.n + "</h1>" +
      "<p>Consulta as tuas respostas, a resposta correcta e a explicação de cada pergunta.</p>";
    estado.Q.forEach(function (q, i) {
      var sel = estado.res.respostas[i], acertou = sel === q.correta;
      h += "<article class='card revisao-pergunta'><h2>Pergunta " + (i + 1) + "</h2>" +
        "<p>" + esc(q.enunciado) + "</p>";
      if (q.imagem && q.imagem.src) h += "<img class='img' src='" + esc(q.imagem.src) + "' alt='" +
        esc(q.imagem.descricao || "Imagem da pergunta") + "'>";
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
      "<a class='btn sec' href='#/exames'>Ver exames</a></p>";
    app.innerHTML = h;
  }
  app.addEventListener("submit", terminarAutenticacao);
  app.addEventListener("click", function (event) {
    var alvo = event.target;
    if (!alvo || !alvo.getAttribute) return;
    var acao = alvo.getAttribute("data-action");
    if (!acao) return;
    if (acao === "auth-mode") {
      authMode = authMode === "login" ? "registo" : "login";
      authFeedback = "";
      telaAutenticacao();
      return;
    }
    if (acao === "auth-logout") { sairDaConta(); return; }
    if (!estado || estado.res) return;
    if (acao === "responder") {
      var indice = Number(alvo.getAttribute("data-indice"));
      if (indice >= 0 && indice < 4) {
        estado.resp[estado.i] = indice;
        if (Object.keys(estado.resp).length === estado.Q.length) terminar("completo");
        else renderQuestao(indice);
      }
    } else if (acao === "anterior" && estado.i > 0) {
      estado.i--; renderQuestao();
    } else if (acao === "proxima" && estado.i < estado.Q.length - 1) {
      estado.i++; renderQuestao();
    } else if (acao === "submeter") {
      var brancas = estado.Q.length - Object.keys(estado.resp).length;
      if (brancas > 0 && !confirm("Tens " + brancas +
          " pergunta(s) sem resposta. Valem zero. Submeter mesmo assim?")) return;
      terminar("manual");
    }
  });
  window.addEventListener("hashchange", function () {
    fecharMenu();
    rota();
  });
  rota();
})();