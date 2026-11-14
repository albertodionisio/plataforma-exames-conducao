(function () {
  "use strict";

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
