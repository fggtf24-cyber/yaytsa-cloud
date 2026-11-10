// Уведомления с сервера рассылки (yaytsa-cloud-push): ответы, лайки, сообщения — даже когда сайт закрыт.
// iPhone показывает их только у сайта, добавленного на экран «Домой».
self.addEventListener('push', e => {
  let m = {};
  try { m = e.data.json(); } catch {}
  e.waitUntil(self.registration.showNotification(m.title || 'Яйца Cloud', {
    body: m.body || '', icon: 'assets/icon-192.png', badge: 'assets/icon-192.png', tag: m.tag, renotify: true, data: { href: m.href || '' },
  }));
});

// Нажали на уведомление: открытый сайт переходит к записи, закрытый открывается сразу на ней.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const href = (e.notification.data?.href || '').replace(/^#?/, '#');
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const w = ws[0];
    if (w) { w.postMessage({ type: 'go', href }); return w.focus(); }
    return clients.openWindow('./' + (href === '#' ? '' : href));
  }));
});
