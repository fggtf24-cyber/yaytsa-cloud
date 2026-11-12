'use strict';
/* ================= Sync between devices =================
   One account with the yaytsa-cloud site. Data lives in the project's Realtime Database at
   timer/<uid>: s/<id> sessions, p/<key> project metadata, set = shared settings. Every item
   carries u (time of the last change); the newer one wins. Deleted items stay as {del, u} so a
   device that was offline does not bring them back. Everything goes over plain REST and the
   database's event stream, so the same code runs in WebView2 and in the Android WebView.
   Uses globals of app.js (sessions, projects, settings, api, ...); runs only after its boot. */

const SYNC = {
  key: 'AIzaSyB5N_ynBpx9cD8cyy4da_HFMHVc-qZ_YyU',
  db: 'https://yaytsa-cloud-default-rtdb.europe-west1.firebasedatabase.app',
  site: 'https://fggtf24-cyber.github.io/yaytsa-cloud/',
};
// Settings that follow the account; the rest (theme, zoom, window options) stay per device.
const SYNC_SETTINGS = ['work', 'brk', 'longBrk', 'longEvery', 'autoStart', 'goal', 'goalWeek', 'sound', 'popup', 'lang', 'plans'];
// A deleted item is remembered as '-<time of deletion>'; older copies of it are not brought back.
const isDel = g => typeof g === 'string' && g[0] === '-';
const delAt = g => Number(g.slice(1)) || 0;

const ST = {
  ru: {
    gSync: 'Синхронизация',
    bannerText: 'Нет синхронизации', bannerGo: 'Включить',
    syncName: 'Аккаунт Яйца Cloud',
    syncDesc: 'Один аккаунт с сайтом. История, проекты и настройки таймера одинаковые на ПК и телефоне',
    google: 'Войти через Google', withEmail: 'Почта и пароль',
    email: 'Почта', password: 'Пароль', login: 'Войти', register: 'Создать аккаунт', cancel: 'Отмена',
    logout: 'Выйти', forgot: 'Забыли пароль?',
    googleWait: 'Войдите в браузере и нажмите «Открыть Яйцетаймер»',
    stOk: at => `Синхронизировано${at ? ' в ' + at : ''}`, stConn: 'Подключение…', stOffline: 'Нет связи, изменения отправятся позже',
    stDenied: 'Сервер не принял доступ. Попробуйте выйти и войти снова', stNoDb: 'Синхронизация на сервере ещё не включена',
    loggedOut: 'Вход истёк, войдите снова', merged: n => `Получено с других устройств: ${n}`,
    eCreds: 'Неверная почта или пароль', eExists: 'Эта почта уже зарегистрирована. Нажмите «Войти»',
    eWeak: 'Пароль должен быть не короче 6 символов', eEmail: 'Проверьте адрес почты',
    eMany: 'Слишком много попыток, подождите немного', eNet: 'Нет связи с сервером', eOther: 'Не получилось войти',
  },
  en: {
    gSync: 'Sync',
    bannerText: 'Sync is off', bannerGo: 'Turn on',
    syncName: 'Яйца Cloud account',
    syncDesc: 'The same account as the site. History, projects and timer settings match on PC and phone',
    google: 'Sign in with Google', withEmail: 'Email and password',
    email: 'Email', password: 'Password', login: 'Sign in', register: 'Create account', cancel: 'Cancel',
    logout: 'Sign out', forgot: 'Forgot password?',
    googleWait: 'Sign in in the browser, then press “Open Яйцетаймер”',
    stOk: at => `Synced${at ? ' at ' + at : ''}`, stConn: 'Connecting…', stOffline: 'Offline, changes will be sent later',
    stDenied: 'The server refused access. Try signing out and in again', stNoDb: 'Sync is not enabled on the server yet',
    loggedOut: 'Sign-in expired, please sign in again', merged: n => `Received from other devices: ${n}`,
    eCreds: 'Wrong email or password', eExists: 'This email is already registered. Press “Sign in”',
    eWeak: 'The password needs at least 6 characters', eEmail: 'Check the email address',
    eMany: 'Too many attempts, wait a little', eNet: 'Cannot reach the server', eOther: 'Could not sign in',
  },
};
const st = k => (ST[settings.lang] || ST.ru)[k];

let account = null;                       // {uid, email, rt}
let syncSent = { s: {}, p: {}, set: '' }; // signatures of what the server holds, as far as we know
let syncStatus = 'off';                   // off | conn | ok | offline | denied | nodb
let syncAt = 0;
let syncForm = false;                     // email form open
let syncBusy = false;
let syncErr = '';
let syncLoaded = false;                   // first full snapshot from the server merged
let googleState = '';
let idTok = '', idExp = 0;
let es = null, esTimer = null, retryT = null, retryMs = 2000, esAlive = 0;
let pushT = null, pushing = false, pushAgain = false;

/* ---------- helpers ---------- */
function canon(v) {
  if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',')}}`;
  return JSON.stringify(v === undefined ? null : v);
}
function sig(o) {
  const s = canon(o);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}
// Database keys cannot hold . $ # [ ] /
const dbKey = k => encodeURIComponent(k).replace(/\./g, '%2E');
const unKey = k => { try { return decodeURIComponent(k); } catch { return k; } };
const sessCore = s => ({ start: s.start, end: s.end, dur: s.dur, label: s.label || '', full: !!s.full, ...(s.manual ? { manual: true } : {}), ...(s.series ? { series: s.series } : {}) });
const projCore = p => ({ name: p.name || '', deadline: p.deadline || '', hidden: !!p.hidden, created: p.created || 0 });
const setCore = () => Object.fromEntries(SYNC_SETTINGS.map(k => [k, settings[k]]));

async function post(url, body, form) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': form ? 'application/x-www-form-urlencoded' : 'application/json' },
    body: form ? new URLSearchParams(body).toString() : JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error((j.error && j.error.message) || `HTTP ${r.status}`); e.code = (j.error && j.error.message) || ''; throw e; }
  return j;
}
const authUrl = m => `https://identitytoolkit.googleapis.com/v1/accounts:${m}?key=${SYNC.key}`;

function authError(e) {
  const c = String(e.code || e.message || '');
  if (/INVALID_LOGIN|INVALID_PASSWORD|EMAIL_NOT_FOUND/.test(c)) return st('eCreds');
  if (/EMAIL_EXISTS/.test(c)) return st('eExists');
  if (/WEAK_PASSWORD/.test(c)) return st('eWeak');
  if (/INVALID_EMAIL|MISSING_EMAIL/.test(c)) return st('eEmail');
  if (/TOO_MANY/.test(c)) return st('eMany');
  if (e instanceof TypeError) return st('eNet');
  return st('eOther');
}

/* ---------- account ---------- */
async function idToken() {
  if (idTok && Date.now() < idExp - 60000) return idTok;
  try {
    const j = await post(`https://securetoken.googleapis.com/v1/token?key=${SYNC.key}`, { grant_type: 'refresh_token', refresh_token: account.rt }, true);
    idTok = j.id_token;
    idExp = Date.now() + Number(j.expires_in || 3600) * 1000;
    if (j.refresh_token && j.refresh_token !== account.rt) { account.rt = j.refresh_token; persist(); }
    return idTok;
  } catch (e) {
    if (/TOKEN_EXPIRED|INVALID_REFRESH_TOKEN|USER_DISABLED|USER_NOT_FOUND/.test(e.code || '')) {
      syncLogout();
      toast(st('loggedOut'));
    }
    throw e;
  }
}

async function signedIn(uid, email, rt, tok, expiresIn) {
  if (account && account.uid !== uid) syncReset();
  account = { uid, email: email || '', rt };
  idTok = tok || '';
  idExp = tok ? Date.now() + Number(expiresIn || 3600) * 1000 : 0;
  syncForm = false;
  syncErr = '';
  hideBanner();
  await persistNow();
  syncConnect();
  renderSync();
}

async function emailAuth(register) {
  const email = $('#syncEmail').value.trim();
  const password = $('#syncPass').value;
  syncBusy = true; syncErr = ''; renderSync();
  try {
    const j = await post(authUrl(register ? 'signUp' : 'signInWithPassword'), { email, password, returnSecureToken: true });
    await signedIn(j.localId, j.email, j.refreshToken, j.idToken, j.expiresIn);
  } catch (e) {
    syncErr = authError(e);
  }
  syncBusy = false;
  renderSync();
}

// Google sign-in happens on the site in the real browser (Google does not allow it inside
// embedded web views); the site hands the session back to the app with this random state.
function googleAuth() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  googleState = Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
  api.authBrowser(googleState, SYNC.site);
  syncErr = st('googleWait');
  renderSync();
}

async function onAuthResult(r) {
  if (!r || !googleState || r.state !== googleState || !r.rt) return;
  googleState = '';
  syncBusy = true; syncErr = ''; renderSync();
  try {
    const j = await post(`https://securetoken.googleapis.com/v1/token?key=${SYNC.key}`, { grant_type: 'refresh_token', refresh_token: r.rt }, true);
    const u = await post(authUrl('lookup'), { idToken: j.id_token });
    const email = u.users && u.users[0] && u.users[0].email;
    await signedIn(j.user_id, email, j.refresh_token, j.id_token, j.expires_in);
  } catch (e) {
    syncErr = authError(e);
  }
  syncBusy = false;
  renderSync();
}

function syncReset() {
  syncSent = { s: {}, p: {}, set: '' };
  syncLoaded = false;
  tSent = ''; tU = 0;
}

function syncLogout() {
  disconnect();
  account = null;
  idTok = ''; idExp = 0;
  syncReset();
  syncStatus = 'off';
  persistNow();
  renderSync();
}

/* ---------- live stream from the server ---------- */
function disconnect() {
  if (es) { es.close(); es = null; }
  clearTimeout(esTimer);
  clearTimeout(retryT);
}

function retry() {
  disconnect();
  if (!account) return;
  retryT = setTimeout(syncConnect, retryMs);
  retryMs = Math.min(retryMs * 2, 60000);
}

async function syncConnect() {
  disconnect();
  if (!account) return;
  syncStatus = syncStatus === 'ok' ? 'ok' : 'conn';
  renderSync();
  let tok;
  try { tok = await idToken(); } catch { if (account) { syncStatus = 'offline'; renderSync(); retry(); } return; }
  if (!account) return;
  const src = new EventSource(`${SYNC.db}/timer/${account.uid}.json?auth=${encodeURIComponent(tok)}`);
  es = src;
  const handle = kind => e => {
    if (es !== src) return;
    esAlive = Date.now();
    let m;
    try { m = JSON.parse(e.data); } catch { return; }
    if (m) onRemote(kind, m.path, m.data);
  };
  src.addEventListener('put', handle('put'));
  src.addEventListener('patch', handle('patch'));
  src.addEventListener('auth_revoked', () => { idTok = ''; syncConnect(); });
  src.addEventListener('cancel', () => { syncStatus = 'denied'; renderSync(); disconnect(); });
  src.onopen = () => { retryMs = 2000; esAlive = Date.now(); };
  // the database sends a keep-alive now and then: silence means the line is dead (a phone asleep, a network switch)
  src.addEventListener('keep-alive', () => { esAlive = Date.now(); });
  src.onerror = () => {
    if (es !== src) return;
    // A missing database answers 404, which EventSource reports the same way as no network.
    fetch(`${SYNC.db}/.json?shallow=true`).then(r => r.status === 404 ? 'nodb' : 'offline', () => 'offline')
      .then(s => { if (es === src || !es) { syncStatus = s; renderSync(); } });
    retry();
  };
  // Tokens live an hour: reconnect with a fresh one before it runs out.
  esTimer = setTimeout(() => { idTok = ''; syncConnect(); }, 50 * 60000);
}

let remoteChanged = 0;
let uiT = null;
function onRemote(kind, path, data) {
  const seg = String(path || '/').split('/').filter(Boolean);
  if (kind === 'patch') Object.entries(data || {}).forEach(([k, v]) => applyAt(seg.concat(k.split('/').filter(Boolean)), v, false));
  else applyAt(seg, data, true);
  syncStatus = 'ok';
  syncAt = Date.now();
  clearTimeout(uiT);
  uiT = setTimeout(afterRemote, 120);
}

function applyAt(seg, v, full) {
  if (!seg.length) {
    if (full) mergeAll(v || {});
    else Object.entries(v || {}).forEach(([k, x]) => applyAt([k], x, false));
    return;
  }
  const [kind, key, ...rest] = seg;
  if (kind === 't') { if (!key) applyRemoteTimer(v); else syncConnect(); return; }
  if (kind === 'apps') { applyRemoteApps(seg.length === 1 ? v : null); return; }
  if (!['s', 'p', 'set'].includes(kind)) return;
  if (kind === 'set') { if (!key) applySettings(v); else syncConnect(); return; }
  if (!key) { Object.entries(v || {}).forEach(([k, x]) => applyItem(kind, k, x)); return; }
  if (rest.length) { syncConnect(); return; } // a partial item: we never write those, reload everything
  applyItem(kind, key, v);
}

// First snapshot: merge both ways. Items the server lacks are sent again even if we think we sent them.
function mergeAll(d) {
  const s = d.s || {}, p = d.p || {};
  Object.entries(s).forEach(([k, v]) => applyItem('s', k, v));
  Object.entries(p).forEach(([k, v]) => applyItem('p', k, v));
  if (d.set) applySettings(d.set);
  if (d.t) applyRemoteTimer(d.t);
  if (d.apps) applyRemoteApps(d.apps);
  for (const x of sessions) if (!s[dbKey(x.id)]) delete syncSent.s[x.id];
  for (const k of Object.keys(projects)) if (!p[dbKey(k)]) delete syncSent.p[k];
  if (!d.set) syncSent.set = '';
  syncLoaded = true;
  // one line in the log per start: what the cloud holds for the timer (helps when devices disagree)
  const ct = d.t;
  syncLog('load', `cloud timer: ${!ct ? 'none' : ct.series ? `series ${ct.series.id} ${ct.series.pausedAt ? 'paused' : 'running'}` : ct.running ? 'running' : 'idle'}, saved ${ct && ct.u ? new Date(ct.u).toISOString() : '-'}`);
}

function applyItem(kind, rawKey, v) {
  const key = unKey(rawKey);
  if (!v || typeof v !== 'object') return;
  const ru = Number(v.u) || 0;
  if (kind === 's') {
    const i = sessions.findIndex(x => x.id === key);
    const local = i >= 0 ? sessions[i] : null;
    if (v.del) {
      if (local && (local.u || 0) <= ru) { sessions.splice(i, 1); remoteChanged++; }
      if (!local || (local.u || 0) <= ru) syncSent.s[key] = '-' + ru;
      return;
    }
    const core = sessCore(v);
    if (!local && isDel(syncSent.s[key]) && ru <= delAt(syncSent.s[key])) { syncSent.s[key] = 'redel'; return; }
    if (!local) {
      // The same work logged on two devices (CSV imported on both): keep the smaller id everywhere.
      const k = sessionKey(core);
      const twin = sessions.find(x => sessionKey(x) === k);
      if (twin) {
        if (twin.id < key) { syncSent.s[key] = syncSent.s[key] || 'twin'; return; }
        sessions.splice(sessions.indexOf(twin), 1);
        if (!syncSent.s[twin.id]) syncSent.s[twin.id] = 'twin';
      }
      sessions.push({ id: key, ...core, u: ru });
      syncSent.s[key] = sig(core);
      remoteChanged++;
    } else if ((local.u || 0) < ru) {
      Object.assign(local, core, { u: ru });
      syncSent.s[key] = sig(core);
      remoteChanged++;
    } else if (sig(sessCore(local)) === sig(core)) {
      syncSent.s[key] = sig(core);
    }
  } else if (kind === 'p') {
    const local = projects[key];
    if (v.del) {
      if (local && (local.u || 0) <= ru) { delete projects[key]; remoteChanged++; }
      if (!local || (local.u || 0) <= ru) syncSent.p[key] = '-' + ru;
      return;
    }
    const core = projCore(v);
    if (!local && isDel(syncSent.p[key]) && ru <= delAt(syncSent.p[key])) { syncSent.p[key] = 'redel'; return; }
    if (!local || (local.u || 0) < ru) {
      projects[key] = { ...core, u: ru };
      syncSent.p[key] = sig(core);
      remoteChanged++;
    } else if (sig(projCore(local)) === sig(core)) {
      syncSent.p[key] = sig(core);
    }
  }
}

// Settings merge setting by setting (2.19): each one carries the time it was last changed (uk),
// so a change on the phone and another one on the PC both survive. A copy from an older version
// without uk counts as changed at its u, as before.
function applySettings(v) {
  if (!v || typeof v !== 'object') return;
  const ru = Number(v.u) || 0;
  const ruk = v.uk && typeof v.uk === 'object' ? v.uk : {};
  settings.uk = settings.uk || {};
  syncSent.sv = syncSent.sv || {};
  let changed = false, langChanged = false, behind = false;
  for (const k of SYNC_SETTINGS) {
    if (!(k in v)) continue;
    const rT = Number(ruk[k]) || ru, lT = Number(settings.uk[k]) || settings.u || 0;
    if (rT > lT) {
      if (sig(settings[k]) !== sig(v[k])) { if (k === 'lang') langChanged = true; changed = true; }
      settings[k] = v[k];
      settings.uk[k] = rT;
      syncSent.sv[k] = sig(v[k]);
    } else if (sig(settings[k]) === sig(v[k])) syncSent.sv[k] = sig(v[k]);
    else behind = true; // ours is newer: it goes up with the next push
  }
  settings.u = Math.max(settings.u || 0, ru);
  if (langChanged) applyI18n();
  if (!behind) syncSent.set = sig(setCore());
  if (changed) remoteChanged++;
}

function afterRemote() {
  if (typeof planTick === 'function') { planTick(true); renderPlans(); }
  if (dedupeSessions()) remoteChanged++;
  sessions.sort((a, b) => a.start - b.start);
  if (isUntouched()) setPhase(timer.phase); // new phase lengths apply to an untouched timer
  persist();
  if (remoteChanged) {
    render();
    renderLabelMeta();
    if (view === 'stats') renderStats();
    if (view === 'projects') renderProjects();
    remoteChanged = 0;
  }
  renderSync();
}

/* ---------- sending local changes ---------- */
function syncSchedule() {
  if (!account) return;
  clearTimeout(pushT);
  pushT = setTimeout(syncPush, 600);
}

// settings as versions before 2.19 wrote them (no plans, no per-setting times)
let setLegacy = false;
const legacySet = s => { const o = { ...s }; delete o.uk; delete o.plans; delete o.goalWeek; return o; };
async function syncPush() {
  if (!account || !syncLoaded) return;
  if (pushing) { pushAgain = true; return; }
  const now = Date.now();
  const up = {}, marks = [];
  const seen = new Set();
  for (const x of sessions) {
    seen.add(x.id);
    const core = sessCore(x), g = sig(core);
    if (syncSent.s[x.id] === g) continue;
    if (!x.u || syncSent.s[x.id] !== undefined) x.u = now;
    up[`s/${dbKey(x.id)}`] = { ...core, u: x.u };
    marks.push(['s', x.id, g]);
  }
  for (const id of Object.keys(syncSent.s)) {
    if (seen.has(id) || isDel(syncSent.s[id])) continue;
    up[`s/${dbKey(id)}`] = { del: 1, u: now };
    marks.push(['s', id, '-' + now]);
  }
  for (const [k, p] of Object.entries(projects)) {
    const core = projCore(p), g = sig(core);
    if (syncSent.p[k] === g) continue;
    if (!p.u || syncSent.p[k] !== undefined) p.u = now;
    up[`p/${dbKey(k)}`] = { ...core, u: p.u };
    marks.push(['p', k, g]);
  }
  for (const k of Object.keys(syncSent.p)) {
    if (projects[k] || isDel(syncSent.p[k])) continue;
    up[`p/${dbKey(k)}`] = { del: 1, u: now };
    marks.push(['p', k, '-' + now]);
  }
  const sg = sig(setCore());
  if (syncSent.set !== sg) {
    if (!settings.u || syncSent.set) settings.u = now;
    // stamp only the settings that changed here since they were last in the cloud
    settings.uk = settings.uk || {};
    syncSent.sv = syncSent.sv || {};
    for (const k of SYNC_SETTINGS) {
      const g = sig(settings[k]);
      if (syncSent.sv[k] !== g) { settings.uk[k] = now; syncSent.sv[k] = g; }
    }
    up.set = { ...setCore(), u: settings.u, uk: settings.uk };
    marks.push(['set', '', sg]);
  }
  if (!marks.length) return;

  pushing = true;
  try {
    const tok = await idToken();
    const patch = body => fetch(`${SYNC.db}/timer/${account.uid}.json?auth=${encodeURIComponent(tok)}`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    let r = await patch(setLegacy && up.set ? { ...up, set: legacySet(up.set) } : up);
    // new settings fields turned down by the cloud must never hold back the history: the plain form goes
    if (!r.ok && up.set && !setLegacy && r.status >= 400 && r.status < 500) {
      syncLog('push', `HTTP ${r.status}, sending settings in the plain form`);
      r = await patch({ ...up, set: legacySet(up.set) });
      if (r.ok) setLegacy = true;
    }
    if (r.ok) syncLog('push', 'ok'); else syncLog('push', `HTTP ${r.status}`);
    if (r.status === 401 || r.status === 403) { syncStatus = 'denied'; throw new Error('denied'); }
    if (r.status === 404) { syncStatus = 'nodb'; throw new Error('nodb'); }
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    for (const [kind, k, g] of marks) {
      if (kind === 'set') syncSent.set = g; else syncSent[kind][k] = g;
    }
    syncStatus = 'ok';
    syncAt = Date.now();
    persist();
  } catch (e) {
    if (syncStatus === 'ok' || syncStatus === 'conn') syncStatus = 'offline';
    clearTimeout(pushT);
    pushT = setTimeout(syncPush, 30000);
  }
  pushing = false;
  renderSync();
  if (pushAgain) { pushAgain = false; syncSchedule(); }
}

/* ---------- live timer: t = the running phase, shared by every device ----------
   The timer is wall-clock based (endAt), so devices only exchange its state when somebody
   presses something; each device counts down on its own and ends the phase on its own.
   Both log the finished session, and the twin rule above merges the two copies. */
let tSent = '';   // signature of the timer state last sent or received
let tU = 0;       // time of that state
let tRetry = null;
const timerCore = () => ({
  phase: timer.phase, total: timer.total, running: !!timer.running,
  endAt: timer.running ? timer.endAt : 0,
  remaining: timer.running ? 0 : timer.remaining,
  startedAt: timer.startedAt || 0,
  label: $('#label').value.trim(),
  // the schedule, without this device's own bookkeeping
  series: series ? { id: series.id || '', start: series.start, count: series.count, work: series.work, brk: series.brk, every: series.every || 0, lbrk: series.lbrk || 0, pausedAt: series.pausedAt || 0, label: series.label || $('#label').value.trim() } : null,
});

// Called from renderOuter (about once a second): sends the state when it changed here.
// The timer must reach the other devices whatever version they run: if the cloud turns the full
// state down, the same state goes again in the shape every version knows (no new fields).
let timerLegacy = false, syncLogged = {};
const syncLog = (k, m) => { if (syncLogged[k] !== m) { syncLogged[k] = m; try { api.log(`sync ${k}: ${m}`); } catch {} } };
const legacyTimer = c => ({ ...c, series: c.series ? { id: c.series.id, start: c.series.start, count: c.series.count, work: c.series.work, brk: c.series.brk, pausedAt: c.series.pausedAt } : null });
async function putTimer(body) {
  const tok = await idToken();
  return fetch(`${SYNC.db}/timer/${account.uid}/t.json?auth=${encodeURIComponent(tok)}`, {
    method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
}
async function syncTimer() {
  if (!account || !syncLoaded) return;
  const core = timerCore(), g = sig(core);
  if (g === tSent) return;
  tSent = g;
  tU = Date.now();
  try {
    let r = await putTimer({ ...(timerLegacy ? legacyTimer(core) : core), u: tU });
    if (!r.ok && !timerLegacy && r.status >= 400 && r.status < 500) {
      syncLog('timer', `HTTP ${r.status}, sending the plain form`);
      r = await putTimer({ ...legacyTimer(core), u: tU });
      if (r.ok) timerLegacy = true;
    }
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    syncLog('timer', 'ok');
  } catch (e) {
    syncLog('timer', String(e && e.message || e));
    clearTimeout(tRetry);
    tRetry = setTimeout(() => { if (tSent === g) tSent = ''; }, 10000); // offline: try again later
  }
}

// The timer alone, straight from the database (used to double-check the stream)
async function pollTimer() {
  try {
    const tok = await idToken();
    const r = await fetch(`${SYNC.db}/timer/${account.uid}/t.json?auth=${encodeURIComponent(tok)}`);
    if (!r.ok) return;
    const v = await r.json();
    if (!v || (Number(v.u) || 0) <= tU) return;
    applyRemoteTimer(v);
    // the stream missed it, so it is not to be trusted: open it again (it reloads the rest too)
    syncLog('stream', `missed a timer change, reconnecting`);
    syncConnect();
  } catch {}
}
function applyRemoteTimer(v) {
  if (!v || typeof v !== 'object' || (Number(v.u) || 0) <= tU) return;
  if (v.phase !== 'work' && v.phase !== 'break') return;
  const now = Date.now();
  // A phase that ran out long ago (the other device was closed): its end is not news.
  if (v.running && v.endAt < now - 60000 && !v.series) return;
  // This device is ending the same phase right now: let it finish (alert, log) on its own.
  if (timer.running && now >= timer.endAt - 1500 && v.phase !== timer.phase) return;
  tU = Number(v.u);
  const wasRunning = timer.running;
  // the task name first: sessions the series logs below must carry the other device's name, not ours
  if (typeof v.label === 'string' && document.activeElement !== $('#label') && $('#label').value.trim() !== v.label) {
    $('#label').value = v.label;
    renderLabelMeta();
  }
  if (validSeries(v.series)) {
    const same = series && ((series.id && series.id === v.series.id) || (series.start === v.series.start && series.count === v.series.count));
    series = { ...v.series, label: v.series.label || (typeof v.label === 'string' ? v.label : ''), logged: same ? series.logged : 0 };
    seriesPos = '';
    applySeries(true); // a session the other device already logged is the same entry (series + start), never a second one
  } else if (series) { series = null; seriesPos = ''; }
  if (!series) {
    timer.phase = v.phase;
    timer.total = Number(v.total) || phaseMinutes(v.phase) * 60000;
    timer.running = !!v.running;
    timer.endAt = timer.running ? Number(v.endAt) : 0;
    timer.remaining = timer.running ? Math.max(0, timer.endAt - now) : Number(v.remaining) || timer.total;
    timer.startedAt = Number(v.startedAt) || 0;
  }
  tSent = sig(timerCore());
  api.schedule(timer.running ? Math.max(0, timer.endAt - now) : 0);
  if (timer.running && !wasRunning) api.closeAlert();
  render();
}

/* ---------- program stats: tracked on the PC, shown on the phone too ---------- */
let appsRemote = null, appsSent = '', appsSentAt = 0;
function syncApps(list) {
  if (ANDROID || api.web || !account || !syncLoaded || !Array.isArray(list)) return;
  const g = sig(list.map(a => [a.exe, a.name, Math.round(a.total.run / 60), Math.round(a.total.active / 60), (a.icon || '').length, dayKey(Date.now())]));
  if (g === appsSent || Date.now() - appsSentAt < 60000) return; // at most once a minute, only when it changed
  appsSent = g;
  appsSentAt = Date.now();
  const body = { u: Date.now(), list: list.map(a => ({ exe: a.exe, name: a.name, icon: a.icon || '', today: a.today, week: a.week, month: a.month, quarter: a.quarter, total: a.total, recent: a.recent || [], hoursRun: a.hoursRun || [], hoursActive: a.hoursActive || [], slotsRun: a.slotsRun || [], slotsActive: a.slotsActive || [], hoursDay: dayKey(Date.now()) })) };
  idToken().then(tok => fetch(`${SYNC.db}/timer/${account.uid}/apps.json?auth=${encodeURIComponent(tok)}`, {
    method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  })).catch(() => { appsSent = ''; });
}
function applyRemoteApps(v) {
  if (!ANDROID && !api.web) return; // the phone and the web app show what the PC tracks
  appsRemote = v && Array.isArray(v.list) ? v.list : [];
  // "today" and "7 days" were counted on the PC when it sent them; recount from the days if that was another day
  const today = dayKey(Date.now());
  appsRemote.forEach(a => {
    const rec = Array.isArray(a.recent) ? a.recent : [];
    const sum = n => rec.slice(-n).reduce((o, d) => ({ run: o.run + (d.run || 0), active: o.active + (d.active || 0) }), { run: 0, active: 0 });
    if (rec.length && rec[rec.length - 1].day !== today) {
      const idx = rec.findIndex(d => d.day === today);
      a.today = idx >= 0 ? rec[idx] : { run: 0, active: 0 };
    }
    if (a.hoursDay !== today) { a.hoursRun = []; a.hoursActive = []; a.slotsRun = []; a.slotsActive = []; } // the hours are of another day
    a.week = a.week || sum(7);
    a.month = a.month || sum(30);
  });
  appStats = appsRemote;
  if (typeof renderApps === 'function') renderApps();
}

/* ---------- settings UI ---------- */
function renderSync() {
  const box = $('#syncBox');
  if (!box) return;
  $('#syncTitle').textContent = st('gSync');
  if (account) {
    const at = syncAt ? hm(syncAt) : '';
    const status = { ok: st('stOk')(at), conn: st('stConn'), offline: st('stOffline'), denied: st('stDenied'), nodb: st('stNoDb'), off: '' }[syncStatus] || '';
    box.innerHTML = `
      <div class="set">
        <div class="set-text"><div class="set-name"></div><div class="set-desc sync-status ${esc(syncStatus)}"></div></div>
        <button class="ghost" id="syncLogout"></button>
      </div>`;
    box.querySelector('.set-name').textContent = account.email || st('syncName');
    box.querySelector('.set-desc').textContent = status;
    box.querySelector('#syncLogout').textContent = st('logout');
    return;
  }
  const typed = syncForm && $('#syncEmail') ? [$('#syncEmail').value, $('#syncPass').value] : null;
  box.innerHTML = `
    <div class="set">
      <div class="set-text"><div class="set-name">${esc(st('syncName'))}</div><div class="set-desc">${esc(st('syncDesc'))}</div></div>
    </div>
    <div class="sync-actions">
      <button class="ghost" id="syncGoogle"${syncBusy ? ' disabled' : ''}>${esc(st('google'))}</button>
      ${syncForm ? '' : `<button class="ghost" id="syncEmailBtn">${esc(st('withEmail'))}</button>`}
    </div>
    ${syncForm ? `
    <form class="sync-form" id="syncForm" autocomplete="on">
      <input class="text-input" id="syncEmail" type="email" autocomplete="username" required>
      <input class="text-input" id="syncPass" type="password" autocomplete="current-password" minlength="6" required>
      <div class="btn-row">
        <a class="sync-forgot" id="syncForgot" href="#">${esc(st('forgot'))}</a>
        <button type="button" class="ghost" id="syncCancel">${esc(st('cancel'))}</button>
        <button type="button" class="ghost" id="syncRegister"${syncBusy ? ' disabled' : ''}>${esc(st('register'))}</button>
        <button type="submit" class="ghost on" id="syncLogin"${syncBusy ? ' disabled' : ''}>${esc(st('login'))}</button>
      </div>
    </form>` : ''}
    <p class="sync-msg" ${syncErr ? '' : 'hidden'}></p>`;
  if (syncForm) {
    $('#syncEmail').placeholder = st('email');
    $('#syncPass').placeholder = st('password');
    if (typed) [$('#syncEmail').value, $('#syncPass').value] = typed;
  }
  box.querySelector('.sync-msg').textContent = syncErr;
}

function bindSync() {
  const box = $('#syncBox');
  box.addEventListener('click', e => {
    const b = e.target.closest('button, a');
    if (!b) return;
    if (b.id === 'syncGoogle') googleAuth();
    else if (b.id === 'syncEmailBtn') { syncForm = true; syncErr = ''; renderSync(); $('#syncEmail').focus(); }
    else if (b.id === 'syncCancel') { syncForm = false; syncErr = ''; renderSync(); }
    else if (b.id === 'syncRegister') { if ($('#syncForm').reportValidity()) emailAuth(true); }
    else if (b.id === 'syncLogout') syncLogout();
    else if (b.id === 'syncForgot') { e.preventDefault(); api.openUrl && api.openUrl(`${SYNC.site}#account`); }
  });
  box.addEventListener('submit', e => { e.preventDefault(); emailAuth(false); });
  if (api.onAuthResult) api.onAuthResult(onAuthResult);
  // Back in view (phone unlocked, window shown): the stream may have died while asleep, reconnect.
  api.onWindowVisible(v => { if (v && account && (ANDROID || !es)) syncConnect(); });
  window.addEventListener('online', () => { if (account) { retryMs = 2000; syncConnect(); syncSchedule(); } });
}

/* ---------- "sync is off" banner: on launch, at most once a day, until signed in ---------- */
const NAG_EVERY = 20 * 3600 * 1000;
function maybeNag() {
  if (account || Date.now() - (Number(settings.syncNagAt) || 0) < NAG_EVERY) return;
  settings.syncNagAt = Date.now();
  persist();
  $('#syncBannerText').textContent = st('bannerText');
  $('#syncBannerGo').textContent = st('bannerGo');
  const el = $('#syncBanner');
  el.classList.remove('out');
  el.hidden = false;
}
function hideBanner() {
  const el = $('#syncBanner');
  if (!el || el.hidden) return;
  el.classList.add('out');
  setTimeout(() => { el.hidden = true; el.classList.remove('out'); }, 260);
}
function bindBanner() {
  $('#syncBannerX').addEventListener('click', hideBanner);
  $('#syncBannerGo').addEventListener('click', () => {
    hideBanner();
    $('.tab[data-view="settings"]').click();
    setTimeout(() => {
      const box = $('#syncBox');
      const page = $('#view-settings');
      if (page.scrollHeight > page.clientHeight) page.scrollTo({ top: box.offsetTop - 120, behavior: 'smooth' });
      else box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      box.classList.remove('flash');
      void box.offsetWidth;
      box.classList.add('flash');
    }, 420);
  });
}

/* ---------- hooks for app.js ---------- */
const syncSnapshot = () => ({ account, sent: syncSent });

function syncInit(data) {
  const d = data.sync || {};
  if (d.account && d.account.uid && d.account.rt) account = d.account;
  if (d.sent && typeof d.sent === 'object') syncSent = { s: d.sent.s || {}, p: d.sent.p || {}, set: d.sent.set || '', sv: d.sent.sv || {} };
  bindSync();
  bindBanner();
  renderSync();
  if (account) syncConnect();
  // The timer must agree everywhere, whatever happened to the live stream: a dead stream is
  // reopened, and the timer (a few hundred bytes) is checked every 30 s and whenever the window
  // comes back. Old and new versions all read and write the same timer state.
  const watch = () => {
    if (!account || !syncLoaded || document.hidden) return;
    pollTimer();
  };
  setInterval(watch, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) watch(); });
  if (api.onWindowVisible) api.onWindowVisible(v => { if (v) watch(); });
  else setTimeout(maybeNag, ANDROID ? 2600 : 1500); // after the launch animation
  // the PC sends its program stats every few minutes, so the phone sees them without opening Apps here
  if (!ANDROID && !api.web && api.appsStats) {
    const push = async () => { if (account && syncLoaded) syncApps((await api.appsStats()) || []); };
    setTimeout(push, 20000);
    setInterval(push, 5 * 60000);
  }
}
