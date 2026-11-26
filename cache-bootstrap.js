(function () {
  "use strict";
  // Regista a cache individual no dispositivo. A cache partilhada é configurada
  // no CDN do alojamento (ver netlify.toml).
  if (!("serviceWorker" in navigator)) return;
  var secure = location.protocol === "https:" || location.hostname === "localhost";
  if (!secure) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
      .then(function (registration) {
        // Procura actualizações do próprio service worker sem interromper exames.
        if (registration && typeof registration.update === "function") {
          registration.update().catch(function () {});
        }
      })
      .catch(function (error) {
        console.warn("ESTRADA: não foi possível activar a cache local.", error);
      });

    // Solicita armazenamento persistente quando o navegador o permite.
    // A decisão final pertence ao navegador/sistema operativo.
    if (navigator.storage && typeof navigator.storage.persist === "function") {
      navigator.storage.persist().catch(function () {});
    }
  });
}());
