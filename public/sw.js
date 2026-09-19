// Service worker de la app de contactos.
//
// Estrategia hibrida: no se usa una sola tecnica para todo, se elige
// segun el tipo de pedido.
//
//   - Navegacion (abrir la app)  -> network first, si no hay red va el cache
//   - Archivos propios (js/css/img) -> cache first, son fijos y con hash
//   - Lo demas (otros dominios)  -> se deja pasar, no se cachea

const VERSION = "contactos-v1";
const BASICOS = ["/", "/index.html", "/manifest.json", "/icon-192.png"];

// Al instalar, guardo lo minimo para que la app abra sin red.
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(BASICOS))
  );
  self.skipWaiting();
});

// Al activar, borro las versiones viejas del cache.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres.filter((n) => n !== VERSION).map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(redPrimero(req));
  } else {
    e.respondWith(cachePrimero(req));
  }
});

// Busco en la red; si falla devuelvo lo guardado.
async function redPrimero(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(VERSION);
    cache.put(req, res.clone());
    return res;
  } catch {
    const guardado = await caches.match(req);
    return guardado || caches.match("/index.html");
  }
}

// Si ya lo tengo guardado lo devuelvo de una; si no, lo pido y lo guardo.
async function cachePrimero(req) {
  const guardado = await caches.match(req);
  if (guardado) return guardado;

  const res = await fetch(req);
  if (res.ok) {
    const cache = await caches.open(VERSION);
    cache.put(req, res.clone());
  }
  return res;
}
