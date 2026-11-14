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
