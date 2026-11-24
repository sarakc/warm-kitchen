// Warm Kitchen offline support: keeps the finder on the device so the home-screen app opens without a connection.
// Modelled on tempo/sw.js. Bump CACHE when FILES changes; activate deletes every other cache.
const CACHE = "wk-v1";
const PAGE = "./warm_kitchen_finder.html";
const FILES = [PAGE, "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/favicon-32.png", "./icons/favicon.svg", "./icons/apple-touch-icon.png"];
// cache: "reload" skips the browser's HTTP cache, so an install never stores a stale copy
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Only a real copy of a file is kept: not a 404, a 5xx, a captive-portal redirect or an opaque response
const keep = r => r && r.ok && r.type === "basic" && !r.redirected;
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // Pages: network first so recipe updates arrive. Only the finder is saved, and it is what opens when the network
  // fails or Pages answers with an error; other pages (the cookbook) pass through untouched.
  if (req.mode === "navigate") {
    if (!/\/warm_kitchen_finder\.html$/.test(new URL(req.url).pathname)) return;
    e.respondWith(fetch(req).then(r => {
      if (keep(r)) { const c = r.clone(); caches.open(CACHE).then(x => x.put(PAGE, c)); return r; }
      return r.status >= 400 ? caches.match(PAGE).then(hit => hit || r) : r;
    }, () => caches.match(PAGE)));
    return;
  }
  // Icons and the manifest: the saved copy at once, refreshed in the background
  if (!FILES.some(f => new URL(f, location).href === req.url)) return;
  const fresh = fetch(req).then(r => { if (keep(r)) { const c = r.clone(); return caches.open(CACHE).then(x => x.put(req, c)).then(() => r); } return r; });
  e.respondWith(caches.match(req).then(hit => hit || fresh));
  e.waitUntil(fresh.catch(() => {}));
});
