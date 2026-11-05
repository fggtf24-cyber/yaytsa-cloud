// Программы добавляют админы прямо на сайте. APPS — стартовый список. Категории-вкладки строятся из поля cat сами.
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
    size: '130 МБ',
    repo: 'https://github.com/fggtf24-cyber/smooth-cursor-obs',
    // site: 'https://smoothcursor.ru/', // ponytail: хостинг пока лежит, раскомментировать (или вписать в редакторе), когда поднимут
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
    size: 'Около 7 ГБ',
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

// Стартовый список «Других проектов». Правки админов лежат в Firestore и накладываются поверх APPS и PROJECTS.
const PROJECTS = [
  {
    id: 'soundcloud',
    name: '52swag jams',
    desc: 'Наша музыка на SoundCloud.',
    url: 'https://soundcloud.com/f-fggt/sets/52swag-jams',
  },
];

// Публичный конфиг: этот ключ не секрет, он и должен быть на клиенте. Запись защищают правила в firestore.rules.
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
  'permission-denied': 'Нет прав: войдите через Google с почтой админа.',
};

const view = document.getElementById('view');
const search = document.getElementById('search');
const avatar = document.getElementById('avatar');
const toastEl = document.getElementById('toast');

const PROJECTS_TAB = 'projects';
let cat = 'all';
let authMode = 'login';
let fb = null;          // модуль firebase-auth
let fs = null;          // модуль firebase-firestore
let auth = null;
let db = null;
let user = null;
let isAdmin = false;
let authState = 'loading';    // loading | ready | failed
let contentState = 'loading'; // loading | ready | failed
let profile = {};  // users/<uid>: name, photo
let apps = APPS;
let projects = PROJECTS;

// Всё, что вводят в редакторе, попадает в разметку только через esc и safeUrl.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const safeUrl = u => (/^(https:\/\/|assets\/)/.test(u || '') ? esc(u) : '');
const icon = a => safeUrl(a.icon) || 'assets/favicon.svg';

/* ---------- Приложения ---------- */

const platform = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" stroke-width="1.8" role="img" aria-label="Для компьютера"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>';
const download = (a, cls = 'btn') => `<a class="${cls} dl" data-id="${esc(a.id)}" href="${safeUrl(a.file)}" aria-label="Скачать ${esc(a.name)}">Скачать</a>`;
const siteLink = a => (safeUrl(a.site) ? `<a class="link" href="${safeUrl(a.site)}" target="_blank" rel="noopener">Сайт</a>` : '');
const editLink = (kind, a) => (isAdmin ? `<a class="link" href="#edit/${kind}/${esc(a.id)}" aria-label="Изменить ${esc(a.name)}">Изменить</a>` : '');
const authorLine = a => (a.author ? `<p class="author">Автор: ${esc(a.author)}</p>` : '');

const card = a => `
  <article class="card">
    <div class="card-head">
      <img src="${icon(a)}" alt="">
      <h2><a href="#app/${esc(a.id)}">${esc(a.name)}</a></h2>
      ${platform}
    </div>
    ${authorLine(a)}
    <p>${esc(a.desc)}</p>
    <div class="card-foot">
      <a class="link" href="#app/${esc(a.id)}" aria-label="Подробнее о ${esc(a.name)}">Подробнее</a>
      ${siteLink(a)}
      ${editLink('apps', a)}
      ${download(a)}
    </div>
  </article>`;

const projectCard = p => `
  <article class="card">
    <div class="card-head"><h2>${esc(p.name)}</h2></div>
    <p>${esc(p.desc)}</p>
    <div class="card-foot">
      ${editLink('projects', p)}
      <a class="btn open" href="${safeUrl(p.url)}" target="_blank" rel="noopener" aria-label="Открыть ${esc(p.name)}">Открыть</a>
    </div>
  </article>`;

const promo = `
  <article class="card promo">
    <svg width="28" height="28" aria-hidden="true"><use href="#logo"/></svg>
    <p>Все программы бесплатные. Без подписки.</p>
    <div class="eggs" aria-hidden="true">
      ${['#6FA8FF', '#FFB347', '#A58BFF', '#FF6F91', '#FFFFFF', '#6BE3B4', '#5ED0F0', '#FF8A5B', '#FFC531']
        .map(c => `<i style="background:${c}"></i>`).join('')}
    </div>
  </article>`;

function renderApps() {
  const q = search.value.trim().toLowerCase();
  const found = a => !q || `${a.name} ${a.author} ${a.desc} ${a.cat}`.toLowerCase().includes(q);
  const onProjects = cat === PROJECTS_TAB;
  const cats = [...new Set(apps.map(a => a.cat))];
  const list = onProjects ? projects.filter(found) : apps.filter(a => (cat === 'all' || a.cat === cat) && found(a));
  const tabs = [['all', 'Все приложения'], ...cats.map(c => [c, c]), [PROJECTS_TAB, 'Другие проекты']];
  const add = onProjects ? ['projects', 'Добавить проект'] : ['apps', 'Добавить программу'];

  view.innerHTML = `
    <div class="tabs" role="group" aria-label="Категории">
      ${tabs.map(([id, label]) => `<button type="button" data-cat="${esc(id)}" aria-pressed="${id === cat}">${esc(label)}</button>`).join('')}
      ${isAdmin ? `<a class="btn tabs-add" href="#edit/${add[0]}/new">${add[1]}</a>` : ''}
    </div>
    <section class="section">
      <h1>${onProjects ? 'Другие наши проекты' : 'Программы с яйцами'}</h1>
      ${list.length
        ? `<div class="grid">${cat === 'all' && !q ? promo : ''}${list.map(onProjects ? projectCard : card).join('')}</div>`
        : '<p class="empty">Ничего не нашлось.</p>'}
    </section>`;
}

function renderApp(a) {
  const list = items => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const demo = safeUrl(a.demo);
  const features = a.features || [];
  const isWindows = /Windows/.test(navigator.userAgent);
  view.innerHTML = `
    <div class="app-bar">
      <a class="app-back" href="#apps" aria-label="Все приложения">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
      </a>
      <span>${esc(a.name)}</span>
    </div>
    <div class="app-page">
      <aside class="app-side">
        <div class="app-title">
          <img src="${icon(a)}" alt="">
          <h1>${esc(a.name)}</h1>
        </div>
        <div class="app-platform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>
          Настольные ПК
        </div>
        <p class="app-desc">${esc(a.desc)}</p>
        <ul class="app-meta">
          <li>${isWindows ? '<i class="ok">✓</i>Работает на этом устройстве' : '<i>!</i>Только для Windows'}</li>
          ${a.size ? `<li><i>↓</i>${esc(a.size)} после установки</li>` : ''}
          ${a.author ? `<li><i>@</i>Автор: ${esc(a.author)}</li>` : ''}
        </ul>
        ${download(a, 'btn primary')}
        <div class="app-links">
          ${siteLink(a)}
          ${safeUrl(a.repo) ? `<a class="link" href="${safeUrl(a.repo)}" target="_blank" rel="noopener">GitHub</a>` : ''}
          ${editLink('apps', a)}
        </div>
      </aside>
      <div class="app-main">
        ${features.length ? `
          <h2>Основное использование</h2>
          <div class="use">
            <div class="use-text">
              <p class="use-lead">${esc(features[0])}</p>
              ${list(features.slice(1))}
            </div>
            ${demo ? `<img src="${demo}" alt="${esc(a.name)} в работе">` : ''}
          </div>` : (demo ? `<div class="use"><img src="${demo}" alt="${esc(a.name)} в работе"></div>` : '')}
        ${a.needs?.length ? `<h2>Что нужно</h2><div class="use"><div class="use-text">${list(a.needs)}</div></div>` : ''}
      </div>
    </div>`;
}

/* ---------- Редактор (только админы) ---------- */

// [поле, подпись, тип]; * в конце типа — обязательное.
const FIELDS = {
  apps: [
    ['name', 'Название', 'text*'],
    ['author', 'Автор', 'text'],
    ['cat', 'Категория (новая появится вкладкой)', 'text*'],
    ['desc', 'Описание', 'area*'],
    ['file', 'Ссылка на .exe', 'url*'],
    ['size', 'Размер после установки, например 130 МБ', 'text'],
    ['site', 'Сайт программы', 'url'],
    ['repo', 'GitHub', 'url'],
    ['icon', 'Ссылка на иконку', 'url'],
    ['demo', 'Ссылка на гифку или картинку', 'url'],
    ['features', 'Что умеет (один пункт на строку)', 'lines'],
    ['needs', 'Что нужно (один пункт на строку)', 'lines'],
  ],
  projects: [
    ['name', 'Название', 'text*'],
    ['desc', 'Описание', 'area'],
    ['url', 'Ссылка', 'url*'],
  ],
};

function renderEditor(kind, id) {
  const note = text => { view.innerHTML = `<section class="section"><p class="empty">${text}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note('Загрузка…');
  if (contentState === 'failed') return note('Не удалось загрузить данные. Обновите страницу.');
  if (!isAdmin) return note('Редактировать могут только админы, вошедшие через Google.');
  const item = id === 'new' ? {} : (kind === 'apps' ? apps : projects).find(x => x.id === id);
  if (!item) return note('Такой записи нет.');

  const field = ([key, label, type]) => {
    const required = type.endsWith('*') ? 'required' : '';
    const t = type.replace('*', '');
    const value = Array.isArray(item[key]) ? item[key].join('\n') : item[key] ?? '';
    const control = t === 'area' || t === 'lines'
      ? `<textarea name="${key}" rows="${t === 'lines' ? 6 : 3}" ${required}>${esc(value)}</textarea>`
      : `<input name="${key}" value="${esc(value)}" ${required} ${t === 'url' ? 'pattern="(https://|assets/).+" title="Ссылка должна начинаться с https://"' : ''}>`;
    return `<label class="field">${label}${control}</label>`;
  };
  view.innerHTML = `
    <section class="section account editor">
      <h1>${id === 'new' ? 'Новая запись' : `Изменить: ${esc(item.name)}`}</h1>
      <form id="edit-form" class="account" data-kind="${kind}" data-id="${esc(id)}">
        ${FIELDS[kind].map(field).join('')}
        <button class="btn primary">Сохранить</button>
      </form>
      ${id === 'new' ? '' : '<button type="button" class="btn danger" id="delete">Удалить</button>'}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

async function saveItem(form) {
  const { kind, id } = form.dataset;
  const data = Object.fromEntries(new FormData(form));
  for (const [key, , type] of FIELDS[kind]) {
    data[key] = type === 'lines'
      ? data[key].split('\n').map(l => l.trim()).filter(Boolean)
      : data[key].trim();
  }
  const col = fs.collection(db, kind);
  const ref = id === 'new' ? fs.doc(col) : fs.doc(col, id);
  await fs.setDoc(ref, data, { merge: true });
  await loadContent();
  location.hash = kind === 'apps' ? `app/${ref.id}` : 'apps';
}

/* ---------- Данные ---------- */

// Запись из Firestore ложится поверх стартовой с тем же id.
// deleted: стартовые записи живут в коде, поэтому их помечаем, а не стираем.
function merge(base, snap) {
  const items = new Map(base.map(a => [a.id, a]));
  snap.forEach(d => items.set(d.id, { ...items.get(d.id), ...d.data(), id: d.id }));
  return [...items.values()].filter(a => !a.deleted);
}

async function loadContent() {
  const [a, p] = await Promise.all(['apps', 'projects'].map(c => fs.getDocs(fs.collection(db, c))));
  apps = merge(APPS, a);
  projects = merge(PROJECTS, p);
  contentState = 'ready';
}

async function loadProfile(u) {
  if (!u) return {};
  try {
    return (await fs.getDoc(fs.doc(db, 'users', u.uid))).data() || {};
  } catch (e) {
    console.error(e);
    return {};
  }
}

async function checkAdmin(u) {
  if (!u?.email) return false;
  try {
    return (await fs.getDoc(fs.doc(db, 'admins', u.email.toLowerCase()))).exists();
  } catch {
    return false; // правила не пускают: вход не через Google
  }
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
        <h1>Профиль</h1>
        <div class="profile-head">
          <span class="avatar big" id="big-avatar"></span>
          <div class="profile-photo">
            <label class="btn">Загрузить фото<input id="photo" class="sr" type="file" accept="image/*"></label>
            ${profile.photo ? '<button type="button" class="link linkbtn" id="photo-remove">Убрать фото</button>' : ''}
          </div>
        </div>
        <form id="profile-form" class="account">
          <label class="field">Имя<input name="name" maxlength="80" autocomplete="name"></label>
          <button class="btn primary">Сохранить</button>
        </form>
        <p id="who" class="empty"></p>
        ${isAdmin ? '<p class="msg ok">Вы админ: кнопки «Изменить» и «Добавить» есть в каталоге, цифры в разделе «Статистика».</p>' : ''}
        <p id="msg" class="msg" role="alert"></p>
        <button type="button" class="btn" id="logout">Выйти</button>
      </section>`;
    view.querySelector('#who').textContent = user.email;
    view.querySelector('[name=name]').value = displayName();
    drawAvatar(view.querySelector('#big-avatar'));
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

const displayName = () => profile.name || user?.displayName || '';

function drawAvatar(el) {
  const src = profile.photo || user?.photoURL;
  el.textContent = src ? '' : (displayName() || user?.email || 'Я')[0];
  if (!src) return;
  const img = new Image();
  img.src = src;
  img.alt = '';
  img.referrerPolicy = 'no-referrer'; // без этого аватарки Google часто не грузятся
  el.append(img);
}

async function saveProfile(data) {
  await fs.setDoc(fs.doc(db, 'users', user.uid), data, { merge: true });
  profile = { ...profile, ...data };
  drawAvatar(avatar);
  renderAccount();
  say('Сохранено.', true);
}

// Storage на бесплатном тарифе нет, поэтому фото ужимаем до 128×128 и храним строкой в профиле.
async function photoToDataUrl(file) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  canvas.getContext('2d').drawImage(bitmap,
    (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 128, 128);
  return canvas.toDataURL('image/jpeg', 0.8);
}

/* ---------- Статистика ---------- */

const today = () => new Date().toISOString().slice(0, 10);

// ponytail: счётчики пишет браузер, поэтому накрутить их можно. Для честных цифр нужен сервер.
function count(key) {
  fs?.setDoc(fs.doc(db, 'stats', `${key}_${today()}`), { n: fs.increment(1) }, { merge: true })
    .catch(console.error);
}

function countVisit() {
  try {
    if (sessionStorage.getItem('counted')) return;
    sessionStorage.setItem('counted', '1');
  } catch { /* приватный режим: посчитаем как есть */ }
  count('visits');
}

async function renderStats() {
  const note = text => { view.innerHTML = `<section class="section"><h1>Статистика</h1><p class="empty">${text}</p></section>`; };
  if (authState === 'loading') return note('Загрузка…');
  if (!isAdmin) return note('Статистику видят только админы, вошедшие через Google.');
  note('Загрузка…');
  let snap;
  try {
    snap = await fs.getDocs(fs.collection(db, 'stats'));
  } catch (e) {
    console.error(e);
    return note('Не удалось загрузить статистику.');
  }
  if (route().name !== 'stats') return;

  const rows = [];
  snap.forEach(d => {
    const m = d.id.match(/^(visits|dl_(.+))_(\d{4}-\d{2}-\d{2})$/);
    if (m) rows.push({ app: m[2], day: m[3], n: d.data().n || 0 });
  });
  const since = days => new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10);
  const sum = (test, from = '') => rows.filter(r => test(r) && r.day >= from).reduce((t, r) => t + r.n, 0);
  const isVisit = r => !r.app;
  const isDownload = r => !!r.app;
  const periods = [['Сегодня', today()], ['7 дней', since(7)], ['30 дней', since(30)], ['Всё время', '']];
  const line = (name, test) => `<tr><th scope="row">${esc(name)}</th>${periods.map(([, from]) => `<td>${sum(test, from)}</td>`).join('')}</tr>`;
  const ids = [...new Set([...apps.map(a => a.id), ...rows.filter(isDownload).map(r => r.app)])];
  const appName = id => apps.find(a => a.id === id)?.name || id;
  const days = [...Array(14)].map((_, i) => since(i + 1));

  view.innerHTML = `
    <section class="section">
      <h1>Статистика</h1>
      <div class="table-box"><table>
        <thead><tr><th></th>${periods.map(([label]) => `<th scope="col">${label}</th>`).join('')}</tr></thead>
        <tbody>
          ${line('Заходы', isVisit)}
          ${line('Скачивания', isDownload)}
          ${ids.map(id => line(`↓ ${appName(id)}`, r => r.app === id)).join('')}
        </tbody>
      </table></div>
      <h2 class="stats-sub">По дням</h2>
      <div class="table-box"><table>
        <thead><tr><th scope="col">День</th><th scope="col">Заходы</th><th scope="col">Скачивания</th></tr></thead>
        <tbody>${days.map(day => `<tr><th scope="row">${day}</th><td>${sum(r => isVisit(r) && r.day === day)}</td><td>${sum(r => isDownload(r) && r.day === day)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="empty">Заход считается один раз за сеанс браузера. Скачивание считается по нажатию кнопки.</p>
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

async function initFirebase() {
  try {
    const [{ initializeApp }, authModule, firestoreModule] = await Promise.all([
      import(`${FIREBASE_CDN}firebase-app.js`),
      import(`${FIREBASE_CDN}firebase-auth.js`),
      import(`${FIREBASE_CDN}firebase-firestore.js`),
    ]);
    fb = authModule;
    fs = firestoreModule;
    const app = initializeApp(FIREBASE);
    auth = fb.getAuth(app);
    db = fs.getFirestore(app);
    auth.languageCode = 'ru';
    countVisit();
    loadContent()
      .catch(e => { console.error(e); contentState = 'failed'; }) // каталог останется стартовым
      .then(render);
    fb.onAuthStateChanged(auth, async u => {
      [isAdmin, profile] = await Promise.all([checkAdmin(u), loadProfile(u)]);
      user = u;
      authState = 'ready';
      drawAvatar(avatar);
      document.getElementById('rail-stats').hidden = !isAdmin;
      render();
    });
  } catch (e) {
    // Каталог и скачивание от Firebase не зависят: падают только аккаунты и правки.
    console.error(e);
    authState = contentState = 'failed';
    render();
  }
}

/* ---------- Навигация и события ---------- */

function route() {
  const [name, a, b] = location.hash.slice(1).split('/');
  if (name === 'account' || name === 'stats') return { name };
  if (name === 'edit' && FIELDS[a] && b) return { name, kind: a, id: b };
  const app = name === 'app' && apps.find(x => x.id === a);
  return app ? { name: 'app', app } : { name: 'apps' };
}

function render() {
  const r = route();
  if (r.name === 'account') renderAccount();
  else if (r.name === 'stats') renderStats();
  else if (r.name === 'edit') renderEditor(r.kind, r.id);
  else if (r.name === 'app') renderApp(r.app);
  else renderApps();
  document.querySelectorAll('.rail a').forEach(a => {
    if (a.dataset.route === (['account', 'stats'].includes(r.name) ? r.name : 'apps')) a.setAttribute('aria-current', 'page');
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
    count(`dl_${t.dataset.id}`);
    toast('Скачивание началось. Если Windows покажет SmartScreen: «Подробнее», затем «Выполнить в любом случае».');
  }
  else if (t.id === 'delete') {
    if (!confirm('Удалить запись с сайта?')) return;
    const { kind, id } = view.querySelector('#edit-form').dataset;
    attempt(async () => {
      await fs.setDoc(fs.doc(db, kind, id), { deleted: true }, { merge: true });
      await loadContent();
      cat = 'all';
      location.hash = 'apps';
    });
  }
  else if (t.id === 'photo-remove') attempt(() => saveProfile({ photo: '' }));
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
  if (e.target.id === 'edit-form') return attempt(() => saveItem(e.target));
  if (e.target.id === 'profile-form') {
    return attempt(() => saveProfile({ name: e.target.elements.name.value.trim() }));
  }
  const { email, password } = Object.fromEntries(new FormData(e.target));
  const go = authMode === 'register' ? fb.createUserWithEmailAndPassword : fb.signInWithEmailAndPassword;
  attempt(() => go(auth, email.trim(), password));
});

view.addEventListener('change', e => {
  if (e.target.id !== 'photo' || !e.target.files[0]) return;
  const file = e.target.files[0];
  photoToDataUrl(file)
    .then(photo => attempt(() => saveProfile({ photo })))
    .catch(() => say('Не получилось открыть эту картинку. Попробуйте JPG или PNG.'));
});

search.addEventListener('input', () => {
  if (route().name === 'apps') renderApps();
  else location.hash = 'apps';
});

addEventListener('hashchange', () => { render(); scrollTo(0, 0); });

render();
initFirebase();
