import { EN, TERMS } from './i18n.js?v=36';
import { setupSocial, cropImage, askDialog } from './social.js?v=23';

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
  {
    id: 'fig2ae',
    name: 'Fig2AE',
    icon: 'assets/fig2ae.png',
    desc: 'Переносит макеты из Figma в After Effects одной кнопкой: фигуры, текст, градиенты и эффекты остаются редактируемыми.',
    descEn: 'Moves Figma designs into After Effects with one button: shapes, text, gradients and effects stay editable.',
    file: 'https://github.com/fggtf24-cyber/fig2ae/raw/main/Fig2AE-Setup.exe',
    size: '180 КБ',
    sizeEn: '180 KB',
    repo: 'https://github.com/fggtf24-cyber/fig2ae',
    features: [
      'Выделили фрейм в Figma, нажали «Send selection to Ae» — композиция появляется в открытом проекте After Effects',
      'Новая композиция или прямо в текущую, с позиции курсора на таймлайне, как в AEUX',
      'Фигуры, живой текст, градиенты, тени, блюры и маски переносятся редактируемыми. Что не переносится один в один, плагин показывает списком',
      'Прямоугольники и эллипсы можно получать параметрическими фигурами AE',
      'Группы — прекомпами или null-слоями. Кнопки Precomp, Un-Precomp и удаление null-слоёв групп',
      'Референсный кадр из Figma поверх, чтобы сверить результат',
      'Кнопка Log: журнал ошибок копируется одним нажатием',
      'Обновляется сама, без переустановки и перезапуска After Effects',
    ],
    needs: [
      'Windows 10 или 11 (macOS — установка через Node.js)',
      'After Effects 2022 или новее',
      'Figma desktop: плагин подключается через Plugins → Development → Import plugin from manifest',
      'Установка: запустите Fig2AE-Setup.exe и нажмите «Установить»',
      'Права администратора не нужны',
    ],
    featuresEn: [
      'Select a frame in Figma, press "Send selection to Ae" — the comp appears in the open After Effects project',
      'New comp or straight into the current one, at the playhead, like AEUX',
      'Shapes, live text, gradients, shadows, blurs and masks stay editable. Anything not transferred 1:1 is listed by the plugin',
      'Rectangles and ellipses can come in as AE parametric shapes',
      'Groups as precomps or null layers. Precomp, Un-Precomp and delete-group-nulls buttons',
      'Figma reference frame on top to compare the result',
      'Log button: the error log is copied in one click',
      'Updates itself, no reinstall and no After Effects restart',
    ],
    needsEn: [
      'Windows 10 or 11 (macOS: install with Node.js)',
      'After Effects 2022 or newer',
      'Figma desktop: the plugin is added via Plugins → Development → Import plugin from manifest',
      'Setup: run Fig2AE-Setup.exe and click Install',
      'No administrator rights needed',
    ],
  },
  {
    id: 'yaytsa-timer',
    name: 'Яйца Таймер',
    nameEn: 'Yaytsa Timer',
    icon: 'assets/yaytsa-timer.png',
    desc: 'Помодоро-таймер с учётом рабочих часов. Свои интервалы работы и перерыва, статистика по дням и напоминание поверх всех окон.',
    descEn: 'A pomodoro timer that tracks your work hours. Custom focus and break lengths, daily stats and a reminder on top of every window.',
    file: 'https://github.com/brlk33/Yaytsa-Timer/raw/main/YaytsaTimer-Setup.exe',
    size: '3 МБ',
    sizeEn: '3 MB',
    repo: 'https://github.com/brlk33/Yaytsa-Timer',
    features: [
      'Свои интервалы: по умолчанию 25/5, работа и перерыв меняются с шагом 5 минут',
      'Учёт часов: каждый заход записывается вместе с задачей, над которой вы работали',
      'Статистика: сегодня, 7 и 30 дней, график по дням, цель на день, выгрузка в CSV',
      'Напоминание справа снизу поверх любых окон и видео во весь экран. Не исчезает, пока не нажмёте',
      'Работа в фоне: значок в трее, крестик прячет окно, таймер идёт дальше',
      'Кнопка «Тест 5 сек», чтобы проверить звук и напоминание',
      'Интерфейс в стиле Notion, тёмная и светлая тема, русский и английский',
      'Обновляется сама при запуске',
    ],
    needs: [
      'Windows 10 или 11, 64-бит',
      'Около 3 МБ на диске',
      'Работает на встроенном в Windows движке Edge (WebView2), он есть в Windows 10 и 11',
      'Права администратора не нужны',
    ],
    featuresEn: [
      'Custom intervals: 25/5 by default, focus and break change in 5-minute steps',
      'Hour tracking: every session is saved with the task you worked on',
      'Stats: today, 7 and 30 days, daily chart, daily goal, CSV export',
      'A bottom-right reminder on top of any window and fullscreen video. It stays until you click it',
      'Runs in the background: tray icon, the close button hides the window and the timer keeps going',
      'A "Test 5 sec" button to check the sound and the reminder',
      'Notion-style interface, dark and light theme, Russian and English',
      'Updates itself on launch',
    ],
    needsEn: [
      'Windows 10 or 11, 64-bit',
      'About 3 MB of disk space',
      'Runs on the Edge engine built into Windows (WebView2), included in Windows 10 and 11',
      'No administrator rights needed',
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
  'username/invalid': 'Имя пользователя: 1–20 символов, латиница, цифры и _.',
  'username/unknown': 'Такого @имени нет. Проверьте соавторов.',
  'link/invalid': 'Такую ссылку сайт не знает. Проверьте её или посмотрите список соцсетей.',
  'link/duplicate': 'Две ссылки на одну соцсеть. Оставьте одну.',
  'username/taken': 'Это имя уже занято. Попробуйте другое.',
};

const view = document.getElementById('view');
const search = document.getElementById('search');
const avatar = document.getElementById('avatar');
const toastEl = document.getElementById('toast');
const bellWrap = document.getElementById('bell-wrap');
const bell = document.getElementById('bell');
const bellCount = document.getElementById('bell-count');
const bellPanel = document.getElementById('bell-panel');
const meMenu = document.getElementById('me-menu');
const cookieBar = document.getElementById('cookie');

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
  drawThemeButton();
  if (auth) auth.languageCode = lang;
  if (!user) avatar.textContent = initial();
}

const isLight = () => document.documentElement.dataset.theme === 'light';

function drawThemeButton() {
  const label = T(isLight() ? 'Тёмная тема' : 'Светлая тема');
  const button = document.getElementById('theme');
  button.setAttribute('aria-label', label);
  button.title = label;
}

function toggleTheme() {
  const next = isLight() ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch { /* приватный режим */ }
  drawThemeButton();
}

function setLang(next) {
  lang = next;
  try { localStorage.setItem('lang', next); } catch { /* приватный режим */ }
  applyStaticText();
  drawBell();
  render();
}

const PROJECTS_TAB = 'projects';
const COMMUNITY_TAB = 'community';
let cat = 'all';
let authMode = 'login';
let fb = null;          // модуль firebase-auth
let fs = null;          // модуль firebase-firestore
let auth = null;
let db = null;
let user = null;
let realAdmin = false; // почта есть в admins
let isAdmin = false;   // админские кнопки на экране: админ может смотреть сайт глазами обычного пользователя
let authState = 'loading';    // loading | ready | failed
let contentState = 'loading'; // loading | ready | failed
let authors = {};   // uid админа -> { name }: публичные имена для поля «Автор»
let messages = [];  // личка: полученные и отправленные
let replies = [];   // ответы в личке
let stopMessages = [];
let notifications = [];
let stopNotifications = [];
let broadcasts = []; // посты с @everyone
let profile = {};  // users/<uid>: name, photo
let apps = APPS;
let projects = PROJECTS;

// Всё, что вводят в редакторе, попадает в разметку только через esc и safeUrl.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const safeUrl = u => (/^(https:\/\/|assets\/)/.test(u || '') ? esc(u) : '');
// Иконка: файл сайта, ссылка или картинка, загруженная в редакторе и сохранённая строкой.
const icon = a => (/^data:image\/(png|jpeg|webp);base64,/.test(a.icon || '') ? esc(a.icon) : safeUrl(a.icon)) || 'assets/favicon.svg';

// Профили, посты, подписки и чаты живут в social.js. Модулю отдаём доступ к общему состоянию через геттеры.
const social = setupSocial({
  T, esc, view, nm, icon,
  get fs() { return fs; },
  get db() { return db; },
  get user() { return user; },
  get isAdmin() { return isAdmin; },
  get lang() { return lang; },
  get apps() { return apps; },
  get authState() { return authState; },
  route: () => route(),
  render: () => render(),
  toast: text => toast(text),
  notify: (...args) => notify(...args),
  drawInboxCount: () => drawInboxCount(),
  drawRail: () => drawRail(),
});

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
// authorUid получает баги и идеи, coauthors только подписаны на карточке.
const authorName = a => authors[a.authorUid]?.name || social.nameOf(a.authorUid);
const authorUids = a => [...new Set([a.authorUid, ...(a.coauthors || [])].filter(Boolean))];
const authorLink = uid => {
  const handle = social.handleOf(uid);
  return handle ? `<a class="link" href="#u/${esc(handle)}">@${esc(handle)}</a>` : esc(authors[uid]?.name || '');
};
const authorText = a => {
  const links = authorUids(a).map(authorLink).filter(Boolean);
  return links.length ? T(links.length > 1 ? 'Авторы: {name}' : 'Автор: {name}', { name: links.join(', ') }) : '';
};
const authorLine = a => (authorText(a) ? `<p class="author">${authorText(a)}</p>` : '');

const card = a => `
  <article class="card">
    <div class="card-head">
      <img src="${icon(a)}" alt="">
      <h2><a href="#app/${esc(a.id)}">${esc(nm(a))}</a></h2>
      ${a.community ? `<span class="tag">${T('Сообщество')}</span>` : ''}
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
  const onCommunity = cat === COMMUNITY_TAB;
  const list = (onProjects ? projects : apps.filter(a => !!a.community === onCommunity)).filter(found);
  const tabs = [['all', T('Все приложения')], [COMMUNITY_TAB, T('Сообщество')], [PROJECTS_TAB, T('Другие проекты')]];
  // В «Сообществе» программу предлагает любой, в остальных вкладках запись сразу добавляет админ.
  const add = onCommunity ? `<a class="btn tabs-add" href="#publish">${T('Добавить программу')}</a>`
    : !isAdmin ? ''
    : `<a class="btn tabs-add" href="#edit/${onProjects ? 'projects' : 'apps'}/new">${T(onProjects ? 'Добавить проект' : 'Добавить программу')}</a>`;

  view.innerHTML = `
    <div class="tabs" role="group" aria-label="${T('Категории')}">
      ${tabs.map(([id, label]) => `<button type="button" data-cat="${esc(id)}" aria-pressed="${id === cat}">${esc(label)}</button>`).join('')}
      ${add}
    </div>
    <section class="section">
      <h1>${T(onProjects ? 'Другие наши проекты' : onCommunity ? 'Программы сообщества' : 'Программы с яйцами')}</h1>
      ${list.length
        ? `<div class="grid">${cat === 'all' && !q ? promo() : ''}${list.map(onProjects ? projectCard : card).join('')}</div>`
        : `<p class="empty">${T(onCommunity && !q ? 'Здесь появятся программы участников. Предложите свою первым!' : 'Ничего не нашлось.')}</p>`}
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
          ${authorText(a) ? `<li><i>@</i><span>${authorText(a)}</span></li>` : ''}
          ${a.community ? `<li><i>!</i>${T('Программу добавил участник. Админ проверил заявку, но файл вы скачиваете на свой риск.')}</li>` : ''}
        </ul>
        ${a.community ? `<figure id="author-selfie" class="author-selfie" data-app="${esc(a.id)}" hidden></figure>` : ''}
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
        ${needs.length ? `<h2>${T('Системные требования')}</h2><div class="use"><div class="use-text">${list(needs)}</div></div>` : ''}
        <h2>${T('Обсуждения')}</h2>
        <div id="app-threads" class="app-threads" data-app="${esc(a.id)}"><p class="empty">${T('Загрузка…')}</p></div>
        <p id="msg" class="msg" role="alert"></p>
      </div>
    </div>`;
  social.fillAppThreads(a.id);
  if (a.community) loadAuthorSelfie(a.id);
}

// Селфи лежит отдельным документом: каталог грузится без него, а удалённая заявка уносит и селфи.
async function loadAuthorSelfie(id) {
  if (!fs) return;
  const image = (await fs.getDoc(fs.doc(db, 'selfies', id)).catch(() => null))?.data()?.image;
  const box = document.getElementById('author-selfie');
  if (box?.dataset.app !== id || !social.isImage(image)) return;
  box.innerHTML = `<img src="${image}" alt="${T('Селфи автора')}"><figcaption>${T('Селфи автора')}</figcaption>`;
  box.hidden = false;
}

const when = ts => ts?.toDate?.().toLocaleString(lang === 'en' ? 'en-GB' : 'ru-RU', { dateStyle: 'medium', timeStyle: 'short' }) || '';

/* ---------- Звук ---------- */

// Браузер разрешает звук только после первого нажатия на странице, поэтому заводим его на этот момент.
let audio = null;
addEventListener('pointerdown', () => {
  audio ||= new AudioContext();
  audio.resume();
});

function soundOn() {
  try { return !localStorage.getItem('muted'); } catch { return true; }
}

// Две мягкие ноты вверх. Файл не нужен: звук собирается здесь же.
function ping() {
  if (!audio || !soundOn()) return;
  [[880, 0], [1175, 0.11]].forEach(([freq, delay]) => {
    const start = audio.currentTime + delay;
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.frequency.value = freq;
    volume.gain.setValueAtTime(0, start);
    volume.gain.linearRampToValueAtTime(0.08, start + 0.015);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
    tone.connect(volume).connect(audio.destination);
    tone.start(start);
    tone.stop(start + 0.24);
  });
}

// Звучим, только когда непрочитанных стало больше. Первые секунды после входа молчим:
// в это время подгружаются старые уведомления, и они не новые.
const heard = { bell: 0, inbox: 0 };
let quietUntil = 0;
function soundOnGrowth(kind, count) {
  if (count > heard[kind] && Date.now() > quietUntil) ping();
  heard[kind] = count;
}

/* ---------- Уведомления ---------- */

// Сервера нет: уведомление пишет браузер того, кто ответил или лайкнул. Правила проверяют, что оно настоящее.
// У лайка id постоянный, поэтому «снял и поставил снова» второго уведомления не даст: такую запись правила отклонят.
function notify(type, commentId, to, appId, text = '') {
  if (to === user.uid) return;
  const col = fs.collection(db, 'notifications');
  const ref = type === 'like' ? fs.doc(col, `like_${commentId}_${user.uid}`)
    : type === 'follow' ? fs.doc(col, `follow_${user.uid}_${to}`)
    : fs.doc(col);
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
  stopNotifications.forEach(stop => stop());
  stopNotifications = [];
  notifications = [];
  broadcasts = [];
  if (u) {
    // ponytail: тянем все уведомления человека и сортируем в браузере, индекс не нужен.
    stopNotifications = [
      fs.onSnapshot(
        fs.query(fs.collection(db, 'notifications'), fs.where('to', '==', u.uid)),
        snap => {
          notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          drawBell();
          drawInboxCount();
        },
        console.error,
      ),
      fs.onSnapshot(
        fs.query(fs.collection(db, 'broadcasts'), fs.orderBy('createdAt', 'desc'), fs.limit(10)),
        snap => {
          broadcasts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          drawBell();
        },
        console.error,
      ),
    ];
  }
  drawBell();
}

// @everyone: один документ на всех, поэтому прочитанность каждый браузер помнит сам.
// ponytail: на другом устройстве такой пост снова будет новым. Для общей отметки её надо хранить в users/<uid>.
function seenBroadcasts() {
  try { return +localStorage.getItem('seenBroadcasts') || 0; } catch { return 0; }
}

function allNotes() {
  const joined = Date.parse(user?.metadata.creationTime) || 0;
  const seen = seenBroadcasts();
  const everyone = broadcasts
    .filter(b => b.from !== user?.uid && (b.createdAt?.toMillis() || Date.now()) >= joined)
    .map(b => ({
      id: `b_${b.id}`, type: 'everyone', fromName: b.fromName, appId: b.id, commentId: b.id, text: b.title,
      createdAt: b.createdAt, read: (b.createdAt?.toMillis() || 0) <= seen,
    }));
  // Сообщения считает красный значок у «Сообщений», в колокольчике их нет.
  return [...notifications.filter(n => n.type !== 'dm'), ...everyone].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
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
  const single = {
    like: 'Лайк от {name}',
    follow: '{name} подписался(-ась) на вас',
    everyone: '{name} отметил(а) всех в посте',
    mod: n.appId ? 'Админ одобрил вашу программу' : 'Админ отклонил вашу программу',
  }[n.type] || 'Ответ от {name}';
  if (count === 1) return T(single, { name: names[0] });
  const [a, b] = names;
  const who = count === 2 ? T('{a} и {b}', { a, b }) : T('{a}, {b} и ещё {n}', { a, b, n: count - 2 });
  return `${who}: ${count} ${likesWord(count)}`;
};

// fromName и text пишут посетители: только через esc.
const noteHref = n => ({
  follow: `#uid/${esc(n.from)}`,
  treply: `#post/${esc(n.appId)}/${esc(n.commentId)}`,
  everyone: `#post/${esc(n.appId)}`,
  mod: n.appId ? `#app/${esc(n.appId)}` : '#publish',
}[n.type] || `#app/${esc(n.appId)}/${esc(n.commentId)}`);

const noteItem = n => `
  <a class="note${n.read ? '' : ' unread'}" href="${noteHref(n)}">
    <span>${noteTitle(n)}</span>
    ${n.text ? `<span class="note-text">${esc(n.text)}</span>` : ''}
    <span class="note-time">${when(n.createdAt)}</span>
  </a>`;

function drawBell() {
  const groups = groupNotes(allNotes());
  const unread = groups.filter(n => !n.read).length;
  bellWrap.hidden = !user;
  bellCount.hidden = !unread;
  bellCount.textContent = unread > 9 ? '9+' : unread;
  soundOnGrowth('bell', unread);
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
  notifications.filter(n => !n.read && n.type !== 'dm').forEach(n => {
    fs.updateDoc(fs.doc(db, 'notifications', n.id), { read: true }).catch(console.error);
  });
  try { localStorage.setItem('seenBroadcasts', Date.now()); } catch { /* приватный режим */ }
}

/* ---------- Редактор (только админы) ---------- */

// [поле, подпись, тип, блок]; * в конце типа — обязательное. Поля с блоком прячутся в сворачиваемую секцию.
const FIELDS = {
  apps: [
    ['icon', 'Иконка', 'icon'],
    ['name', 'Название', 'text*'],
    ['authorUid', 'Автор (аккаунт админа)', 'author'],
    ['coauthors', 'Соавторы', 'people'],
    ['desc', 'Описание', 'area*'],
    ['file', 'Ссылка на .exe', 'url*'],
    ['size', 'Размер после установки, например 130 МБ', 'text'],
    ['features', 'Что умеет (один пункт на строку)', 'lines'],
    ['needs', 'Системные требования (один пункт на строку)', 'lines'],
    ['site', 'Сайт программы', 'url', 'Ссылки и демо'],
    ['repo', 'GitHub', 'url', 'Ссылки и демо'],
    ['demo', 'Ссылка на картинку, гифку или .mp4', 'url', 'Ссылки и демо'],
    ['nameEn', 'Название', 'text', 'Английская версия'],
    ['descEn', 'Описание', 'area', 'Английская версия'],
    ['sizeEn', 'Размер, например 130 MB', 'text', 'Английская версия'],
    ['featuresEn', 'Что умеет (один пункт на строку)', 'lines', 'Английская версия'],
    ['needsEn', 'Системные требования (один пункт на строку)', 'lines', 'Английская версия'],
  ],
  projects: [
    ['name', 'Название', 'text*'],
    ['desc', 'Описание', 'area'],
    ['url', 'Ссылка', 'url*'],
    ['descEn', 'Описание', 'area', 'Английская версия'],
  ],
};

// Поле формы по описанию из FIELDS. Им же собрана заявка на программу.
const field = item => ([key, label, type]) => {
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
  if (t === 'people') {
    const names = (item[key] || []).map(social.handleOf).filter(Boolean).map(h => `@${h}`).join(' ');
    return `
      <label class="field">${T(label)}
        <input name="${key}" value="${esc(names)}" autocomplete="off" data-suggest="@" placeholder="@neba @drug">
        <small class="r-hint">${T('Через пробел, начните с @ и выберите человека из списка.')}</small>
      </label>`;
  }
  // Автор заявки из сообщества не в списке админов, но терять его при сохранении нельзя.
  const outsider = value && !authors[value] ? `<option value="${esc(value)}" selected>${esc(social.nameOf(value) || value)}</option>` : '';
  const control = t === 'author' ? `
    <select name="${key}">
      <option value="">${T('Не указан')}</option>
      ${outsider}
      ${Object.entries(authors).map(([uid, a]) => `<option value="${esc(uid)}" ${uid === value ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}
    </select>`
    : t === 'area' || t === 'lines'
    ? `<textarea name="${key}" rows="${t === 'lines' ? 6 : 3}" ${required}>${esc(value)}</textarea>`
    : `<input name="${key}" value="${esc(value)}" ${required} ${t === 'url' ? `pattern="(https://|assets/).+" title="${T('Ссылка должна начинаться с https://')}"` : ''}>`;
  return `<label class="field">${T(label)}${control}</label>`;
};

function renderEditor(kind, id) {
  const note = text => { view.innerHTML = `<section class="section panel"><p class="empty">${text}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note(T('Загрузка…'));
  if (contentState === 'failed') return note(T('Не удалось загрузить данные. Обновите страницу.'));
  if (!isAdmin) return note(T('Редактировать могут только админы, вошедшие через Google.'));
  const item = id === 'new' ? {} : (kind === 'apps' ? apps : projects).find(x => x.id === id);
  if (!item) return note(T('Такой записи нет.'));
  view.innerHTML = `
    <section class="section panel account editor">
      <h1>${id === 'new' ? T('Новая запись') : T('Изменить: {name}', { name: esc(item.name) })}</h1>
      <form id="edit-form" class="account" data-kind="${kind}" data-id="${esc(id)}">
        ${FIELDS[kind].filter(f => !f[3]).map(field(item)).join('')}
        ${[...new Set(FIELDS[kind].map(f => f[3]).filter(Boolean))].map(group => `
          <details class="more">
            <summary>${T(group)}</summary>
            <div class="more-body">${FIELDS[kind].filter(f => f[3] === group).map(field(item)).join('')}</div>
          </details>`).join('')}
        <button class="btn primary">${T('Сохранить')}</button>
      </form>
      ${id === 'new' ? '' : `<button type="button" class="btn danger" id="delete">${T('Удалить')}</button>`}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

// Значения формы в том виде, в каком они лягут в базу.
async function readFields(form, fields) {
  const data = Object.fromEntries(new FormData(form));
  for (const [key, , type] of fields) {
    data[key] = type === 'lines' ? data[key].split('\n').map(l => l.trim()).filter(Boolean)
      : type === 'people' ? await social.uidsByNames(data[key])
      : data[key].trim();
  }
  return data;
}

async function saveItem(form) {
  const { kind, id } = form.dataset;
  const data = await readFields(form, FIELDS[kind]);
  // Для записей из кода (APPS/PROJECTS) в Firestore пишем только то, что отличается от кода.
  // Иначе первое же сохранение замораживает все поля, и следующие правки в коде (новая ссылка, размер) не видны на сайте.
  const base = id === 'new' ? null : (kind === 'apps' ? APPS : PROJECTS).find(x => x.id === id);
  const norm = v => (v == null || v === '' || (Array.isArray(v) && !v.length)) ? '' : v;
  if (base) for (const key of Object.keys(data)) {
    if (JSON.stringify(norm(data[key])) === JSON.stringify(norm(base[key]))) data[key] = fs.deleteField();
  }
  const col = fs.collection(db, kind);
  const ref = id === 'new' ? fs.doc(col) : fs.doc(col, id);
  await fs.setDoc(ref, data, { merge: true });
  await loadContent();
  location.hash = kind === 'apps' ? `app/${ref.id}` : 'apps';
}

/* ---------- Заявка на программу ---------- */

const PUBLISH_FIELDS = ['icon', 'name', 'coauthors', 'desc', 'file', 'size', 'features', 'needs', 'site', 'repo', 'demo']
  .map(key => FIELDS.apps.find(f => f[0] === key));

const STATUS = {
  pending: ['На проверке', 'idea'],
  approved: ['Одобрена', 'ok'],
  rejected: ['Отклонена', 'bug'],
};
const statusTag = s => `<span class="tag ${STATUS[s.status][1]}">${T(STATUS[s.status][0])}</span>`;

function renderPublish() {
  const note = html => { view.innerHTML = `<section class="section panel"><h1>${T('Добавить программу')}</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading') return note(T('Загрузка…'));
  if (authState === 'failed') return note(T('Сервис сейчас недоступен. Обновите страницу позже.'));
  if (!user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы предложить программу.')}`);
  if (!social.hasProfile()) return note(`${T('Сначала выберите @имя.')} <a class="link" href="#account">${T('Открыть профиль')}</a>`);
  view.innerHTML = `
    <section class="section panel account editor">
      <h1>${T('Добавить программу')}</h1>
      <p class="empty">${T('Заявка уйдёт админам на проверку. После одобрения программа появится во вкладке «Сообщество».')}</p>
      <form id="publish-form" class="account">
        ${PUBLISH_FIELDS.filter(f => !f[3]).map(field({})).join('')}
        <details class="more">
          <summary>${T('Ссылки и демо')}</summary>
          <div class="more-body">${PUBLISH_FIELDS.filter(f => f[3]).map(field({})).join('')}</div>
        </details>
        <div class="field">${T('Ваше селфи (обязательно)')}
          <div class="icon-pick">
            <img id="selfie-preview" src="assets/favicon.svg" alt="">
            <label class="btn">${T('Загрузить селфи')}<input id="selfie-file" class="sr" type="file" accept="image/*"></label>
          </div>
          <small class="r-hint">${T('После одобрения селфи будет видно всем на странице программы.')}</small>
          <input type="hidden" name="selfie">
        </div>
        <button class="btn primary">${T('Отправить на проверку')}</button>
      </form>
      <p id="msg" class="msg" role="alert"></p>
      <div id="my-subs"></div>
    </section>`;
  fillMySubmissions();
}

async function fillMySubmissions() {
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'submissions'), fs.where('uid', '==', user.uid)));
  const box = document.getElementById('my-subs');
  if (!box || snap.empty) return;
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  box.innerHTML = `
    <h2 class="stats-sub">${T('Мои заявки')}</h2>
    ${list.map(s => `
      <article class="comment">
        <div class="comment-body">
          <div class="comment-head"><b>${esc(s.name)}</b>${statusTag(s)}<span>${when(s.createdAt)}</span></div>
          ${s.reason ? `<p>${T('Причина: {text}', { text: esc(s.reason) })}</p>` : ''}
          <div class="comment-actions">
            ${s.status === 'approved' ? `<a class="link" href="#app/${esc(s.id)}">${T('Открыть')}</a>` : ''}
            <button type="button" class="link linkbtn" data-del-sub="${esc(s.id)}">${T('Удалить заявку')}</button>
          </div>
        </div>
      </article>`).join('')}`;
}

// Окно согласия: без явного «да» селфи не уйдёт.
function askSelfieConsent(image) {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'r-crop';
    dlg.innerHTML = `
      <form method="dialog" class="r-crop-box">
        <h2>${T('Ваше селфи увидят все')}</h2>
        <img class="consent-selfie" src="${image}" alt="">
        <p class="empty">${T('Когда админ одобрит программу, это селфи будет видно всем посетителям на её странице. Убрать его можно, удалив заявку.')}</p>
        <div class="r-crop-bar">
          <button class="btn" value="no">${T('Отмена')}</button>
          <button class="btn primary" value="yes">${T('Согласен(-на), отправить')}</button>
        </div>
      </form>`;
    document.body.append(dlg);
    dlg.addEventListener('close', () => {
      resolve(dlg.returnValue === 'yes');
      dlg.remove();
    });
    dlg.showModal();
  });
}

async function sendSubmission(form) {
  const { selfie, ...data } = await readFields(form, PUBLISH_FIELDS);
  if (!selfie) return say(T('Добавьте своё селфи: без него заявку не принять.'));
  if (!/^https:\/\//.test(data.file)) return say(T('Ссылка должна начинаться с https://'));
  if (!await askSelfieConsent(selfie)) return;
  const sub = fs.doc(fs.collection(db, 'submissions'));
  const batch = fs.writeBatch(db);
  batch.set(sub, { ...data, uid: user.uid, status: 'pending', selfiePublic: true, createdAt: fs.serverTimestamp() });
  batch.set(fs.doc(db, 'selfies', sub.id), { uid: user.uid, image: selfie });
  await batch.commit();
  renderPublish();
  say(T('Заявка отправлена. Решение придёт в уведомления.'), true);
}

async function deleteSubmission(id) {
  if (!await askDialog(T, { title: T('Удалить заявку и селфи?'), text: T('Со страницы программы селфи тоже пропадёт.'), ok: 'Удалить', danger: true })) return;
  const batch = fs.writeBatch(db);
  batch.delete(fs.doc(db, 'submissions', id));
  batch.delete(fs.doc(db, 'selfies', id));
  await batch.commit();
  await drawPending();
  render();
}

/* ---------- Админка ---------- */

let submissions = []; // заявки на экране админки

async function drawPending() {
  const count = document.getElementById('admin-count');
  count.hidden = true;
  if (!isAdmin) return;
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'submissions'), fs.where('status', '==', 'pending')));
  count.hidden = snap.empty;
  count.textContent = snap.size > 9 ? '9+' : snap.size;
}

const submissionCard = s => `
  <article class="comment sub">
    ${s.selfie ? `<img class="sub-selfie" src="${s.selfie}" alt="${T('Селфи автора')}">` : ''}
    <div class="comment-body">
      <div class="comment-head"><img class="sub-icon" src="${icon(s)}" alt=""><b>${esc(s.name)}</b>${statusTag(s)}<span>${when(s.createdAt)}</span></div>
      <p class="author">${authorText({ authorUid: s.uid, coauthors: s.coauthors })}</p>
      <p>${esc(s.desc)}</p>
      ${s.features?.length ? `<ul>${s.features.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      <div class="comment-actions wrap">
        ${safeUrl(s.file) ? `<a class="link" href="${safeUrl(s.file)}" target="_blank" rel="noopener nofollow">${T('Файл')}</a>` : ''}
        ${safeUrl(s.repo) ? `<a class="link" href="${safeUrl(s.repo)}" target="_blank" rel="noopener nofollow">GitHub</a>` : ''}
        ${safeUrl(s.site) ? `<a class="link" href="${safeUrl(s.site)}" target="_blank" rel="noopener nofollow">${T('Сайт')}</a>` : ''}
      </div>
      ${s.reason ? `<p>${T('Причина: {text}', { text: esc(s.reason) })}</p>` : ''}
      <div class="comment-actions wrap">
        ${s.status === 'pending' ? `
          <button type="button" class="btn primary" data-approve="${esc(s.id)}">${T('Одобрить')}</button>
          <button type="button" class="btn" data-reject="${esc(s.id)}">${T('Отклонить')}</button>` : ''}
        <button type="button" class="link linkbtn" data-del-sub="${esc(s.id)}">${T('Удалить заявку')}</button>
      </div>
    </div>
  </article>`;

async function renderAdmin(tab) {
  const shell = html => {
    view.innerHTML = `
      <section class="section panel admin">
        <header class="admin-head">
          <h1>${T('Админка')}</h1>
          <p class="empty">${T(tab === 'users' ? 'Все, кто заходил на сайт под своим аккаунтом.' : 'Программы от пользователей. Одобренные появятся во вкладке «Сообщество».')}</p>
        </header>
        <div class="tabs" role="group" aria-label="${T('Разделы')}">
          <a class="tab" href="#admin" aria-current="${tab !== 'users'}">${T('Программы на проверку')}</a>
          <a class="tab" href="#admin/users" aria-current="${tab === 'users'}">${T('Пользователи')}</a>
        </div>
        ${html}
        <p id="msg" class="msg" role="alert"></p>
      </section>`;
  };
  const empty = text => shell(`<div class="edit-card"><p class="empty">${text}</p></div>`);
  if (authState === 'loading') return empty(T('Загрузка…'));
  if (!isAdmin) return empty(T('Этот раздел видят только админы, вошедшие через Google.'));
  empty(T('Загрузка…'));
  try {
    if (tab === 'users') {
      const snap = await fs.getDocs(fs.collection(db, 'accounts'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (Date.parse(b.created) || 0) - (Date.parse(a.created) || 0));
      await social.loadPeople(list.map(a => a.id));
      if (route().tab !== 'users') return;
      const date = text => (Date.parse(text) ? new Date(text).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU') : '—');
      const way = { 'google.com': 'Google', password: T('Почта') };
      return shell(`
        <p class="empty">${T('Всего: {n}. Человек попадает сюда, когда заходит на сайт под своим аккаунтом.', { n: list.length })}</p>
        <div class="table-box"><table>
          <thead><tr><th scope="col">${T('Почта')}</th><th scope="col">${T('Логин')}</th><th scope="col">${T('Имя')}</th><th scope="col">${T('Способ входа')}</th><th scope="col">${T('Регистрация')}</th><th scope="col">${T('Был на сайте')}</th></tr></thead>
          <tbody>${list.map(a => `
            <tr>
              <th scope="row">${esc(a.email) || '—'}</th>
              <td>${social.handleOf(a.id) ? authorLink(a.id) : '—'}</td>
              <td>${esc(social.nameOf(a.id)) || '—'}</td>
              <td>${esc(way[a.provider] || a.provider)}</td>
              <td>${date(a.created)}</td>
              <td>${a.lastSeen ? date(a.lastSeen.toDate()) : '—'}</td>
            </tr>`).join('')}</tbody>
        </table></div>`);
    }
    const snap = await fs.getDocs(fs.collection(db, 'submissions'));
    // Сначала то, что ждёт решения, внутри по свежести.
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.status !== 'pending') - (b.status !== 'pending')
      || (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    await Promise.all([
      social.loadPeople(list.flatMap(s => [s.uid, ...(s.coauthors || [])])),
      ...list.filter(s => s.status === 'pending').map(async s => {
        const image = (await fs.getDoc(fs.doc(db, 'selfies', s.id))).data()?.image;
        s.selfie = social.isImage(image) ? image : '';
      }),
    ]);
    if (route().name !== 'admin' || route().tab === 'users') return;
    submissions = list;
    shell(list.map(submissionCard).join('') || `<div class="edit-card"><p class="empty">${T('Пока нет программ на проверку.')}</p></div>`);
  } catch (e) {
    console.error(e);
    empty(T('Не удалось загрузить данные. Обновите страницу.'));
  }
}

// Одобренная заявка становится обычной записью каталога, так что страница, комментарии и статистика работают сами.
async function decide(id, approve) {
  const s = submissions.find(x => x.id === id);
  const reason = approve ? '' : await askDialog(T, { title: T('Отклонить заявку'), text: T('Причину увидит автор.'), input: true, placeholder: T('Причина отказа'), ok: 'Отклонить', danger: true });
  if (!s || reason === null) return;
  const { id: _id, selfie: _selfie, selfiePublic: _public, uid, status: _status, createdAt: _createdAt, reason: _reason, ...fields } = s;
  const batch = fs.writeBatch(db);
  if (approve) batch.set(fs.doc(db, 'apps', id), { ...fields, authorUid: uid, community: true });
  batch.update(fs.doc(db, 'submissions', id), { status: approve ? 'approved' : 'rejected', reason: reason.trim().slice(0, 300) });
  await batch.commit();
  notify('mod', id, uid, approve ? id : '', reason.trim() ? `${s.name}: ${reason.trim()}` : s.name);
  await loadContent();
  await drawPending();
  render();
}

/* ---------- Соглашение и куки ---------- */

function renderTerms() {
  view.innerHTML = `
    <section class="section panel terms">
      ${(lang === 'en' ? TERMS.en : TERMS.ru).map(([title, text], i) => (i ? `<h2>${title}</h2><p>${text}</p>` : `<h1>${title}</h1><p class="empty">${text}</p>`)).join('')}
    </section>`;
}

function drawCookieBar() {
  try { cookieBar.hidden = !!localStorage.getItem('cookieOk'); } catch { cookieBar.hidden = false; }
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
  await social.loadPeople(apps.flatMap(authorUids));
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

// Браузер не может прочитать список аккаунтов Firebase, поэтому каждый сам отмечается здесь при входе.
async function syncAccount(u) {
  const { signInProvider } = await u.getIdTokenResult();
  await fs.setDoc(fs.doc(db, 'accounts', u.uid), {
    email: u.email || '',
    provider: signInProvider,
    created: u.metadata.creationTime || '',
    lastSeen: fs.serverTimestamp(),
  });
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
    view.innerHTML = `<section class="section panel"><h1>${T('Аккаунт')}</h1><p class="empty">${
      T(authState === 'loading' ? 'Загрузка…' : 'Сервис входа сейчас недоступен. Скачивать программы можно и без аккаунта.')}</p></section>`;
    return;
  }
  if (user) {
    view.innerHTML = `
      <section class="section panel edit">
        <header class="edit-top">
          <h1>${T('Редактирование профиля')}</h1>
          ${social.accountNote()}
        </header>
        <div class="edit-profile">
          ${social.bannerField()}
          <div class="edit-id">
            <span class="avatar big" id="big-avatar"></span>
            <div class="edit-who">
              <b>${esc(displayName() || T('Пользователь'))}</b>
              <small>${social.handleOf(user.uid) ? `@${esc(social.handleOf(user.uid))}` : esc(user.email)}</small>
            </div>
            <div class="profile-photo">
              <label class="btn">${T('Загрузить фото')}<input id="photo" class="sr" type="file" accept="image/*"></label>
              ${profile.photo ? `<button type="button" class="link linkbtn" id="photo-remove">${T('Убрать фото')}</button>` : ''}
            </div>
          </div>
        </div>
        <form id="profile-form" class="edit-form">
          <section class="edit-card">
            <div class="edit-title"><h2>${T('Основное')}</h2><p>${T('Так вас видят другие люди на сайте.')}</p></div>
            <div class="edit-fields">
              <label class="field">${T('Имя')}<input name="name" maxlength="80" autocomplete="name"></label>
              ${social.accountFields()}
            </div>
          </section>
          ${social.netFields()}
          <div class="edit-bar">
            <p id="msg" class="msg" role="alert"></p>
            <button class="btn primary">${T('Сохранить')}</button>
          </div>
        </form>
        <section class="edit-card edit-account">
          <div class="edit-title"><h2>${T('Аккаунт')}</h2><p id="who"></p></div>
          ${isAdmin ? `<p class="msg ok">${T('Вы админ: кнопки «Изменить» и «Добавить» есть в каталоге, цифры в разделе «Статистика».')}</p>` : ''}
          <div class="edit-account-actions">
            <a class="link" href="#terms">${T('Пользовательское соглашение')}</a>
            <button type="button" class="btn" id="logout">${T('Выйти')}</button>
          </div>
        </section>
      </section>`;
    view.querySelector('#who').textContent = user.email;
    view.querySelector('[name=name]').value = displayName();
    drawAvatar(view.querySelector('#big-avatar'));
    return;
  }
  const reg = authMode === 'register';
  view.innerHTML = `
    <section class="section panel account">
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
      <p class="r-hint">${T('Входя на сайт, вы принимаете')} <a class="link" href="#terms">${T('пользовательское соглашение')}</a>.</p>
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

async function saveBanner(banner) {
  await social.updatePublic({ banner });
  renderAccount();
  say(T('Сохранено.'), true);
}

async function saveProfile(data) {
  await fs.setDoc(fs.doc(db, 'users', user.uid), data, { merge: true });
  profile = { ...profile, ...data };
  await social.mirror({ name: myName(), photo: myPhoto().length <= 100000 ? myPhoto() : '' });
  if (realAdmin) await syncAuthor();
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
  const note = html => { view.innerHTML = `<section class="section panel"><h1>${T('Сообщить о баге или идее')}</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note(T('Загрузка…'));
  if (!user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы написать автору программы.')}`);
  if (!apps.some(authorName)) return note(T('Пока ни у одной программы не указан автор.'));
  const option = a => (authorName(a)
    ? `<option value="${esc(a.id)}" ${a.id === appId ? 'selected' : ''}>${T('{name} (автор: {author})', { name: esc(nm(a)), author: esc(authorName(a)) })}</option>`
    : `<option disabled>${T('{name} (автор не указан)', { name: esc(nm(a)) })}</option>`);
  view.innerHTML = `
    <section class="section panel account editor">
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
  say(T('Отправлено. Сообщение получит {name}, ответ появится в разделе «Сообщения».', { name: authorName(app) }), true);
}

// Сообщения видят оба участника: автор получает, отправитель видит свои и ответы на них.
function watchMessages(u) {
  stopMessages.forEach(stop => stop());
  stopMessages = [];
  messages = [];
  replies = [];
  if (u) {
    const lists = { to: [], from: [] };
    const update = () => {
      const byId = new Map([...lists.to, ...lists.from].map(m => [m.id, m]));
      messages = [...byId.values()].sort((x, y) => (y.createdAt?.toMillis() || 0) - (x.createdAt?.toMillis() || 0));
      drawInboxCount();
      if (route().name === 'inbox') renderInbox();
    };
    const rows = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const col = name => fs.collection(db, name);
    stopMessages = [
      ...['to', 'from'].map(side => fs.onSnapshot(
        fs.query(col('messages'), fs.where(side, '==', u.uid)),
        snap => { lists[side] = rows(snap); update(); },
        console.error,
      )),
      fs.onSnapshot(
        fs.query(col('replies'), fs.where('participants', 'array-contains', u.uid)),
        snap => { replies = rows(snap); update(); },
        console.error,
      ),
    ];
  }
  drawInboxCount();
}

// «Профиль» в левом меню ведёт на свою публичную страницу, если @имя уже выбрано.
function drawRail() {
  document.getElementById('rail-profile').href = user ? social.myHref() : '#account';
  document.getElementById('rail-admin-group').hidden = !isAdmin;
}

function toggleMeMenu(open) {
  meMenu.hidden = !open;
  avatar.setAttribute('aria-expanded', open);
  if (!open) return;
  meMenu.innerHTML = `
    <a role="menuitem" href="${esc(social.myHref())}">${T('Перейти на страницу')}</a>
    <a role="menuitem" href="#account">${T('Редактировать профиль')}</a>
    ${realAdmin ? `<button type="button" role="menuitem" id="view-mode">${T(isAdmin ? 'Вид пользователя' : 'Вид админа')}</button>` : ''}
    <button type="button" role="menuitem" id="sound-mode">${T(soundOn() ? 'Выключить звук' : 'Включить звук')}</button>
    <button type="button" role="menuitem" id="me-logout">${T('Выйти')}</button>`;
}

// Настоящие права остаются в правилах базы: переключатель только прячет админские кнопки.
function setAdminView(on) {
  isAdmin = realAdmin && on;
  try { localStorage.setItem('userView', on ? '' : '1'); } catch { /* приватный режим */ }
  drawRail();
  drawPending().catch(console.error);
  render();
}

function savedAdminView() {
  try { return !localStorage.getItem('userView'); } catch { return true; }
}

function drawInboxCount() {
  const unread = messages.filter(m => m.to === user?.uid && !m.read).length
    + notifications.filter(n => n.type === 'dm' && !n.read).length // ответы на баги и идеи
    + social.unreadChats();
  const count = document.getElementById('inbox-count');
  count.hidden = !unread;
  count.textContent = unread > 9 ? '9+' : unread;
  soundOnGrowth('inbox', unread);
}

// Имена, почту и текст пишут посетители: только через esc.
const replyItem = r => `
  <div class="comment-body reply-item">
    <div class="comment-head"><b>${esc(r.name)}</b><span>${when(r.createdAt)}</span></div>
    <p>${esc(r.text)}</p>
  </div>`;

const messageItem = m => {
  const mine = m.to === user.uid;
  const thread = replies.filter(r => r.messageId === m.id)
    .sort((x, y) => (x.createdAt?.toMillis() || Infinity) - (y.createdAt?.toMillis() || Infinity));
  return `
    <article class="comment">
      <div class="comment-body">
        <div class="comment-head">
          <span class="tag ${m.type === 'idea' ? 'idea' : 'bug'}">${T(m.type === 'idea' ? 'Идея' : 'Баг')}</span>
          <a class="link" href="#app/${esc(m.appId)}">${esc(m.appName)}</a>
          <span>${when(m.createdAt)}</span>
        </div>
        <p>${esc(m.text)}</p>
        <div class="comment-head">${mine ? `<b>${esc(m.fromName)}</b><span>${esc(m.fromEmail)}</span>` : `<span>${T('Вы написали автору программы')}</span>`}</div>
        ${thread.length ? `<div class="thread">${thread.map(replyItem).join('')}</div>` : ''}
        <form class="comment-form message-reply" data-id="${esc(m.id)}">
          <textarea name="text" rows="2" maxlength="2000" required aria-label="${T('Ответ')}" placeholder="${T('Напишите ответ')}"></textarea>
          <button class="btn primary">${T('Ответить')}</button>
        </form>
        ${mine ? `<div class="comment-actions"><button type="button" class="link linkbtn" data-del-message="${esc(m.id)}">${T('Удалить')}</button></div>` : ''}
      </div>
    </article>`;
};

function renderInbox() {
  const note = html => { view.innerHTML = `<section class="section panel"><h1>${T('Сообщения')}</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading') return note(T('Загрузка…'));
  if (!user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы видеть сообщения.')}`);
  // Список обновляется сам, поэтому недописанные ответы переносим в новую разметку.
  const drafts = new Map([...view.querySelectorAll('.message-reply')].map(f => [f.dataset.id, f.elements.text.value]));
  const active = document.activeElement?.closest?.('.message-reply')?.dataset.id;
  view.innerHTML = `
    <section class="section panel inbox">
      <div class="inbox-head"><h1>${T('Баги и идеи')}</h1><a class="link" href="#chat">${T('Чаты')}</a></div>
      ${messages.map(messageItem).join('') || `<p class="empty">${T('Пока сообщений нет. Здесь будут ваши баги и идеи, ответы на них и письма по вашим программам.')}</p>`}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
  view.querySelectorAll('.message-reply').forEach(f => {
    f.elements.text.value = drafts.get(f.dataset.id) || '';
    if (f.dataset.id === active) f.elements.text.focus();
  });
  messages.filter(m => m.to === user.uid && !m.read).forEach(m => {
    fs.updateDoc(fs.doc(db, 'messages', m.id), { read: true }).catch(console.error);
  });
  notifications.filter(n => n.type === 'dm' && !n.read).forEach(n => {
    fs.updateDoc(fs.doc(db, 'notifications', n.id), { read: true }).catch(console.error);
  });
}

async function sendReply(form) {
  const text = form.elements.text.value.trim();
  const m = messages.find(x => x.id === form.dataset.id);
  if (!text || !m) return;
  await fs.addDoc(fs.collection(db, 'replies'), {
    messageId: m.id,
    participants: [m.to, m.from],
    from: user.uid,
    name: myName(),
    text,
    createdAt: fs.serverTimestamp(),
  });
  form.reset();
  notify('dm', m.id, m.to === user.uid ? m.from : m.to, m.appId, text);
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
  const note = text => { view.innerHTML = `<section class="section panel"><h1>${T('Статистика')}</h1><p class="empty">${text}</p></section>`; };
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
    <section class="section panel stats">
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
      [realAdmin, profile] = await Promise.all([checkAdmin(u), loadProfile(u)]);
      isAdmin = realAdmin && savedAdminView();
      user = u;
      quietUntil = Date.now() + 4000;
      authState = 'ready';
      await social.onUser(u);
      watchNotifications(u);
      watchMessages(u);
      if (realAdmin) await syncAuthor().catch(console.error);
      if (u) {
        syncAccount(u).catch(console.error);
      }
      drawAvatar(avatar);
      toggleMeMenu(false);
      document.getElementById('rail-inbox').hidden = !u;
      drawRail();
      drawPending().catch(console.error);
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
  const parts = location.hash.slice(1).split('/');
  const s = social.route(parts);
  if (s) return s;
  const [name, a, b] = parts;
  if (['account', 'stats', 'inbox', 'publish', 'terms'].includes(name)) return { name };
  if (name === 'admin') return { name, tab: a };
  if (name === 'report') return { name, appId: a };
  if (name === 'edit' && FIELDS[a] && b) return { name, kind: a, id: b };
  const app = name === 'app' && apps.find(x => x.id === a);
  return app ? { name: 'app', app } : { name: 'apps' };
}

const RAIL = { feed: 'feed', post: 'feed', submit: 'feed', u: 'account', uid: 'account', chat: 'inbox', inbox: 'inbox', account: 'account', stats: 'stats', report: 'report', admin: 'admin' };

function render() {
  const r = route();
  document.querySelectorAll('.rail a').forEach(a => {
    if (a.dataset.route === (RAIL[r.name] || 'apps')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (r.social) { social.render(r); return; } // заголовок вкладки social.js ставит сам, когда загрузит данные
  if (r.name === 'account') renderAccount();
  else if (r.name === 'stats') renderStats();
  else if (r.name === 'inbox') renderInbox();
  else if (r.name === 'report') renderReport(r.appId);
  else if (r.name === 'publish') renderPublish();
  else if (r.name === 'admin') renderAdmin(r.tab);
  else if (r.name === 'terms') renderTerms();
  else if (r.name === 'edit') renderEditor(r.kind, r.id);
  else if (r.name === 'app') renderApp(r.app);
  else renderApps();
  document.title = r.app ? `${nm(r.app)} — ${T('Яйца Cloud')}` : T('Яйца Cloud — все приложения');
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
  else if (t.dataset.approve) attempt(() => decide(t.dataset.approve, true));
  else if (t.dataset.reject) attempt(() => decide(t.dataset.reject, false));
  else if (t.dataset.delSub) attempt(() => deleteSubmission(t.dataset.delSub));
  else if (t.dataset.delMessage) {
    attempt(async () => {
      if (await askDialog(T, { title: T('Удалить сообщение?'), ok: 'Удалить', danger: true })) await fs.deleteDoc(fs.doc(db, 'messages', t.dataset.delMessage));
    });
  }
  else if (t.id === 'delete') {
    const { kind, id } = view.querySelector('#edit-form').dataset;
    attempt(async () => {
      if (!await askDialog(T, { title: T('Удалить запись с сайта?'), ok: 'Удалить', danger: true })) return;
      await fs.setDoc(fs.doc(db, kind, id), { deleted: true }, { merge: true });
      await loadContent();
      cat = 'all';
      location.hash = 'apps';
    });
  }
  else if (t.id === 'photo-remove') attempt(() => saveProfile({ photo: '' }));
  else if (t.id === 'banner-remove') attempt(() => saveBanner(''));
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
  if (e.target.method === 'dialog') return; // окно вопроса закрывается само
  e.preventDefault();
  if (e.target.id === 'edit-form') return attempt(() => saveItem(e.target));
  if (e.target.id === 'report-form') return attempt(() => sendReport(e.target));
  if (e.target.id === 'publish-form') return attempt(() => sendSubmission(e.target));
  if (e.target.classList.contains('message-reply')) return attempt(() => sendReply(e.target));
  if (e.target.dataset.sForm) return social.onSubmit(e.target);
  if (e.target.id === 'profile-form') {
    const f = e.target.elements;
    const name = f.name.value.trim();
    return attempt(async () => {
      await social.saveIdentity({ username: f.username.value, bio: f.bio.value, name: name || myName(), photo: myPhoto(), links: social.readLinks(e.target) });
      await saveProfile({ name });
    });
  }
  const { email, password } = Object.fromEntries(new FormData(e.target));
  const go = authMode === 'register' ? fb.createUserWithEmailAndPassword : fb.signInWithEmailAndPassword;
  attempt(() => go(auth, email.trim(), password));
});

document.getElementById('lang').addEventListener('click', () => setLang(lang === 'ru' ? 'en' : 'ru'));
document.getElementById('theme').addEventListener('click', toggleTheme);
bell.addEventListener('click', () => toggleBell(bellPanel.hidden));
bellPanel.addEventListener('click', e => { if (e.target.closest('a')) toggleBell(false); });
document.addEventListener('click', e => { if (!bellPanel.hidden && !bellWrap.contains(e.target)) toggleBell(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !bellPanel.hidden) toggleBell(false); });

// Без входа аватарка сразу ведёт на вход, после входа открывает меню.
avatar.addEventListener('click', e => {
  if (!user) return;
  e.preventDefault();
  toggleMeMenu(meMenu.hidden);
});
meMenu.addEventListener('click', e => {
  if (e.target.id === 'view-mode') setAdminView(!isAdmin);
  if (e.target.id === 'me-logout') fb.signOut(auth).catch(console.error);
  if (e.target.id === 'sound-mode') {
    try { localStorage.setItem('muted', soundOn() ? '1' : ''); } catch { /* приватный режим */ }
  }
  if (e.target.closest('a, button')) toggleMeMenu(false);
});
document.addEventListener('click', e => { if (!meMenu.hidden && !e.target.closest('#me-wrap')) toggleMeMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !meMenu.hidden) { toggleMeMenu(false); avatar.focus(); }
});

document.getElementById('cookie-ok').addEventListener('click', () => {
  try { localStorage.setItem('cookieOk', '1'); } catch { /* приватный режим */ }
  cookieBar.hidden = true;
});

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
  if (e.target.id === 'selfie-file' && file) {
    e.target.value = '';
    cropImage(file, T, { ratio: 3 / 4, out: 600, limit: 280000 })
      .then(url => {
        if (!url) return;
        view.querySelector('[name=selfie]').value = url;
        view.querySelector('#selfie-preview').src = url;
        say('');
      })
      .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
    return;
  }
  if (e.target.id === 'banner' && file) {
    e.target.value = '';
    cropImage(file, T, { ratio: 3, out: 1200, limit: 190000 })
      .then(url => url && attempt(() => saveBanner(url)))
      .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
    return;
  }
  if (e.target.id !== 'photo' || !file) return;
  e.target.value = ''; // чтобы тот же файл можно было выбрать снова
  cropImage(file, T)
    .then(photo => photo && attempt(() => saveProfile({ photo })))
    .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
});

search.addEventListener('input', () => { if (route().name === 'apps') renderApps(); });

// Короткий fade только при смене раздела. Сортировки и вкладки внутри раздела меняются без анимации.
let enterTimer;
function animateView() {
  view.classList.remove('enter');
  void view.offsetWidth;
  view.classList.add('enter');
  clearTimeout(enterTimer);
  enterTimer = setTimeout(() => view.classList.remove('enter'), 150);
}

let shownRoute = route().name;
addEventListener('hashchange', () => {
  const { name } = route();
  if (name !== shownRoute) animateView();
  shownRoute = name;
  render();
  scrollTo(0, 0);
});

// Шапка на узком экране переносится на две строки, поэтому её высоту меряем, а не угадываем.
const topBar = document.querySelector('.top');
new ResizeObserver(() => document.documentElement.style.setProperty('--top-h', `${topBar.offsetHeight}px`)).observe(topBar);

applyStaticText();
drawCookieBar();
animateView();
render();
initFirebase();
