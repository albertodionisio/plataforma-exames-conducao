"use strict";

/* Regista o cache partilhado apenas em HTTPS ou localhost. */
(function () {
  if (!("serviceWorker" in navigator)) return;
  const host = location.hostname;
  const seguro = location.protocol === "https:" ||
    host === "localhost" || host === "127.0.0.1";
  if (!seguro) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/", updateViaCache: "none" })
      .then(function (registration) {
        if (typeof registration.update === "function") {
          registration.update().catch(function () {});
        }
      })
      .catch(function (error) {
        console.warn("Cache offline do ESTRADA indisponível:", error);
      });
  }, { once: true });
})();
