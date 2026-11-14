(function () {
  "use strict";
  var CHAVE_TEMA="estrada.tema";
  var botoesTema=Array.prototype.slice.call(document.querySelectorAll("[data-theme-choice]"));
  var estadoTema=document.getElementById("estado-tema");
  function temaGuardado(){try{return localStorage.getItem(CHAVE_TEMA)==="dark"?"dark":"light";}catch(e){return "light";}}
  function aplicarTema(tema,guardar){tema=tema==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",tema);document.documentElement.style.colorScheme=tema;var meta=document.querySelector("meta[name=theme-color]");if(meta)meta.setAttribute("content",tema==="dark"?"#111a29":"#14284b");botoesTema.forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-theme-choice")===tema));});if(estadoTema)estadoTema.textContent="Tema "+(tema==="dark"?"escuro":"claro")+" seleccionado. A preferência fica guardada neste dispositivo.";if(guardar){try{localStorage.setItem(CHAVE_TEMA,tema);}catch(e){if(estadoTema)estadoTema.textContent="Tema alterado nesta página, mas não foi possível guardar a preferência neste dispositivo.";}}}
  aplicarTema(temaGuardado(),false);
  botoesTema.forEach(function(b){b.addEventListener("click",function(){aplicarTema(b.getAttribute("data-theme-choice"),true);});});
  window.addEventListener("storage",function(e){if(e.key===CHAVE_TEMA)aplicarTema(e.newValue,false);});


  // DEF-003: notificações locais, sem push nem pedidos automáticos de permissão.
  var CHAVE_NOTIFICACOES = "estrada.notificacoes.ativas";
  var estadoNotificacoes = document.getElementById("estado-notificacoes");
  var activarNotificacoes = document.getElementById("activar-notificacoes");
  var desactivarNotificacoes = document.getElementById("desactivar-notificacoes");
  var testarNotificacao = document.getElementById("testar-notificacao");

  function notificacoesGuardadas() {
    try { return localStorage.getItem(CHAVE_NOTIFICACOES) === "true"; }
    catch (e) { return false; }
  }

  function actualizarEstadoNotificacoes(mensagem) {
    if (!estadoNotificacoes) return;
    var seguro = window.isSecureContext;
    var suportado = seguro && "Notification" in window;
    var permissao = suportado ? Notification.permission : "unsupported";
    var activo = notificacoesGuardadas() && permissao === "granted";
    if (mensagem) estadoNotificacoes.textContent = mensagem;
    else if (!seguro) estadoNotificacoes.textContent = "Indisponível: o navegador exige uma ligação segura (HTTPS) para apresentar notificações.";
    else if (!("Notification" in window)) estadoNotificacoes.textContent = "Este navegador não suporta notificações.";
    else if (permissao === "denied") estadoNotificacoes.textContent = "Permissão bloqueada no navegador. Altera-a nas definições do site para poderes activar.";
    else if (permissao === "default") estadoNotificacoes.textContent = "Ainda não autorizadas. Só será pedido acesso quando tocares em «Activar notificações».";
    else if (activo) estadoNotificacoes.textContent = "Notificações autorizadas e activas neste dispositivo.";
    else estadoNotificacoes.textContent = "O navegador autorizou notificações, mas os avisos do ESTRADA estão desactivados.";
    if (activarNotificacoes) activarNotificacoes.hidden = !suportado || (permissao === "granted" && activo);
    if (desactivarNotificacoes) desactivarNotificacoes.hidden = !activo;
    if (testarNotificacao) testarNotificacao.hidden = !activo;
  }

  if (activarNotificacoes) activarNotificacoes.addEventListener("click", async function () {
    if (!window.isSecureContext || !("Notification" in window)) {
      actualizarEstadoNotificacoes();
      return;
    }
    try {
      var permissao = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      if (permissao === "granted") {
        try { localStorage.setItem(CHAVE_NOTIFICACOES, "true"); }
        catch (e) { actualizarEstadoNotificacoes("A permissão foi concedida, mas não foi possível guardar a preferência neste dispositivo."); return; }
        actualizarEstadoNotificacoes("Notificações activadas. Podes enviar uma notificação de teste.");
      } else if (permissao === "denied") {
        actualizarEstadoNotificacoes("Permissão recusada. Para voltar a permitir, altera a autorização nas definições do navegador.");
      } else {
        actualizarEstadoNotificacoes("Pedido não autorizado. As notificações continuam desactivadas.");
      }
    } catch (e) {
      actualizarEstadoNotificacoes("Não foi possível pedir autorização ao navegador.");
    }
  });

  if (desactivarNotificacoes) desactivarNotificacoes.addEventListener("click", function () {
    try { localStorage.setItem(CHAVE_NOTIFICACOES, "false"); }
    catch (e) { actualizarEstadoNotificacoes("Não foi possível guardar a preferência neste dispositivo."); return; }
    actualizarEstadoNotificacoes("Avisos do ESTRADA desactivados neste dispositivo. A permissão do navegador não foi revogada.");
  });

  if (testarNotificacao) testarNotificacao.addEventListener("click", function () {
    if (!("Notification" in window) || Notification.permission !== "granted" || !notificacoesGuardadas()) {
      actualizarEstadoNotificacoes();
      return;
    }
    try {
      new Notification("ESTRADA", { body: "As notificações estão activas neste dispositivo." });
      actualizarEstadoNotificacoes("Notificação de teste enviada.");
    } catch (e) {
      actualizarEstadoNotificacoes("O navegador não conseguiu apresentar a notificação de teste.");
    }
  });

  window.addEventListener("focus", function () { actualizarEstadoNotificacoes(); });
  actualizarEstadoNotificacoes();

  var links = Array.prototype.slice.call(
    document.querySelectorAll(".atalhos a[href^='#']")
  );

  function actualizarAtalho() {
    var hash = window.location.hash;
    links.forEach(function (link) {
      if (link.getAttribute("href") === hash) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      window.requestAnimationFrame(actualizarAtalho);
    });
  });

  window.addEventListener("hashchange", actualizarAtalho);
  actualizarAtalho();
})();
