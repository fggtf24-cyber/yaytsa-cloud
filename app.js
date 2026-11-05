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
const icon = a => safeUrl(a.icon) || 'assets/favicon.svg';

/* ---------- Приложения ---------- */

const platform = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" stroke-width="1.8" role="img" aria-label="Для компьютера"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>';
const download = (a, cls = 'btn') => `<a class="${cls} dl" data-id="${esc(a.id)}" href="${safeUrl(a.file)}" aria-label="Скачать ${esc(a.name)}">Скачать</a>`;
const siteLink = a => (safeUrl(a.site) ? `<a class="link" href="${safeUrl(a.site)}" target="_blank" rel="noopener">Сайт</a>` : '');
const editLink = (kind, a) => (isAdmin ? `<a class="link" href="#edit/${kind}/${esc(a.id)}" aria-label="Изменить ${esc(a.name)}">Изменить</a>` : '');
const media = a => {
  const src = safeUrl(a.demo);
  if (!src) return '';
  return /\.(mp4|webm)(\?|$)/i.test(src)
    ? `<video src="${src}" autoplay muted loop playsinline aria-label="${esc(a.name)} в работе"></video>`
    : `<img src="${src}" alt="${esc(a.name)} в работе">`;
};
const authorName = a => authors[a.authorUid]?.name || '';
const authorLine = a => (authorName(a) ? `<p class="author">Автор: ${esc(authorName(a))}</p>` : '');

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

// Ссылка на soundcloud.com в проекте сама превращается в плеер.
const soundcloud = p => (/^https:\/\/soundcloud\.com\//.test(p.url || '') ? `
  <iframe class="player" title="Плеер: ${esc(p.name)}" allow="autoplay; encrypted-media"
    src="https://w.soundcloud.com/player/?url=${encodeURIComponent(p.url)}&color=%231473e6&show_comments=false&show_teaser=false&visual=true"></iframe>` : '');

const projectCard = p => `
  <article class="card${soundcloud(p) ? ' wide' : ''}">
    <div class="card-head"><h2>${esc(p.name)}</h2></div>
    <p>${esc(p.desc)}</p>
    ${soundcloud(p)}
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
  const found = a => !q || `${a.name} ${authorName(a)} ${a.desc}`.toLowerCase().includes(q);
  const onProjects = cat === PROJECTS_TAB;
  const list = (onProjects ? projects : apps).filter(found);
  const tabs = [['all', 'Все приложения'], [PROJECTS_TAB, 'Другие проекты']];
  const add = onProjects ? ['projects', 'Добавить проект'] : ['apps', 'Добавить программу'];

  view.innerHTML = `
    <div class="tabs" role="group" aria-label="Категории">
      ${tabs.map(([id, label]) => `<button type="button" data-cat="${esc(id)}" aria-pressed="${id === cat}">${esc(label)}</button>`).join('')}
      ${isAdmin ? `<a class="btn tabs-add" href="#edit/${add[0]}/new">${add[1]}</a>` : ''}
    </div>
    <section class="section">
      <h1>${onProjects ? 'Другие наши проекты' : 'Программы с яйцами'}</h1>
      ${list.length
        ? `<div class="grid">${!onProjects && !q ? promo : ''}${list.map(onProjects ? projectCard : card).join('')}</div>`
        : '<p class="empty">Ничего не нашлось.</p>'}
    </section>`;
}

function renderApp(a) {
  const list = items => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const demo = media(a);
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
          ${authorName(a) ? `<li><i>@</i>Автор: ${esc(authorName(a))}</li>` : ''}
        </ul>
        ${download(a, 'btn primary')}
        ${authorName(a) ? `<a class="btn report-link" href="#report/${esc(a.id)}">Сообщить о баге или идее</a>` : ''}
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
            ${demo}
          </div>` : (demo ? `<div class="use">${demo}</div>` : '')}
        ${a.needs?.length ? `<h2>Что нужно</h2><div class="use"><div class="use-text">${list(a.needs)}</div></div>` : ''}
        <h2>Комментарии <span id="comment-count"></span></h2>
        ${commentForm()}
        <p id="msg" class="msg" role="alert"></p>
        <div id="comment-list" data-app="${esc(a.id)}"><p class="empty">Загрузка…</p></div>
      </div>
    </div>`;
  loadComments(a.id);
}

/* ---------- Комментарии ---------- */

const commentForm = () => (user ? `
  <form class="comment-form">
    <label class="sr" for="comment-text">Комментарий</label>
    <textarea id="comment-text" name="text" rows="3" maxlength="1000" required placeholder="Напишите комментарий"></textarea>
    <button class="btn primary">Отправить</button>
  </form>` : '<p class="empty"><a class="link" href="#account">Войдите</a>, чтобы оставить комментарий или лайк.</p>');

const when = ts => ts?.toDate?.().toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }) || '';

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
        <div class="comment-head"><b>${esc(c.name)}</b><span>${when(c.createdAt)}</span></div>
        <p>${esc(c.text)}</p>
        <div class="comment-actions">
          <button type="button" class="like" data-like="${esc(c.id)}" data-uid="${esc(c.uid)}" aria-pressed="${liked}" aria-label="Нравится, сейчас ${likes.length}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.2-9.1C1.7 7.8 3.8 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3 0 5.1 2.8 4 5.9C19.5 15.4 12 20 12 20z"/></svg>
            ${likes.length}
          </button>
          <button type="button" class="link linkbtn" data-reply="${esc(rootId)}" data-target="${esc(c.id)}" data-uid="${esc(c.uid)}" data-name="${esc(c.name)}" data-nested="${rootId !== c.id}">Ответить</button>
          ${user && (c.uid === user.uid || isAdmin) ? `<button type="button" class="link linkbtn" data-del-comment="${esc(c.id)}">Удалить</button>` : ''}
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
    if (authState === 'failed') box().innerHTML = '<p class="empty">Комментарии сейчас недоступны.</p>';
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
    }).join('') : '<p class="empty">Пока никто не написал.</p>';
    document.getElementById('comment-count').textContent = shown ? `(${shown})` : '';
    const target = document.getElementById(`c-${route().commentId}`);
    if (target) {
      target.scrollIntoView({ block: 'center' });
      target.classList.add('flash');
      history.replaceState(null, '', `#app/${appId}`); // иначе каждый лайк снова прокручивал бы сюда
    }
  } catch (e) {
    console.error(e);
    if (box()) box().innerHTML = '<p class="empty">Комментарии сейчас недоступны.</p>';
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
    <textarea name="text" rows="2" maxlength="1000" required aria-label="Ответ" placeholder="Напишите ответ"></textarea>
    <button class="btn primary">Ответить</button>`;
  body.append(form);
  const input = form.elements.text;
  if (button.dataset.nested === 'true') input.value = `${button.dataset.name}, `;
  input.focus();
}

async function addComment(form) {
  const text = form.elements.text.value.trim();
  if (!text) return;
  const appId = route().app.id;
  // ponytail: имя и фото копируются в комментарий, поэтому смена профиля старые комментарии не меняет.
  await fs.addDoc(fs.collection(db, 'comments'), {
    appId,
    uid: user.uid,
    name: (displayName() || 'Пользователь').slice(0, 80),
    photo: profile.photo || user.photoURL || '',
    text,
    createdAt: fs.serverTimestamp(),
    likedBy: [],
    ...(form.dataset.parent ? { parentId: form.dataset.parent } : {}),
  });
  if (form.dataset.parent) notify('reply', form.dataset.target, form.dataset.uid, appId, text);
  form.reset();
  await loadComments(appId);
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
    fromName: (displayName() || 'Пользователь').slice(0, 80),
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
  const tens = n % 100;
  const last = n % 10;
  if (tens > 10 && tens < 20) return 'лайков';
  if (last === 1) return 'лайк';
  return last > 1 && last < 5 ? 'лайка' : 'лайков';
};

const noteTitle = n => {
  const count = n.people.length;
  const names = n.people.slice(0, 2).map(p => `<b>${esc(p)}</b>`);
  if (count === 1) return `${n.type === 'like' ? 'Лайк' : 'Ответ'} от ${names[0]}`;
  const who = count === 2 ? names.join(' и ') : `${names.join(', ')} и ещё ${count - 2}`;
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
  bell.setAttribute('aria-label', unread ? `Уведомления, новых: ${unread}` : 'Уведомления');
  if (!bellPanel.hidden) {
    bellPanel.innerHTML = groups.map(noteItem).join('') || '<p class="empty">Пока нет уведомлений.</p>';
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

// [поле, подпись, тип]; * в конце типа — обязательное.
const FIELDS = {
  apps: [
    ['name', 'Название', 'text*'],
    ['authorUid', 'Автор (аккаунт админа)', 'author'],
    ['desc', 'Описание', 'area*'],
    ['file', 'Ссылка на .exe', 'url*'],
    ['size', 'Размер после установки, например 130 МБ', 'text'],
    ['site', 'Сайт программы', 'url'],
    ['repo', 'GitHub', 'url'],
    ['icon', 'Ссылка на иконку', 'url'],
    ['demo', 'Ссылка на картинку, гифку или .mp4', 'url'],
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
    const control = t === 'author' ? `
      <select name="${key}">
        <option value="">Не указан</option>
        ${Object.entries(authors).map(([uid, a]) => `<option value="${esc(uid)}" ${uid === value ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}
      </select>`
      : t === 'area' || t === 'lines'
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
  if (isAdmin) await syncAuthor();
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

/* ---------- Баги и идеи ---------- */

function renderReport(appId) {
  const note = html => { view.innerHTML = `<section class="section"><h1>Сообщить о баге или идее</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note('Загрузка…');
  if (!user) return note('<a class="link" href="#account">Войдите</a>, чтобы написать автору программы.');
  if (!apps.some(authorName)) return note('Пока ни у одной программы не указан автор.');
  const option = a => (authorName(a)
    ? `<option value="${esc(a.id)}" ${a.id === appId ? 'selected' : ''}>${esc(a.name)} (автор: ${esc(authorName(a))})</option>`
    : `<option disabled>${esc(a.name)} (автор не указан)</option>`);
  view.innerHTML = `
    <section class="section account editor">
      <h1>Сообщить о баге или идее</h1>
      <form id="report-form" class="account">
        <label class="field">Что это
          <select name="type"><option value="bug">Баг</option><option value="idea">Идея</option></select>
        </label>
        <label class="field">Программа
          <select name="appId" required>${apps.map(option).join('')}</select>
        </label>
        <label class="field">Сообщение
          <textarea name="text" rows="6" maxlength="2000" required></textarea>
        </label>
        <button class="btn primary">Отправить автору</button>
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
    fromName: (displayName() || 'Пользователь').slice(0, 80),
    fromEmail: user.email || '',
    type,
    appId,
    appName: app.name.slice(0, 100),
    text: text.trim(),
    createdAt: fs.serverTimestamp(),
    read: false,
  });
  form.reset();
  say(`Отправлено. Сообщение получит ${authorName(app)}.`, true);
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
        <span class="tag ${m.type === 'idea' ? 'idea' : 'bug'}">${m.type === 'idea' ? 'Идея' : 'Баг'}</span>
        <a class="link" href="#app/${esc(m.appId)}">${esc(m.appName)}</a>
        <span>${when(m.createdAt)}</span>
      </div>
      <p>${esc(m.text)}</p>
      <div class="comment-head"><b>${esc(m.fromName)}</b><span>${esc(m.fromEmail)}</span></div>
      <div class="comment-actions"><button type="button" class="link linkbtn" data-del-message="${esc(m.id)}">Удалить</button></div>
    </div>
  </article>`;

function renderInbox() {
  const note = text => { view.innerHTML = `<section class="section"><h1>Сообщения</h1><p class="empty">${text}</p></section>`; };
  if (authState === 'loading') return note('Загрузка…');
  if (!isAdmin) return note('Сообщения видят только админы, вошедшие через Google.');
  view.innerHTML = `
    <section class="section inbox">
      <h1>Сообщения</h1>
      ${messages.map(messageItem).join('') || '<p class="empty">Пока ничего не пришло. Сюда попадают баги и идеи по программам, где автор вы.</p>'}
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
      watchNotifications(u);
      watchMessages(isAdmin ? u : null);
      if (isAdmin) await syncAuthor().catch(console.error);
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
    if (!confirm('Удалить сообщение?')) return;
    attempt(() => fs.deleteDoc(fs.doc(db, 'messages', t.dataset.delMessage)));
  }
  else if (t.dataset.delComment) {
    if (!confirm('Удалить комментарий?')) return;
    attempt(async () => {
      await fs.deleteDoc(fs.doc(db, 'comments', t.dataset.delComment));
      await loadComments(route().app.id);
    });
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
  if (e.target.id === 'report-form') return attempt(() => sendReport(e.target));
  if (e.target.classList.contains('comment-form')) return attempt(() => addComment(e.target));
  if (e.target.id === 'profile-form') {
    return attempt(() => saveProfile({ name: e.target.elements.name.value.trim() }));
  }
  const { email, password } = Object.fromEntries(new FormData(e.target));
  const go = authMode === 'register' ? fb.createUserWithEmailAndPassword : fb.signInWithEmailAndPassword;
  attempt(() => go(auth, email.trim(), password));
});

bell.addEventListener('click', () => toggleBell(bellPanel.hidden));
bellPanel.addEventListener('click', e => { if (e.target.closest('a')) toggleBell(false); });
document.addEventListener('click', e => { if (!bellPanel.hidden && !bellWrap.contains(e.target)) toggleBell(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !bellPanel.hidden) toggleBell(false); });

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
