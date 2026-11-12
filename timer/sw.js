// Яйцетаймер web app: works offline. The app files are cached per version; a new version is
// fetched in the background and waits until the page says "restart" (like the PC update).
const VERSION = '2.19.2';
const CACHE = `yaytsa-timer-${VERSION}`;
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'sync.js', 'webapi.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('yaytsa-timer-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// The app's own files from the cache (fast, offline); everything else (sync, sign-in) goes to the network
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.endsWith('/version.json') || u.pathname.endsWith('/auth.html')) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
// A click on an alert brings the timer forward
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => (ws[0] ? ws[0].focus() : clients.openWindow('./'))));
});
