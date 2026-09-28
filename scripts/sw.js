// El build completa la lista con los archivos que genera Vite.
const CACHE = '__CACHE__';
const PREFIX = 'contactos-';
const ARCHIVOS = __ARCHIVOS__;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.filter((n) => n.startsWith(PREFIX) && n !== CACHE)
      .map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    // HTML: primero la red; sin conexión, la copia de esta versión.
    event.respondWith(fetch(request).then((response) => {
      if (!response.ok) return guardado('/index.html');
      return response;
    }).catch(() => guardado('/index.html')));
  } else {
    // Los archivos con hash no cambian: podemos usar la copia guardada.
    event.respondWith(guardado(request).then((saved) => saved || fetch(request)));
  }
});

async function guardado(request) {
  const cache = await caches.open(CACHE);
  // Solo hay archivos estáticos; Vary: Origin no cambia su contenido.
  return cache.match(request, { ignoreVary: true });
}
