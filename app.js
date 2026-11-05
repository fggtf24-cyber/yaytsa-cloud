import { EN } from './i18n.js?v=13';

// Программы добавляют админы прямо на сайте. APPS — стартовый список.
// file — прямая ссылка на .exe. Для GitHub-релиза: .../releases/latest/download/<имя>.exe (всегда свежая версия).
// site — необязательно: если поля нет, кнопки «Сайт» не будет.
const APPS = [
  {
    id: 'smooth-cursor',
    name: 'Smooth Cursor',
    icon: 'assets/smooth-cursor.png',
    demo: 'assets/smooth-cursor-demo.mp4',
    desc: 'Плавный курсор для записей экрана в OBS, как в Screen Studio. Клики попадают точно в цель.',
    descEn: 'A smooth cursor for OBS screen recordings, like in Screen Studio. Clicks land exactly on target.',
    file: 'https://github.com/fggtf24-cyber/smooth-cursor-obs/releases/latest/download/SmoothCursor-Setup.exe',
    size: '130 МБ',
    sizeEn: '130 MB',
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
    featuresEn: [
      'Record with F9: OBS captures video while the app logs the cursor at 240 Hz',
      'Smooths out jerky mouse movement',
      'The cursor squeezes and tilts slightly on click',
      'Motion blur on fast movement',
      'Updates itself on launch',
    ],
    needsEn: [
      'Windows, 64-bit',
      'OBS Studio 30 or newer',
      'ffmpeg: if missing, the app downloads it (about 100 MB)',
      'No administrator rights needed',
    ],
  },
  {
    id: 'voicetype',
    name: 'VoiceType',
    icon: 'assets/voicetype.png',
    desc: 'Голосовой ввод в любое окно по горячей клавише. Работает на вашем компьютере, без облака и лимитов.',
    descEn: 'Voice typing into any window with a hotkey. Runs on your computer, no cloud and no limits. Speech recognition is tuned for Russian.',
    file: 'https://github.com/brlk33/Voice-Type/raw/main/VoiceType-Setup.exe',
    size: 'Около 7 ГБ',
    sizeEn: 'About 7 GB',
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
    featuresEn: [
      'Dictation: hold right Ctrl and speak, the text appears at the cursor',
      'Long recordings: text is recognized as you record',
      'Files: audio and video of any length to text',
      'YouTube: video text from a link',
      'Clean speech: removes filler sounds and repeats',
      'Replacement dictionary for terms',
      'Updates itself on launch',
    ],
    needsEn: [
      'Windows 10 or 11, 64-bit',
      'NVIDIA graphics card recommended, it runs slower on the CPU',
      'About 7 GB of disk space',
      'Internet during installation: 10–20 minutes, the installer downloads everything it needs',
    ],
  },
  {
    id: 'yaytsechist',
    name: 'Яйцечист',
    nameEn: 'Yaytsechist',
    icon: 'assets/yaytsechist.png',
    desc: 'Чистит Windows от мусора, показывает, что занимает место на диске, и ускоряет отклик в играх.',
    descEn: 'Cleans junk from Windows, shows what takes up disk space and improves game responsiveness.',
    file: 'https://github.com/fggtf24-cyber/yaytsechist/releases/latest/download/Yaytsechist.exe',
    size: '31 МБ',
    sizeEn: '31 MB',
    portable: true,
    repo: 'https://github.com/fggtf24-cyber/yaytsechist',
    features: [
      'Оптимизация для игр: свой план питания, таймер 0.5 мс, отключение Game DVR. Всё возвращается одной кнопкой',
      'Очистка диска: временные файлы, кэш обновлений, браузеров и лаунчеров, отчёты об ошибках, корзина',
      'Место на диске: схема из прямоугольников, папки по размеру, самые большие файлы, поиск, выгрузка в CSV',
      'Очистка памяти: вручную, по порогу загрузки или по расписанию',
      'Работа в фоне: значок в трее и запуск вместе с Windows',
      'Обновляется сама при запуске',
    ],
    needs: [
      'Windows 10 или 11, 64-бит',
      'Права администратора: программа попросит их при запуске',
      'Часть настроек оптимизации требует перезагрузки',
      'Очистка диска удаляет файлы навсегда, в корзину отправляет только вкладка «Место на диске»',
    ],
    featuresEn: [
      'Game optimization: custom power plan, 0.5 ms timer, Game DVR off. One button restores everything',
      'Disk cleanup: temp files, update, browser and launcher caches, error reports, recycle bin',
      'Disk space: treemap, folders by size, largest files, search, CSV export',
      'Memory cleanup: manual, by load threshold or on a schedule',
      'Background mode: tray icon and start with Windows',
      'Updates itself on launch',
    ],
    needsEn: [
      'Windows 10 or 11, 64-bit',
      'Administrator rights: the app asks for them on launch',
      'Some optimization settings need a restart',
      'Disk cleanup deletes files permanently, only the Disk space tab sends them to the recycle bin',
    ],
  },
];

// Стартовый список «Других проектов». Правки админов лежат в Firestore и накладываются поверх APPS и PROJECTS.
const PROJECTS = [
  {
    id: 'soundcloud',
    name: '52swag jams',
    desc: 'Наша музыка на SoundCloud.',
    descEn: 'Our music on SoundCloud.',
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
  'permission-denied': 'Нет прав на это действие. Для правок войдите через Google с почтой админа.',
};

const view = document.getElementById('view');
const search = document.getElementById('search');
const avatar = document.getElementById('avatar');
const toastEl = document.getElementById('toast');
const bellWrap = document.getElementById('bell-wrap');
const bell = document.getElementById('bell');
const bellCount = document.getElementById('bell-count');
const bellPanel = document.getElementById('bell-panel');

// Язык: сохранённый выбор, иначе язык браузера.
function savedLang() {
  try {
    const stored = localStorage.getItem('lang');
    if (stored === 'ru' || stored === 'en') return stored;
  } catch { /* приватный режим: просто не запомним */ }
  return navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
let lang = savedLang();

// Перевод интерфейса: ключ в словаре EN — сама русская строка.
const T = (text, vars = {}) => (lang === 'en' ? EN[text] ?? text : text).replace(/\{(\w+)\}/g, (_, k) => vars[k]);
// Перевод содержимого: поле descEn и другие, если заполнено, иначе русский текст.
const tr = (item, field) => (lang === 'en' && item[`${field}En`]?.length ? item[`${field}En`] : item[field]);
const nm = a => tr(a, 'name');

function applyStaticText() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
  document.querySelectorAll('[data-t-placeholder]').forEach(el => { el.placeholder = T(el.dataset.tPlaceholder); });
  document.querySelectorAll('[data-t-label]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.tLabel)); });
  const button = document.getElementById('lang');
  button.textContent = lang === 'ru' ? 'EN' : 'RU';
  button.setAttribute('aria-label', T(lang === 'ru' ? 'Переключить на английский' : 'Переключить на русский'));
  if (auth) auth.languageCode = lang;
  if (!user) avatar.textContent = initial();
}

function setLang(next) {
  lang = next;
  try { localStorage.setItem('lang', next); } catch { /* приватный режим */ }
  applyStaticText();
  drawBell();
  render();
}

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
let authors = {};   // uid админа -> { name }: публичные имена для поля «Автор»
let messages = [];  // личка админа
let stopMessages = null;
let notifications = [];
let stopNotifications = null;
let profile = {};  // users/<uid>: name, photo
let apps = APPS;
let projects = PROJECTS;

// Всё, что вводят в редакторе, попадает в разметку только через esc и safeUrl.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const safeUrl = u => (/^(https:\/\/|assets\/)/.test(u || '') ? esc(u) : '');
// Иконка: файл сайта, ссылка или картинка, загруженная в редакторе и сохранённая строкой.
const icon = a => (/^data:image\/(png|jpeg|webp);base64,/.test(a.icon || '') ? esc(a.icon) : safeUrl(a.icon)) || 'assets/favicon.svg';

/* ---------- Приложения ---------- */

const platform = () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" stroke-width="1.8" role="img" aria-label="${T('Для компьютера')}"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>`;
const download = (a, cls = 'btn') => `<a class="${cls} dl" data-id="${esc(a.id)}" href="${safeUrl(a.file)}" aria-label="${T('Скачать {name}', { name: esc(nm(a)) })}">${T('Скачать')}</a>`;
const siteLink = a => (safeUrl(a.site) ? `<a class="link" href="${safeUrl(a.site)}" target="_blank" rel="noopener">${T('Сайт')}</a>` : '');
const editLink = (kind, a) => (isAdmin ? `<a class="link" href="#edit/${kind}/${esc(a.id)}" aria-label="${T('Изменить {name}', { name: esc(nm(a)) })}">${T('Изменить')}</a>` : '');
const media = a => {
  const src = safeUrl(a.demo);
  if (!src) return '';
  return /\.(mp4|webm)(\?|$)/i.test(src)
    ? `<video src="${src}" autoplay muted loop playsinline aria-label="${T('{name} в работе', { name: esc(nm(a)) })}"></video>`
    : `<img src="${src}" alt="${T('{name} в работе', { name: esc(nm(a)) })}">`;
};
const authorName = a => authors[a.authorUid]?.name || '';
const authorLine = a => (authorName(a) ? `<p class="author">${T('Автор: {name}', { name: esc(authorName(a)) })}</p>` : '');

const card = a => `
  <article class="card">
    <div class="card-head">
      <img src="${icon(a)}" alt="">
      <h2><a href="#app/${esc(a.id)}">${esc(nm(a))}</a></h2>
      ${platform()}
    </div>
    ${authorLine(a)}
    <p>${esc(tr(a, 'desc'))}</p>
    <div class="card-foot">
      <a class="link" href="#app/${esc(a.id)}" aria-label="${T('Подробнее о {name}', { name: esc(nm(a)) })}">${T('Подробнее')}</a>
      ${siteLink(a)}
      ${editLink('apps', a)}
      ${download(a)}
    </div>
  </article>`;

// Ссылка на soundcloud.com в проекте сама превращается в плеер.
const soundcloud = p => (/^https:\/\/soundcloud\.com\//.test(p.url || '') ? `
  <iframe class="player" title="${T('Плеер: {name}', { name: esc(p.name) })}" allow="autoplay; encrypted-media"
    src="https://w.soundcloud.com/player/?url=${encodeURIComponent(p.url)}&color=%231473e6&show_comments=false&show_teaser=false&visual=true"></iframe>` : '');

const projectCard = p => `
  <article class="card${soundcloud(p) ? ' wide' : ''}">
    <div class="card-head"><h2>${esc(p.name)}</h2></div>
    <p>${esc(tr(p, 'desc'))}</p>
    ${soundcloud(p)}
    <div class="card-foot">
      ${editLink('projects', p)}
      <a class="btn open" href="${safeUrl(p.url)}" target="_blank" rel="noopener" aria-label="${T('Открыть {name}', { name: esc(p.name) })}">${T('Открыть')}</a>
    </div>
  </article>`;

const promo = () => `
  <article class="card promo">
    <svg width="28" height="28" aria-hidden="true"><use href="#logo"/></svg>
    <p>${T('Все программы бесплатные. Без подписки.')}</p>
    <div class="eggs" aria-hidden="true">
      ${['#6FA8FF', '#FFB347', '#A58BFF', '#FF6F91', '#FFFFFF', '#6BE3B4', '#5ED0F0', '#FF8A5B', '#FFC531']
        .map(c => `<i style="background:${c}"></i>`).join('')}
    </div>
  </article>`;

function renderApps() {
  const q = search.value.trim().toLowerCase();
  const found = a => !q || `${a.name} ${nm(a)} ${authorName(a)} ${tr(a, 'desc')}`.toLowerCase().includes(q);
  const onProjects = cat === PROJECTS_TAB;
  const list = (onProjects ? projects : apps).filter(found);
  const tabs = [['all', T('Все приложения')], [PROJECTS_TAB, T('Другие проекты')]];
  const add = onProjects ? ['projects', T('Добавить проект')] : ['apps', T('Добавить программу')];

  view.innerHTML = `
    <div class="tabs" role="group" aria-label="${T('Категории')}">
      ${tabs.map(([id, label]) => `<button type="button" data-cat="${esc(id)}" aria-pressed="${id === cat}">${esc(label)}</button>`).join('')}
      ${isAdmin ? `<a class="btn tabs-add" href="#edit/${add[0]}/new">${add[1]}</a>` : ''}
    </div>
    <section class="section">
      <h1>${T(onProjects ? 'Другие наши проекты' : 'Программы с яйцами')}</h1>
      ${list.length
        ? `<div class="grid">${!onProjects && !q ? promo() : ''}${list.map(onProjects ? projectCard : card).join('')}</div>`
        : `<p class="empty">${T('Ничего не нашлось.')}</p>`}
    </section>`;
}

function renderApp(a) {
  const list = items => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const demo = media(a);
  const features = tr(a, 'features') || [];
  const needs = tr(a, 'needs') || [];
  const size = tr(a, 'size');
  const isWindows = /Windows/.test(navigator.userAgent);
  view.innerHTML = `
    <div class="app-bar">
      <a class="app-back" href="#apps" aria-label="${T('Все приложения')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
      </a>
      <span>${esc(nm(a))}</span>
    </div>
    <div class="app-page">
      <aside class="app-side">
        <div class="app-title">
          <img src="${icon(a)}" alt="">
          <h1>${esc(nm(a))}</h1>
        </div>
        <div class="app-platform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>
          ${T('Настольные ПК')}
        </div>
        <p class="app-desc">${esc(tr(a, 'desc'))}</p>
        <ul class="app-meta">
          <li>${isWindows ? `<i class="ok">✓</i>${T('Работает на этом устройстве')}` : `<i>!</i>${T('Только для Windows')}`}</li>
          ${size ? `<li><i>↓</i>${T(a.portable ? '{size}, установка не нужна' : '{size} после установки', { size: esc(size) })}</li>` : ''}
          ${authorName(a) ? `<li><i>@</i>${T('Автор: {name}', { name: esc(authorName(a)) })}</li>` : ''}
        </ul>
        ${download(a, 'btn primary')}
        ${authorName(a) ? `<a class="btn report-link" href="#report/${esc(a.id)}">${T('Сообщить о баге или идее')}</a>` : ''}
        <div class="app-links">
          ${siteLink(a)}
          ${safeUrl(a.repo) ? `<a class="link" href="${safeUrl(a.repo)}" target="_blank" rel="noopener">GitHub</a>` : ''}
          ${editLink('apps', a)}
        </div>
      </aside>
      <div class="app-main">
        ${features.length ? `
          <h2>${T('Основное использование')}</h2>
          <div class="use">
            <div class="use-text">
              <p class="use-lead">${esc(features[0])}</p>
              ${list(features.slice(1))}
            </div>
            ${demo}
          </div>` : (demo ? `<div class="use">${demo}</div>` : '')}
        ${needs.length ? `<h2>${T('Что нужно')}</h2><div class="use"><div class="use-text">${list(needs)}</div></div>` : ''}
        <h2>${T('Комментарии')} <span id="comment-count"></span></h2>
        ${commentForm()}
        <p id="msg" class="msg" role="alert"></p>
        <div id="comment-list" data-app="${esc(a.id)}"><p class="empty">${T('Загрузка…')}</p></div>
      </div>
    </div>`;
  loadComments(a.id);
}

/* ---------- Комментарии ---------- */

const commentForm = () => (user ? `
  <form class="comment-form">
    <label class="sr" for="comment-text">${T('Комментарий')}</label>
    <textarea id="comment-text" name="text" rows="3" maxlength="1000" required placeholder="${T('Напишите комментарий')}"></textarea>
    <button class="btn primary">${T('Отправить')}</button>
  </form>` : `<p class="empty"><a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы оставить комментарий или лайк.')}</p>`);

const when = ts => ts?.toDate?.().toLocaleString(lang === 'en' ? 'en-GB' : 'ru-RU', { dateStyle: 'medium', timeStyle: 'short' }) || '';

// Имя, фото и текст пишут посетители: в разметку только через esc, картинка только https или data:image.
// rootId: ответы живут одной веткой под верхним комментарием, ответ на ответ идёт туда же.
const commentItem = (c, rootId = c.id) => {
  const likes = c.likedBy || [];
  const liked = !!user && likes.includes(user.uid);
  const photo = /^(https:\/\/|data:image\/)/.test(c.photo || '') ? esc(c.photo) : '';
  return `
    <article class="comment" id="c-${esc(c.id)}">
      <span class="avatar">${photo ? `<img src="${photo}" alt="" referrerpolicy="no-referrer">` : esc(String(c.name || 'П')[0])}</span>
      <div class="comment-body">
        <div class="comment-head"><b>${esc(c.name)}</b>${authors[c.uid] ? `<span class="tag admin">${T('Админ')}</span>` : ''}<span>${when(c.createdAt)}</span></div>
        <p>${esc(c.text)}</p>
        <div class="comment-actions">
          <button type="button" class="like" data-like="${esc(c.id)}" data-uid="${esc(c.uid)}" aria-pressed="${liked}" aria-label="${T('Нравится, сейчас {n}', { n: likes.length })}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.2-9.1C1.7 7.8 3.8 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3 0 5.1 2.8 4 5.9C19.5 15.4 12 20 12 20z"/></svg>
            ${likes.length}
          </button>
          <button type="button" class="link linkbtn" data-reply="${esc(rootId)}" data-target="${esc(c.id)}" data-uid="${esc(c.uid)}" data-name="${esc(c.name)}" data-nested="${rootId !== c.id}">${T('Ответить')}</button>
          ${user && (c.uid === user.uid || isAdmin) ? `<button type="button" class="link linkbtn" data-del-comment="${esc(c.id)}">${T('Удалить')}</button>` : ''}
        </div>
      </div>
    </article>`;
};

// ponytail: грузим все комментарии программы и сортируем в браузере, индекс не нужен.
// Когда их станут тысячи, понадобится составной индекс и подгрузка порциями.
async function loadComments(appId) {
  const box = () => {
    const el = document.getElementById('comment-list');
    return el?.dataset.app === appId ? el : null;
  };
  if (!fs) {
    if (authState === 'failed') box().innerHTML = `<p class="empty">${T('Комментарии сейчас недоступны.')}</p>`;
    return;
  }
  try {
    const snap = await fs.getDocs(fs.query(fs.collection(db, 'comments'), fs.where('appId', '==', appId)));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    if (!box()) return;
    // ponytail: у удалённого комментария ответы остаются в базе, но не показываются.
    const roots = list.filter(c => !c.parentId);
    const replies = id => list.filter(c => c.parentId === id).reverse();
    const shown = roots.reduce((n, c) => n + 1 + replies(c.id).length, 0);
    box().innerHTML = shown ? roots.map(c => {
      const thread = replies(c.id).map(r => commentItem(r, c.id)).join('');
      return commentItem(c) + (thread ? `<div class="replies">${thread}</div>` : '');
    }).join('') : `<p class="empty">${T('Пока никто не написал.')}</p>`;
    document.getElementById('comment-count').textContent = shown ? `(${shown})` : '';
    const target = document.getElementById(`c-${route().commentId}`);
    if (target) {
      target.scrollIntoView({ block: 'center' });
      target.classList.add('flash');
      history.replaceState(null, '', `#app/${appId}`); // иначе каждый лайк снова прокручивал бы сюда
    }
  } catch (e) {
    console.error(e);
    if (box()) box().innerHTML = `<p class="empty">${T('Комментарии сейчас недоступны.')}</p>`;
  }
}

function toggleReplyForm(button) {
  if (!user) { location.hash = 'account'; return; }
  const body = button.closest('.comment-body');
  const open = body.querySelector('.comment-form');
  if (open) { open.remove(); return; }
  const form = document.createElement('form');
  form.className = 'comment-form';
  form.dataset.parent = button.dataset.reply;
  form.dataset.target = button.dataset.target;
  form.dataset.uid = button.dataset.uid;
  form.innerHTML = `
    <textarea name="text" rows="2" maxlength="1000" required aria-label="${T('Ответ')}" placeholder="${T('Напишите ответ')}"></textarea>
    <button class="btn primary">${T('Ответить')}</button>`;
  body.append(form);
  const input = form.elements.text;
  if (button.dataset.nested === 'true') input.value = `${button.dataset.name}, `;
  input.focus();
}

async function addComment(form) {
  const text = form.elements.text.value.trim();
  if (!text) return;
  const appId = route().app.id;
  await fs.addDoc(fs.collection(db, 'comments'), {
    appId,
    uid: user.uid,
    name: myName(),
    photo: myPhoto(),
    text,
    createdAt: fs.serverTimestamp(),
    likedBy: [],
    ...(form.dataset.parent ? { parentId: form.dataset.parent } : {}),
  });
  if (form.dataset.parent) notify('reply', form.dataset.target, form.dataset.uid, appId, text);
  form.reset();
  await loadComments(appId);
}

// Имя и фото лежат в самом комментарии, чтобы читать его без лишних запросов.
// При входе и смене профиля обновляем их во всех своих комментариях.
async function syncMyComments() {
  const name = myName();
  const photo = myPhoto();
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'comments'), fs.where('uid', '==', user.uid)));
  // ponytail: в одной пачке Firestore до 500 записей, остальные обновятся при следующем входе.
  const stale = snap.docs.filter(d => d.data().name !== name || d.data().photo !== photo).slice(0, 500);
  if (!stale.length) return;
  const batch = fs.writeBatch(db);
  stale.forEach(d => batch.update(d.ref, { name, photo }));
  await batch.commit();
  const { app } = route();
  if (app) await loadComments(app.id);
}

/* ---------- Уведомления ---------- */

// Сервера нет: уведомление пишет браузер того, кто ответил или лайкнул. Правила проверяют, что оно настоящее.
// У лайка id постоянный, поэтому «снял и поставил снова» второго уведомления не даст: такую запись правила отклонят.
function notify(type, commentId, to, appId, text = '') {
  if (to === user.uid) return;
  const col = fs.collection(db, 'notifications');
  const ref = type === 'like' ? fs.doc(col, `like_${commentId}_${user.uid}`) : fs.doc(col);
  fs.setDoc(ref, {
    to,
    from: user.uid,
    fromName: myName(),
    type,
    appId,
    commentId,
    text: text.slice(0, 120),
    createdAt: fs.serverTimestamp(),
    read: false,
  }).catch(() => {}); // комментарий или лайк уже сохранён, без уведомления он не пострадает
}

function watchNotifications(u) {
  stopNotifications?.();
  stopNotifications = null;
  notifications = [];
  if (u) {
    // ponytail: тянем все уведомления человека и сортируем в браузере, индекс не нужен.
    stopNotifications = fs.onSnapshot(
      fs.query(fs.collection(db, 'notifications'), fs.where('to', '==', u.uid)),
      snap => {
        notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        drawBell();
      },
      console.error,
    );
  }
  drawBell();
}

// Лайки одного комментария сливаются в одну строку, как на YouTube. Список уже отсортирован: первым идёт самый новый.
function groupNotes(list) {
  const groups = new Map();
  for (const n of list) {
    const key = n.type === 'like' ? `like_${n.commentId}` : n.id;
    const group = groups.get(key);
    if (group) {
      group.people.push(n.fromName);
      group.read &&= n.read;
      group.text ||= n.text;
    } else {
      groups.set(key, { ...n, people: [n.fromName] });
    }
  }
  return [...groups.values()].slice(0, 30);
}

const likesWord = n => {
  if (lang === 'en') return n === 1 ? 'like' : 'likes';
  const tens = n % 100;
  const last = n % 10;
  if (tens > 10 && tens < 20) return 'лайков';
  if (last === 1) return 'лайк';
  return last > 1 && last < 5 ? 'лайка' : 'лайков';
};

const noteTitle = n => {
  const count = n.people.length;
  const names = n.people.slice(0, 2).map(p => `<b>${esc(p)}</b>`);
  if (count === 1) return T(n.type === 'like' ? 'Лайк от {name}' : 'Ответ от {name}', { name: names[0] });
  const [a, b] = names;
  const who = count === 2 ? T('{a} и {b}', { a, b }) : T('{a}, {b} и ещё {n}', { a, b, n: count - 2 });
  return `${who}: ${count} ${likesWord(count)}`;
};

// fromName и text пишут посетители: только через esc.
const noteItem = n => `
  <a class="note${n.read ? '' : ' unread'}" href="#app/${esc(n.appId)}/${esc(n.commentId)}">
    <span>${noteTitle(n)}</span>
    ${n.text ? `<span class="note-text">${esc(n.text)}</span>` : ''}
    <span class="note-time">${when(n.createdAt)}</span>
  </a>`;

function drawBell() {
  const groups = groupNotes(notifications);
  const unread = groups.filter(n => !n.read).length;
  bellWrap.hidden = !user;
  bellCount.hidden = !unread;
  bellCount.textContent = unread > 9 ? '9+' : unread;
  bell.setAttribute('aria-label', unread ? T('Уведомления, новых: {n}', { n: unread }) : T('Уведомления'));
  if (!bellPanel.hidden) {
    bellPanel.innerHTML = groups.map(noteItem).join('') || `<p class="empty">${T('Пока нет уведомлений.')}</p>`;
  }
}

function toggleBell(open) {
  bellPanel.hidden = !open;
  bell.setAttribute('aria-expanded', open);
  drawBell();
  if (!open) return;
  notifications.filter(n => !n.read).forEach(n => {
    fs.updateDoc(fs.doc(db, 'notifications', n.id), { read: true }).catch(console.error);
  });
}

/* ---------- Редактор (только админы) ---------- */

// [поле, подпись, тип, блок]; * в конце типа — обязательное. Поля с блоком прячутся в сворачиваемую секцию.
const FIELDS = {
  apps: [
    ['icon', 'Иконка', 'icon'],
    ['name', 'Название', 'text*'],
    ['authorUid', 'Автор (аккаунт админа)', 'author'],
    ['desc', 'Описание', 'area*'],
    ['file', 'Ссылка на .exe', 'url*'],
    ['size', 'Размер после установки, например 130 МБ', 'text'],
    ['features', 'Что умеет (один пункт на строку)', 'lines'],
    ['needs', 'Что нужно (один пункт на строку)', 'lines'],
    ['site', 'Сайт программы', 'url', 'Ссылки и демо'],
    ['repo', 'GitHub', 'url', 'Ссылки и демо'],
    ['demo', 'Ссылка на картинку, гифку или .mp4', 'url', 'Ссылки и демо'],
    ['nameEn', 'Название', 'text', 'Английская версия'],
    ['descEn', 'Описание', 'area', 'Английская версия'],
    ['sizeEn', 'Размер, например 130 MB', 'text', 'Английская версия'],
    ['featuresEn', 'Что умеет (один пункт на строку)', 'lines', 'Английская версия'],
    ['needsEn', 'Что нужно (один пункт на строку)', 'lines', 'Английская версия'],
  ],
  projects: [
    ['name', 'Название', 'text*'],
    ['desc', 'Описание', 'area'],
    ['url', 'Ссылка', 'url*'],
    ['descEn', 'Описание', 'area', 'Английская версия'],
  ],
};

function renderEditor(kind, id) {
  const note = text => { view.innerHTML = `<section class="section"><p class="empty">${text}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note(T('Загрузка…'));
  if (contentState === 'failed') return note(T('Не удалось загрузить данные. Обновите страницу.'));
  if (!isAdmin) return note(T('Редактировать могут только админы, вошедшие через Google.'));
  const item = id === 'new' ? {} : (kind === 'apps' ? apps : projects).find(x => x.id === id);
  if (!item) return note(T('Такой записи нет.'));

  const field = ([key, label, type]) => {
    const required = type.endsWith('*') ? 'required' : '';
    const t = type.replace('*', '');
    const value = Array.isArray(item[key]) ? item[key].join('\n') : item[key] ?? '';
    if (t === 'icon') {
      return `
        <div class="field">${T(label)}
          <div class="icon-pick">
            <img id="icon-preview" src="${icon(item)}" alt="">
            <label class="btn">${T('Загрузить с компьютера')}<input id="icon-file" class="sr" type="file" accept="image/*"></label>
          </div>
          <input type="hidden" name="${key}" value="${esc(value)}">
        </div>`;
    }
    const control = t === 'author' ? `
      <select name="${key}">
        <option value="">${T('Не указан')}</option>
        ${Object.entries(authors).map(([uid, a]) => `<option value="${esc(uid)}" ${uid === value ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}
      </select>`
      : t === 'area' || t === 'lines'
      ? `<textarea name="${key}" rows="${t === 'lines' ? 6 : 3}" ${required}>${esc(value)}</textarea>`
      : `<input name="${key}" value="${esc(value)}" ${required} ${t === 'url' ? `pattern="(https://|assets/).+" title="${T('Ссылка должна начинаться с https://')}"` : ''}>`;
    return `<label class="field">${T(label)}${control}</label>`;
  };
  view.innerHTML = `
    <section class="section account editor">
      <h1>${id === 'new' ? T('Новая запись') : T('Изменить: {name}', { name: esc(item.name) })}</h1>
      <form id="edit-form" class="account" data-kind="${kind}" data-id="${esc(id)}">
        ${FIELDS[kind].filter(f => !f[3]).map(field).join('')}
        ${[...new Set(FIELDS[kind].map(f => f[3]).filter(Boolean))].map(group => `
          <details class="more">
            <summary>${T(group)}</summary>
            <div class="more-body">${FIELDS[kind].filter(f => f[3] === group).map(field).join('')}</div>
          </details>`).join('')}
        <button class="btn primary">${T('Сохранить')}</button>
      </form>
      ${id === 'new' ? '' : `<button type="button" class="btn danger" id="delete">${T('Удалить')}</button>`}
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
  const [a, p, people] = await Promise.all(['apps', 'projects', 'authors'].map(c => fs.getDocs(fs.collection(db, c))));
  apps = merge(APPS, a);
  projects = merge(PROJECTS, p);
  people.forEach(d => { authors[d.id] = d.data(); });
  contentState = 'ready';
}

// Админ сам появляется в списке авторов при входе, а смена имени в профиле меняет подпись на всех его программах.
async function syncAuthor() {
  const name = (displayName() || 'Админ').slice(0, 80);
  await fs.setDoc(fs.doc(db, 'authors', user.uid), { name });
  authors[user.uid] = { name };
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
  } catch (e) {
    console.error(e); // правила не пускают: вход не через Google
    return false;
  }
}

/* ---------- Аккаунт ---------- */

function renderAccount() {
  if (authState !== 'ready') {
    view.innerHTML = `<section class="section"><h1>${T('Аккаунт')}</h1><p class="empty">${
      T(authState === 'loading' ? 'Загрузка…' : 'Сервис входа сейчас недоступен. Скачивать программы можно и без аккаунта.')}</p></section>`;
    return;
  }
  if (user) {
    view.innerHTML = `
      <section class="section account">
        <h1>${T('Профиль')}</h1>
        <div class="profile-head">
          <span class="avatar big" id="big-avatar"></span>
          <div class="profile-photo">
            <label class="btn">${T('Загрузить фото')}<input id="photo" class="sr" type="file" accept="image/*"></label>
            ${profile.photo ? `<button type="button" class="link linkbtn" id="photo-remove">${T('Убрать фото')}</button>` : ''}
          </div>
        </div>
        <form id="profile-form" class="account">
          <label class="field">${T('Имя')}<input name="name" maxlength="80" autocomplete="name"></label>
          <button class="btn primary">${T('Сохранить')}</button>
        </form>
        <p id="who" class="empty"></p>
        ${isAdmin ? `<p class="msg ok">${T('Вы админ: кнопки «Изменить» и «Добавить» есть в каталоге, цифры в разделе «Статистика».')}</p>` : ''}
        <p id="msg" class="msg" role="alert"></p>
        <button type="button" class="btn" id="logout">${T('Выйти')}</button>
      </section>`;
    view.querySelector('#who').textContent = user.email;
    view.querySelector('[name=name]').value = displayName();
    drawAvatar(view.querySelector('#big-avatar'));
    return;
  }
  const reg = authMode === 'register';
  view.innerHTML = `
    <section class="section account">
      <h1>${T(reg ? 'Создать аккаунт' : 'Вход')}</h1>
      <div class="tabs" role="group" aria-label="${T('Вход или регистрация')}">
        <button type="button" data-mode="login" aria-pressed="${!reg}">${T('Вход')}</button>
        <button type="button" data-mode="register" aria-pressed="${reg}">${T('Регистрация')}</button>
      </div>
      <button type="button" class="btn google" id="google">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M21 12.2h-9M20.6 12.2a8.8 8.8 0 1 1-2.6-6.3"/></svg>
        ${T('Продолжить с Google')}
      </button>
      <p class="or">${T('или')}</p>
      <form id="auth-form" class="account">
        <label class="field">${T('Почта')}
          <input name="email" type="email" required autocomplete="email">
        </label>
        <label class="field">${T('Пароль')}
          <input name="password" type="password" required minlength="6" autocomplete="${reg ? 'new-password' : 'current-password'}">
        </label>
        <button class="btn primary">${T(reg ? 'Создать аккаунт' : 'Войти')}</button>
      </form>
      ${reg ? '' : `<button type="button" class="link linkbtn" id="reset">${T('Забыли пароль?')}</button>`}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

const displayName = () => profile.name || user?.displayName || '';
const myName = () => (displayName() || 'Пользователь').slice(0, 80);
const myPhoto = () => profile.photo || user?.photoURL || '';

const initial = () => (displayName() || user?.email || '')[0] || (lang === 'en' ? 'Me' : 'Я');

function drawAvatar(el) {
  const src = profile.photo || user?.photoURL;
  el.textContent = src ? '' : initial();
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
  if (isAdmin) await syncAuthor();
  await syncMyComments();
  drawAvatar(avatar);
  renderAccount();
  say(T('Сохранено.'), true);
}

// Storage на бесплатном тарифе нет, поэтому картинки ужимаем в браузере и храним строкой в базе.
async function photoToDataUrl(file, size = 128, type = 'image/jpeg') {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  canvas.getContext('2d').drawImage(bitmap,
    (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  return canvas.toDataURL(type, 0.8);
}

/* ---------- Баги и идеи ---------- */

function renderReport(appId) {
  const note = html => { view.innerHTML = `<section class="section"><h1>${T('Сообщить о баге или идее')}</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note(T('Загрузка…'));
  if (!user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы написать автору программы.')}`);
  if (!apps.some(authorName)) return note(T('Пока ни у одной программы не указан автор.'));
  const option = a => (authorName(a)
    ? `<option value="${esc(a.id)}" ${a.id === appId ? 'selected' : ''}>${T('{name} (автор: {author})', { name: esc(nm(a)), author: esc(authorName(a)) })}</option>`
    : `<option disabled>${T('{name} (автор не указан)', { name: esc(nm(a)) })}</option>`);
  view.innerHTML = `
    <section class="section account editor">
      <h1>${T('Сообщить о баге или идее')}</h1>
      <form id="report-form" class="account">
        <label class="field">${T('Что это')}
          <select name="type"><option value="bug">${T('Баг')}</option><option value="idea">${T('Идея')}</option></select>
        </label>
        <label class="field">${T('Программа')}
          <select name="appId" required>${apps.map(option).join('')}</select>
        </label>
        <label class="field">${T('Сообщение')}
          <textarea name="text" rows="6" maxlength="2000" required></textarea>
        </label>
        <button class="btn primary">${T('Отправить автору')}</button>
      </form>
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

async function sendReport(form) {
  const { type, appId, text } = Object.fromEntries(new FormData(form));
  const app = apps.find(a => a.id === appId);
  if (!authorName(app) || !text.trim()) return;
  await fs.addDoc(fs.collection(db, 'messages'), {
    to: app.authorUid,
    from: user.uid,
    fromName: myName(),
    fromEmail: user.email || '',
    type,
    appId,
    appName: app.name.slice(0, 100),
    text: text.trim(),
    createdAt: fs.serverTimestamp(),
    read: false,
  });
  form.reset();
  say(T('Отправлено. Сообщение получит {name}.', { name: authorName(app) }), true);
}

function watchMessages(u) {
  stopMessages?.();
  stopMessages = null;
  messages = [];
  if (u) {
    stopMessages = fs.onSnapshot(
      fs.query(fs.collection(db, 'messages'), fs.where('to', '==', u.uid)),
      snap => {
        messages = snap.docs.map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        drawInboxCount();
        if (route().name === 'inbox') renderInbox();
      },
      console.error,
    );
  }
  drawInboxCount();
}

function drawInboxCount() {
  const unread = messages.filter(m => !m.read).length;
  const count = document.getElementById('inbox-count');
  count.hidden = !unread;
  count.textContent = unread > 9 ? '9+' : unread;
}

// Имя, почту и текст пишут посетители: только через esc.
const messageItem = m => `
  <article class="comment">
    <div class="comment-body">
      <div class="comment-head">
        <span class="tag ${m.type === 'idea' ? 'idea' : 'bug'}">${T(m.type === 'idea' ? 'Идея' : 'Баг')}</span>
        <a class="link" href="#app/${esc(m.appId)}">${esc(m.appName)}</a>
        <span>${when(m.createdAt)}</span>
      </div>
      <p>${esc(m.text)}</p>
      <div class="comment-head"><b>${esc(m.fromName)}</b><span>${esc(m.fromEmail)}</span></div>
      <div class="comment-actions"><button type="button" class="link linkbtn" data-del-message="${esc(m.id)}">${T('Удалить')}</button></div>
    </div>
  </article>`;

function renderInbox() {
  const note = text => { view.innerHTML = `<section class="section"><h1>${T('Сообщения')}</h1><p class="empty">${text}</p></section>`; };
  if (authState === 'loading') return note(T('Загрузка…'));
  if (!isAdmin) return note(T('Сообщения видят только админы, вошедшие через Google.'));
  view.innerHTML = `
    <section class="section inbox">
      <h1>${T('Сообщения')}</h1>
      ${messages.map(messageItem).join('') || `<p class="empty">${T('Пока ничего не пришло. Сюда попадают баги и идеи по программам, где автор вы.')}</p>`}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
  messages.filter(m => !m.read).forEach(m => {
    fs.updateDoc(fs.doc(db, 'messages', m.id), { read: true }).catch(console.error);
  });
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
  const note = text => { view.innerHTML = `<section class="section"><h1>${T('Статистика')}</h1><p class="empty">${text}</p></section>`; };
  if (authState === 'loading') return note(T('Загрузка…'));
  if (!isAdmin) return note(T('Статистику видят только админы, вошедшие через Google.'));
  note(T('Загрузка…'));
  let snap;
  try {
    snap = await fs.getDocs(fs.collection(db, 'stats'));
  } catch (e) {
    console.error(e);
    return note(T('Не удалось загрузить статистику.'));
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
  const periods = [[T('Сегодня'), today()], [T('7 дней'), since(7)], [T('30 дней'), since(30)], [T('Всё время'), '']];
  const line = (name, test) => `<tr><th scope="row">${esc(name)}</th>${periods.map(([, from]) => `<td>${sum(test, from)}</td>`).join('')}</tr>`;
  const ids = [...new Set([...apps.map(a => a.id), ...rows.filter(isDownload).map(r => r.app)])];
  const appName = id => { const a = apps.find(x => x.id === id); return a ? nm(a) : id; };
  const days = [...Array(14)].map((_, i) => since(i + 1));

  view.innerHTML = `
    <section class="section">
      <h1>${T('Статистика')}</h1>
      <div class="table-box"><table>
        <thead><tr><th></th>${periods.map(([label]) => `<th scope="col">${label}</th>`).join('')}</tr></thead>
        <tbody>
          ${line(T('Заходы'), isVisit)}
          ${line(T('Скачивания'), isDownload)}
          ${ids.map(id => line(`↓ ${appName(id)}`, r => r.app === id)).join('')}
        </tbody>
      </table></div>
      <h2 class="stats-sub">${T('По дням')}</h2>
      <div class="table-box"><table>
        <thead><tr><th scope="col">${T('День')}</th><th scope="col">${T('Заходы')}</th><th scope="col">${T('Скачивания')}</th></tr></thead>
        <tbody>${days.map(day => `<tr><th scope="row">${day}</th><td>${sum(r => isVisit(r) && r.day === day)}</td><td>${sum(r => isDownload(r) && r.day === day)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="empty">${T('Заход считается один раз за сеанс браузера. Скачивание считается по нажатию кнопки.')}</p>
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
    say(T(AUTH_ERRORS[e.code] || 'Не получилось. Попробуйте ещё раз.'));
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
    auth.languageCode = lang;
    countVisit();
    loadContent()
      .catch(e => { console.error(e); contentState = 'failed'; }) // каталог останется стартовым
      .then(render);
    fb.onAuthStateChanged(auth, async u => {
      [isAdmin, profile] = await Promise.all([checkAdmin(u), loadProfile(u)]);
      user = u;
      authState = 'ready';
      watchNotifications(u);
      watchMessages(isAdmin ? u : null);
      if (isAdmin) await syncAuthor().catch(console.error);
      if (u) syncMyComments().catch(console.error);
      drawAvatar(avatar);
      document.getElementById('rail-stats').hidden = !isAdmin;
      document.getElementById('rail-inbox').hidden = !isAdmin;
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
  if (['account', 'stats', 'inbox'].includes(name)) return { name };
  if (name === 'report') return { name, appId: a };
  if (name === 'edit' && FIELDS[a] && b) return { name, kind: a, id: b };
  const app = name === 'app' && apps.find(x => x.id === a);
  return app ? { name: 'app', app, commentId: b } : { name: 'apps' };
}

function render() {
  const r = route();
  if (r.name === 'account') renderAccount();
  else if (r.name === 'stats') renderStats();
  else if (r.name === 'inbox') renderInbox();
  else if (r.name === 'report') renderReport(r.appId);
  else if (r.name === 'edit') renderEditor(r.kind, r.id);
  else if (r.name === 'app') renderApp(r.app);
  else renderApps();
  document.querySelectorAll('.rail a').forEach(a => {
    if (a.dataset.route === (['account', 'stats', 'inbox', 'report'].includes(r.name) ? r.name : 'apps')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = r.app ? `${nm(r.app)} — ${T('Яйца Клауд')}` : T('Яйца Клауд — все приложения');
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
    toast(T('Скачивание началось. Если Windows покажет SmartScreen: «Подробнее», затем «Выполнить в любом случае».'));
  }
  else if (t.dataset.like) {
    if (!user) { location.hash = 'account'; return; }
    const adding = t.getAttribute('aria-pressed') !== 'true';
    const commentText = t.closest('.comment-body').querySelector('p').textContent;
    const appId = route().app.id;
    attempt(async () => {
      await fs.updateDoc(fs.doc(db, 'comments', t.dataset.like), {
        likedBy: (adding ? fs.arrayUnion : fs.arrayRemove)(user.uid),
      });
      if (adding) notify('like', t.dataset.like, t.dataset.uid, appId, commentText);
      await loadComments(appId);
    });
  }
  else if (t.dataset.reply) toggleReplyForm(t);
  else if (t.dataset.delMessage) {
    if (!confirm(T('Удалить сообщение?'))) return;
    attempt(() => fs.deleteDoc(fs.doc(db, 'messages', t.dataset.delMessage)));
  }
  else if (t.dataset.delComment) {
    if (!confirm(T('Удалить комментарий?'))) return;
    attempt(async () => {
      await fs.deleteDoc(fs.doc(db, 'comments', t.dataset.delComment));
      await loadComments(route().app.id);
    });
  }
  else if (t.id === 'delete') {
    if (!confirm(T('Удалить запись с сайта?'))) return;
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
    if (!email) return say(T('Введите почту, и мы пришлём ссылку для сброса пароля.'));
    attempt(async () => {
      await fb.sendPasswordResetEmail(auth, email);
      say(T('Если такой аккаунт есть, письмо уже в пути. Проверьте почту.'), true);
    });
  }
});

view.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'edit-form') return attempt(() => saveItem(e.target));
  if (e.target.id === 'report-form') return attempt(() => sendReport(e.target));
  if (e.target.classList.contains('comment-form')) return attempt(() => addComment(e.target));
  if (e.target.id === 'profile-form') {
    return attempt(() => saveProfile({ name: e.target.elements.name.value.trim() }));
  }
  const { email, password } = Object.fromEntries(new FormData(e.target));
  const go = authMode === 'register' ? fb.createUserWithEmailAndPassword : fb.signInWithEmailAndPassword;
  attempt(() => go(auth, email.trim(), password));
});

document.getElementById('lang').addEventListener('click', () => setLang(lang === 'ru' ? 'en' : 'ru'));
bell.addEventListener('click', () => toggleBell(bellPanel.hidden));
bellPanel.addEventListener('click', e => { if (e.target.closest('a')) toggleBell(false); });
document.addEventListener('click', e => { if (!bellPanel.hidden && !bellWrap.contains(e.target)) toggleBell(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !bellPanel.hidden) toggleBell(false); });

view.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (e.target.id === 'icon-file' && file) {
    photoToDataUrl(file, 192, 'image/png') // PNG, чтобы не терять прозрачность
      .then(url => {
        view.querySelector('[name=icon]').value = url;
        view.querySelector('#icon-preview').src = url;
        say('');
      })
      .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
    return;
  }
  if (e.target.id !== 'photo' || !file) return;
  photoToDataUrl(file)
    .then(photo => attempt(() => saveProfile({ photo })))
    .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
});

search.addEventListener('input', () => {
  if (route().name === 'apps') renderApps();
  else location.hash = 'apps';
});

addEventListener('hashchange', () => { render(); scrollTo(0, 0); });

applyStaticText();
render();
initFirebase();
