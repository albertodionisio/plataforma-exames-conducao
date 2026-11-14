(function () {
  "use strict";
  var chave = "estrada.tema";
  function aplicarTema() {
    var tema = "light";
    try { tema = localStorage.getItem(chave) === "dark" ? "dark" : "light"; }
    catch (e) {}
    document.documentElement.setAttribute("data-theme", tema);
    document.documentElement.style.colorScheme = tema;
  }
  aplicarTema();
  window.addEventListener("storage", function (evento) {
    if (evento.key === chave || evento.key === null) aplicarTema();
  });
})();
