"use strict";

/*
 * ESTRADA shared static cache.
 * Never cache API, authentication, payment, Firestore or private responses.
 */
const CACHE_PREFIX = "estrada-static-";
const CACHE_VERSION = "v1-20261119";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/styles-resultados.css",
  "/app.js",
  "/config.js",
  "/manifest.webmanifest",
  "/public/assinaturas/planos.js",
  "/public/assinaturas/planos.css"
];
const MAX_ENTRIES = 300;

function isPrivateOrDynamic(url) {
  const path = url.pathname.toLowerCase();
  return path.startsWith("/api") ||
    path.startsWith("/__/") ||
    path.includes("firestore") ||
    path.includes("identitytoolkit") ||
    path.includes("securetoken") ||
    path.includes("payment") ||
    path.includes("callback") ||
    path.includes("webhook") ||
    path.includes("auth");
}

function isCacheableStatic(request, url) {
  if (request.method !== "GET" || url.origin !== self.location.origin) return false;
  if (isPrivateOrDynamic(url)) return false;
  if (request.headers.has("authorization")) return false;
  if (request.cache === "no-store") return false;
  return ["script", "style", "image", "font"].includes(request.destination) ||
    /\.(?:js|css|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);
}

async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_ENTRIES) return;
  await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map(key => cache.delete(key)));
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(SHELL.map(async path => {
      try {
        const response = await fetch(path, { cache: "reload" });
        if (response.ok && response.type === "basic") await cache.put(path, response);
      } catch (_) {
        // A resource that is unavailable during installation can be cached later.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name =>
      name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
    ).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || isPrivateOrDynamic(url)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put("/index.html", response.clone());
        }
        return response;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match("/index.html")) ||
          new Response("Sem ligação. Volta a tentar quando estiveres online.", {
            status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
      }
    })());
    return;
  }

  if (!isCacheableStatic(request, url)) return;

  const cachePromise = caches.open(CACHE_NAME);
  const isImageOrFont = ["image", "font"].includes(request.destination) ||
    /\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);

  if (isImageOrFont) {
    const refresh = cachePromise.then(async cache => {
      const response = await fetch(request);
      if (response.ok && response.type === "basic" &&
          !response.headers.has("Set-Cookie") &&
          !response.headers.get("Cache-Control")?.includes("no-store")) {
        await cache.put(request, response.clone());
        await trimCache(cache);
      }
      return response;
    });
    // A imagem em cache é mostrada imediatamente e actualizada em segundo plano.
    event.waitUntil(refresh.then(() => undefined).catch(() => undefined));
    event.respondWith((async () => {
      const cache = await cachePromise;
      const cached = await cache.match(request);
      if (cached) return cached;
      try { return await refresh; }
      catch (_) {
        return new Response("", { status: 504, statusText: "Recurso indisponível offline" });
      }
    })());
    return;
  }

  // Código e estilos: rede primeiro para não prender versões antigas; cache
  // local funciona como contingência quando o dispositivo está offline.
  event.respondWith((async () => {
    const cache = await cachePromise;
    const cached = await cache.match(request);
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic" &&
          !response.headers.has("Set-Cookie") &&
          !response.headers.get("Cache-Control")?.includes("no-store")) {
        await cache.put(request, response.clone());
        await trimCache(cache);
      }
      return response;
    } catch (_) {
      if (cached) return cached;
      return new Response("", { status: 504, statusText: "Recurso indisponível offline" });
    }
  })());
});
