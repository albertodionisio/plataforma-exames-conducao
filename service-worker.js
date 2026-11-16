"use strict";

var CACHE_PREFIX = "estrada-cache-";
var CACHE_SHELL = CACHE_PREFIX + "shell-v1";
var CACHE_EXAMES = CACHE_PREFIX + "exames-v1";
var CACHE_MEDIA = CACHE_PREFIX + "media-v1";
var CACHE_DIAS = 30 * 24 * 60 * 60 * 1000;
var CACHE_MEDIA_DIAS = 365 * 24 * 60 * 60 * 1000;
var SHELL = [
  "/",
  "/index.html",
  "/config.js",
  "/app.js",
  "/styles.css",
  "/styles-resultados.css",
  "/manifest.webmanifest"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_SHELL).then(function (cache) {
      return Promise.all(SHELL.map(function (url) {
        return cache.add(url).catch(function () { return null; });
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key.indexOf(CACHE_PREFIX) === 0 &&
          [CACHE_SHELL, CACHE_EXAMES, CACHE_MEDIA].indexOf(key) === -1;
      }).map(function (key) { return caches.delete(key); }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function idadeDaResposta(response) {
  var guardado = Number(response.headers.get("x-estrada-cache-time") || 0);
  return guardado ? Date.now() - guardado : Infinity;
}

function guardarComData(cache, request, response) {
  if (!response || !response.ok || response.type === "opaque") return Promise.resolve();
  var headers = new Headers(response.headers);
  headers.set("x-estrada-cache-time", String(Date.now()));
  var copia = new Response(response.clone().body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
  return cache.put(request, copia);
}

function actualizarEmSegundoPlano(request, cache) {
  return fetch(request).then(function (response) {
    return guardarComData(cache, request, response).then(function () { return response; });
  });
}

function cacheComValidade(request, cacheName, validade) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (guardada) {
      var valida = guardada && idadeDaResposta(guardada) < validade;
      if (valida) {
        // Entrega imediatamente a cópia local e actualiza-a em segundo plano.
        // A CDN partilhada responde a este pedido; não é uma leitura Firestore.
        return Promise.resolve().then(function () {
          actualizarEmSegundoPlano(request, cache).catch(function () {});
          return guardada;
        });
      }
      return actualizarEmSegundoPlano(request, cache).catch(function () {
        // Se estiver sem rede, conserva a última cópia mesmo depois da validade.
        if (guardada) return guardada;
        throw new Error("Conteúdo indisponível na rede e sem cópia local.");
      });
    });
  });
}

function ePedidoDeExame(url) {
  return url.pathname.indexOf("/data/exames/exame") === 0 &&
    /\/exame\d+\.js$/.test(url.pathname);
}

function eMediaPublica(url) {
  return url.pathname.indexOf("/public/") === 0 &&
    /\.(?:avif|gif|jpe?g|png|svg|webp|pdf)$/i.test(url.pathname);
}

function eRecursoBase(url) {
  return url.origin === self.location.origin &&
    ["/", "/index.html", "/config.js", "/app.js", "/styles.css",
      "/styles-resultados.css", "/manifest.webmanifest"].indexOf(url.pathname) !== -1;
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Nunca colocar sessões, autenticação, resultados ou dados pessoais em cache.
  if (/\/auth(?:\/|$)|\/api(?:\/|$)|\/rest\/v1(?:\/|$)|\/storage\/v1(?:\/|$)/i.test(url.pathname)) return;

  if (ePedidoDeExame(url)) {
    event.respondWith(cacheComValidade(request, CACHE_EXAMES, CACHE_DIAS));
    return;
  }
  if (eMediaPublica(url)) {
    event.respondWith(cacheComValidade(request, CACHE_MEDIA, CACHE_MEDIA_DIAS));
    return;
  }
  if (eRecursoBase(url)) {
    event.respondWith(caches.open(CACHE_SHELL).then(function (cache) {
      return fetch(request).then(function (response) {
        if (response && response.ok) cache.put(request, response.clone()).catch(function () {});
        return response;
      }).catch(function () {
        return cache.match(request).then(function (guardada) {
          return guardada || Response.error();
        });
      });
    }));
  }
});
