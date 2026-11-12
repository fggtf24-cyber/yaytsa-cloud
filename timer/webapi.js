// Browser bridge (the web app for Mac and any computer): the same window.focusApi the desktop
// (web.go) and Android (bridge.js) builds provide, backed by what a browser has.
//   data          localStorage (one JSON object, merged like the desktop's data.json)
//   alerts        a system notification + the page's chime, repeated until you come back
//   phase wake-up a timer in the page (a hidden tab may be up to a minute late in Chrome)
//   sign-in       Google on the Яйца Cloud site in a new tab, handed back on the same origin
//   updates       the service worker caches the app; a new version is offered like on the PC
// Nothing native: no tray, no program tracking, no window buttons (the browser has its own).
(() => {
  const VERSION = '2.19.0';
  document.documentElement.classList.add('web');
  const KEY = 'yaytsa-timer-data';
  const handlers = {};
  const on = name => cb => { (handlers[name] = handlers[name] || []).push(cb); };
  const emit = (name, v) => (handlers[name] || []).forEach(cb => { try { cb(v); } catch (e) {} });
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } };
  const write = partial => {
    try {
      const d = { ...read(), ...(partial || {}) };
      localStorage.setItem(KEY, JSON.stringify(d));
      return true;
    } catch (e) { console.warn('save failed', e); return false; }
  };
  // Ask for notifications on the first press of a key (browsers want a gesture for that)
  const askNotify = () => { try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (e) {} };
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#btnStart, #btnTest, #btnTest2')) askNotify(); }, true);

  let dueT = null;
  let alertN = null, alertT = null, alertLeft = 0;
  const stopRing = () => { clearInterval(alertT); alertT = null; if (alertN) { try { alertN.close(); } catch (e) {} alertN = null; } };
  const ring = d => { if (d.sound !== false && typeof window.chime === 'function') window.chime(d.next === 'work' ? 'work' : 'break'); };
  document.addEventListener('visibilitychange', () => {
    emit('window-visible', !document.hidden);
    if (!document.hidden) stopRing(); // back at the timer: the alert has done its job
  });

  window.focusApi = {
    web: true,
    load: () => Promise.resolve(read()),
    save: p => Promise.resolve(write(p)),
    saveSync: p => write(p),
    notify: (title, body) => { try { if (Notification.permission === 'granted') new Notification(title || 'Яйцетаймер', { body: body || '', icon: 'icon-192.png' }); } catch (e) {} },
    progress: () => {},
    schedule: ms => {
      clearTimeout(dueT);
      if (ms > 0) dueT = setTimeout(() => emit('phase-due', null), Math.min(ms, 2 ** 31 - 1));
    },
    onPhaseDue: on('phase-due'),
    ncdrag: () => {}, winMin: () => {}, winMax: () => {}, winClose: () => {},
    onMaximized: () => {},
    onWindowVisible: on('window-visible'),
    zoom: z => { document.documentElement.style.zoom = String(z || 1); },
    appsInstalled: () => Promise.resolve([]),
    appsBrowse: () => Promise.resolve(null),
    title: t => { document.title = t; },
    theme: () => {
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = getComputedStyle(document.body).backgroundColor || '#191919';
    },
    systemDark: () => Promise.resolve(matchMedia('(prefers-color-scheme: dark)').matches),
    onSystemTheme: cb => matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => cb(e.matches)),
    alwaysOnTop: () => {},
    focusWindow: () => window.focus(),
    exportCsv: (csv, name) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
      a.download = name || 'yaytsa-timer.csv';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return Promise.resolve(true);
    },
    openDataFolder: () => {},
    // End of a phase: a notification that stays, and the chime again every repeatSec until you look
    showAlert: d => {
      stopRing();
      ring(d);
      try {
        if (Notification.permission === 'granted') {
          alertN = new Notification(d.title || 'Яйцетаймер', { body: d.body || '', icon: 'icon-192.png', requireInteraction: true, tag: 'yaytsa-alert' });
          alertN.onclick = () => { window.focus(); stopRing(); };
        }
      } catch (e) {}
      if (!document.hidden && !d.test) return; // looking at it already: one chime is enough
      alertLeft = 4;
      alertT = setInterval(() => { if (--alertLeft < 0) stopRing(); else ring(d); }, (d.repeatSec || 15) * 1000);
    },
    closeAlert: stopRing,
    onAlertAction: on('alert-action'),
    updateTray: () => {},
    onTrayAction: on('tray-action'),
    quit: () => {},
    log: m => console.log('[yaytsa]', m),
    onUpdateReady: on('update-ready'),
    installUpdate: () => {
      navigator.serviceWorker && navigator.serviceWorker.getRegistration().then(r => {
        if (r && r.waiting) r.waiting.postMessage('skip'); else location.reload();
      });
    },
    autostart: () => Promise.resolve(false),
    setAutostart: () => Promise.resolve(false),
    appsStats: () => Promise.resolve([]),
    appsCandidates: () => Promise.resolve([]),
    appsTrack: () => Promise.resolve([]),
    appsUntrack: () => Promise.resolve([]),
    // Google sign-in: the site (same origin) signs in and hands the session back to auth.html,
    // which passes it here over a BroadcastChannel (or localStorage) and closes
    authBrowser: (state, site) => { window.open(`${site}#timer-login/w/${state}`, '_blank'); },
    onAuthResult: on('auth-result'),
    openUrl: u => window.open(u, '_blank', 'noopener'),
  };

  const takeAuth = v => { if (v && v.state && v.rt) emit('auth-result', v); };
  try { new BroadcastChannel('yaytsa-auth').onmessage = e => takeAuth(e.data); } catch (e) {}
  addEventListener('storage', e => {
    if (e.key !== 'yaytsa-auth' || !e.newValue) return;
    try { takeAuth(JSON.parse(e.newValue)); } catch (err) {}
    localStorage.removeItem('yaytsa-auth');
  });

  // Offline and updates: the service worker keeps the app; a new version waits until you restart
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const offer = () => {
        if (!reg.waiting || !navigator.serviceWorker.controller) return;
        fetch('version.json', { cache: 'no-store' }).then(r => r.json()).then(j => emit('update-ready', j.version || ''), () => emit('update-ready', ''));
      };
      offer();
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        if (w) w.addEventListener('statechange', () => { if (w.state === 'installed') offer(); });
      });
      setInterval(() => reg.update().catch(() => {}), 30 * 60000);
    }).catch(() => {});
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
  }
  window.__yaytsaWebVersion = VERSION;
})();
