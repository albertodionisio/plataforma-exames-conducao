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
  var subscriptionData = null, subscriptionReady = false;
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
              carregarSubscricao(authUser).then(function () {
                var retomou = retomarExamePendente();
                if (!retomou && location.hash === "#/entrar") {
                  location.hash = "#/exames";
                  if (location.hash === "#/exames") rota();
                } else if (!retomou) {
                  rota();
                }
              });
            } else {
              subscriptionData = null;
              subscriptionReady = true;
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

  function sincronizarPerfil(user, telefone) {
    if (!firestoreDb || !user || !user.uid) return Promise.resolve();
    var perfil = {
      uid: user.uid,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };
    if (user.email) perfil.email = user.email;
    if (telefone) perfil.phone = telefone;
    if (user.displayName) perfil.displayName = user.displayName;
    if (user.photoURL) perfil.photoURL = user.photoURL;
    var ref = firestoreDb.collection("users").doc(user.uid);
    var claims = telefone ? Promise.resolve() :
      (typeof user.getIdTokenResult === "function" ?
        user.getIdTokenResult().then(function (resultado) {
          if (resultado.claims && resultado.claims.phoneAuth === true &&
              typeof resultado.claims.phone === "string") perfil.phone = resultado.claims.phone;
        }) : Promise.resolve());
    return claims.then(function () {
      return ref.get().then(function (snap) {
        var existente = snap.exists ? snap.data() : {};
        if (!perfil.displayName && existente.displayName) {
          authDisplayName = existente.displayName;
        } else if (perfil.displayName) {
          authDisplayName = perfil.displayName;
        }
        if (!snap.exists) perfil.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
        return ref.set(perfil, { merge: true }).then(function () {
          renderConta();
          return perfil;
        });
      });
    });
  }

  function carregarSubscricao(user) {
    subscriptionData = null;
    subscriptionReady = false;
    if (!firestoreDb || !user || !user.uid) {
      subscriptionData = null;
      subscriptionReady = true;
      return Promise.resolve(null);
    }
    return firestoreDb.collection("subscriptions").doc(user.uid).get().then(function (snap) {
      if (authUser && authUser.uid === user.uid) subscriptionData = snap.exists ? snap.data() : null;
      subscriptionReady = true;
      return subscriptionData;
    }).catch(function (error) {
      if (authUser && authUser.uid === user.uid) subscriptionData = null;
      subscriptionReady = true;
      console.warn("Não foi possível carregar a assinatura:", error && error.code);
      return null;
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
  var authDisplayName = "";
  function renderConta() {
    var el = document.getElementById("conta-utilizador");
    if (!el) return;
    var nome = authUser ? (authUser.displayName || authDisplayName || "Conta") : "";
    el.innerHTML = authUser ?
      "<span class='conta-email'>" + esc(nome) +
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
    var camposNome = registo ?
      "<label for='auth-first-name'>Primeiro nome</label><input id='auth-first-name' name='firstName' type='text' autocomplete='given-name' maxlength='50' required>" +
      "<label for='auth-last-name'>Sobrenome ou apelido</label><input id='auth-last-name' name='lastName' type='text' autocomplete='family-name' maxlength='60'>" : "";
    var campoIdentificador =
      "<label for='auth-identifier'>Email ou número de telefone</label>" +
      "<input id='auth-identifier' name='identifier' type='text' autocomplete='username' placeholder='Email ou número de telefone' required maxlength='254' autocapitalize='none' spellcheck='false'>";
    app.innerHTML = "<section class='auth-card card' aria-labelledby='auth-titulo'>" +
      "<h1 id='auth-titulo'>" + (registo ? "Criar conta" : "Entrar na tua conta") + "</h1>" +
      "<p>" + (registo ? "Regista-te para começares a realizar exames. Podes usar o teu email ou número de telefone." :
        "Inicia sessão com o teu email ou número de telefone para continuares.") + "</p>" +
      "<form id='auth-form'>" + camposNome + campoIdentificador +
      "<label for='auth-password'>Palavra-passe</label><input id='auth-password' name='password' type='password' autocomplete='" + (registo ? "new-password" : "current-password") + "' minlength='8' maxlength='128' required>" +
      (registo ? "<label for='auth-confirm-password'>Confirmar palavra-passe</label><input id='auth-confirm-password' name='confirmPassword' type='password' autocomplete='new-password' minlength='8' maxlength='128' required>" : "") +
      "<button class='btn auth-submit' type='submit'>" + (registo ? "Criar conta" : "Entrar") + "</button></form>" +
      (authFeedback ? "<p class='auth-feedback' role='status'>" + esc(authFeedback) + "</p>" : "") +
      (!registo ? "<p><button class='link-button' type='button' data-action='auth-reset'>Esqueci-me da palavra-passe</button></p>" : "") +
      "<p class='auth-alternar'>" + (registo ? "Já tens conta?" : "Ainda não tens conta?") +
      " <button class='link-button' type='button' data-action='auth-mode'>" + (registo ? "Entrar" : "Criar conta") + "</button></p>" +
      (A.googleOAuthEnabled ? "<button class='btn sec auth-google' type='button' data-action='auth-google'><svg class='auth-google-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/><path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23z'/><path fill='#FBBC05' d='M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.15a11 11 0 0 0 0 9.88l3.69-2.84z'/><path fill='#EA4335' d='M12 4.37c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0a11 11 0 0 0-9.85 7.06l3.69 2.84C6.71 7.3 9.14 4.37 12 4.37z'/></svg><span>Continuar com Google</span></button>" : "") +
      "<p><a href='#/exames' data-action='auth-cancel'>Voltar ao catálogo</a></p></section>";
  }
  function concluirAutenticacao(user) {
    authUser = user || authUser;
    authFeedback = "";
    renderConta();
  }

  function normalizarTelefoneCliente(valor) {
    var telefone = String(valor || "").trim().replace(/[\s().-]/g, "");
    if (/^00258\d{9}$/.test(telefone)) telefone = "+258" + telefone.slice(5);
    if (/^258\d{9}$/.test(telefone)) telefone = "+" + telefone;
    if (/^\d{9}$/.test(telefone)) telefone = "+258" + telefone;
    // Vodacom: 84/85. Movitel: 86/87/88. Sempre 9 algarismos nacionais.
    return /^\+258(?:84|85|86|87|88)\d{7}$/.test(telefone) ? telefone : "";
  }
  function autenticarComTelefone(telefone, password, confirmar, nomeProprio, apelido) {
    fetch("/api/auth/phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        action: authMode === "registo" ? "register" : "login",
        phone: telefone,
        password: password,
        confirmPassword: confirmar,
        firstName: authMode === "registo" ? nomeProprio : undefined,
        lastName: authMode === "registo" ? apelido : undefined
      })
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) throw new Error(data && data.error ? data.error : "Não foi possível autenticar.");
        return data;
      });
    }).then(function (data) {
      return firebaseAuth.signInWithCustomToken(data.token).then(function (credential) {
        var displayName = String(data.displayName || [data.firstName, data.lastName].filter(Boolean).join(" ")).trim();
        var actualizarNome = displayName && typeof credential.user.updateProfile === "function" ?
          credential.user.updateProfile({ displayName: displayName }) : Promise.resolve();
        return actualizarNome.then(function () {
          return sincronizarPerfil(credential.user, data.phone);
        }).then(function () {
          concluirAutenticacao(credential.user);
        });
      });
    }).catch(function (error) {
      authFeedback = error && error.message ? error.message : "Não foi possível concluir o acesso por telefone.";
      telaAutenticacao();
    });
  }
  function terminarAutenticacao(event) {
    var form = event.target;
    if (!form || form.id !== "auth-form") return;
    event.preventDefault();
    if (!authAvailable || !firebaseAuth) {
      authFeedback = "Serviço Firebase indisponível.";
      return telaAutenticacao();
    }
    var passwordEl = form.querySelector("#auth-password");
    var password = passwordEl ? passwordEl.value : "";
    var confirmarEl = form.querySelector("#auth-confirm-password");
    var confirmar = confirmarEl ? confirmarEl.value : "";
    var primeiroNomeEl = form.querySelector("#auth-first-name");
    var apelidoEl = form.querySelector("#auth-last-name");
    var nomeProprio = primeiroNomeEl ? primeiroNomeEl.value.trim().replace(/\\s+/g, " ") : "";
    var apelido = apelidoEl ? apelidoEl.value.trim().replace(/\\s+/g, " ") : "";
    if (authMode === "registo" && (!nomeProprio || nomeProprio.length > 50 || apelido.length > 60)) {
      authFeedback = "Indica o primeiro nome (até 50 caracteres) e, se quiseres, um sobrenome ou apelido (até 60 caracteres).";
      return telaAutenticacao();
    }
    if (password.length < 8 || password.length > 128) {
      authFeedback = "A palavra-passe deve ter entre 8 e 128 caracteres.";
      return telaAutenticacao();
    }
    if (authMode === "registo" && password !== confirmar) {
      authFeedback = "As palavras-passe não coincidem.";
      return telaAutenticacao();
    }
    var identificadorEl = form.querySelector("#auth-identifier");
    var identificador = identificadorEl ? identificadorEl.value.trim() : "";
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);
    var telefone = normalizarTelefoneCliente(identificador);
    if (emailValido) {
      // O Firebase Authentication valida o endereço de email.
    } else if (telefone) {
      authFeedback = "A processar...";
      telaAutenticacao();
      autenticarComTelefone(telefone, password, confirmar, nomeProprio, apelido);
      return;
    } else {
      authFeedback = "Indica um email válido ou um número de telefone válido (por exemplo, 84 123 4567 ou +258 84 123 4567).";
      return telaAutenticacao();
    }
    var email = identificador;
    authFeedback = "A processar...";
    telaAutenticacao();
    if (authMode === "registo") {
      firebaseAuth.createUserWithEmailAndPassword(email, password).then(function (credential) {
        var displayName = [nomeProprio, apelido].filter(Boolean).join(" ");
        return credential.user.updateProfile({ displayName: displayName }).then(function () {
          // Usa o handler padrão do Firebase. Não enviar o hostname temporário da
          // Vercel como continue URL: Preview deployments variam e podem não estar
          // autorizados no Firebase Authentication.
          return credential.user.sendEmailVerification();
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
    var identificadorEl = document.getElementById("auth-identifier");
    var email = identificadorEl ? identificadorEl.value.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      authFeedback = "Para recuperar a palavra-passe, escreve primeiro o endereço de email no campo acima.";
      telaAutenticacao();
      return;
    }
    // O handler padrão do Firebase evita depender da autorização de cada
    // hostname temporário de Preview para links de recuperação.
    firebaseAuth.sendPasswordResetEmail(email).then(function () {
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
  function temAcesso(n) {
    if (n <= Number(A.gratuitos || 0) || testeAberto(n)) return true;
    if (!subscriptionReady || !authUser || !subscriptionData || subscriptionData.uid !== authUser.uid || subscriptionData.status !== "active") return false;
    var inicio = subscriptionData.startsAt;
    var fim = subscriptionData.graceUntil || subscriptionData.endsAt;
    var inicioMs = inicio && typeof inicio.toMillis === "function" ? inicio.toMillis() : Date.parse(inicio);
    var fimMs = fim && typeof fim.toMillis === "function" ? fim.toMillis() : Date.parse(fim);
    return Number.isFinite(fimMs) && fimMs > Date.now() &&
      (!Number.isFinite(inicioMs) || inicioMs <= Date.now()) &&
      Number(subscriptionData.exams || 0) >= Number(n);
  }
  function pararRelogio() {
    if (timer !== null) { clearInterval(timer); timer = null; }
  }
  // Guarda apenas o estado necessário para retomar a tentativa no mesmo navegador.
  // O prazo absoluto impede que uma actualização da página reinicie os 60 minutos.
  // Cada exame tem uma chave própria: uma tentativa nunca bloqueia outro exame.
  var chaveExameEmCurso = "estrada.exame.em-curso";
  function chaveEstadoExame(n) { return chaveExameEmCurso + "." + Number(n); }
  function migrarEstadoExameLegado(n) {
    try {
      var legado = localStorage.getItem(chaveExameEmCurso);
      if (!legado) return;
      var antigo = JSON.parse(legado);
      if (antigo && Number.isInteger(Number(antigo.n)) && Number(antigo.n) > 0) {
        var destino = chaveEstadoExame(antigo.n);
        if (!localStorage.getItem(destino)) localStorage.setItem(destino, legado);
        localStorage.removeItem(chaveExameEmCurso);
      }
    } catch (e) {
      // Um registo legado sem número identificável não pode bloquear exames diferentes.
      // Mantém-se intacto para não apagar dados que não conseguimos interpretar.
    }
  }
  function guardarEstadoExame() {
    if (!estado || estado.res) return;
    try {
      localStorage.setItem(chaveEstadoExame(estado.n), JSON.stringify({
        versao:1, n:estado.n, i:estado.i, fim:estado.fim, resp:estado.resp
      }));
    } catch (e) {
      // A tentativa continua a funcionar mesmo se o navegador bloquear o armazenamento.
    }
  }
  function limparEstadoExame(n) {
    try { localStorage.removeItem(chaveEstadoExame(n)); } catch (e) {}
  }
  function lerEstadoExame(n, Q) {
    var bruto;
    try {
      migrarEstadoExameLegado(n);
      bruto = localStorage.getItem(chaveEstadoExame(n));
    } catch (e) { return null; }
    if (!bruto) return null;
    try {
      var salvo = JSON.parse(bruto);
      if (!salvo || salvo.versao !== 1 || Number(salvo.n) !== Number(n) ||
          !Number.isInteger(salvo.i) || salvo.i < 0 || salvo.i >= Q.length ||
          !Number.isFinite(salvo.fim) || !salvo.resp || typeof salvo.resp !== "object" ||
          Array.isArray(salvo.resp)) return { invalido:true };
      var resp = {};
      Object.keys(salvo.resp).forEach(function (k) {
        var indicePergunta = Number(k), alternativa = salvo.resp[k];
        if (!Number.isInteger(indicePergunta) || indicePergunta < 0 || indicePergunta >= Q.length ||
            !Number.isInteger(alternativa) || alternativa < 0 || alternativa > 3) {
          throw new Error("Estado de exame inválido");
        }
        resp[indicePergunta] = alternativa;
      });
      return { n:Number(n), Q:Q, i:salvo.i, fim:salvo.fim, resp:resp, res:null };
    } catch (e) {
      return { invalido:true };
    }
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
    var recuperado = lerEstadoExame(n, Q);
    if (recuperado && recuperado.invalido) {
      // Dados inválidos deste exame não devem bloquear a abertura nem pedir confirmação.
      // As tentativas válidas dos restantes exames permanecem intactas.
      limparEstadoExame(n);
      recuperado = null;
    }
    if (recuperado) {
      estado = recuperado;
    } else {
      estado = { n:n, Q:Q, i:0, fim:Date.now() + Number(A.minutos || 60) * 60000, resp:{}, res:null };
    }
    if (restante() <= 0) {
      terminar("tempo");
      return;
    }
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
    guardarEstadoExame();
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
    limparEstadoExame(estado.n);
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
  // O botão Sair é renderizado em #conta-utilizador, fora de #app.
  // Por isso, a delegação de cliques do conteúdo principal não o recebe.
  var contaUtilizador = document.getElementById("conta-utilizador");
  if (contaUtilizador) {
    contaUtilizador.addEventListener("click", function (event) {
      var botaoSair = event.target.closest ? event.target.closest("[data-action=\"auth-logout\"]") : null;
      if (botaoSair) sairDaConta();
    });
  }
  app.addEventListener("click", function (event) {
    var alvo = event.target;
    // Aceita cliques no texto, no SVG ou nos caminhos internos do ícone.
    // O botão é o elemento que contém data-action.
    if (!alvo || !alvo.closest) return;
    alvo = alvo.closest("[data-action]");
    if (!alvo || !app.contains(alvo)) return;
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
  window.addEventListener("estrada:subscription-updated", function () {
    if (!authUser) return;
    carregarSubscricao(authUser).then(function () {
      if (location.hash !== "#/planos") rota();
    });
  });
  window.addEventListener("hashchange", function () {
    fecharMenu();
    rota();
  });
  iniciarAuth().then(function () { rota(); });
})();