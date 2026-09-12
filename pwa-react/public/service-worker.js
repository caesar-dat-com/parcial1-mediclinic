// Estrategia Network First (Clase 02 - PWA): primero la red, y si no hay
// conexion se responde con lo que quedo en cache. Asi la app sigue abriendo
// offline sin quedarse pegada a una version vieja cuando si hay internet.
const CACHE = 'mediclinic-v1';
const BASE = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copia));
        return respuesta;
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((cacheada) => cacheada || caches.match('/index.html'))
      )
  );
});
