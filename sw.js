// WhereMeGo service worker: the whole app is cached so it works without network.
// Bump CACHE when you publish a new version, so installed copies fetch it.
const CACHE = 'wheremego-v4';
const ASSETS = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
// Map tiles you have looked at stay available offline (limited number, refreshed after a week, as the OSM tile policy asks).
const TILE_PATH = /\/\d{1,2}\/\d+\/\d+(@2x)?\.(png|jpe?g|webp)$/;   // any slippy-map tile server (z/x/y.png)
const TILES = 'wheremego-tiles', MAX_TILES = 800, TILE_MAX_AGE = 7 * 24 * 3600 * 1000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== TILES).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// stale-while-revalidate: answer from cache at once, refresh the cache in the background
async function tileFetch(req){
  const cache = await caches.open(TILES);
  const hit = await cache.match(req);
  if (hit && Date.now() - (new Date(hit.headers.get('date') || 0)).getTime() < TILE_MAX_AGE) return hit;
  try {
    const r = await fetch(req);
    if (r.ok && r.type !== 'opaque'){
      await cache.put(req, r.clone());
      const keys = await cache.keys();
      if (keys.length > MAX_TILES) await Promise.all(keys.slice(0, keys.length - MAX_TILES).map(k => cache.delete(k)));
    }
    return r;
  } catch(err){ if (hit) return hit; throw err; }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method === 'GET' && url.origin !== location.origin && TILE_PATH.test(url.pathname)){ e.respondWith(tileFetch(req)); return; }
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = (await cache.match(req, { ignoreSearch: true })) ||
                (req.mode === 'navigate' ? await cache.match('index.html') : undefined);
    const net = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; });
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net;
  })());
});
