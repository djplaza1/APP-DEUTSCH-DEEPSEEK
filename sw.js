/* Müller — Service Worker: red primero; caché de app + metadatos offline (último guion vía Cache API) */
const CACHE = 'muller-sw-v6';
const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './b1-b2-database.json',
    './vocab-packs/reise-mini.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match('./index.html') || caches.match(req))
        );
        return;
    }
    if (url.origin === self.location.origin && url.pathname.endsWith('.muller-offline-meta.json')) {
        event.respondWith(caches.open('muller-offline-user-v1').then((c) => c.match(event.request).then((hit) => hit || fetch(event.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } })))));
        return;
    }
    if (
        url.origin === self.location.origin &&
        (url.pathname.endsWith('b1-b2-database.json') || url.pathname.endsWith('index.html'))
    ) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    if (res.ok) caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req))
        );
        return;
    }
    // Scripts JSX/JS y estilos: red primero para evitar servir código viejo tras refactors.
    if (
        url.origin === self.location.origin &&
        (url.pathname.endsWith('.jsx') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))
    ) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    if (res && res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE).then((c) => c.put(req, copy));
                    }
                    return res;
                })
                .catch(() => caches.match(req))
        );
        return;
    }
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
