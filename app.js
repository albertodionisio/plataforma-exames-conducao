(function () {
  "use strict";
  // DEF-002: carregar a preferência de aparência antes de desenhar a aplicação.
  try{var temaInicial=localStorage.getItem("estrada.tema")==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",temaInicial);document.documentElement.style.colorScheme=temaInicial;}catch(e){document.documentElement.setAttribute("data-theme","light");}
  window.addEventListener("storage",function(e){if(e.key==="estrada.tema"){var tema=e.newValue==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",tema);document.documentElement.style.colorScheme=tema;}});
  var A = window.APP || {}, EX = window.EXAMES || {};
  var app = document.getElementById("app");
  var estado = null, timer = null;
  var firebaseApp = null, firebaseAuth = null, firestoreDb = null;
  var authUser = null, authReady = false, authAvailable = false;
  var authMode = "login", authFeedback = "";

  function iniciarAuth() {
    var config = A.firebase;
    if (!window.firebase || !config || !config.apiKey || !config.authDomain ||
        !config.projectId || !config.appId) {
      authReady = true;
      authAvailable = false;
      return Promise.resolve();
    }
    try {
      firebaseApp = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(config);
      firebaseAuth = window.firebase.auth();
      firestoreDb = window.firebase.firestore();
      firebaseAuth.languageCode = "pt";
      authAvailable = true;
      return firebaseAuth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).then(function () {
        return new Promise(function (resolve) {
          var initialised = false;
          firebaseAuth.onAuthStateChanged(function (user) {
            var passwordProvider = user && Array.isArray(user.providerData) &&
              user.providerData.some(function (p) { return p.providerId === "password"; });
            if (user && passwordProvider && !user.emailVerified) {
              authUser = null;
              authReady = true;
              renderConta();
              firebaseAuth.signOut().catch(function () {});
              if (!initialised) { initialised = true; resolve(); }
              return;
            }
            authUser = user || null;
            authReady = true;
            renderConta();
            if (authUser) {
              sincronizarPerfil(authUser).catch(function (error) {
                console.warn("Perfil Firebase ainda não sincronizado:", error && error.code);
              });
              retomarExamePendente();
            }
            if (!initialised) { initialised = true; resolve(); }
          }, function () {
            authReady = true;
            authAvailable = false;
            if (!initialised) { initialised = true; resolve(); }
          });
          firebaseAuth.getRedirectResult().catch(function (error) {
            authFeedback = mensagemAuth(error, "Não foi possível concluir o acesso com Google.");
          });
        });
      }).catch(function () {
        authReady = true;
        authAvailable = false;
      });
    } catch (error) {
      authReady = true;
      authAvailable = false;
      return Promise.resolve();
    }
  }

  function sincronizarPerfil(user) {
    if (!firestoreDb || !user || !user.uid) return Promise.resolve();
    var perfil = {
      uid: user.uid,
      email: user.email || "",
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };
    if (user.displayName) perfil.displayName = user.displayName;
    if (user.photoURL) perfil.photoURL = user.photoURL;
    var ref = firestoreDb.collection("users").doc(user.uid);
    return ref.get().then(function (snap) {
      if (!snap.exists) perfil.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
      return ref.set(perfil, { merge: true });
    });
  }

  function mensagemAuth(error, fallback) {
    var code = error && error.code ? error.code : "";
    var mensagens = {
      "auth/email-already-in-use": "Este email já está associado a uma conta.",
      "auth/invalid-email": "O endereço de email não é válido.",
      "auth/weak-password": "A palavra-passe deve ter pelo menos 8 caracteres.",
      "auth/user-not-found": "Não existe uma conta com este email.",
      "auth/wrong-password": "A palavra-passe está incorrecta.",
      "auth/invalid-credential": "Email ou palavra-passe incorrectos.",
      "auth/too-many-requests": "Demasiadas tentativas. Aguarda um pouco e tenta novamente.",
      "auth/popup-closed-by-user": "A janela de autenticação foi fechada antes de concluir.",
      "auth/popup-blocked": "O navegador bloqueou a janela de autenticação. Tenta novamente.",
      "auth/unauthorized-domain": "Este domínio ainda não está autorizado no Firebase Authentication.",
      "auth/network-request-failed": "Falha de ligação. Verifica a Internet e tenta novamente."
    };
    return mensagens[code] || (error && error.message) || fallback;
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
      n = Number(localStorage.getItem("estrada.exame.pendente"));
      if (n > 0) localStorage.removeItem("estrada.exame.pendente");
      else n = null;
    } catch (e) {}
    if (!n) return false;
    var destino = "#/exame/" + n;
    var hashAnterior = location.hash;
    location.hash = destino;
    if (hashAnterior === destino) rota();
    return true;
  }

  function telaAutenticacao() {
    if (!authAvailable) {
      app.innerHTML = "<h1>Entrar</h1><div class='card aviso'>O serviço Firebase ainda não está disponível. Verifica a configuração e os domínios autorizados.</div><p><a class='btn sec' href='#/exames'>Voltar aos exames</a></p>";
      return;
    }
    var registo = authMode === "registo";
    app.innerHTML = "<section class='auth-card card' aria-labelledby='auth-titulo'>" +
      "<h1 id='auth-titulo'>" + (registo ? "Criar conta" : "Entrar na tua conta") + "</h1>" +
      "<p>" + (registo ? "Regista-te para começares a realizar exames. Terás de confirmar o teu email." : "Inicia sessão para continuares para o exame seleccionado.") + "</p>" +
      "<form id='auth-form'>" +
      "<label for='auth-email'>Email</label><input id='auth-email' name='email' type='email' autocomplete='email' required maxlength='254'>" +
      "<label for='auth-password'>Palavra-passe</label><input id='auth-password' name='password' type='password' autocomplete='" + (registo ? "new-password" : "current-password") + "' minlength='8' required>" +
      "<button class='btn auth-submit' type='submit'>" + (registo ? "Criar conta" : "Entrar") + "</button></form>" +
      (authFeedback ? "<p class='auth-feedback' role='status'>" + esc(authFeedback) + "</p>" : "") +
      (!registo ? "<p><button class='link-button' type='button' data-action='auth-reset'>Esqueci-me da palavra-passe</button></p>" : "") +
      "<p class='auth-alternar'>" + (registo ? "Já tens conta?" : "Ainda não tens conta?") +
      " <button class='link-button' type='button' data-action='auth-mode'>" + (registo ? "Entrar" : "Criar conta") + "</button></p>" +
      (A.googleOAuthEnabled ? "<button class='btn sec auth-google' type='button' data-action='auth-google'>Continuar com Google</button>" : "") +
      "<p><a href='#/exames' data-action='auth-cancel'>Voltar ao catálogo</a></p></section>";
  }
  function concluirAutenticacao(user) {
    authUser = user || authUser;
    authFeedback = "";
    renderConta();
    if (!retomarExamePendente() && location.hash === "#/entrar") { location.hash = "#/exames"; if (location.hash === "#/exames") rota(); }
  }

  function terminarAutenticacao(event) {
    var form = event.target;
    if (!form || form.id !== "auth-form") return;
    event.preventDefault();
    if (!authAvailable || !firebaseAuth) {
      authFeedback = "Serviço Firebase indisponível.";
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
    if (authMode === "registo") {
      firebaseAuth.createUserWithEmailAndPassword(email, password).then(function (credential) {
        return credential.user.sendEmailVerification({
          url: location.origin + location.pathname + "#/entrar"
        }).then(function () {
          return firebaseAuth.signOut();
        }).then(function () {
          authFeedback = "Conta criada. Enviámos uma mensagem para confirmares o teu email. Depois da confirmação, já poderás entrar.";
          telaAutenticacao();
        });
      }).catch(function (error) {
        authFeedback = mensagemAuth(error, "Não foi possível criar a conta.");
        telaAutenticacao();
      });
      return;
    }
    firebaseAuth.signInWithEmailAndPassword(email, password).then(function (credential) {
      if (!credential.user.emailVerified) {
        return firebaseAuth.signOut().then(function () {
          authFeedback = "Ainda não confirmaste o teu email. Abre a mensagem de verificação que enviámos antes de entrar.";
          telaAutenticacao();
        });
      }
      concluirAutenticacao(credential.user);
    }).catch(function (error) {
      authFeedback = mensagemAuth(error, "Não foi possível iniciar sessão.");
      telaAutenticacao();
    });
  }

  function recuperarPalavraPasse() {
    var emailEl = document.getElementById("auth-email");
    var email = emailEl ? emailEl.value.trim() : "";
    if (!email) {
      authFeedback = "Escreve primeiro o teu email no campo acima.";
      telaAutenticacao();
      return;
    }
    firebaseAuth.sendPasswordResetEmail(email, {
      url: location.origin + location.pathname + "#/entrar"
    }).then(function () {
      authFeedback = "Se existir uma conta para este endereço, receberás uma mensagem com as instruções para redefinir a palavra-passe.";
      telaAutenticacao();
    }).catch(function (error) {
      authFeedback = mensagemAuth(error, "Não foi possível enviar a mensagem de recuperação.");
      telaAutenticacao();
    });
  }
  function entrarComGoogle() {
    if (!authAvailable || !firebaseAuth || A.googleOAuthEnabled !== true) return;
    var provider = new window.firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    firebaseAuth.signInWithPopup(provider).then(function (resultado) {
      concluirAutenticacao(resultado.user);
    }).catch(function (error) {
      if (error && error.code === "auth/popup-blocked") {
        firebaseAuth.signInWithRedirect(provider).catch(function (redirectError) {
          authFeedback = mensagemAuth(redirectError, "Não foi possível iniciar o acesso com Google.");
          telaAutenticacao();
        });
        return;
      }
      authFeedback = mensagemAuth(error, "Não foi possível iniciar o acesso com Google.");
      telaAutenticacao();
    });
  }
  function sairDaConta() {
    try { localStorage.removeItem("estrada.exame.pendente"); } catch (e) {}
    if (!firebaseAuth) return;
    firebaseAuth.signOut().then(function () {
      authUser = null;
      estado = null;
      pararRelogio();
      renderConta();
      location.hash = "#/";
      rota();
    }).catch(function () {
      authFeedback = "Não foi possível terminar a sessão. Tenta novamente.";
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
      try { localStorage.setItem("estrada.exame.pendente", String(n)); } catch (e) {}
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
    if (acao === "auth-reset") { recuperarPalavraPasse(); return; }
    if (acao === "auth-cancel") { try { localStorage.removeItem("estrada.exame.pendente"); } catch (e) {} return; }
    if (acao === "auth-google") { entrarComGoogle(); return; }
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
  iniciarAuth().then(function () { rota(); });
})();