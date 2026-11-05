// Новая программа = новая запись в APPS. Категории-вкладки строятся из поля cat сами.
// file — прямая ссылка на .exe. Для GitHub-релиза: .../releases/latest/download/<имя>.exe (всегда свежая версия).
// site — необязательно: если поля нет, кнопки «Сайт» не будет.
const APPS = [
  {
    id: 'smooth-cursor',
    name: 'Smooth Cursor',
    cat: 'Видео',
    icon: 'assets/smooth-cursor.png',
    demo: 'assets/smooth-cursor-demo.gif',
    desc: 'Плавный курсор для записей экрана в OBS, как в Screen Studio. Клики попадают точно в цель.',
    file: 'https://github.com/fggtf24-cyber/smooth-cursor-obs/releases/latest/download/SmoothCursor-Setup.exe',
    size: '52 МБ',
    repo: 'https://github.com/fggtf24-cyber/smooth-cursor-obs',
    // site: 'https://smoothcursor.ru/', // ponytail: хостинг пока лежит, раскомментировать, когда поднимут
    features: [
      'Запись по F9: OBS пишет видео, программа логирует курсор с частотой 240 Гц',
      'Сглаживает дёрганые движения мыши',
      'При клике курсор чуть сжимается и наклоняется',
      'Motion blur на быстрых движениях',
      'Обновляется сама при запуске',
    ],
    needs: [
      'Windows, 64-бит',
      'OBS Studio 30 или новее',
      'ffmpeg: если его нет, программа скачает сама (около 100 МБ)',
      'Права администратора не нужны',
    ],
  },
  {
    id: 'voicetype',
    name: 'VoiceType',
    cat: 'Звук',
    icon: 'assets/voicetype.png',
    desc: 'Голосовой ввод в любое окно по горячей клавише. Работает на вашем компьютере, без облака и лимитов.',
    file: 'https://github.com/brlk33/Voice-Type/raw/main/VoiceType-Setup.exe',
    size: '285 КБ',
    repo: 'https://github.com/brlk33/Voice-Type',
    features: [
      'Диктовка: держите правый Ctrl и говорите, текст появится там, где стоит курсор',
      'Длинные записи: текст распознаётся по ходу записи',
      'Файлы: аудио и видео любой длины в текст',
      'YouTube: текст ролика по ссылке',
      'Чистая речь: убирает «э-э», «м-м» и повторы',
      'Словарь замен для терминов',
      'Обновляется сама при запуске',
    ],
    needs: [
      'Windows 10 или 11, 64-бит',
      'Видеокарта NVIDIA рекомендуется, без неё работает на процессоре медленнее',
      'Около 7 ГБ на диске',
      'Интернет на время установки: 10–20 минут, установщик сам скачает всё нужное',
    ],
  },
];

// Публичный конфиг: этот ключ не секрет, он и должен быть на клиенте. Доступ ограничен списком доменов в Firebase.
const FIREBASE = {
  apiKey: 'AIzaSyB5N_ynBpx9cD8cyy4da_HFMHVc-qZ_YyU',
  authDomain: 'yaytsa-cloud.firebaseapp.com',
  projectId: 'yaytsa-cloud',
  appId: '1:404414364346:web:074a88baecb305d25aa083',
};
const FIREBASE_CDN = 'https://www.gstatic.com/firebasejs/13.1.0/';

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Неверная почта или пароль.',
  'auth/invalid-email': 'Проверьте адрес почты.',
  'auth/missing-password': 'Введите пароль.',
  'auth/weak-password': 'Пароль должен быть не короче 6 символов.',
  'auth/email-already-in-use': 'Эта почта уже зарегистрирована. Попробуйте войти.',
  'auth/too-many-requests': 'Слишком много попыток. Подождите немного.',
  'auth/network-request-failed': 'Нет связи с сервером. Проверьте интернет.',
  'auth/popup-blocked': 'Браузер заблокировал окно входа. Разрешите всплывающие окна.',
  'auth/account-exists-with-different-credential': 'Эта почта уже зарегистрирована другим способом.',
};

const view = document.getElementById('view');
const search = document.getElementById('search');
const avatar = document.getElementById('avatar');
const toastEl = document.getElementById('toast');

let cat = 'all';
let authMode = 'login';
let fb = null;          // модуль firebase-auth
let auth = null;
let user = null;
let authState = 'loading'; // loading | ready | failed

/* ---------- Приложения ---------- */

const platform = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" stroke-width="1.8" role="img" aria-label="Для компьютера"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>';
const download = (a, cls = 'btn') => `<a class="${cls} dl" href="${a.file}" aria-label="Скачать ${a.name}, ${a.size}">Скачать</a>`;
const siteLink = a => (a.site ? `<a class="link" href="${a.site}" target="_blank" rel="noopener">Сайт</a>` : '');

const card = a => `
  <article class="card">
    <div class="card-head">
      <img src="${a.icon}" alt="">
      <h2><a href="#app/${a.id}">${a.name}</a></h2>
      ${platform}
    </div>
    <p>${a.desc}</p>
    <div class="card-foot">
      <a class="link" href="#app/${a.id}" aria-label="Подробнее о ${a.name}">Подробнее</a>
      ${siteLink(a)}
      ${download(a)}
    </div>
  </article>`;

const promo = `
  <article class="card promo">
    <svg width="28" height="28" aria-hidden="true"><use href="#logo"/></svg>
    <p>Вся кладка бесплатно. Без подписки.</p>
    <div class="eggs" aria-hidden="true">
      ${['#6FA8FF', '#FFB347', '#A58BFF', '#FF6F91', '#FFFFFF', '#6BE3B4', '#5ED0F0', '#FF8A5B', '#FFC531']
        .map(c => `<i style="background:${c}"></i>`).join('')}
    </div>
  </article>`;

function renderApps() {
  const q = search.value.trim().toLowerCase();
  const list = APPS.filter(a =>
    (cat === 'all' || a.cat === cat) &&
    (!q || `${a.name} ${a.desc} ${a.cat}`.toLowerCase().includes(q)));
  const tabs = [['all', 'Все приложения'], ...[...new Set(APPS.map(a => a.cat))].map(c => [c, c])];

  view.innerHTML = `
    <div class="tabs" role="group" aria-label="Категории">
      ${tabs.map(([id, label]) => `<button type="button" data-cat="${id}" aria-pressed="${id === cat}">${label}</button>`).join('')}
    </div>
    <section class="section">
      <h1>Приложения, которые уже вылупились</h1>
      ${list.length
        ? `<div class="grid">${cat === 'all' && !q ? promo : ''}${list.map(card).join('')}</div>`
        : '<p class="empty">Ничего не нашлось.</p>'}
    </section>`;
}

function renderApp(a) {
  const facts = (title, items) => `
    <div class="card fact"><h2>${title}</h2><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
  view.innerHTML = `
    <section class="section">
      <a class="link back" href="#apps">← Все приложения</a>
      <div class="app-head">
        <img src="${a.icon}" alt="">
        <div><h1>${a.name}</h1><p>${a.desc}</p></div>
      </div>
      <div class="app-actions">
        ${download(a, 'btn primary')}
        <span class="empty">${a.size}, Windows</span>
        ${siteLink(a)}
        <a class="link" href="${a.repo}" target="_blank" rel="noopener">GitHub</a>
      </div>
      <div class="app-body">
        ${a.demo ? `<img class="demo" src="${a.demo}" alt="${a.name} в работе">` : ''}
        <div class="facts">${facts('Что умеет', a.features)}${facts('Что нужно', a.needs)}</div>
      </div>
    </section>`;
}

/* ---------- Аккаунт ---------- */

function renderAccount() {
  if (authState !== 'ready') {
    view.innerHTML = `<section class="section"><h1>Аккаунт</h1><p class="empty">${
      authState === 'loading' ? 'Загрузка…' : 'Сервис входа сейчас недоступен. Скачивать программы можно и без аккаунта.'}</p></section>`;
    return;
  }
  if (user) {
    view.innerHTML = `
      <section class="section account">
        <h1>Аккаунт</h1>
        <p id="who"></p>
        <button type="button" class="btn" id="logout">Выйти</button>
      </section>`;
    view.querySelector('#who').textContent = user.displayName ? `${user.displayName} (${user.email})` : user.email;
    return;
  }
  const reg = authMode === 'register';
  view.innerHTML = `
    <section class="section account">
      <h1>${reg ? 'Создать аккаунт' : 'Вход'}</h1>
      <div class="tabs" role="group" aria-label="Вход или регистрация">
        <button type="button" data-mode="login" aria-pressed="${!reg}">Вход</button>
        <button type="button" data-mode="register" aria-pressed="${reg}">Регистрация</button>
      </div>
      <button type="button" class="btn google" id="google">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M21 12.2h-9M20.6 12.2a8.8 8.8 0 1 1-2.6-6.3"/></svg>
        Продолжить с Google
      </button>
      <p class="or">или</p>
      <form id="auth-form" class="account">
        <label class="field">Почта
          <input name="email" type="email" required autocomplete="email">
        </label>
        <label class="field">Пароль
          <input name="password" type="password" required minlength="6" autocomplete="${reg ? 'new-password' : 'current-password'}">
        </label>
        <button class="btn primary">${reg ? 'Создать аккаунт' : 'Войти'}</button>
      </form>
      ${reg ? '' : '<button type="button" class="link linkbtn" id="reset">Забыли пароль?</button>'}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

function say(text, ok = false) {
  const msg = view.querySelector('#msg');
  msg.textContent = text;
  msg.classList.toggle('ok', ok);
}

async function attempt(fn) {
  try {
    await fn();
  } catch (e) {
    if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
    console.error(e);
    say(AUTH_ERRORS[e.code] || 'Не получилось. Попробуйте ещё раз.');
  }
}

async function initAuth() {
  try {
    const [{ initializeApp }, authModule] = await Promise.all([
      import(`${FIREBASE_CDN}firebase-app.js`),
      import(`${FIREBASE_CDN}firebase-auth.js`),
    ]);
    fb = authModule;
    auth = fb.getAuth(initializeApp(FIREBASE));
    auth.languageCode = 'ru';
    fb.onAuthStateChanged(auth, u => {
      user = u;
      authState = 'ready';
      avatar.textContent = (u?.displayName || u?.email || 'Я')[0];
      if (route().name === 'account') render();
    });
  } catch (e) {
    // Каталог и скачивание от Firebase не зависят: падает только страница аккаунта.
    console.error(e);
    authState = 'failed';
    if (route().name === 'account') render();
  }
}

/* ---------- Навигация и события ---------- */

function route() {
  const [name, id] = location.hash.slice(1).split('/');
  if (name === 'account') return { name };
  const app = name === 'app' && APPS.find(a => a.id === id);
  return app ? { name: 'app', app } : { name: 'apps' };
}

function render() {
  const r = route();
  if (r.name === 'account') renderAccount();
  else if (r.name === 'app') renderApp(r.app);
  else renderApps();
  document.querySelectorAll('.rail a').forEach(a => {
    if (a.dataset.route === (r.name === 'account' ? 'account' : 'apps')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = r.app ? `${r.app.name} — Яйца Клауд` : 'Яйца Клауд — все приложения';
}

let toastTimer;
function toast(text) {
  toastEl.textContent = text;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 9000);
}

view.addEventListener('click', e => {
  const t = e.target.closest('button, a');
  if (!t) return;
  if (t.dataset.cat) { cat = t.dataset.cat; renderApps(); }
  else if (t.dataset.mode) { authMode = t.dataset.mode; renderAccount(); }
  else if (t.classList.contains('dl')) {
    toast('Скачивание началось. Если Windows покажет SmartScreen: «Подробнее», затем «Выполнить в любом случае».');
  }
  else if (t.id === 'logout') attempt(() => fb.signOut(auth));
  else if (t.id === 'google') attempt(() => fb.signInWithPopup(auth, new fb.GoogleAuthProvider()));
  else if (t.id === 'reset') {
    const email = view.querySelector('[name=email]').value.trim();
    if (!email) return say('Введите почту, и мы пришлём ссылку для сброса пароля.');
    attempt(async () => {
      await fb.sendPasswordResetEmail(auth, email);
      say('Если такой аккаунт есть, письмо уже в пути. Проверьте почту.', true);
    });
  }
});

view.addEventListener('submit', e => {
  e.preventDefault();
  const { email, password } = Object.fromEntries(new FormData(e.target));
  const go = authMode === 'register' ? fb.createUserWithEmailAndPassword : fb.signInWithEmailAndPassword;
  attempt(() => go(auth, email.trim(), password));
});

search.addEventListener('input', () => {
  if (route().name === 'apps') renderApps();
  else location.hash = 'apps';
});

addEventListener('hashchange', () => { render(); scrollTo(0, 0); });

render();
initAuth();
