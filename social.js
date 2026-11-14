// Соцчасть: профили с @именем, посты с ветками комментариев, голоса, подписки, личные чаты.
// Сервера нет: всё пишет браузер, а честность записей проверяют правила в firestore.rules.

const USERNAME_RE = /^[a-z0-9_]{1,20}$/;
// Картинки хранятся строкой в базе. Показываем только такие, SVG и прочее сюда не пройдёт.
const FEED_CARD = '.r-post[data-href]'; // В ленте клик по картинке открывает пост, а не просмотр.
const DATA_IMAGE = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/;
// Соцсети в профиле: [id, подпись, сайты]. Значок лежит в assets/net/<id>.svg.
const NETS = [
  ['youtube', 'YouTube', ['youtube.com', 'youtu.be']],
  ['tiktok', 'TikTok', ['tiktok.com']],
  ['instagram', 'Instagram', ['instagram.com']],
  ['telegram', 'Telegram', ['t.me', 'telegram.me']],
  ['discord', 'Discord', ['discord.gg', 'discord.com']],
  ['twitch', 'Twitch', ['twitch.tv']],
  ['github', 'GitHub', ['github.com']],
  ['x', 'X', ['x.com', 'twitter.com']],
  ['vk', 'VK', ['vk.com', 'vk.ru']],
  ['soundcloud', 'SoundCloud', ['soundcloud.com']],
];

// Ссылку пишет посетитель: пускаем только https на сайт этой соцсети.
function cleanLink(hosts, raw) {
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    url.protocol = 'https:';
    const host = url.hostname.toLowerCase();
    return hosts.some(h => host === h || host.endsWith(`.${h}`)) ? url.href : '';
  } catch {
    return '';
  }
}

const EMOJI = '😀 😂 🤣 😅 😊 😍 🥰 😘 😎 🤩 🤔 😏 🙄 😭 🥲 😡 🤯 😱 🤡 💀 👀 👍 👎 👏 🙏 🤝 💪 🫡 ❤️ 🔥 ✨ 🎉 💯 🚀 🥚 🐣 🍳 🐔 🍆 💩'.split(' ');

// Стикеры с яйцами: файлы лежат в assets/stickers/<id>.svg, в базе хранится только id.
const STICKERS = ['happy', 'laugh', 'love', 'cool', 'wink', 'party', 'think', 'shock', 'cry', 'angry', 'sleepy', 'dead'];

// Соцсеть узнаём по самой ссылке.
const netOf = raw => NETS.find(([, , hosts]) => cleanLink(hosts, raw));
const netIcon = raw => `assets/net/${netOf(raw)?.[0] || 'link'}.svg`;

// Название программы в хэштеге: без пробелов, чтобы тег был одним словом.
const appTag = name => name.replace(/\s+/g, '');
const TAG_RE = /(^|[\s(])#([\p{L}\p{N}_-]{1,60})/gu;
const EGG_COLORS = ['#6FA8FF', '#FFB347', '#A58BFF', '#FF6F91', '#6BE3B4', '#5ED0F0', '#FF8A5B', '#FFC531'];

const ICON = {
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  ul: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M10 6h10M10 12h10M10 18h10"/><circle cx="5" cy="6" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="18" r="1" fill="currentColor"/></svg>',
  ol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 6h10M10 12h10M10 18h10M4 4.5l1.5-1V8M3.8 14.2c.3-.7 2.2-1 2.2.3 0 1-2.2 1.8-2.2 2.9H6"/></svg>',
  hr: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 12h18M8 6h8M8 18h8" opacity=".45"/><path d="M3 12h18"/></svg>',
  up: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8 2.8 10.6h4.6v6.6h5.2v-6.6h4.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  down: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17.2 2.8 9.4h4.6V2.8h5.2v6.6h4.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  comment: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10 3c4.4 0 7.5 2.9 7.5 6.5S14.4 16 10 16c-1 0-2-.1-2.9-.4L3 17.2l1.2-3.4C3 12.7 2.5 11.2 2.5 9.5 2.5 5.9 5.6 3 10 3z" stroke-linejoin="round"/></svg>',
  share: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4l5 5-5 5M17 9H9c-3 0-5 2-5 5v2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dots: '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="4" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="16" cy="10" r="1.6"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke-linecap="round"/></svg>',
  minus: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10h12" stroke-linecap="round"/></svg>',
  send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z" stroke-linejoin="round"/></svg>',
  chat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" stroke-linejoin="round"/></svg>',
  image: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5-8 8" stroke-linejoin="round"/></svg>',
  smile: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.5 2.3 2.2 4 2.2s3-.7 4-2.2M9 9.5v.5M15 9.5v.5"/></svg>',
  sticker: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14a1 1 0 0 1 1 1v9l-6 6H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 20v-5a1 1 0 0 1 1-1h5"/></svg>',
  tick: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13l5 5L19 7"/></svg>',
  ticks: '<svg width="20" height="16" viewBox="0 0 30 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13l5 5L18 7"/><path d="M14 17l1 1L25 7"/></svg>',
  mic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z" stroke-linejoin="round"/></svg>',
  bell: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" stroke-linecap="round"/></svg>',
  muted: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4M4 4l16 16" stroke-linecap="round"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13" stroke-linejoin="round"/></svg>',
};

export function setupSocial(ctx) {
  const { T, esc, view } = ctx;
  onHeic = () => ctx.toast(T('Обрабатываем фото с iPhone, это займёт несколько секунд…'));
  const F = () => ctx.fs;
  const ref = (...path) => F().doc(ctx.db, ...path);
  const col = (...path) => F().collection(ctx.db, ...path);
  const rows = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const ms = ts => ts?.toMillis?.() || 0;
  const me = () => ctx.user?.uid;

  let pub = null;              // мой публичный профиль или null, пока не выбрано @имя
  const people = new Map();    // uid -> профиль, null — профиля нет
  const nameToUid = new Map();
  const postTitles = new Map();
  let myVotes = new Map();     // 'p_<id>' / 'c_<id>' -> -1 | 0 | 1
  let following = new Set();   // на кого подписан я
  let followers = new Set();   // кто подписан на меня
  let chats = [];
  let stopChats = null;
  let stopMsgs = null;
  let roomId = null;           // открытый чат
  let roomPeer = null;
  let roomGroup = null;        // открытая группа
  let chatQuery = '';          // поиск в списке чатов
  let chatPeople = [];         // люди по этому поиску, с кем ещё нет чата
  let roomMsgs = [];
  let editingMsg = null;       // id своего сообщения, которое правим в строке ввода
  let thread = null;           // открытый пост: { post, comments, focus }
  let commentSort = 'best';
  let shownProfile = null;     // uid открытого профиля
  let seq = 0;                 // защита от устаревших асинхронных отрисовок
  const shownComments = new Map(); // комментарии на открытой странице профиля

  /* ---------- Люди ---------- */

  function remember(uid, p) {
    people.set(uid, p ? { ...p, uid } : null);
    if (p?.username) nameToUid.set(p.username, uid);
  }

  async function loadPeople(uids) {
    const missing = [...new Set(uids)].filter(u => u && !people.has(u));
    await Promise.all(missing.map(async uid => {
      try {
        const d = await F().getDoc(ref('profiles', uid));
        remember(uid, d.exists() ? d.data() : null);
      } catch (e) {
        console.error(e);
        people.set(uid, null);
      }
    }));
  }

  async function uidByName(name) {
    if (nameToUid.has(name)) return nameToUid.get(name);
    const d = await F().getDoc(ref('usernames', name));
    const uid = d.exists() ? d.data().uid : null;
    if (uid) nameToUid.set(name, uid);
    return uid;
  }

  const handle = uid => people.get(uid)?.username || '';
  const shownName = uid => people.get(uid)?.name || (handle(uid) ? handle(uid) : T('Пользователь'));
  const profileHref = uid => (handle(uid) ? `#u/${esc(handle(uid))}` : `#uid/${esc(uid)}`);
  const userLabel = uid => esc(handle(uid) ? `@${handle(uid)}` : shownName(uid));
  const isMutual = uid => following.has(uid) && followers.has(uid);
  const color = uid => EGG_COLORS[[...String(uid)].reduce((n, c) => n + c.charCodeAt(0), 0) % EGG_COLORS.length];

  function photoOf(uid) {
    const p = people.get(uid)?.photo || '';
    return /^(https:\/\/|data:image\/(png|jpeg|webp);base64,)/.test(p) ? esc(p) : '';
  }

  function ava(uid, size = 32) {
    const src = photoOf(uid);
    const letter = esc((shownName(uid).replace(/^@/, '')[0] || '?').toUpperCase());
    return `<span class="r-ava" style="--s:${size}px;--c:${color(uid)}" aria-hidden="true">${src ? `<img src="${src}" alt="" referrerpolicy="no-referrer">` : letter}</span>`;
  }

  // Шапка профиля: своя картинка поверх цвета логотипа.
  function bannerStyle(uid) {
    const b = people.get(uid)?.banner || '';
    return `--c:${color(uid)}${DATA_IMAGE.test(b) ? `;background-image:url('${b}')` : ''}`;
  }

  function netLinks(uid) {
    const links = people.get(uid)?.links || {};
    const html = NETS.map(([id, label, hosts]) => {
      const url = typeof links[id] === 'string' ? cleanLink(hosts, links[id]) : '';
      return url ? `<a class="r-net" href="${esc(url)}" target="_blank" rel="noopener nofollow ugc" aria-label="${label}" title="${label}"><img src="assets/net/${id}.svg" alt="" width="18" height="18"></a>` : '';
    }).join('');
    return html ? `<div class="r-nets">${html}</div>` : '';
  }

  /* ---------- Мелочи ---------- */

  function ago(ts) {
    const t = ms(ts);
    if (!t) return T('только что');
    const s = Math.max(0, (Date.now() - t) / 1000);
    const units = [[31536000, 'г.', 'y'], [2592000, 'мес.', 'mo'], [86400, 'дн.', 'd'], [3600, 'ч', 'h'], [60, 'мин', 'min']];
    for (const [sec, ru, en] of units) {
      if (s >= sec) {
        const n = Math.floor(s / sec);
        return ctx.lang === 'en' ? `${n} ${en} ago` : `${n} ${ru} назад`;
      }
    }
    return T('только что');
  }
  const fullDate = ts => (ms(ts) ? new Date(ms(ts)).toLocaleString(ctx.lang === 'en' ? 'en-GB' : 'ru-RU', { dateStyle: 'long', timeStyle: 'short' }) : '');
  const day = ts => (ms(ts) ? new Date(ms(ts)).toLocaleDateString(ctx.lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
  const fmt = n => (Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n));
  const time = ts => `<time datetime="${ms(ts) ? new Date(ms(ts)).toISOString() : ''}" title="${esc(fullDate(ts))}">${ago(ts)}</time>`;

  const appByTag = tag => ctx.apps.find(a => [a.name, a.nameEn].some(n => n && appTag(n).toLowerCase() === tag.toLowerCase()));

  // Текст пишут посетители: сначала esc, потом ссылки (только http/https), упоминания @имя и хэштеги программ.
  const rich = s => esc(s)
    .replace(/https?:\/\/[^\s<]+[^\s<.,:;"')\]!?]/g, u => `<a class="r-link" href="${u}" target="_blank" rel="noopener nofollow ugc">${u}</a>`)
    // Телефон часто пишет @Neba с большой буквы: имена без учёта регистра.
    .replace(/(^|[\s(])@([a-z0-9_]{1,20})\b/gi, (_, pre, raw) => {
      const n = raw.toLowerCase();
      return n === 'everyone' ? `${pre}<b class="r-all">@everyone</b>` : `${pre}<a class="r-link" href="#u/${n}">@${raw}</a>`;
    })
    .replace(TAG_RE, (m, pre, tag) => {
      const app = appByTag(tag);
      return app ? `${pre}<a class="r-link" href="#app/${esc(app.id)}">#${tag}</a>` : m;
    });

  // Как в Notion: строки «- текст» и «1. текст» — списки, строка «---» — черта между частями. Остальное как есть.
  function richBlocks(s) {
    const out = [];
    let text = [];
    let list = null;
    const flushText = () => {
      while (text.length && !text[0].trim()) text.shift(); // отступы у списков и черты дают поля, пустые строки рядом лишние
      while (text.length && !text.at(-1).trim()) text.pop();
      if (text.length) out.push(rich(text.join('\n')));
      text = [];
    };
    const flushList = () => {
      if (list) out.push(`<${list.tag} class="r-list-${list.tag}"${list.start > 1 ? ` start="${list.start}"` : ''}>${list.items.map(i => `<li>${rich(i)}</li>`).join('')}</${list.tag}>`);
      list = null;
    };
    for (const line of s.split('\n')) {
      const ul = /^\s*[-*•]\s+(.*)$/.exec(line);
      const ol = !ul && /^\s*(\d{1,4})[.)]\s+(.*)$/.exec(line);
      if (ul || ol) {
        flushText();
        const tag = ul ? 'ul' : 'ol';
        if (list?.tag !== tag) { flushList(); list = { tag, start: ol ? +ol[1] : 1, items: [] }; }
        list.items.push(ul ? ul[1] : ol[2]);
        continue;
      }
      flushList();
      if (/^\s*(-{3,}|\*{3,}|_{3,}|—{2,})\s*$/.test(line)) { flushText(); out.push('<hr class="r-hr">'); } else text.push(line);
    }
    flushText();
    flushList();
    return out.join('');
  }

  // Enter в пункте списка начинает следующий пункт, Enter в пустом пункте выходит из списка.
  function continueList(t) {
    if (t.selectionStart !== t.selectionEnd) return false;
    const start = t.value.lastIndexOf('\n', t.selectionStart - 1) + 1;
    const m = /^(\s*)(?:([-*•])|(\d{1,4})([.)]))\s+(.*)$/.exec(t.value.slice(start, t.selectionStart));
    if (!m) return false;
    if (!m[5].trim()) t.setRangeText('', start, t.selectionStart, 'end');
    else t.setRangeText(`\n${m[1]}${m[2] || `${+m[3] + 1}${m[4]}`} `, t.selectionStart, t.selectionStart, 'end');
    t.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  // Кнопки «Список», «Нумерация», «Черта» в посте: на телефоне про «- » и «1. » никто не догадается.
  function insertFormat(btn) {
    const t = btn.closest('form').querySelector('textarea');
    const start = t.value.lastIndexOf('\n', t.selectionStart - 1) + 1;
    const kind = btn.dataset.fmt;
    if (kind === 'hr') {
      const pre = t.selectionStart > start ? '\n' : '';
      t.setRangeText(`${pre}---\n`, t.selectionStart, t.selectionEnd, 'end');
    } else {
      const prev = /^\s*(\d{1,4})[.)]\s/.exec(t.value.slice(t.value.lastIndexOf('\n', start - 2) + 1, start));
      const mark = kind === 'ul' ? '- ' : `${prev && start ? +prev[1] + 1 : 1}. `;
      if (!t.value.slice(start).startsWith(mark)) t.setRangeText(mark, start, start, 'preserve');
    }
    t.focus();
    t.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Строка каретки в textarea: копия поля с текстом до каретки. Подсказка @ встаёт под эту строку,
  // а не под всё поле: на телефоне низ длинного поля спрятан под клавиатурой.
  function caretBottom(t) {
    const cs = getComputedStyle(t);
    const div = document.createElement('div');
    for (const p of ['boxSizing', 'width', 'padding', 'borderWidth', 'font', 'lineHeight', 'letterSpacing', 'wordSpacing', 'tabSize']) div.style[p] = cs[p];
    Object.assign(div.style, { position: 'absolute', visibility: 'hidden', top: '0', left: '-9999px', borderStyle: 'solid', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' });
    div.textContent = t.value.slice(0, t.selectionStart);
    const mark = div.appendChild(document.createElement('span'));
    mark.textContent = '​';
    document.body.append(div);
    const y = mark.offsetTop + mark.offsetHeight - t.scrollTop;
    div.remove();
    return Math.min(Math.max(y, 0), t.offsetHeight);
  }

  // Пост разработчика про свою программу помечен значком. Синим выделяется только «обновление программы» —
  // автор сам ставит галочку, иначе каждый его пост о программе горел бы синим.
  const isDevPost = p => {
    const app = p.appId && ctx.apps.find(a => a.id === p.appId);
    return !!app && [app.authorUid, ...(app.coauthors || [])].includes(p.uid);
  };
  const isUpdatePost = p => p.update === true && isDevPost(p);
  const devBadge = p => (isDevPost(p) ? `<span class="r-devbadge">${ICON.check}${T(isUpdatePost(p) ? 'Обновление программы' : 'От разработчика')}</span>` : '');

  // Черновики лежат в этом браузере (посты ещё и в базе, см. watchDrafts): недописанное не пропадёт, если уйти со страницы.
  const draftKey = k => `draft:${me()}:${k}`;
  const getDraft = k => { try { return JSON.parse(localStorage.getItem(draftKey(k))); } catch { return null; } };
  const setDraft = (k, v) => {
    try { if (v) localStorage.setItem(draftKey(k), JSON.stringify(v)); else localStorage.removeItem(draftKey(k)); } catch { /* приватный режим */ }
  };
  // ponytail: фото в черновик поста не кладём — они большие, localStorage переполнится.
  // Галочка «обновление» в новом посте видна, только когда в теге стоит своя программа.
  function syncUpdateCheck(form) {
    const box = form.querySelector('.r-update-check');
    if (!box) return;
    const app = appByTag(appTag(form.elements.tag.value.trim().replace(/^#/, '')));
    box.hidden = !isDevPost({ appId: app?.id, uid: me() });
    if (box.hidden) form.elements.update.checked = false;
  }
  // Черновики постов — список, как на Reddit: у каждой формы свой черновик (draftId), вкладка «Черновики» показывает все.
  let draftId = '';
  function postDrafts() {
    const list = getDraft('posts') || [];
    const old = getDraft('post'); // единственный черновик из прошлой версии
    if (old) { list.unshift({ id: 'old', at: Date.now(), ...old }); setDraft('posts', list); setDraft('post', null); }
    return list;
  }
  const putPostDraft = (id, d) => {
    const list = postDrafts().filter(x => x.id !== id);
    setDraft('posts', d ? [{ ...d, id, at: Date.now() }, ...list].slice(0, 50) : list.length ? list : null);
    pushDrafts();
  };
  // Копия списка в базе (drafts/{uid}) — черновики видны на всех устройствах.
  // Пишем через 1,5 с после последней буквы; пока запись ждёт, пришедшая из базы версия не перебивает свою.
  // ponytail: если писать один пост сразу с двух устройств, побеждает последнее сохранение целиком.
  let pushTimer = 0, stopDrafts = null;
  function pushDrafts() {
    if (!ctx.user) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      pushTimer = 0;
      F().setDoc(ref('drafts', me()), { posts: postDrafts() }).catch(console.error);
    }, 1500);
  }
  function watchDrafts() {
    stopDrafts?.();
    stopDrafts = null;
    clearTimeout(pushTimer);
    pushTimer = 0;
    if (!ctx.user) return;
    let first = true;
    stopDrafts = F().onSnapshot(ref('drafts', me()), snap => {
      if (pushTimer || snap.metadata.hasPendingWrites) return;
      const cloud = snap.data()?.posts || [];
      let list = cloud;
      if (first) { // первый раз сливаем с тем, что лежало только в этом браузере
        const byId = new Map(cloud.map(d => [d.id, d]));
        postDrafts().forEach(d => { if (!byId.has(d.id) || byId.get(d.id).at < d.at) byId.set(d.id, d); });
        list = [...byId.values()].sort((a, b) => b.at - a.at).slice(0, 50);
      }
      setDraft('posts', list.length ? list : null);
      if (first && JSON.stringify(list) !== JSON.stringify(cloud)) pushDrafts();
      first = false;
      if (view.querySelector('.r-drafts')) renderDrafts();
      else { const nav = view.querySelector('.r-submit-tabs'); if (nav) nav.outerHTML = submitTabs(false); } // число у вкладки
    }, console.error);
  }
  function savePostDraft(form) {
    const { title, body, tag } = Object.fromEntries(new FormData(form));
    const update = !!form.elements.update?.checked;
    if (!draftId) return;
    putPostDraft(draftId, title.trim() || body.trim() || tag.trim() || update ? { title, body, tag, update } : null);
  }
  const submitTabs = drafts => `
    <nav class="r-tabs r-submit-tabs" aria-label="${T('Создать пост')}">
      <a href="#submit" aria-current="${drafts ? 'false' : 'page'}">${T('Пост')}</a>
      <a href="#submit/drafts" aria-current="${drafts ? 'page' : 'false'}">${T('Черновики')}${postDrafts().length ? ` <b class="r-count">${postDrafts().length}</b>` : ''}</a>
    </nav>`;

  function renderDrafts() {
    const list = postDrafts();
    const main = `
      <h1 class="r-h1">${T('Создать пост')}</h1>
      ${submitTabs(true)}
      <div class="r-drafts">${list.length ? list.map(d => `
        <article class="r-draft">
          <a class="r-draft-open" href="#submit/draft/${esc(d.id)}">
            <b>${esc(d.title.trim() || T('Без заголовка'))}</b>
            ${d.body.trim() ? `<span class="r-draft-body">${esc(d.body.trim().slice(0, 200))}</span>` : ''}
            <small>${d.tag.trim() ? `#${esc(d.tag.trim().replace(/^#/, ''))} · ` : ''}${T('изменён {when}', { when: ago({ toMillis: () => d.at }) })}</small>
          </a>
          <button type="button" class="r-iconbtn" data-s-del-draft="${esc(d.id)}" aria-label="${T('Удалить черновик')}" title="${T('Удалить черновик')}">${ICON.trash || '×'}</button>
        </article>`).join('') : `<p class="empty r-note">${T('Черновиков нет. Недописанный пост сохранится сюда сам.')}</p>`}
      </div>`;
    view.innerHTML = page(main, `
      <section class="r-card">
        <h3 class="r-card-title small">${T('Черновики')}</h3>
        <p class="r-sub">${T('Недописанные посты сохраняются сами, пока вы печатаете. Они хранятся в этом браузере.')}</p>
      </section>`);
  }

  const imageTag = url => (DATA_IMAGE.test(url || '') ? `<img class="c-image" src="${url}" alt="${T('Картинка в комментарии')}" loading="lazy" tabindex="0" role="button">` : '');

  /* ---------- Картинка в комментарии ---------- */

  const emojiBtn = () => `
    <details class="emoji">
      <summary class="r-iconbtn" title="${T('Эмодзи')}" aria-label="${T('Эмодзи')}">${ICON.smile}</summary>
      <div class="pop emoji-panel">${EMOJI.map(e => `<button type="button" data-emoji="${e}">${e}</button>`).join('')}</div>
    </details>`;

  const stickerBtn = () => `
    <details class="emoji">
      <summary class="r-iconbtn" title="${T('Стикеры')}" aria-label="${T('Стикеры')}">${ICON.sticker}</summary>
      <div class="pop emoji-panel sticker-panel">${STICKERS.map(id => `<button type="button" data-sticker="${id}" aria-label="${T('Стикер')}"><img src="assets/stickers/${id}.svg" alt="" loading="lazy"></button>`).join('')}</div>
    </details>`;

  // Сообщение только из эмодзи показываем крупно, как в Телеграме: чем их меньше, тем крупнее (до 3 штук).
  const EMOJI_RE = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator})/u;
  const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  function emojiOnly(text) {
    const parts = [...graphemes.segment(text.replace(/\s+/g, ''))].map(x => x.segment);
    return parts.length <= 3 && parts.length && parts.every(x => EMOJI_RE.test(x)) ? parts.length : 0;
  }
  const stickerTag = id => (STICKERS.includes(id) ? `<img class="c-sticker" src="assets/stickers/${id}.svg" alt="${T('Стикер')}">` : '');

  // Стикер уходит сразу по нажатию, как в мессенджерах.
  function sendSticker(btn) {
    const form = btn.closest('form');
    btn.closest('details').open = false;
    if (form.dataset.sForm === 'chat') sendChat(form, { sticker: btn.dataset.sticker });
    else addComment(form, btn.dataset.sticker);
  }

  // Эмодзи идёт в то поле формы, где стоял курсор последним: в заголовок поста или в текст.
  function insertEmoji(btn) {
    const form = btn.closest('form');
    const input = form.emojiField?.isConnected ? form.emojiField : form.querySelector('textarea');
    input.setRangeText(btn.dataset.emoji, input.selectionStart, input.selectionEnd, 'end');
    btn.closest('details').open = false;
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const MAX_IMAGES = 10; // фото в одном посте
  const attachBar = (stickers = false, multi = false) => `
    <div class="attach"${multi ? ' data-multi' : ''}>
      ${emojiBtn()}
      ${stickers ? stickerBtn() : ''}
      ${multi ? [['ul', 'Список'], ['ol', 'Нумерованный список'], ['hr', 'Черта между частями']].map(([k, l]) => `<button type="button" class="r-iconbtn" data-fmt="${k}" title="${T(l)}" aria-label="${T(l)}">${ICON[k]}</button>`).join('') : ''}
      <label class="r-iconbtn" title="${T('Добавить картинку или гифку')}">${ICON.image}<span class="sr">${T('Добавить картинку или гифку')}</span>
        <input class="sr" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif,.heic,.heif" data-attach${multi ? ' multiple' : ''}></label>
      ${multi ? '<span class="attach-list"></span>' : `<input type="hidden" name="image">${attachItem()}`}
    </div>`;
  // Превью прикреплённой картинки. В посте их несколько, у каждой своё поле image.
  const attachItem = (url = '') => `
      <span class="attach-preview"${url ? '' : ' hidden'}>${url ? `<input type="hidden" name="image" value="${url}">` : ''}<img alt="${T('Открыть картинку')}" tabindex="0" role="button"${url ? ` src="${url}"` : ''}><button type="button" data-attach-clear aria-label="${T('Убрать картинку')}">×</button></span>`;

  function clearAttach(form) {
    const box = form.querySelector('.attach');
    if (!box) return;
    if (box.dataset.multi !== undefined) { box.querySelector('.attach-list').innerHTML = ''; return; }
    box.querySelector('[name=image]').value = '';
    box.querySelector('.attach-preview').hidden = true;
  }

  async function attach(input, file) {
    const files = file ? [].concat(file) : [...input.files];
    input.value = ''; // чтобы тот же файл можно было выбрать снова
    if (!files.length) return;
    const box = input.closest('.attach');
    if (box.dataset.multi !== undefined) {
      const list = box.querySelector('.attach-list');
      const room = MAX_IMAGES - list.children.length;
      if (files.length > room) ctx.toast(T('В посте можно до {n} фото.', { n: MAX_IMAGES }));
      for (const f of files.slice(0, Math.max(room, 0))) {
        try { list.insertAdjacentHTML('beforeend', attachItem(await fileToImage(f))); }
        catch (e) { attachFailed(e); }
      }
      return;
    }
    try {
      const url = await fileToImage(files[0]);
      box.querySelector('[name=image]').value = url;
      box.querySelector('.attach-preview img').src = url;
      box.querySelector('.attach-preview').hidden = false;
    } catch (e) { attachFailed(e); }
  }

  function attachFailed(e) {
    console.error(e);
    ctx.toast(T(e.message === 'big-gif' ? 'Гифка слишком большая: можно до 580 КБ.' : 'Не получилось открыть эту картинку. Попробуйте JPG или PNG.'));
  }

  function fail(e) {
    console.error(e);
    ctx.toast(T(e?.code === 'permission-denied' ? 'Нет прав на это действие. Возможно, правила базы ещё не обновлены.' : 'Не получилось. Попробуйте ещё раз.'));
  }

  function needAccount() {
    if (!ctx.user) { location.hash = 'account'; return true; }
    if (!pub) {
      ctx.toast(T('Сначала выберите @имя в профиле.'));
      location.hash = 'account';
      return true;
    }
    return false;
  }

  const page = (main, aside = '') => `
    <div class="r-page">
      <div class="r-main">${main}</div>
      ${aside ? `<aside class="r-aside">${aside}</aside>` : ''}
    </div>`;
  const note = html => { view.innerHTML = page(`<p class="empty r-note">${html}</p>`); };
  function notReady() {
    if (ctx.authState === 'failed') { note(T('Сервис сейчас недоступен. Обновите страницу позже.')); return true; }
    if (!F() || ctx.authState === 'loading') { note(T('Загрузка…')); return true; }
    return false;
  }

  /* ---------- Голоса ---------- */

  function voteBox(kind, id, score) {
    const key = `${kind}_${id}`;
    const v = myVotes.get(key) || 0;
    return `
      <div class="r-vote${v > 0 ? ' up' : v < 0 ? ' down' : ''}" data-vote-box="${esc(key)}" data-base="${(score || 0) - v}">
        <button type="button" class="r-arrow" data-vote="${kind}" data-id="${esc(id)}" data-dir="1" aria-pressed="${v > 0}" aria-label="${T('Голос за')}">${ICON.up}</button>
        <span class="r-score">${fmt(score || 0)}</span>
        <button type="button" class="r-arrow" data-vote="${kind}" data-id="${esc(id)}" data-dir="-1" aria-pressed="${v < 0}" aria-label="${T('Голос против')}">${ICON.down}</button>
      </div>`;
  }

  function paintVotes(key) {
    const v = myVotes.get(key) || 0;
    document.querySelectorAll(`[data-vote-box="${CSS.escape(key)}"]`).forEach(box => {
      box.classList.toggle('up', v > 0);
      box.classList.toggle('down', v < 0);
      box.querySelector('.r-score').textContent = fmt(+box.dataset.base + v);
      box.querySelectorAll('[data-dir]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.dir === v)));
    });
  }

  async function vote(btn) {
    if (!ctx.user) { location.hash = 'account'; return; }
    const { vote: kind, id } = btn.dataset;
    const dir = +btn.dataset.dir;
    const key = `${kind}_${id}`;
    const before = myVotes.get(key) || 0;
    const after = before === dir ? 0 : dir;
    myVotes.set(key, after);
    paintVotes(key);
    try {
      const batch = F().writeBatch(ctx.db);
      batch.set(ref('votes', `${key}_${me()}`), { uid: me(), kind, target: id, v: after });
      // Счёт программы (a) лежит отдельно: каталог правит один админ.
      if (kind === 'a') batch.set(ref('applikes', id), { n: F().increment(after - before) }, { merge: true });
      else batch.update(ref(kind === 'p' ? 'posts' : 'tcomments', id), { score: F().increment(after - before) });
      await batch.commit();
      if (kind === 'a') ctx.onAppLike?.(id, after - before);
      const item = kind === 'p' ? thread?.post?.id === id && thread.post : thread?.comments.find(c => c.id === id);
      if (item) item.score = (item.score || 0) + after - before;
    } catch (e) {
      myVotes.set(key, before);
      paintVotes(key);
      fail(e);
    }
  }

  /* ---------- Подписки ---------- */

  function followBtn(uid, extra = '') {
    if (uid === me()) return '';
    const mine = following.has(uid);
    const theirs = followers.has(uid);
    const label = mine && theirs ? 'Подписан(а) на вас' : mine ? 'Вы подписаны' : theirs ? 'Подписаться в ответ' : 'Подписаться';
    return `<button type="button" class="r-pill ${mine ? 'ghost' : 'primary'} ${extra}" data-s-follow="${esc(uid)}" aria-pressed="${mine}">${T(label)}</button>`;
  }

  async function toggleFollow(uid) {
    if (needAccount()) return;
    const id = `${me()}_${uid}`;
    try {
      if (following.has(uid)) {
        await F().deleteDoc(ref('follows', id));
        following.delete(uid);
      } else {
        await F().setDoc(ref('follows', id), { from: me(), to: uid, createdAt: F().serverTimestamp() });
        following.add(uid);
        ctx.notify('follow', '', uid, '', '');
      }
      if (ctx.route().name === 'u' && shownProfile === uid) ctx.render();
      else document.querySelectorAll(`[data-s-follow="${CSS.escape(uid)}"]`).forEach(b => { b.outerHTML = followBtn(uid, [...b.classList].includes('wide') ? 'wide' : ''); });
    } catch (e) { fail(e); }
  }

  /* ---------- Карточки постов ---------- */

  function relation(uid) {
    if (!ctx.user || uid === me()) return '';
    if (isMutual(uid)) return `<span class="r-tag mutual">${T('подписан(а) на вас')}</span>`;
    if (following.has(uid)) return `<span class="r-tag">${T('подписка')}</span>`;
    return '';
  }

  // Хэштег программы стоит под текстом поста отдельной меткой.
  function tagChip(appId) {
    const app = appId && ctx.apps.find(a => a.id === appId);
    return app ? `<a class="r-tagchip" href="#app/${esc(app.id)}">#${esc(appTag(ctx.nm(app)))}</a>` : '';
  }

  const shareBtn = href => `<button type="button" class="r-pill" data-s-share="${esc(href)}">${ICON.share}<span>${T('Поделиться')}</span></button>`;

  // Картинка поста. Место под неё занято сразу, поэтому лента не прыгает, когда файл догрузится.
  // Несколько фото — лента, которая листается стрелками или свайпом; все кадры в пропорциях первого.
  const postMedia = p => {
    if (!p.imageRatio) return '';
    const n = Math.min(MAX_IMAGES, Math.max(1, p.images || 1));
    const box = i => `<div class="r-media" data-media="${esc(i ? `${p.id}_${i}` : p.id)}" style="aspect-ratio:${Math.min(3, Math.max(0.4, +p.imageRatio || 1))}"></div>`;
    if (n === 1) return box(0);
    return `
      <div class="r-gallery">
        <div class="r-gallery-track">${Array.from({ length: n }, (_, i) => box(i)).join('')}</div>
        <button type="button" class="r-gallery-step prev" data-gallery-step="-1" aria-label="${T('Предыдущее фото')}" hidden>${ICON.back}</button>
        <button type="button" class="r-gallery-step next" data-gallery-step="1" aria-label="${T('Следующее фото')}">${ICON.back}</button>
        <span class="r-gallery-count">1/${n}</span>
      </div>`;
  };
  // Номер кадра и стрелки по краям обновляются, когда ленту листают любым способом.
  view.addEventListener('scroll', e => {
    const track = e.target;
    if (!track.classList?.contains('r-gallery-track')) return;
    const n = track.children.length;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    const g = track.parentElement;
    g.querySelector('.r-gallery-count').textContent = `${i + 1}/${n}`;
    g.querySelector('.prev').hidden = i === 0;
    g.querySelector('.next').hidden = i >= n - 1;
  }, true);

  // Файлы постов и личных сообщений, уже скачанные за этот визит.
  const mediaFiles = new Map();
  const mediaKey = box => `${box.dataset.chat || 'post'}/${box.dataset.media}`;

  async function loadChatFile(chat, id, parts = 1) {
    const key = `${chat}/${id}`;
    if (!mediaFiles.has(key)) {
      const ids = Array.from({ length: parts }, (_, i) => (i ? `${id}_${i}` : id));
      const docs = await Promise.all(ids.map(x => F().getDoc(ref('chats', chat, 'media', x)).catch(() => null)));
      mediaFiles.set(key, docs.map(d => d?.data()?.data || '').join(''));
    }
    return mediaFiles.get(key);
  }

  async function fillMedia(box) {
    const { media: id, chat } = box.dataset;
    let url;
    if (chat) url = await loadChatFile(chat, id);
    else {
      const key = mediaKey(box);
      if (!mediaFiles.has(key)) mediaFiles.set(key, (await F().getDoc(ref('postimages', id)).catch(() => null))?.data()?.image || '');
      url = mediaFiles.get(key);
    }
    if (DATA_IMAGE.test(url || '')) box.innerHTML = `<img class="r-media-bg" src="${url}" alt=""><img class="r-media-img" src="${url}" alt="${T(chat ? 'Фото в сообщении' : 'Картинка в посте')}"${box.closest(FEED_CARD) ? '' : ' tabindex="0" role="button"'}>`;
  }

  // Просмотр картинки поверх страницы, как на Reddit. Картинки у нас data:, поэтому сохранить можно прямо из src.
  function openImage(source) {
    const dlg = document.createElement('dialog');
    dlg.className = 'r-view';
    dlg.innerHTML = `
      <div class="r-view-bar">
        <button type="button" data-view-copy>${T('Скопировать')}</button>
        <a data-view-save>${T('Сохранить')}</a>
        <button type="button" data-view-close aria-label="${T('Закрыть')}">×</button>
      </div>
      <img alt="">`;
    const image = dlg.querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    const save = dlg.querySelector('[data-view-save]');
    save.href = source.src;
    save.download = `yaytsa-cloud.${source.src.slice(11, source.src.indexOf(';'))}`;
    const copy = dlg.querySelector('[data-view-copy]');
    copy.addEventListener('click', async () => {
      // В буфер браузеры принимают только PNG. Промис внутри ClipboardItem нужен Safari: иначе он теряет нажатие.
      const png = new Promise((done, fail) => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(image, 0, 0);
        canvas.toBlob(blob => (blob ? done(blob) : fail(new Error('png'))));
      });
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
        copy.textContent = T('Скопировано');
      } catch {
        copy.textContent = T('Не удалось скопировать');
      }
    });
    dlg.addEventListener('click', e => {
      if (e.target === dlg || e.target.closest('[data-view-close]')) dlg.close();
    });
    dlg.addEventListener('close', () => dlg.remove());
    document.body.append(dlg);
    dlg.showModal();
  }
  const viewable = el => el.closest('.c-image, .attach-preview img, .r-media-img:not(' + FEED_CARD + ' *)');
  view.addEventListener('keydown', e => {
    if (e.key === 'Enter' && viewable(e.target)) openImage(e.target);
  });

  // Качаем картинку, только когда карточка подъезжает к экрану.
  const mediaSeen = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    mediaSeen.unobserve(e.target);
    fillMedia(e.target);
  }), { rootMargin: '600px' });
  new MutationObserver(() => {
    view.querySelectorAll('.r-media:not([data-watched])').forEach(box => {
      box.dataset.watched = '';
      // Переписка перерисовывается часто: уже скачанное показываем сразу, чтобы фото не мигало.
      if (mediaFiles.has(mediaKey(box))) fillMedia(box);
      else mediaSeen.observe(box);
    });
  }).observe(view, { childList: true, subtree: true });

  // Имя сверху, @логин под ним.
  const names = uid => `<span class="r-names"><b>${esc(shownName(uid))}</b>${handle(uid) ? `<small>@${esc(handle(uid))}</small>` : ''}</span>`;

  const postCard = (p, { author = true } = {}) => `
    <article class="r-post${isUpdatePost(p) ? ' dev' : ''}" data-href="#post/${esc(p.id)}">
      ${devBadge(p)}
      <div class="r-meta">
        ${author ? `<a class="r-who" href="${profileHref(p.uid)}">${ava(p.uid, 32)}${names(p.uid)}</a>${relation(p.uid)}<span class="r-dot">•</span>` : ''}
        ${time(p.createdAt)}
      </div>
      <h2 class="r-title"><a href="#post/${esc(p.id)}">${esc(p.title)}</a></h2>
      ${p.body ? `<div class="r-preview">${esc(p.body)}</div>` : ''}
      ${postMedia(p)}
      ${tagChip(p.appId)}
      <div class="r-actions">
        ${voteBox('p', p.id, p.score)}
        <a class="r-pill" href="#post/${esc(p.id)}" aria-label="${T('Комментарии: {n}', { n: p.commentCount || 0 })}">${ICON.comment}<span>${fmt(p.commentCount || 0)}</span></a>
        ${shareBtn(`#post/${p.id}`)}
      </div>
    </article>`;

  /* ---------- Лента ---------- */

  const SORTS = [['hot', 'Популярное'], ['new', 'Новое'], ['top', 'Лучшее'], ['following', 'Подписки']];

  // Формула «горячего» как у Reddit: голоса по логарифму плюс свежесть. Подписки поднимаются выше, взаимные ещё выше.
  function hot(p) {
    const s = p.score || 0;
    const t = (ms(p.createdAt) || Date.now()) / 1000;
    const boost = isMutual(p.uid) ? 1.5 : following.has(p.uid) ? 1 : 0;
    return Math.sign(s) * Math.log10(Math.max(Math.abs(s), 1)) + Math.log10(1 + (p.commentCount || 0)) * 0.5 + t / 45000 + boost;
  }

  async function renderFeed(sort) {
    if (notReady()) return;
    const my = ++seq;
    document.title = `${T('Лента')} — ${T('Яйца Cloud')}`;
    // При смене сортировки старый список стоит на месте, пока не придёт новый: страница не прыгает.
    const bar = view.querySelector('.r-feedbar .r-sorts'); // только лента: такие же кнопки есть в «Сообществе»
    if (bar) bar.querySelectorAll('.r-sort').forEach(a => a.setAttribute('aria-current', a.getAttribute('href').replace(/^#feed\/?/, '') === (sort === 'hot' ? '' : sort) ? 'page' : 'false'));
    else view.innerHTML = feedShell(sort, `<p class="empty r-note">${T('Загрузка…')}</p>`, '');
    let list;
    try {
      // ponytail: берём 200 свежих постов и ранжируем в браузере. Когда постов станет много, нужен серверный рейтинг.
      list = rows(await F().getDocs(F().query(col('posts'), F().orderBy('createdAt', 'desc'), F().limit(200))));
    } catch (e) {
      console.error(e);
      if (my === seq) view.innerHTML = feedShell(sort, `<p class="empty r-note">${T('Лента сейчас недоступна.')}</p>`, '');
      return;
    }
    await loadPeople(list.map(p => p.uid));
    if (my !== seq) return;
    if (sort === 'following') list = list.filter(p => following.has(p.uid));
    const by = { hot: (a, b) => hot(b) - hot(a), new: (a, b) => ms(b.createdAt) - ms(a.createdAt), top: (a, b) => (b.score || 0) - (a.score || 0) };
    list.sort(by[sort] || by.new);

    const empty = sort === 'following'
      ? (ctx.user ? T('Здесь будут посты тех, на кого вы подписаны.') : `<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы видеть посты подписок.')}`)
      : T('Пока никто ничего не написал. Будьте первым!');

    // Популярные авторы: сумма голосов за их посты в ленте.
    const weight = new Map();
    list.forEach(p => weight.set(p.uid, (weight.get(p.uid) || 0) + (p.score || 0) + (p.commentCount || 0)));
    const top = [...weight].filter(([uid]) => handle(uid) && uid !== me()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const aside = `
      <section class="r-card">
        <h3 class="r-card-title">${T('Лента')}</h3>
        <p class="r-card-text">${T('Популярные обсуждения со всего сайта. Посты тех, на кого вы подписаны, стоят выше.')}</p>
        <a class="r-pill primary wide" href="#submit">${ICON.plus}<span>${T('Создать пост')}</span></a>
      </section>
      ${top.length ? `
        <section class="r-card">
          <h3 class="r-card-title small">${T('Популярные авторы')}</h3>
          <ul class="r-people">${top.map(([uid]) => `
            <li><a class="r-who" href="${profileHref(uid)}">${ava(uid, 32)}<span><b>${esc(shownName(uid))}</b><small>@${esc(handle(uid))}</small></span></a>${ctx.user ? followBtn(uid, 'small') : ''}</li>`).join('')}
          </ul>
        </section>` : ''}`;
    view.innerHTML = feedShell(sort, list.length ? list.map(p => postCard(p)).join('') : `<p class="empty r-note">${empty}</p>`, aside);
  }

  const feedShell = (sort, body, aside) => page(`
    <div class="r-feedbar">
      <div class="r-sorts" role="group" aria-label="${T('Сортировка')}">
        ${SORTS.map(([id, label]) => `<a class="r-sort" href="#feed${id === 'hot' ? '' : `/${id}`}" aria-current="${id === sort ? 'page' : 'false'}">${T(label)}</a>`).join('')}
      </div>
      <a class="r-pill primary r-feed-new" href="#submit">${ICON.plus}<span>${T('Создать пост')}</span></a>
    </div>
    <div class="r-list">${body}</div>`, aside);

  /* ---------- Пост и ветка ---------- */

  async function renderPost(id, focus) {
    if (notReady()) return;
    const my = ++seq;
    if (thread?.post.id !== id) note(T('Загрузка…'));
    let post, comments;
    try {
      const [p, c] = await Promise.all([
        F().getDoc(ref('posts', id)),
        watchComments(id),
      ]);
      if (!p.exists()) { stopComments(); if (my === seq) note(T('Пост не найден или удалён.')); return; }
      post = { id: p.id, ...p.data() };
      comments = c;
    } catch (e) {
      console.error(e);
      stopComments();
      if (my === seq) note(T('Пост сейчас недоступен.'));
      return;
    }
    await loadPeople([post.uid, ...comments.map(c => c.uid)]);
    if (my !== seq) return;
    thread = { post, comments, focus };
    postTitles.set(post.id, post.title);
    drawPost();
  }

  // Комментарии открытого поста — подпиской: первый снимок отдаёт текущие, дальше новые приходят сами.
  let stopThread = null;
  const stopComments = () => { stopThread?.(); stopThread = null; };

  function watchComments(id) {
    stopComments();
    return new Promise((resolve, reject) => {
      let first = true;
      stopThread = F().onSnapshot(F().query(col('tcomments'), F().where('postId', '==', id)), snap => {
        if (first) { first = false; resolve(rows(snap)); }
        else if (!snap.metadata.hasPendingWrites && thread?.post.id === id) liveComments(rows(snap));
      }, e => { if (first) reject(e); else console.error(e); });
    });
  }

  async function liveComments(comments) {
    const t = thread;
    const known = new Set(t.comments.map(c => c.id));
    await loadPeople(comments.map(c => c.uid));
    if (thread !== t) return;
    t.comments = comments;
    t.post.commentCount = Math.max(t.post.commentCount || 0, comments.length);
    const pill = view.querySelector('[data-s-jump]');
    if (pill) {
      pill.lastElementChild.textContent = fmt(t.post.commentCount);
      pill.setAttribute('aria-label', T('Комментарии: {n}', { n: t.post.commentCount }));
    }
    const box = view.querySelector('.r-tree');
    // Открыт ответ, правка или меню — не сбиваем; данные уже свежие, покажем при следующей отрисовке.
    if (!box || box.querySelector('form, details[open]')) return;
    const shut = [...box.querySelectorAll('.r-c.collapsed')].map(el => el.id);
    box.innerHTML = treeHtml();
    shut.forEach(id => document.getElementById(id)?.classList.add('collapsed'));
    comments.forEach(c => known.has(c.id) || document.getElementById(`tc-${c.id}`)?.classList.add('flash'));
  }

  function treeHtml() {
    const { post, comments, focus } = thread;
    return tree(comments, post, focus) || (comments.some(c => !c.deleted) ? '' : `<p class="empty r-note">${T('Комментариев пока нет. Начните обсуждение!')}</p>`);
  }

  function drawPost(keepScroll = false) {
    const { post, focus } = thread;
    const y = scrollY;
    document.title = `${post.title} — ${T('Яйца Cloud')}`;
    const mine = post.uid === me();
    const menu = mine || ctx.isStaff ? `
      <details class="r-menu">
        <summary class="r-iconbtn" aria-label="${T('Ещё')}">${ICON.dots}</summary>
        <div class="r-menu-list">
          ${mine ? `<button type="button" data-s-edit-post>${T('Изменить')}</button>` : ''}
          <button type="button" data-s-del-post>${T('Удалить')}</button>
        </div>
      </details>` : '';
    const sub = handle(post.uid) ? `@${esc(handle(post.uid))}` : '';
    const main = `
      <article class="r-full${isUpdatePost(post) ? ' dev' : ''}">
        <div class="r-full-head">
          <button type="button" class="r-iconbtn r-backbtn" data-s-back aria-label="${T('Назад')}">${ICON.back}</button>
          <a href="${profileHref(post.uid)}">${ava(post.uid, 32)}</a>
          <div class="r-full-who">
            <div class="r-meta"><a class="r-user strong" href="${profileHref(post.uid)}">${esc(shownName(post.uid))}</a>${relation(post.uid)}<span class="r-dot">•</span>${time(post.createdAt)}${post.editedAt ? `<span class="r-dot">•</span><span>${T('изменено')}</span>` : ''}</div>
            ${sub ? `<div class="r-sub">${sub}</div>` : ''}
          </div>
          ${menu}
        </div>
        ${devBadge(post)}
        <h1 class="r-h1">${rich(post.title)}</h1>
        <div class="r-body" id="r-post-body">${post.body ? richBlocks(post.body) : ''}</div>
        ${postMedia(post)}
        ${tagChip(post.appId)}
        <div class="r-actions">
          ${voteBox('p', post.id, post.score)}
          <a class="r-pill" href="#r-comments" data-s-jump aria-label="${T('Комментарии: {n}', { n: post.commentCount || 0 })}">${ICON.comment}<span>${fmt(post.commentCount || 0)}</span></a>
          ${shareBtn(`#post/${post.id}`)}
        </div>
      </article>
      ${composer('')}
      <div class="r-sortline" id="r-comments">
        <label>${T('Сортировка:')}
          <select data-s-sort>
            ${[['best', 'Лучшие'], ['new', 'Новые'], ['old', 'Старые']].map(([v, l]) => `<option value="${v}" ${v === commentSort ? 'selected' : ''}>${T(l)}</option>`).join('')}
          </select>
        </label>
      </div>
      ${focus ? `<div class="r-single">${T('Вы смотрите одну ветку.')} <a class="link" href="#post/${esc(post.id)}">${T('Показать все комментарии')}</a></div>` : ''}
      <div class="r-tree">${treeHtml()}</div>`;
    view.innerHTML = page(main, authorCard(post.uid));
    if (keepScroll) scrollTo(0, y);
    const target = focus && document.getElementById(`tc-${focus}`);
    if (target && !keepScroll) {
      target.scrollIntoView({ block: 'center' });
      target.classList.add('flash');
    }
  }

  function composer(parentId, autofocus = false) {
    if (!ctx.user) return `<a class="r-composer-stub" href="#account">${T('Войдите, чтобы комментировать')}</a>`;
    if (!pub) return `<a class="r-composer-stub" href="#account">${T('Выберите @имя в профиле, чтобы комментировать')}</a>`;
    return `
      <form class="r-composer${parentId ? ' reply open' : ''}" data-s-form="comment" data-parent="${esc(parentId)}">
        <textarea name="text" rows="${parentId ? 3 : 1}" maxlength="5000" data-suggest="@" aria-label="${T(parentId ? 'Ответ' : 'Комментарий')}"
          placeholder="${T(parentId ? 'Напишите ответ' : 'Присоединиться к обсуждению')}" ${autofocus ? 'autofocus' : ''}></textarea>
        <div class="r-composer-bar">
          ${attachBar(true)}
          <button type="button" class="r-pill ghost" data-s-cancel>${T('Отмена')}</button>
          <button class="r-pill primary">${T(parentId ? 'Ответить' : 'Комментировать')}</button>
        </div>
      </form>`;
  }

  const MAX_DEPTH = 7;

  function tree(comments, post, focus) {
    const kids = new Map();
    comments.forEach(c => {
      const k = c.parentId || '';
      if (!kids.has(k)) kids.set(k, []);
      kids.get(k).push(c);
    });
    const cmp = {
      best: (a, b) => (b.score || 0) - (a.score || 0) || ms(b.createdAt) - ms(a.createdAt),
      new: (a, b) => ms(b.createdAt) - ms(a.createdAt),
      old: (a, b) => ms(a.createdAt) - ms(b.createdAt),
    }[commentSort];
    const count = c => (kids.get(c.id) || []).reduce((n, k) => n + 1 + count(k), 0);

    const item = (c, depth) => {
      const children = [...(kids.get(c.id) || [])].sort(cmp);
      const inner = children.map(k => item(k, depth + 1)).join('');
      if (c.deleted && !inner) return ''; // удалённый лист не показываем, как Reddit
      const mine = c.uid === me();
      const more = depth >= MAX_DEPTH && children.length;
      const menu = !c.deleted && (mine || ctx.isStaff) ? `
        <details class="r-menu">
          <summary class="r-iconbtn small" aria-label="${T('Ещё')}">${ICON.dots}</summary>
          <div class="r-menu-list">
            ${mine ? `<button type="button" data-s-edit-comment="${esc(c.id)}">${T('Изменить')}</button>` : ''}
            <button type="button" data-s-del-comment="${esc(c.id)}">${T('Удалить')}</button>
          </div>
        </details>` : '';
      return `
        <div class="r-c" id="tc-${esc(c.id)}">
          <div class="r-c-gut">
            ${c.deleted ? `<span class="r-ava ghost" style="--s:28px" aria-hidden="true"></span>` : `<a href="${profileHref(c.uid)}" tabindex="-1">${ava(c.uid, 28)}</a>`}
            <button type="button" class="r-c-plus" data-s-collapse aria-label="${T('Развернуть ветку')}">${ICON.plus}</button>
          </div>
          <div class="r-c-head r-meta">
            ${c.deleted ? `<span class="r-muted">${T('[удалено]')}</span>` : `<a class="r-user strong" href="${profileHref(c.uid)}">${userLabel(c.uid)}</a>`}
            ${!c.deleted && c.uid === post.uid ? `<span class="r-tag op" title="${T('Автор поста')}">${T('ОП')}</span>` : ''}
            ${!c.deleted ? relation(c.uid) : ''}
            <span class="r-dot">•</span>${time(c.createdAt)}
            ${c.editedAt && !c.deleted ? `<span class="r-dot">•</span><span>${T('изменено')}</span>` : ''}
            <span class="r-c-hidden">${T('(+{n})', { n: count(c) })}</span>
          </div>
          <button type="button" class="r-c-line" data-s-collapse aria-label="${T('Свернуть ветку')}"></button>
          <div class="r-c-content">
            <div class="r-c-body">${c.deleted ? `<p class="r-muted">${T('[комментарий удалён]')}</p>` : richBlocks(c.body)}</div>
            ${c.deleted ? '' : imageTag(c.image) + stickerTag(c.sticker)}
            ${c.deleted ? '' : `
              <div class="r-c-actions">
                ${voteBox('c', c.id, c.score)}
                <button type="button" class="r-pill flat" data-s-reply="${esc(c.id)}">${ICON.comment}<span>${T('Ответить')}</span></button>
                <button type="button" class="r-pill flat" data-s-share="#post/${esc(post.id)}/${esc(c.id)}">${ICON.share}<span>${T('Поделиться')}</span></button>
                ${menu}
              </div>`}
            ${more
              ? `<a class="r-more" href="#post/${esc(post.id)}/${esc(c.id)}">${T('Продолжить ветку')} →</a>`
              : (inner ? `<div class="r-c-kids">${inner}</div>` : '')}
          </div>
        </div>`;
    };
    const roots = focus ? comments.filter(c => c.id === focus) : [...(kids.get('') || [])].sort(cmp);
    return roots.map(c => item(c, 0)).join('');
  }

  async function addComment(form, sticker = '') {
    if (needAccount()) return;
    const text = sticker ? '' : form.elements.text.value.trim();
    const image = sticker ? '' : form.elements.image?.value || '';
    if ((!text && !image && !sticker) || !thread) return;
    const { post } = thread;
    const parentId = form.dataset.parent || '';
    const button = form.querySelector('button:not([type])');
    button.disabled = true;
    try {
      const cRef = F().doc(col('tcomments'));
      const batch = F().writeBatch(ctx.db);
      const data = { postId: post.id, parentId, uid: me(), body: text, score: 1, deleted: false, ...(image ? { image } : {}), ...(sticker ? { sticker } : {}) };
      batch.set(cRef, { ...data, createdAt: F().serverTimestamp() });
      batch.set(ref('votes', `c_${cRef.id}_${me()}`), { uid: me(), kind: 'c', target: cRef.id, v: 1 });
      batch.update(ref('posts', post.id), { commentCount: F().increment(1) });
      await batch.commit();
      const parent = parentId && thread.comments.find(c => c.id === parentId);
      ctx.notify('treply', cRef.id, parent ? parent.uid : post.uid, post.id, text || T(sticker ? '[стикер]' : '[картинка]'));
      notifyMentions(text, post.id, cRef.id, parent ? parent.uid : post.uid);
      myVotes.set(`c_${cRef.id}`, 1);
      thread.comments.push({ id: cRef.id, ...data, createdAt: { toMillis: () => Date.now() } });
      post.commentCount = (post.commentCount || 0) + 1;
      remember(me(), pub);
      drawPost(true);
      document.getElementById(`tc-${cRef.id}`)?.classList.add('flash');
    } catch (e) {
      button.disabled = false;
      fail(e);
    }
  }

  function toggleReply(btn) {
    if (needAccount()) return;
    const content = btn.closest('.r-c-content');
    const open = content.querySelector(':scope > .r-composer');
    if (open) { open.remove(); return; }
    btn.closest('.r-c-actions').insertAdjacentHTML('afterend', composer(btn.dataset.sReply, true));
    content.querySelector(':scope > .r-composer textarea').focus();
  }

  function editForm(kind, id, text, optional = kind === 'post', extra = '') {
    return `
      <form class="r-composer open" data-s-form="edit-${kind}" data-id="${esc(id)}">
        <textarea name="text" rows="5" maxlength="${kind === 'post' ? 10000 : 5000}" ${optional ? '' : 'required'} data-suggest="@" aria-label="${T('Текст')}">${esc(text)}</textarea>
        ${kind === 'post' ? attachBar(false, true) : ''}
        <div class="r-composer-bar">
          ${extra}
          <button type="button" class="r-pill ghost" data-s-cancel-edit>${T('Отмена')}</button>
          <button class="r-pill primary">${T('Сохранить')}</button>
        </div>
      </form>`;
  }

  async function saveEdit(form) {
    const text = form.elements.text.value.trim();
    const kind = form.dataset.sForm === 'edit-post' ? 'post' : 'comment';
    if (form.dataset.loading !== undefined) return ctx.toast(T('Фото ещё загружаются, подождите секунду.'));
    try {
      if (kind === 'post') {
        await savePostEdit(form, text);
        if (form.elements.update) thread.post.update = form.elements.update.checked;
      }
      else {
        const c = thread.comments.find(x => x.id === form.dataset.id);
        if (!text && !c.image && !c.sticker) return;
        await F().updateDoc(ref('tcomments', c.id), { body: text, editedAt: F().serverTimestamp() });
        Object.assign(c, { body: text, editedAt: true });
      }
      drawPost(true);
    } catch (e) { fail(e); }
  }

  // Фото поста при правке: меняем только те, что поменялись, лишние стираем.
  const postImageId = (id, i) => (i ? `${id}_${i}` : id);
  async function savePostEdit(form, text) {
    const { post } = thread;
    const box = form.elements.update;
    const flag = box && box.checked !== (post.update === true) ? { update: box.checked || F().deleteField() } : {};
    if (!form.querySelector('.attach')) {
      await F().updateDoc(ref('posts', post.id), { body: text, editedAt: F().serverTimestamp(), ...flag });
      return Object.assign(post, { body: text, editedAt: true });
    }
    const images = [...form.querySelectorAll('[name=image]')].map(i => i.value).filter(Boolean).slice(0, MAX_IMAGES);
    const had = post.imageRatio ? Math.min(MAX_IMAGES, post.images || 1) : 0;
    const size = images.length && await imageSize(images[0]);
    const ratio = images.length ? +(size.width / size.height).toFixed(3) : 0;
    const batch = F().writeBatch(ctx.db);
    images.forEach((image, i) => {
      const id = postImageId(post.id, i);
      if (i >= had || mediaFiles.get(`post/${id}`) !== image) batch.set(ref('postimages', id), { uid: me(), image });
    });
    for (let i = images.length; i < had; i++) batch.delete(ref('postimages', postImageId(post.id, i)));
    batch.update(ref('posts', post.id), {
      body: text, editedAt: F().serverTimestamp(), ...flag,
      imageRatio: ratio || F().deleteField(),
      images: images.length > 1 ? images.length : F().deleteField(),
    });
    await batch.commit();
    images.forEach((image, i) => mediaFiles.set(`post/${postImageId(post.id, i)}`, image));
    Object.assign(thread.post, { body: text, editedAt: true, imageRatio: ratio || 0, images: images.length > 1 ? images.length : 0 });
    if (!ratio) delete thread.post.imageRatio;
  }

  // В форму правки подставляем уже загруженные фото поста, а сами кадры под ней прячем.
  async function startPostEdit() {
    const { post } = thread;
    const body = document.getElementById('r-post-body');
    const check = isDevPost(post) ? `<label class="mod-check r-update-check"><input type="checkbox" name="update" ${post.update === true ? 'checked' : ''}><span>${T('Это обновление программы')}</span></label>` : '';
    body.innerHTML = editForm('post', post.id, post.body || '', true, check);
    const input = body.querySelector('textarea');
    input.dispatchEvent(new Event('input', { bubbles: true })); // поле сразу по высоте текста, без тесной прокрутки
    input.focus();
    body.parentElement.querySelector(':scope > .r-media, :scope > .r-gallery')?.setAttribute('hidden', '');
    const list = body.querySelector('.attach-list');
    const form = list.closest('form');
    form.dataset.loading = '';
    const n = post.imageRatio ? Math.min(MAX_IMAGES, post.images || 1) : 0;
    const urls = await Promise.all(Array.from({ length: n }, async (_, i) => {
      const key = `post/${postImageId(post.id, i)}`;
      if (!mediaFiles.has(key)) mediaFiles.set(key, (await F().getDoc(ref('postimages', postImageId(post.id, i))).catch(() => null))?.data()?.image || '');
      return mediaFiles.get(key);
    }));
    // Не загрузилось хоть одно фото — правим только текст, иначе при сохранении фото пропали бы.
    if (!urls.every(u => DATA_IMAGE.test(u))) { list.closest('.attach').remove(); delete form.dataset.loading; ctx.toast(T('Не получилось загрузить фото поста, можно изменить только текст.')); return; }
    list.insertAdjacentHTML('afterbegin', urls.map(u => attachItem(u)).join(''));
    delete form.dataset.loading;
  }

  // Стирает текст и картинку, ветка остаётся: на комментарий могли ответить.
  async function eraseComment(c) {
    const clear = { body: '', deleted: true, image: F().deleteField(), sticker: F().deleteField() };
    await F().updateDoc(ref('tcomments', c.id), c.uid === me() ? { ...clear, editedAt: F().serverTimestamp() } : clear);
    Object.assign(c, { body: '', deleted: true, image: '', sticker: '' });
  }


  async function deleteComment(id) {
    const c = thread.comments.find(x => x.id === id);
    if (!c || !await confirmDelete(T('Удалить комментарий?'), c.uid)) return;
    try {
      await eraseComment(c);
      drawPost(true);
    } catch (e) { fail(e); }
  }

  // Удаление со страницы профиля. Если пост уже удалён, ветки нет и комментарий стираем совсем.
  async function deleteProfileComment(id) {
    const c = shownComments.get(id);
    if (!c || !await confirmDelete(T('Удалить комментарий?'), c.uid)) return;
    try {
      if (postTitles.get(c.postId) === '') await F().deleteDoc(ref('tcomments', id));
      else await eraseComment(c);
      ctx.render();
    } catch (e) { fail(e); }
  }

  async function deletePost() {
    const { post, comments } = thread;
    if (!await confirmDelete(T('Удалить пост? Это нельзя отменить.'), post.uid)) return;
    try {
      await F().deleteDoc(ref('posts', post.id));
      postTitles.set(post.id, '');
      // Комментарии без поста никому не нужны. Что не удалилось сейчас, автор сотрёт из своего профиля.
      await Promise.allSettled([
        ...comments.map(c => F().deleteDoc(ref('tcomments', c.id))),
        ...(ctx.isAdmin ? [F().deleteDoc(ref('broadcasts', post.id))] : []),
        ...(post.imageRatio ? Array.from({ length: post.images || 1 }, (_, i) => F().deleteDoc(ref('postimages', i ? `${post.id}_${i}` : post.id))) : []),
      ]);
      const mine = post.uid === me();
      thread = null;
      location.hash = mine && pub ? `u/${pub.username}` : 'feed';
    } catch (e) { fail(e); }
  }

  function authorCard(uid) {
    const p = people.get(uid);
    if (!p) return '';
    return `
      <section class="r-card r-author">
        <div class="r-banner" style="${bannerStyle(uid)}"></div>
        <div class="r-author-head">
          <a href="${profileHref(uid)}">${ava(uid, 56)}</a>
          <div>
            <a class="r-author-name" href="${profileHref(uid)}">${esc(shownName(uid))}</a>
            <div class="r-sub">@${esc(p.username)}</div>
          </div>
        </div>
        ${p.bio ? `<p class="r-card-text">${rich(p.bio)}</p>` : ''}
        ${birthdayLine(p)}
        <div class="r-author-actions">
          ${uid === me() ? `<a class="r-pill ghost wide" href="#account">${T('Изменить профиль')}</a>` : `${followBtn(uid, 'wide')}${writeBtn(uid, p, ' wide')}`}
        </div>
        ${p.createdAt ? `<p class="r-sub">${T('На сайте с {date}', { date: day(p.createdAt) })}</p>` : ''}
      </section>`;
  }

  /* ---------- Кто в сети ---------- */

  // Браузер отмечается раз в 2 минуты, пока вкладка открыта. «В сети» — отметка не старше 4 минут.
  const BEAT = 2 * 60e3;
  // «В сети» — только пока сайт перед глазами: вкладка открыта и окно в фокусе. Свернул окно, переключился
  // на другую программу или вкладку — сразу отмечаемся away, без 4 минут ожидания.
  // ponytail: с двух вкладок или устройств неактивная перебивает активную до её следующей отметки (≤2 мин).
  const here = () => !document.hidden && document.hasFocus();
  let wasHere = null;
  function beat(force = false) {
    if (!ctx.user || (!force && here() === wasHere)) return; // фокус дёргается часто — пишем только смену
    wasHere = here();
    F().setDoc(ref('presence', me()), { at: F().serverTimestamp(), ...(wasHere ? {} : { away: true }) }).catch(console.error);
  }
  setInterval(() => { if (here()) beat(true); }, BEAT);
  document.addEventListener('visibilitychange', () => beat());
  addEventListener('focus', () => beat());
  addEventListener('blur', () => beat());

  const isOnline = (at, isMe, away = false) => isMe || (!away && Date.now() - ms(at) < 2 * BEAT);

  /* ---------- Профиль ---------- */

  const PROFILE_TABS = [['', 'Обзор'], ['posts', 'Посты'], ['comments', 'Комментарии'], ['followers', 'Подписчики'], ['following', 'Подписки']];

  async function renderProfile(name, tab) {
    if (notReady()) return;
    const my = ++seq;
    let uid;
    try {
      uid = await uidByName(name);
    } catch (e) {
      console.error(e);
      if (my === seq) note(T('Профили сейчас недоступны.'));
      return;
    }
    if (my !== seq) return;
    if (!uid) return note(T('Пользователь @{name} не найден.', { name: esc(name) }));
    shownProfile = uid;
    if (!document.querySelector(`.r-profile[data-uid="${CSS.escape(uid)}"]`)) note(T('Загрузка…'));

    let posts, comments, ins, outs;
    try {
      [posts, comments, ins, outs] = await Promise.all([
        F().getDocs(F().query(col('posts'), F().where('uid', '==', uid))).then(rows),
        F().getDocs(F().query(col('tcomments'), F().where('uid', '==', uid))).then(rows),
        F().getDocs(F().query(col('follows'), F().where('to', '==', uid))).then(s => rows(s).map(f => f.from)),
        F().getDocs(F().query(col('follows'), F().where('from', '==', uid))).then(s => rows(s).map(f => f.to)),
        people.has(uid) ? null : loadPeople([uid]),
      ]);
    } catch (e) {
      console.error(e);
      if (my === seq) note(T('Профиль сейчас недоступен.'));
      return;
    }
    // Свежий профиль, а не из кэша: имя и фото могли поменяться.
    try { const d = await F().getDoc(ref('profiles', uid)); remember(uid, d.exists() ? d.data() : null); } catch { /* останется кэш */ }
    const seen = await F().getDoc(ref('presence', uid)).then(d => d.data() || {}, () => ({}));
    const lastSeen = seen.at;
    await loadRoles([uid], true);
    comments = comments.filter(c => !c.deleted);
    shownComments.clear();
    comments.forEach(c => shownComments.set(c.id, c));
    const listed = tab === 'followers' ? ins : tab === 'following' ? outs : [];
    await Promise.all([
      loadPeople(listed),
      Promise.all([...new Set(comments.map(c => c.postId))].filter(id => !postTitles.has(id)).map(async id => {
        try { const d = await F().getDoc(ref('posts', id)); postTitles.set(id, d.exists() ? d.data().title : ''); } catch { postTitles.set(id, ''); }
      })),
    ]);
    if (my !== seq) return;

    const p = people.get(uid);
    if (!p) return note(T('Пользователь @{name} не найден.', { name: esc(name) }));
    const isMe = uid === me();
    document.title = `${p.name || p.username} (@${p.username}) — ${T('Яйца Cloud')}`;

    const byTime = (a, b) => ms(b.createdAt) - ms(a.createdAt);
    const commentCard = c => `
      <article class="r-post r-pcomment" data-href="#post/${esc(c.postId)}/${esc(c.id)}">
        <div class="r-meta">${ICON.comment}<a class="r-ptitle" href="#post/${esc(c.postId)}">${postTitles.get(c.postId) ? esc(postTitles.get(c.postId)) : T('[пост удалён]')}</a></div>
        <div class="r-meta"><span class="r-user strong">${userLabel(uid)}</span><span>${T('ответил(а)')}</span><span class="r-dot">•</span>${time(c.createdAt)}</div>
        <div class="r-preview">${esc(c.body) || T(c.sticker ? '[стикер]' : '[картинка]')}</div>
        <div class="r-actions">
          ${voteBox('c', c.id, c.score)}
          ${postTitles.get(c.postId) ? `<a class="r-pill flat" href="#post/${esc(c.postId)}/${esc(c.id)}">${ICON.comment}<span>${T('Ответить')}</span></a>` : ''}
          ${shareBtn(`#post/${c.postId}/${c.id}`)}
          ${isMe || ctx.isStaff ? `<button type="button" class="r-pill flat" data-s-del-card="${esc(c.id)}">${T('Удалить')}</button>` : ''}
        </div>
      </article>`;
    const personRow = x => `
      <li class="r-person">
        <a class="r-who" href="${profileHref(x)}">${ava(x, 40)}<span><b>${esc(shownName(x))}</b>${handle(x) ? `<small>@${esc(handle(x))}</small>` : ''}</span></a>
        ${ctx.user ? followBtn(x, 'small') : ''}
      </li>`;

    let body;
    if (tab === 'posts') body = posts.sort(byTime).map(x => postCard(x, { author: false })).join('');
    else if (tab === 'comments') body = comments.sort(byTime).map(commentCard).join('');
    else if (tab) body = listed.length ? `<ul class="r-people big">${listed.map(personRow).join('')}</ul>` : '';
    else {
      body = [...posts.map(x => ({ ...x, kind: 'p' })), ...comments.map(x => ({ ...x, kind: 'c' }))].sort(byTime)
        .map(x => (x.kind === 'p' ? postCard(x, { author: false }) : commentCard(x))).join('');
    }
    const emptyText = {
      '': isMe ? 'Вы ещё ничего не публиковали.' : 'Здесь пока пусто.',
      posts: isMe ? 'У вас пока нет постов.' : 'Постов пока нет.',
      comments: 'Комментариев пока нет.',
      followers: 'Подписчиков пока нет.',
      following: 'Ни на кого не подписан(а).',
    }[tab];

    const stat = (n, label, href) => `<a class="r-stat" href="${href}"><b>${fmt(n)}</b><span>${T(label)}</span></a>`;
    const base = `#u/${esc(p.username)}`;
    const main = `
      <div class="r-profile" data-uid="${esc(uid)}">
        <div class="r-hero" style="${bannerStyle(uid)}">${isMe ? `<a class="r-iconbtn r-hero-edit" href="#account" aria-label="${T('Изменить шапку')}">${ICON.edit}</a>` : ''}</div>
        <header class="r-phead">
          <div class="r-pava">
            ${ava(uid, 116)}
            ${isOnline(lastSeen, isMe, seen.away) ? `<span class="r-online" role="img" title="${T('В сети')}" aria-label="${T('В сети')}"></span>` : ''}
          </div>
          <div class="r-phead-text">
            <h1>${esc(p.name || p.username)}${roleTags(uid)}</h1>
            <p class="r-sub">@${esc(p.username)}${!isOnline(lastSeen, isMe, seen.away) && ms(lastSeen) ? `<span class="r-dot">•</span><span>${T('Был(а) в сети {when}', { when: ago(lastSeen) })}</span>` : ''}${!isMe && followers.has(uid) && !isMutual(uid) ? ` <span class="r-tag">${T('подписан(а) на вас')}</span>` : ''}</p>
          </div>
          ${netLinks(uid)}
        </header>
        <div class="r-phead-actions">
          ${isMe
            ? `<a class="r-pill ghost" href="#account">${T('Изменить профиль')}</a>`
            : `${followBtn(uid)}${writeBtn(uid, p)}${modMenu(uid)}`}
          <span class="r-sub">${T('Подписчики')}: <b>${fmt(ins.length)}</b> · ${T('Подписки')}: <b>${fmt(outs.length)}</b></span>
        </div>
        <nav class="r-tabs" aria-label="${T('Разделы профиля')}">
          ${PROFILE_TABS.map(([id, label]) => `<a href="${base}${id ? `/${id}` : ''}" aria-current="${id === tab ? 'page' : 'false'}">${T(label)}</a>`).join('')}
        </nav>
        ${isMe && ['', 'posts'].includes(tab) ? `<a class="r-pill ghost r-create" href="#submit">${ICON.plus}<span>${T('Создать пост')}</span></a>` : ''}
        <div class="r-list">${body || `<p class="empty r-note">${T(emptyText)}</p>`}</div>
      </div>`;
    const aside = `
      <section class="r-card r-pcard">
        <h2 class="r-card-title">${esc(p.name || p.username)}</h2>
        <div class="r-author-actions">
          ${isMe
            ? `<a class="r-pill ghost wide" href="#account">${T('Изменить профиль')}</a>`
            : `${followBtn(uid, 'wide')}${writeBtn(uid, p, ' wide')}`}
        </div>
        ${!isMe && modMenu(uid) ? `<div class="r-pcard-mod">${modMenu(uid)}</div>` : ''}
        ${p.bio ? `<p class="r-card-text">${rich(p.bio)}</p>` : ''}
        ${birthdayLine(p)}
        <div class="r-stats">
          ${stat(ins.length, 'Подписчики', `${base}/followers`)}
          ${stat(outs.length, 'Подписки', `${base}/following`)}
          <div class="r-stat"><b>${fmt(posts.length)}</b><span>${T('Посты')}</span></div>
          <div class="r-stat"><b>${esc(day(p.createdAt) || '—')}</b><span>${T('На сайте с')}</span></div>
        </div>
      </section>
      ${ctx.authorApps(uid)}`;
    view.innerHTML = page(main, aside);
  }

  async function renderUid(uid) {
    if (notReady()) return;
    const my = ++seq;
    await loadPeople([uid]);
    if (my !== seq) return;
    if (handle(uid)) location.replace(`#u/${handle(uid)}`);
    else if (uid === me()) location.replace('#account');
    else note(T('Этот пользователь ещё не создал профиль.'));
  }

  /* ---------- Новый пост ---------- */

  function renderSubmit(appId, drafts = false, openDraft = '') {
    if (drafts && ctx.user && pub) { document.title = `${T('Черновики')} — ${T('Яйца Cloud')}`; return renderDrafts(); }
    const app = ctx.apps.find(a => a.id === appId);
    const dev = ctx.apps.some(a => [a.authorUid, ...(a.coauthors || [])].includes(me()));
    if (notReady()) return;
    document.title = `${T('Создать пост')} — ${T('Яйца Cloud')}`;
    if (!ctx.user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы создать пост.')}`);
    if (!pub) return note(`${T('Сначала выберите @имя.')} <a class="link" href="#account">${T('Открыть профиль')}</a>`);
    const main = `
      <h1 class="r-h1">${T('Создать пост')}</h1>
      ${submitTabs(false)}
      <form class="r-submit" data-s-form="post">
        <div class="r-field">
          <input name="title" maxlength="300" required autocomplete="off" data-suggest="@" placeholder="${T('Заголовок')}*" aria-label="${T('Заголовок')}">
          <span class="r-counter" data-for="title">0/300</span>
        </div>
        <div class="r-field r-field-body">
          <textarea name="body" rows="9" maxlength="10000" data-suggest="@" placeholder="${T('Текст (необязательно)')}" aria-label="${T('Текст')}"></textarea>
          ${attachBar(false, true)}
        </div>
        <label class="field r-tagfield"><span class="sr">${T('Программа')}</span>
          <span class="r-at"><span aria-hidden="true">#</span><input name="tag" maxlength="60" autocomplete="off" data-suggest="app" placeholder="${T('Программа, необязательно')}" value="${app ? esc(appTag(ctx.nm(app))) : ''}"></span>
        </label>
        ${dev ? `<label class="mod-check r-update-check" hidden><input type="checkbox" name="update"><span>${T('Это обновление программы')}</span></label>` : ''}
        ${ctx.isAdmin ? `<p class="r-hint">${T('@everyone отметит всех: пост придёт в уведомления.')}</p>` : ''}
        <div class="r-submit-bar">
          <button type="button" class="r-pill ghost" data-s-back>${T('Отмена')}</button>
          <button class="r-pill primary">${T('Опубликовать')}</button>
        </div>
      </form>`;
    const aside = `
      <section class="r-card">
        <h3 class="r-card-title small">${T('Как писать')}</h3>
        <ol class="r-rules">
          <li>${T('Пост появится на вашей странице и в общей ленте.')}</li>
          <li>${T('Укажите программу в поле под текстом — пост будет виден и на её странице.')}</li>
          <li>${T('Упомяните человека через @имя, ссылки станут кликабельными.')}</li>
          <li>${T('Список — строка с «- » или «1. », черта между частями — «---». Или кнопки под текстом.')}</li>
          ${dev ? `<li>${T('Пост о своей программе с её тегом будет отмечен «От разработчика». Галочка «Это обновление программы» выделит его синим.')}</li>` : ''}
          <li>${T('Будьте вежливы. Админы могут удалить грубость.')}</li>
        </ol>
      </section>`;
    view.innerHTML = page(main, aside);
    const form = view.querySelector('.r-submit');
    const d = openDraft && postDrafts().find(x => x.id === openDraft);
    draftId = d ? d.id : Date.now().toString(36); // новый пост — новый черновик, появится в списке с первой буквы
    if (d) {
      form.elements.title.value = d.title || '';
      form.elements.body.value = d.body || '';
      if (!app) form.elements.tag.value = d.tag || '';
      if (form.elements.update) form.elements.update.checked = !!d.update;
      view.querySelector('.r-counter').textContent = `${form.elements.title.value.length}/300`;
    }
    syncUpdateCheck(form);
  }

  async function addPost(form) {
    if (needAccount()) return;
    const { title, body, tag } = Object.fromEntries(new FormData(form));
    const images = [...form.querySelectorAll('[name=image]')].map(i => i.value).filter(Boolean).slice(0, MAX_IMAGES);
    if (!title.trim()) return;
    const text = `${title}\n${body}`;
    const tagName = tag.trim().replace(/^#/, '');
    const tagged = tagName ? appByTag(appTag(tagName)) : null;
    if (tagName && !tagged) return ctx.toast(T('Такой программы нет. Выберите её из списка.'));
    const update = !!form.elements.update?.checked;
    if (update && !isDevPost({ appId: tagged?.id, uid: me() })) return ctx.toast(T('Обновление — только для своей программы. Укажите её тег.'));
    const button = form.querySelector('button:not([type])');
    button.disabled = true;
    try {
      const pRef = F().doc(col('posts'));
      const batch = F().writeBatch(ctx.db);
      const size = images.length && await imageSize(images[0]);
      batch.set(pRef, {
        uid: me(), title: title.trim(), body: body.trim(), appId: tagged?.id || '', score: 1, commentCount: 0, createdAt: F().serverTimestamp(),
        ...(update ? { update: true } : {}),
        ...(images.length ? { imageRatio: +(size.width / size.height).toFixed(3) } : {}),
        ...(images.length > 1 ? { images: images.length } : {}),
      });
      images.forEach((image, i) => batch.set(ref('postimages', i ? `${pRef.id}_${i}` : pRef.id), { uid: me(), image }));
      batch.set(ref('votes', `p_${pRef.id}_${me()}`), { uid: me(), kind: 'p', target: pRef.id, v: 1 });
      if (ctx.isAdmin && /(^|[\s(])@everyone\b/.test(text)) {
        batch.set(ref('broadcasts', pRef.id), {
          from: me(), fromName: (pub.name || pub.username).slice(0, 80), title: title.trim().slice(0, 120), createdAt: F().serverTimestamp(),
        });
      }
      await batch.commit();
      putPostDraft(draftId, null);
      notifyMentions(`${title} ${body}`, pRef.id, '');
      myVotes.set(`p_${pRef.id}`, 1);
      location.hash = `post/${pRef.id}`;
    } catch (e) {
      button.disabled = false;
      fail(e);
    }
  }

  // Кого отметили через @имя — тем уведомление «Упоминание от …». skip — кому уже ушло уведомление об ответе.
  async function notifyMentions(text, postId, commentId, skip = '') {
    const names = [...new Set([...(text || '').matchAll(/(^|[^a-z0-9_])@([a-z0-9_]{1,20})(?![a-z0-9_])/gi)].map(m => m[2].toLowerCase()))]
      .filter(n => n !== 'everyone').slice(0, 10);
    for (const n of names) {
      const uid = await uidByName(n).catch(() => null);
      if (uid && uid !== me() && uid !== skip) ctx.notify('mention', commentId, uid, postId, text.trim());
    }
  }

  /* ---------- Подсказки # и @ ---------- */

  async function findPeople(q) {
    if (!F() || !/^[a-z0-9_]*$/.test(q)) return [];
    // Поиск по началу @имени: id документа в usernames и есть имя.
    const from = q ? [F().startAt(q), F().endAt(`${q}\uf8ff`)] : [];
    const snap = await F().getDocs(F().query(col('usernames'), F().orderBy(F().documentId()), ...from, F().limit(6)));
    const found = snap.docs.map(d => ({ name: d.id, uid: d.data().uid }));
    found.forEach(f => nameToUid.set(f.name, f.uid));
    await loadPeople(found.map(f => f.uid));
    return found;
  }

  const personLine = (uid, name) => `${ava(uid, 28)}<span><b>${esc(shownName(uid))}</b><small>@${esc(name)}</small></span>`;

  let suggest = null; // открытый список: { box, input, start, items, active }
  let suggestSeq = 0;

  function closeSuggest() {
    suggestSeq++;
    suggest?.box.remove();
    suggest = null;
  }

  function drawSuggest() {
    suggest.box.innerHTML = suggest.items.map((item, i) => `
      <button type="button" class="s-item" role="option" tabindex="-1" data-i="${i}" aria-selected="${i === suggest.active}">${item.html}</button>`).join('');
    if (suggest.active) suggest.box.children[suggest.active]?.scrollIntoView({ block: 'nearest' });
  }

  // Ищем слово с # или @ прямо перед курсором.
  async function updateSuggest(input) {
    const whole = input.dataset.suggest === 'app';
    const before = input.value.slice(0, input.selectionStart);
    const m = whole ? [null, '#', input.value.trim().replace(/^#/, '')] : before.match(/(?:^|[\s(])([#@])([^\s#@]*)$/);
    if (!m || (!whole && !input.dataset.suggest.includes(m[1]))) return closeSuggest();
    const [, sign, q] = m;
    const low = q.toLowerCase();
    const my = ++suggestSeq;
    let items;
    if (sign === '#') {
      items = ctx.apps.filter(a => `${a.name} ${a.nameEn || ''}`.toLowerCase().includes(low) || appTag(`${a.name} ${a.nameEn || ''}`).toLowerCase().includes(low))
        .slice(0, whole ? Infinity : 6) // в поле «Программа» — все, со скроллом: иначе седьмую и дальше не выбрать
        .map(a => ({ insert: appTag(ctx.nm(a)), html: `<img src="${ctx.icon(a)}" alt=""><span><b>${esc(ctx.nm(a))}</b><small>#${esc(appTag(ctx.nm(a)))}</small></span>` }));
    } else {
      const found = await findPeople(low).catch(e => { console.error(e); return []; });
      if (my !== suggestSeq) return;
      items = found.map(f => ({ insert: f.name, html: personLine(f.uid, f.name) }));
      if (ctx.isAdmin && input.closest('.r-submit') && 'everyone'.startsWith(low)) {
        items.unshift({ insert: 'everyone', html: `<span><b>@everyone</b><small>${T('Отметить всех')}</small></span>` });
      }
    }
    if (!items.length) return closeSuggest();
    const box = suggest?.box || Object.assign(document.createElement('div'), { className: 'pop suggest' });
    const fresh = !suggest;
    box.setAttribute('role', 'listbox');
    input.parentElement.append(box);
    box.style.top = input.tagName === 'TEXTAREA' && !input.closest('.r-ask') ? `${input.offsetTop + caretBottom(input) + 4}px` : '';
    suggest = { box, input, whole, start: before.length - q.length, items, active: 0 };
    drawSuggest();
    if (fresh) box.scrollIntoView({ block: 'nearest' });
  }

  function pickSuggest(i) {
    const { input, whole, start, items } = suggest;
    const head = whole ? items[i].insert : `${input.value.slice(0, start)}${items[i].insert} `;
    const tail = whole ? '' : input.value.slice(input.selectionStart);
    closeSuggest();
    input.value = head + tail;
    input.setSelectionRange(head.length, head.length);
    input.focus();
    if (!whole) input.dispatchEvent(new Event('input', { bubbles: true })); // обновит счётчик символов
    else if (input.form?.matches('.r-submit')) { syncUpdateCheck(input.form); savePostDraft(input.form); } // тег из списка
  }

  /* ---------- Поиск в шапке ---------- */

  const searchInput = document.getElementById('search');
  const searchPanel = document.getElementById('search-panel');
  let searchSeq = 0;
  let searchTimer = null;
  let recent = null;
  let recentAt = 0;

  // ponytail: посты ищем среди 200 свежих, как в ленте. Для поиска по всей базе нужен сервер.
  async function recentPosts() {
    if (!recent || Date.now() - recentAt > 60e3) {
      recent = rows(await F().getDocs(F().query(col('posts'), F().orderBy('createdAt', 'desc'), F().limit(200))));
      recentAt = Date.now();
    }
    return recent;
  }

  function closeSearch() {
    searchSeq++;
    searchPanel.hidden = true;
  }

  async function runSearch() {
    const text = searchInput.value.trim();
    if (!text) return closeSearch();
    const my = ++searchSeq;
    const onlyPeople = text.startsWith('@');
    const q = text.replace(/^@/, '').toLowerCase();
    const apps = onlyPeople ? [] : ctx.apps.filter(a => `${a.name} ${a.nameEn || ''}`.toLowerCase().includes(q)).slice(0, 5);
    const ids = new Set(apps.map(a => a.id));
    const quiet = p => p.catch(e => { console.error(e); return []; });
    const [posts, found] = await Promise.all([
      onlyPeople || !F() ? [] : quiet(recentPosts()),
      quiet(findPeople(q)),
    ]);
    if (my !== searchSeq) return;
    // Сначала посты про найденные программы, потом совпадения в заголовке.
    const hits = posts.filter(p => ids.has(p.appId) || p.title.toLowerCase().includes(q))
      .sort((a, b) => ids.has(b.appId) - ids.has(a.appId)).slice(0, 6);
    const appName = id => { const a = ctx.apps.find(x => x.id === id); return a ? ctx.nm(a) : ''; };
    const block = (title, items) => (items.length ? `<h3 class="s-title">${T(title)}</h3>${items.join('')}` : '');
    searchPanel.innerHTML = [
      block('Программы', apps.map(a => `
        <a class="s-item" href="#app/${esc(a.id)}"><img src="${ctx.icon(a)}" alt=""><span><b>${esc(ctx.nm(a))}</b><small>${T(a.community ? 'Сообщество' : 'Программа')}</small></span></a>`)),
      block('Посты', hits.map(p => `
        <a class="s-item" href="#post/${esc(p.id)}"><span class="s-ico">${ICON.comment}</span><span><b>${esc(p.title)}</b><small>${esc(appName(p.appId) || T('Пост'))} · ${T('Комментарии: {n}', { n: p.commentCount || 0 })}</small></span></a>`)),
      block('Люди', found.map(f => `<a class="s-item" href="#u/${esc(f.name)}">${personLine(f.uid, f.name)}</a>`)),
    ].join('') || `<p class="empty s-empty">${T('Ничего не нашлось.')}</p>`;
    searchPanel.hidden = false;
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(runSearch, 180);
  });
  searchInput.addEventListener('focus', runSearch);
  searchInput.closest('.search-wrap').addEventListener('keydown', e => {
    const links = [...searchPanel.querySelectorAll('a')];
    const at = links.indexOf(document.activeElement);
    if (e.key === 'Escape') { closeSearch(); searchInput.focus(); }
    else if (e.key === 'Enter' && e.target === searchInput && links[0]) { e.preventDefault(); links[0].click(); }
    else if (e.key === 'ArrowDown' && links.length) { e.preventDefault(); links[Math.min(at + 1, links.length - 1)].focus(); }
    else if (e.key === 'ArrowUp' && links.length) { e.preventDefault(); (at > 0 ? links[at - 1] : searchInput).focus(); }
  });
  searchPanel.addEventListener('click', e => {
    if (!e.target.closest('a')) return;
    closeSearch();
    searchInput.value = '';
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) closeSearch(); });

  /* ---------- Обсуждения на странице программы ---------- */

  async function fillAppThreads(appId) {
    const box = () => {
      const el = document.getElementById('app-threads');
      return el?.dataset.app === appId ? el : null;
    };
    if (!F()) return;
    try {
      const list = rows(await F().getDocs(F().query(col('posts'), F().where('appId', '==', appId)))).sort((a, b) => hot(b) - hot(a));
      await loadPeople(list.map(p => p.uid));
      if (!box()) return;
      box().innerHTML = `
        <div class="r-list boxed">${list.slice(0, 6).map(p => postCard(p)).join('') || `<p class="empty r-note">${T('Обсуждений пока нет.')}</p>`}</div>
        <a class="r-pill ghost" href="#submit/${esc(appId)}">${ICON.plus}<span>${T('Начать обсуждение')}</span></a>`;
    } catch (e) {
      console.error(e);
      if (box()) box().innerHTML = `<p class="empty">${T('Обсуждения сейчас недоступны.')}</p>`;
    }
  }

  /* ---------- Чаты ---------- */

  const chatId = (a, b) => [a, b].sort().join('_');
  const groupAva = (g, size) => `<span class="r-ava" style="--s:${size}px;--c:${color(g.id)}" aria-hidden="true">${DATA_IMAGE.test(g.photo || '') ? `<img src="${g.photo}" alt="">` : esc((g.name[0] || '?').toUpperCase())}</span>`;

  const chatForm = () => (pub ? `
    <form class="r-chat-form" data-s-form="chat">
      ${emojiBtn()}
      ${stickerBtn()}
      <label class="r-iconbtn r-chat-photo" title="${T('Отправить фото')}">${ICON.image}<span class="sr">${T('Отправить фото')}</span>
        <input class="sr" type="file" accept="image/*,.heic,.heif" data-chat-photo></label>
      <span class="r-chat-staged" hidden></span>
      <textarea name="text" rows="1" maxlength="2000" aria-label="${T('Сообщение')}" placeholder="${T('Сообщение')}"></textarea>
      <span class="r-rec"><i></i><b data-rec-time>0:00</b><button type="button" class="link linkbtn" data-rec-cancel>${T('Отмена')}</button></span>
      <button type="button" class="r-iconbtn r-mic" data-rec-start title="${T('Записать голосовое')}" aria-label="${T('Записать голосовое')}">${ICON.mic}</button>
      <button class="r-send" aria-label="${T('Отправить')}">${ICON.send}</button>
    </form>` : `<a class="r-composer-stub" href="#account">${T('Выберите @имя в профиле, чтобы писать сообщения')}</a>`);

  const newGroupForm = () => `
    <form class="r-group-new" data-s-form="group">
      <h2>${T('Новая группа')}</h2>
      <label class="field">${T('Название')}<input name="name" maxlength="60" required autocomplete="off"></label>
      <label class="field">${T('Участники')}
        <input name="people" required autocomplete="off" data-suggest="@" placeholder="@neba @drug">
        <small class="r-hint">${T('Через пробел, начните с @ и выберите человека из списка.')}</small>
      </label>
      <button class="btn primary">${T('Создать группу')}</button>
    </form>`;

  const roomStatusTag = '<small class="r-room-status" data-room-status hidden></small>';
  const groupRoom = g => `
    <header class="r-room-head">
      <a class="r-iconbtn r-room-back" href="#chat" aria-label="${T('Все чаты')}">${ICON.back}</a>
      ${groupAva(g, 36)}
      <span class="r-group-who"><b>${esc(g.name)}</b><small data-room-default>${g.members.map(uid => `<a href="${profileHref(uid)}">${userLabel(uid)}</a>`).join(', ')}</small>${roomStatusTag}</span>
      ${muteBtn()}
      <details class="r-menu">
        <summary class="r-iconbtn" aria-label="${T('Ещё')}">${ICON.dots}</summary>
        <div class="r-menu-list">
          ${g.owner === me() ? `
            <button type="button" data-s-group-name>${T('Изменить название')}</button>
            <label>${T('Изменить фото')}<input id="group-photo" class="sr" type="file" accept="image/*,.heic,.heif"></label>
            <button type="button" data-s-group-add>${T('Добавить людей')}</button>` : ''}
          <button type="button" data-s-group-leave>${T('Выйти из группы')}</button>
          ${g.owner === me() ? `<button type="button" class="r-menu-danger" data-s-group-delete>${T('Удалить группу')}</button>` : ''}
        </div>
      </details>
    </header>
    <div class="r-msgs" id="chat-msgs" aria-live="polite"></div>
    ${chatForm()}`;

  async function createGroup(form) {
    if (needAccount()) return;
    const name = form.elements.name.value.trim();
    if (!name) return;
    try {
      const people = await uidsByNames(form.elements.people.value);
      const members = [...new Set([me(), ...people])];
      if (members.length < 2) return ctx.toast(T('Добавьте хотя бы одного человека.'));
      if (!await checkGroupPeople(members)) return;
      const gRef = F().doc(col('chats'));
      await F().setDoc(gRef, {
        group: true, name, owner: me(), members, lastText: T('Группа создана'), lastFrom: me(), lastAt: F().serverTimestamp(), seen: { [me()]: F().serverTimestamp() },
      });
      location.hash = `group/${gRef.id}`;
    } catch (e) {
      if (e.code === 'username/unknown') ctx.toast(T('Такого @имени нет. Проверьте участников.'));
      else fail(e);
    }
  }

  async function addToGroup() {
    const text = await askDialog(T, { title: T('Добавить людей'), text: T('Напишите @имена через пробел.'), input: true, placeholder: '@neba @drug', suggest: '@', ok: 'Добавить' });
    if (!text?.trim()) return;
    try {
      const uids = await uidsByNames(text);
      if (!await checkGroupPeople(uids)) return;
      await F().updateDoc(ref('chats', roomId), { members: F().arrayUnion(...uids) });
      ctx.render();
    } catch (e) {
      if (e.code === 'username/unknown') ctx.toast(T('Такого @имени нет. Проверьте участников.'));
      else fail(e);
    }
  }

  async function renameGroup() {
    const name = (await askDialog(T, { title: T('Название группы'), input: true, value: roomGroup.name, ok: 'Сохранить' }))?.trim().slice(0, 60);
    if (!name || name === roomGroup.name) return;
    try {
      await F().updateDoc(ref('chats', roomId), { name });
      ctx.render();
    } catch (e) { fail(e); }
  }

  async function setGroupPhoto(input) {
    const file = input.files[0];
    input.value = '';
    if (!file) return;
    try {
      const photo = await cropImage(file, T);
      if (!photo) return;
      await F().updateDoc(ref('chats', roomId), { photo });
      ctx.render();
    } catch (e) { fail(e); }
  }

  async function deleteGroup() {
    if (!await askDialog(T, { title: T('Удалить группу?'), text: T('Переписка удалится у всех участников. Это нельзя отменить.'), ok: 'Удалить', danger: true })) return;
    const id = roomId;
    try {
      closeRoomLive();
      stopMsgs?.();
      stopMsgs = null;
      const msgs = await F().getDocs(col('chats', id, 'msgs'));
      const files = await F().getDocs(col('chats', id, 'media'));
      const typing = await F().getDocs(col('chats', id, 'typing')).catch(() => ({ docs: [] }));
      await Promise.all([...msgs.docs, ...files.docs, ...typing.docs].map(d => F().deleteDoc(d.ref)));
      await F().deleteDoc(ref('chats', id));
      location.hash = 'chat';
    } catch (e) {
      fail(e);
      ctx.render();
    }
  }

  async function leaveGroup() {
    if (!await askDialog(T, { title: T('Выйти из группы?'), ok: 'Выйти', danger: true })) return;
    try {
      await F().updateDoc(ref('chats', roomId), { members: F().arrayRemove(me()) });
      location.hash = 'chat';
    } catch (e) { fail(e); }
  }
  const peerOf = c => c.members.find(x => x !== me()) || me();
  const unread = c => c.lastFrom !== me() && ms(c.lastAt) > ms(c.seen?.[me()]);
  const isMuted = c => !!c?.muted?.[me()];
  // Без звука: чат не считается в цифре, не звенит и не шлёт уведомлений на телефон, но остаётся жирным в списке.
  const muteBtn = () => {
    const on = isMuted(chats.find(c => c.id === roomId));
    return `<button type="button" class="r-iconbtn r-mute${on ? ' on' : ''}" data-s-mute aria-pressed="${on}" title="${T(on ? 'Включить звук' : 'Выключить звук')}" aria-label="${T(on ? 'Включить звук' : 'Выключить звук')}">${on ? ICON.muted : ICON.bell}</button>`;
  };
  async function toggleMute() {
    const c = chats.find(x => x.id === roomId);
    if (!c) return ctx.toast(T('Сначала напишите что-нибудь в этот чат.'));
    try {
      await F().updateDoc(ref('chats', c.id), { [`muted.${me()}`]: !isMuted(c) });
    } catch (e) { fail(e); }
  }
  function drawMuteBtn() {
    const old = view.querySelector('.r-mute');
    if (old) old.outerHTML = muteBtn();
  }

  function watchChats() {
    stopChats?.();
    stopChats = null;
    chats = [];
    if (!ctx.user) return;
    stopChats = F().onSnapshot(
      F().query(col('chats'), F().where('members', 'array-contains', me())),
      async snap => {
        // estimate: своя отметка «прочитано» ещё летит на сервер, но уже считается, иначе чат выглядел бы непрочитанным.
        chats = snap.docs.map(d => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
          .sort((a, b) => (ms(b.lastAt) || Date.now()) - (ms(a.lastAt) || Date.now()));
        await loadPeople(chats.flatMap(c => [peerOf(c), c.lastFrom]).filter(Boolean)); // lastFrom — для имени в уведомлении из группы
        ctx.drawInboxCount();
        if (ctx.route().name === 'chat') {
          drawChatList();
          drawMuteBtn();
          drawMsgs(); // собеседник мог прочитать: обновятся галочки
          // Пока чат не дошёл до базы, читать его сообщения нельзя: подписка сразу оборвалась бы.
          if (roomId && !stopMsgs && !snap.metadata.hasPendingWrites && chats.some(c => c.id === roomId)) openRoomStream();
          if (roomId && liveRoom !== roomId && !snap.metadata.hasPendingWrites && chats.some(c => c.id === roomId)) openRoomLive();
          markSeen();
        }
      },
      console.error,
    );
  }

  async function renderChat(name, group = '', peerUid = '') {
    editingMsg = null;
    if (notReady()) return;
    document.title = `${T('Чаты')} — ${T('Яйца Cloud')}`;
    if (!ctx.user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы писать сообщения.')}`);
    const my = ++seq;
    let peer = peerUid || null;
    if (name || peer) {
      if (!peer) try { peer = await uidByName(name); } catch (e) { console.error(e); }
      if (my !== seq) return;
      if (!peer) return note(T('Пользователь @{name} не найден.', { name: esc(name) }));
      await loadPeople([peer]);
      if (my !== seq) return;
    }
    let nextGroup = null;
    if (group && group !== 'new') {
      try {
        const d = await F().getDoc(ref('chats', group));
        if (my !== seq) return;
        if (d.data()?.group) nextGroup = { id: d.id, ...d.data() };
      } catch (e) { console.error(e); }
      if (!nextGroup) return note(T('Группа не найдена.'));
      await loadPeople(nextGroup.members);
      if (my !== seq) return;
    }
    const nextRoom = nextGroup ? nextGroup.id : peer ? chatId(me(), peer) : null;
    if (nextRoom !== roomId) {
      closeRoomLive();
      stopMsgs?.();
      stopMsgs = null;
      roomMsgs = [];
    }
    roomId = nextRoom;
    roomPeer = peer;
    roomGroup = nextGroup;
    chatQuery = '';
    chatPeople = [];
    view.innerHTML = `
      <div class="r-chat${peer || group ? ' has-room' : ''}">
        <aside class="r-chat-list">
          <div class="r-chat-top">
            <h1>${T('Чаты')}</h1>
            <a class="r-pill ghost" href="#group/new">${ICON.plus}<span>${T('Группа')}</span></a>
          </div>
          <label class="search r-chat-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
            <input id="chat-search" type="search" autocomplete="off" aria-label="${T('Поиск по чатам и людям')}" placeholder="${T('Поиск по чатам и людям')}">
          </label>
          <a class="link r-chat-bugs" href="#inbox">${T('Баги и идеи')} <b class="rail-count" hidden></b></a>
          <div id="chat-items"></div>
        </aside>
        <section class="r-room" aria-label="${T('Переписка')}">
          ${group === 'new' ? newGroupForm() : nextGroup ? groupRoom(nextGroup) : peer ? `
            <header class="r-room-head">
              <a class="r-iconbtn r-room-back" href="#chat" aria-label="${T('Все чаты')}">${ICON.back}</a>
              <a class="r-who" href="${profileHref(peer)}">${ava(peer, 36)}<span><b>${esc(shownName(peer))}</b><small data-room-default>${handle(peer) ? `@${esc(handle(peer))}` : ''}</small>${roomStatusTag}</span></a>
              ${relation(peer)}
              ${muteBtn()}
            </header>
            <div class="r-msgs" id="chat-msgs" aria-live="polite"></div>
            ${allows(peer, 'dm') ? chatForm() : `<p class="r-composer-stub">${T('Этот человек не принимает сообщения от вас.')}</p>`}`
            : `<div class="r-room-empty"><p class="empty">${T('Выберите чат слева или откройте профиль человека и нажмите «Написать».')}</p></div>`}
        </section>
      </div>`;
    drawChatList();
    drawMsgs();
    ctx.drawInboxCount();
    if (roomId && chats.some(c => c.id === roomId)) openRoomStream();
    markSeen();
    if (roomPeer || roomGroup) openRoomLive();
    const input = view.querySelector('.r-chat-form textarea');
    if (input && roomId) {
      input.value = getDraft(`chat:${roomId}`) || '';
      input.dispatchEvent(new Event('input', { bubbles: true })); // подогнать высоту поля
    }
    input?.focus();
  }

  function drawChatList() {
    const box = document.getElementById('chat-items');
    if (!box) return;
    const found = c => {
      const peer = peerOf(c);
      return !chatQuery || `${c.group ? c.name : `${shownName(peer)} ${handle(peer)}`} ${c.lastText}`.toLowerCase().includes(chatQuery);
    };
    const known = new Set(chats.filter(c => !c.group).map(peerOf));
    const people = chatPeople.filter(p => p.uid !== me() && !known.has(p.uid)).map(p => `
      <a class="r-chat-item" href="#chat/${esc(p.name)}">
        ${ava(p.uid, 40)}
        <span class="r-chat-text">
          <span class="r-chat-line"><b>${esc(shownName(p.uid))}</b></span>
          <span class="r-chat-last">@${esc(p.name)}</span>
        </span>
      </a>`).join('');
    box.innerHTML = chats.filter(found).map(c => {
      const peer = peerOf(c);
      return `
        <a class="r-chat-item${c.id === roomId ? ' active' : ''}${unread(c) ? ' unread' : ''}${isMuted(c) ? ' muted' : ''}" href="${c.group ? `#group/${esc(c.id)}` : handle(peer) ? `#chat/${esc(handle(peer))}` : `#dm/${esc(peer)}`}">
          ${c.group ? groupAva(c, 40) : ava(peer, 40)}
          <span class="r-chat-text">
            <span class="r-chat-line"><b>${esc(c.group ? c.name : shownName(peer))}${isMuted(c) ? `<span class="r-chat-muted" title="${T('Без звука')}">${ICON.muted}</span>` : ''}</b><small>${ms(c.lastAt) ? ago(c.lastAt) : ''}</small></span>
            <span class="r-chat-last">${c.lastFrom === me() ? `${T('Вы:')} ` : ''}${esc(c.lastText)}</span>
          </span>
        </a>`;
    }).join('') + people || `<p class="empty r-note">${T(chatQuery ? 'Ничего не нашлось.' : 'Переписок пока нет.')}</p>`;
  }

  let chatSearchSeq = 0;
  async function searchChats(text) {
    chatQuery = text.trim().replace(/^@/, '').toLowerCase();
    chatPeople = [];
    drawChatList();
    const my = ++chatSearchSeq;
    if (!chatQuery) return;
    const found = await findPeople(chatQuery).catch(e => { console.error(e); return []; });
    if (my !== chatSearchSeq) return;
    chatPeople = found;
    drawChatList();
  }

  /* ---------- «В сети» и «печатает…» в открытом чате ---------- */

  let liveRoom = null, stopLive = null, peerPresence = null, typingUntil = new Map(), statusTimer = 0, typingSent = 0;
  function openRoomLive() {
    if (liveRoom === roomId) return drawRoomStatus();
    closeRoomLive();
    if (!roomId) return;
    const id = liveRoom = roomId;
    const stops = [F().onSnapshot(col('chats', id, 'typing'), snap => {
      snap.docChanges().forEach(ch => {
        if (ch.doc.id === me()) return;
        // Свежесть меряем своими часами по приходу отметки: часы у людей расходятся.
        const stale = ch.type === 'added' && Date.now() - ms(ch.doc.data().at) > 8000;
        if (ch.type === 'removed' || stale) typingUntil.delete(ch.doc.id);
        else typingUntil.set(ch.doc.id, Date.now() + 6000);
      });
      drawRoomStatus();
    }, () => { if (liveRoom === id) liveRoom = null; })]; // личного чата ещё нет в базе: подпишемся, когда он появится
    if (roomPeer) stops.push(F().onSnapshot(ref('presence', roomPeer), d => { peerPresence = d.data() || null; drawRoomStatus(); }, console.error));
    stopLive = () => stops.forEach(stop => stop());
  }
  function closeRoomLive() {
    stopLive?.();
    clearTimeout(statusTimer);
    stopLive = liveRoom = peerPresence = null;
    typingUntil = new Map();
    typingSent = 0;
  }
  function drawRoomStatus() {
    clearTimeout(statusTimer);
    const box = view.querySelector('[data-room-status]');
    if (!liveRoom || liveRoom !== roomId || !box) return;
    const now = Date.now();
    const typers = [...typingUntil].filter(([, until]) => until > now).map(([uid]) => uid);
    let text = '', cls = '';
    if (typers.length) {
      text = roomGroup ? T('{who} печатает…', { who: typers.map(shownName).join(', ') }) : T('печатает…');
      cls = 'typing';
    } else if (roomPeer && ms(peerPresence?.at)) {
      const on = isOnline(peerPresence.at, false, peerPresence.away);
      text = on ? T('в сети') : T('Был(а) в сети {when}', { when: ago(peerPresence.at) });
      cls = on ? 'online' : '';
    }
    box.textContent = text;
    box.className = `r-room-status ${cls}`;
    box.hidden = !text;
    box.parentElement.querySelector('[data-room-default]').hidden = !!text;
    // Перерисовать, когда «печатает» истечёт, и раз в полминуты — для «в сети» и «был(а) N минут назад».
    statusTimer = setTimeout(drawRoomStatus, Math.min(30e3, ...typers.map(uid => typingUntil.get(uid) - now)) + 50);
  }
  // Своя отметка «печатаю» — не чаще раза в 4 секунды; пустое поле или отправка её снимают.
  function sendTyping(text) {
    if (!roomId || !ctx.user) return;
    if (!text.trim()) {
      if (typingSent) F().deleteDoc(ref('chats', roomId, 'typing', me())).catch(() => {});
      typingSent = 0;
      return;
    }
    if (Date.now() - typingSent < 4000) return;
    typingSent = Date.now();
    F().setDoc(ref('chats', roomId, 'typing', me()), { at: F().serverTimestamp() }).catch(() => {});
  }

  function openRoomStream() {
    const id = roomId;
    stopMsgs = F().onSnapshot(
      F().query(col('chats', id, 'msgs'), F().orderBy('createdAt'), F().limitToLast(300)),
      snap => {
        if (id !== roomId) return;
        roomMsgs = rows(snap);
        drawMsgs();
      },
      e => {
        console.error(e);
        if (id === roomId) stopMsgs = null; // следующее обновление чата откроет подписку заново
      },
    );
  }

  const clock = secs => `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;

  /* ---------- Голосовые ---------- */

  const AUDIO_DATA = /^data:audio\/(mp4|webm|ogg|mpeg)[^,]*;base64,[A-Za-z0-9+/=]+$/;
  const voiceTag = m => `
    <button type="button" class="r-voice" data-voice="${esc(m.id)}" data-secs="${+m.secs || 0}" data-parts="${+m.parts || 1}" aria-label="${T('Голосовое сообщение')}">
      <span class="r-voice-btn">${ICON.play}</span><span class="r-voice-bar"><i></i></span><span class="r-voice-time">${clock(+m.secs || 0)}</span>
    </button>`;

  let playing = null; // { id, audio }
  const voiceBtn = id => view.querySelector(`[data-voice="${CSS.escape(id)}"]`);

  function drawVoice(id, on, part = 0) {
    const btn = voiceBtn(id);
    if (!btn) return;
    btn.querySelector('.r-voice-btn').innerHTML = on ? ICON.pause : ICON.play;
    btn.querySelector('i').style.width = `${Math.round(part * 100)}%`;
  }

  async function toggleVoice(btn) {
    const id = btn.dataset.voice;
    if (playing?.id === id) {
      if (playing.audio.paused) playing.audio.play(); else playing.audio.pause();
      drawVoice(id, !playing.audio.paused, playing.audio.currentTime / (+btn.dataset.secs || 1));
      return;
    }
    if (playing) { playing.audio.pause(); drawVoice(playing.id, false); }
    const url = await loadChatFile(roomId, id, +btn.dataset.parts || 1);
    if (!AUDIO_DATA.test(url)) return ctx.toast(T('Не получилось воспроизвести запись.'));
    const audio = new Audio(url);
    const secs = +btn.dataset.secs || 1;
    playing = { id, audio };
    audio.ontimeupdate = () => drawVoice(id, !audio.paused, Math.min(1, audio.currentTime / secs));
    audio.onended = () => { drawVoice(id, false); playing = null; };
    audio.play().catch(() => ctx.toast(T('Не получилось воспроизвести запись.')));
    drawVoice(id, true);
  }

  // Запись. Сначала mp4: его понимают и iPhone, и компьютеры. Chrome пишет его только на 96 кбит/с,
  // поэтому 2 минуты не влезают в один документ базы и сохраняются частями.
  const VOICE_LIMIT = 120;
  const VOICE_MAX = 3000000;
  const VOICE_PART = 750000;
  let recorder = null; // { rec, stream, started, timer, send, form }

  function stopTracks(r) {
    clearInterval(r.timer);
    r.stream.getTracks().forEach(t => t.stop());
    r.form.classList.remove('recording');
    recorder = null;
  }

  async function startRecording(form) {
    if (needAccount() || recorder) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return ctx.toast(T('Этот браузер не умеет записывать звук.'));
    let stream;
    try {
      stream = await micStream();
    } catch (e) {
      return ctx.toast(micError(e, T));
    }
    const mimeType = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(t => MediaRecorder.isTypeSupported(t));
    const rec = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 24000 });
    const parts = [];
    const r = { rec, stream, form, send: false, started: Date.now() };
    rec.ondataavailable = e => { if (e.data.size) parts.push(e.data); };
    rec.onstop = async () => {
      const secs = Math.max(1, Math.round((Date.now() - r.started) / 1000));
      stopTracks(r);
      if (!r.send || !parts.length) return;
      const blob = new Blob(parts, { type: rec.mimeType });
      const data = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      if (data.length > VOICE_MAX) return ctx.toast(T('Запись слишком большая.'));
      sendChat(form, { media: { kind: 'voice', data, secs } });
    };
    r.timer = setInterval(() => {
      const secs = (Date.now() - r.started) / 1000;
      form.querySelector('[data-rec-time]').textContent = clock(secs);
      if (secs >= VOICE_LIMIT) finishRecording(true);
    }, 250);
    recorder = r;
    form.querySelector('[data-rec-time]').textContent = '0:00';
    form.classList.add('recording');
    rec.start();
  }

  function finishRecording(send) {
    if (!recorder || recorder.rec.state === 'inactive') return;
    recorder.send = send;
    recorder.rec.stop();
  }

  // Фото в чате не уходит сразу, а ждёт над строкой ввода: можно дописать подпись, как в Telegram.
  async function sendChatPhoto(input, file = input.files[0]) {
    const form = input.closest('form');
    input.value = '';
    if (!file) return;
    try {
      const data = await fileToImage(file);
      const { width, height } = await imageSize(data);
      (form.photos ||= []).push({ kind: 'image', data, ratio: +(width / height).toFixed(3) });
      drawStaged(form);
      form.elements.text.focus();
    } catch (e) {
      console.error(e);
      ctx.toast(T(e.message === 'big-gif' ? 'Гифка слишком большая: можно до 580 КБ.' : 'Не получилось открыть эту картинку. Попробуйте JPG или PNG.'));
    }
  }

  const ticks = read => `<span class="r-ticks${read ? ' read' : ''}" role="img" aria-label="${T(read ? 'Прочитано' : 'Отправлено')}">${read ? ICON.ticks : ICON.tick}</span>`;

  function drawMsgs() {
    const box = document.getElementById('chat-msgs');
    if (!box) return;
    const stick = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    // В группе сообщение прочитано, когда его увидел хотя бы один участник.
    const seenMap = chats.find(c => c.id === roomId)?.seen || {};
    const peerSeen = Math.max(0, ...Object.entries(seenMap).filter(([uid]) => uid !== me()).map(([, at]) => ms(at)));
    let html = '';
    let prev = null;
    let lastDay = '';
    const big = m => (m.text && !m.media && !m.sticker ? emojiOnly(m.text) : 0);
    for (const m of roomMsgs) {
      const t = ms(m.createdAt) || Date.now();
      const d = new Date(t).toDateString();
      if (d !== lastDay) {
        html += `<div class="r-day"><span>${esc(day({ toMillis: () => t }))}</span></div>`;
        lastDay = d;
        prev = null;
      }
      const grouped = prev && prev.from === m.from && t - (ms(prev.createdAt) || Date.now()) < 5 * 60e3;
      html += `
        <div class="r-msg${grouped ? ' grouped' : ''}${m.from === me() ? ' mine' : ''}">
          ${grouped ? '<span class="r-msg-gap"></span>' : `<a href="${profileHref(m.from)}" tabindex="-1">${ava(m.from, 32)}</a>`}
          <div class="r-msg-main">
            ${m.from === me() ? `<span class="r-msg-acts">
              ${m.text ? `<button type="button" class="r-iconbtn" data-s-msg-edit="${esc(m.id)}" title="${T('Изменить')}" aria-label="${T('Изменить')}">${ICON.edit}</button>` : ''}
              <button type="button" class="r-iconbtn" data-s-msg-del="${esc(m.id)}" title="${T('Удалить')}" aria-label="${T('Удалить')}">${ICON.trash}</button>
            </span>` : ''}
            ${roomGroup && !grouped && m.from !== me() ? `<div class="r-meta"><a class="r-user strong" href="${profileHref(m.from)}">${esc(shownName(m.from))}</a></div>` : ''}
            <div class="r-bubble${(m.text && !big(m)) || m.media === 'voice' ? '' : ' sticker'}${big(m) ? ` emoji e${big(m)}` : ''}">
              ${m.media === 'image' ? `<div class="r-media" data-media="${esc(m.id)}" data-chat="${esc(roomId)}" style="aspect-ratio:${Math.min(3, Math.max(0.4, +m.ratio || 1))}"></div>` : ''}
              ${m.text ? `<span class="r-msg-text">${rich(m.text)}</span>` : ''}
              ${stickerTag(m.sticker)}
              ${m.media === 'voice' ? voiceTag(m) : ''}
              <span class="r-msg-info">${m.edited ? `${T('изменено')} ` : ''}${new Date(t).toLocaleTimeString(ctx.lang === 'en' ? 'en-GB' : 'ru-RU', { hour: '2-digit', minute: '2-digit' })}${m.from === me() ? ticks(ms(m.createdAt) && ms(m.createdAt) <= peerSeen) : ''}</span>
            </div>
          </div>
        </div>`;
      prev = m;
    }
    box.innerHTML = html || `<div class="r-room-hello">${roomGroup ? groupAva(roomGroup, 64) : ava(roomPeer, 64)}<b>${esc(roomGroup ? roomGroup.name : shownName(roomPeer))}</b><p class="empty">${T('Это начало вашей переписки.')}</p></div>`;
    if (stick || !roomMsgs.length) box.scrollTop = box.scrollHeight;
  }

  const markedSeen = new Map(); // чат -> время сообщения, которое уже отметили прочитанным

  function markSeen() {
    const c = chats.find(x => x.id === roomId);
    // Одно сообщение отмечаем один раз: иначе ответ базы снова вызвал бы запись, и так по кругу.
    if (!c || !unread(c) || document.hidden || markedSeen.get(c.id) === ms(c.lastAt)) return;
    markedSeen.set(c.id, ms(c.lastAt));
    F().updateDoc(ref('chats', c.id), { [`seen.${me()}`]: F().serverTimestamp() }).catch(console.error);
  }

  function drawStaged(form) {
    const box = form.querySelector('.r-chat-staged');
    box.innerHTML = (form.photos || []).map((p, i) => `<span class="attach-preview"><img src="${p.data}" alt="${T('Открыть картинку')}" tabindex="0" role="button"><button type="button" data-chat-unstage="${i}" aria-label="${T('Убрать картинку')}">×</button></span>`).join('');
    box.hidden = !form.photos?.length;
  }

  // Отложенные фото: первое уходит с подписью из строки ввода, остальные следом без подписи.
  async function sendStaged(form) {
    const photos = form.photos;
    form.photos = [];
    drawStaged(form);
    for (const media of photos) await sendChat(form, { media });
  }

  async function sendChat(form, { sticker = '', media = null } = {}) {
    if (needAccount() || !roomId) return;
    if (editingMsg && !sticker && !media) return saveMsgEdit(form);
    if (!sticker && !media && form.photos?.length) return sendStaged(form);
    const input = form.elements.text;
    const extra = sticker || media;
    const caption = !sticker && media?.kind !== 'voice'; // текст из строки ввода уходит с сообщением или как подпись к фото
    const text = caption ? input.value.trim() : '';
    if (!text && !extra) return;
    if (caption) { input.value = ''; setDraft(`chat:${roomId}`, null); sendTyping(''); }
    try {
      const batch = F().writeBatch(ctx.db);
      const label = sticker ? '[стикер]' : media?.kind === 'voice' ? '[голосовое]' : '[фото]';
      const last = { lastText: text.slice(0, 200) || T(label), lastFrom: me(), lastAt: F().serverTimestamp() };
      if (roomGroup) batch.update(ref('chats', roomId), { ...last, [`seen.${me()}`]: F().serverTimestamp() });
      else batch.set(ref('chats', roomId), { members: [me(), roomPeer].sort(), ...last, seen: { [me()]: F().serverTimestamp() } }, { merge: true });
      const mRef = F().doc(col('chats', roomId, 'msgs'));
      const chunks = [];
      if (media) for (let i = 0; i < media.data.length; i += media.kind === 'voice' ? VOICE_PART : media.data.length) chunks.push(media.data.slice(i, i + (media.kind === 'voice' ? VOICE_PART : media.data.length)));
      const parts = chunks.length;
      batch.set(mRef, {
        from: me(), text, createdAt: F().serverTimestamp(),
        ...(sticker ? { sticker } : {}),
        ...(media ? { media: media.kind, ...(media.kind === 'voice' ? { secs: media.secs, parts } : { ratio: media.ratio }) } : {}),
      });
      if (media) {
        chunks.forEach((data, i) => batch.set(ref('chats', roomId, 'media', i ? `${mRef.id}_${i}` : mRef.id), { from: me(), data }));
        mediaFiles.set(`${roomId}/${mRef.id}`, media.data);
      }
      await batch.commit();
      ctx.push?.('chat', roomId); // уведомление собеседнику на телефон, даже если у него всё закрыто
      if (!stopMsgs) openRoomStream();
    } catch (e) {
      if (caption && !input.value) { input.value = text; setDraft(`chat:${roomId}`, text); }
      fail(e);
    }
  }

  // Правка своего сообщения — в строке ввода, как в Telegram: так сохраняются переносы строк.
  function startMsgEdit(id) {
    const m = roomMsgs.find(x => x.id === id);
    const form = view.querySelector('.r-chat-form');
    if (!m || !form) return;
    editingMsg = id;
    if (!view.querySelector('.r-edit-bar')) {
      form.insertAdjacentHTML('beforebegin', `<div class="r-edit-bar">${ICON.edit}<span>${T('Изменение сообщения')}</span><button type="button" class="r-iconbtn" data-s-msg-cancel aria-label="${T('Отмена')}">×</button></div>`);
    }
    const input = form.elements.text;
    input.value = m.text;
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true })); // подогнать высоту поля
  }

  function stopMsgEdit() {
    editingMsg = null;
    view.querySelector('.r-edit-bar')?.remove();
    const input = view.querySelector('.r-chat-form textarea');
    if (input) { input.value = getDraft(`chat:${roomId}`) || ''; input.dispatchEvent(new Event('input', { bubbles: true })); }
  }

  // Строка в списке чатов, если правят или удаляют последнее сообщение.
  const summary = m => (m ? m.text.slice(0, 200) || T(m.sticker ? '[стикер]' : m.media === 'voice' ? '[голосовое]' : '[фото]') : '');

  async function saveMsgEdit(form) {
    const id = editingMsg;
    const text = form.elements.text.value.trim();
    const m = roomMsgs.find(x => x.id === id);
    if (!m || !text) return;
    if (text === m.text) return stopMsgEdit();
    try {
      const batch = F().writeBatch(ctx.db);
      batch.update(ref('chats', roomId, 'msgs', id), { text, edited: F().serverTimestamp() });
      if (roomMsgs.at(-1)?.id === id) batch.update(ref('chats', roomId), { lastText: text.slice(0, 200) });
      await batch.commit();
      stopMsgEdit();
    } catch (e) { fail(e); }
  }

  async function deleteMsg(id) {
    const m = roomMsgs.find(x => x.id === id);
    if (!m || !await askDialog(T, { title: T('Удалить сообщение?'), text: T('Оно пропадёт у всех участников чата.'), ok: 'Удалить', danger: true })) return;
    try {
      const batch = F().writeBatch(ctx.db);
      batch.delete(ref('chats', roomId, 'msgs', id));
      // Фото и голосовые лежат отдельно; у длинного голосового несколько частей.
      if (m.media) for (let i = 0; i < (m.parts || 1); i++) batch.delete(ref('chats', roomId, 'media', i ? `${id}_${i}` : id));
      if (roomMsgs.at(-1)?.id === id) batch.update(ref('chats', roomId), { lastText: summary(roomMsgs.at(-2)) || T('Сообщение удалено') });
      await batch.commit();
      if (editingMsg === id) stopMsgEdit();
    } catch (e) { fail(e); }
  }

  /* ---------- Модерация ---------- */

  // Роли и ограничения людей: uid -> { mod, ban: { until, reason } | null }. Читать их может любой.
  const roles = new Map();
  async function loadRoles(uids, fresh = false) {
    const need = [...new Set(uids)].filter(u => u && (fresh || !roles.has(u)));
    await Promise.all(need.map(async uid => {
      const [m, b, a] = await Promise.all([F().getDoc(ref('mods', uid)), F().getDoc(ref('bans', uid)), F().getDoc(ref('authors', uid))].map(x => x.catch(() => null)));
      roles.set(uid, { mod: !!m?.exists(), ban: b?.exists() ? b.data() : null, admin: !!a?.exists() });
    }));
  }
  const isModUid = uid => !!roles.get(uid)?.mod;
  // Админа видно по authors/<uid>: этот документ при входе пишет только админ (сам список админов закрыт).
  const isAdminUid = uid => !!roles.get(uid)?.admin;
  // Действующее ограничение: until — мс до конца отстранения, null — бан навсегда. Истёкшее не считается.
  const banOf = uid => {
    const b = roles.get(uid)?.ban;
    if (!b) return null;
    const until = b.until ? ms(b.until) : null;
    return until === null || until > Date.now() ? { until, reason: b.reason || '' } : null;
  };
  const banText = b => (b.until === null ? T('Бан навсегда') : T('Отстранение до {date}', { date: new Date(b.until).toLocaleString(ctx.lang === 'en' ? 'en-GB' : 'ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }));
  const roleTags = uid => `${isAdminUid(uid) ? ` <span class="r-tag admin">${T('Админ')}</span>` : isModUid(uid) ? ` <span class="r-tag mod">${T('Модератор')}</span>` : ''}${banOf(uid) ? ` <span class="r-tag ban" title="${esc(banOf(uid).reason)}">${esc(banText(banOf(uid)))}</span>` : ''}`;

  // Меню модерации на чужом профиле: модератор и админ ограничивают, назначать модераторов может только админ.
  const canRestrict = uid => ctx.isStaff && uid !== me() && !isAdminUid(uid) && (ctx.isAdmin || !isModUid(uid));

  function modMenu(uid) {
    if (!ctx.isStaff || uid === me() || isAdminUid(uid)) return '';
    if (!canRestrict(uid) && !ctx.isAdmin) return '';
    return `
      <details class="r-menu">
        <summary class="r-pill ghost">${T('Модерация')}</summary>
        <div class="r-menu-list">
          ${!canRestrict(uid) ? '' : banOf(uid) ? `<button type="button" data-s-unrestrict="${esc(uid)}">${T('Снять ограничение')}</button>` : `<button type="button" class="r-menu-danger" data-s-restrict="${esc(uid)}">${T('Отстранить или забанить…')}</button>`}
          ${ctx.isAdmin ? `<button type="button" data-s-mod="${esc(uid)}">${T(isModUid(uid) ? 'Снять модератора' : 'Сделать модератором')}</button>` : ''}
        </div>
      </details>`;
  }

  // Действия над человеком окном, а не выпадающим меню: в таблице админки меню обрезала бы рамка прокрутки.
  function modChooser(uid) {
    const acts = [
      ...(!canRestrict(uid) ? [] : banOf(uid) ? [['Снять ограничение', () => unrestrict(uid)]] : [['Отстранить или забанить…', () => restrict(uid)]]),
      ...(ctx.isAdmin && handle(uid) ? [[isModUid(uid) ? 'Снять модератора' : 'Сделать модератором', () => toggleMod(uid)]] : []),
    ];
    const dlg = document.createElement('dialog');
    dlg.className = 'r-crop r-ask';
    dlg.innerHTML = `
      <form method="dialog" class="r-crop-box">
        <h2>${T('Модерация')}: ${userLabel(uid)}</h2>
        <div class="mod-acts">${acts.map(([label], n) => `<button type="button" class="btn" data-n="${n}">${T(label)}</button>`).join('')}</div>
        <div class="r-crop-bar"><button class="btn">${T('Отмена')}</button></div>
      </form>`;
    dlg.addEventListener('click', e => {
      const b = e.target.closest('[data-n]');
      if (!b) return;
      dlg.close();
      acts[+b.dataset.n][1]();
    });
    dlg.addEventListener('close', () => dlg.remove());
    document.getElementById('view').append(dlg);
    dlg.showModal();
  }

  // Поля ограничения: отстранить на N минут/часов/дней или забанить навсегда. toggle — галочка «ограничить автора»
  // в окне удаления: поля появляются, только когда её отметили.
  const UNITS = [['m', 'минут', 6e4], ['h', 'часов', 36e5], ['d', 'дней', 864e5]];
  const restrictFields = (uid, toggle) => `
    ${toggle ? `<label class="mod-check"><input type="checkbox" name="on"><span>${T('Ограничить автора: {who}', { who: userLabel(uid) })}</span></label>` : ''}
    <div class="mod-fields"${toggle ? ' hidden' : ''}>
      ${toggle ? '' : `<p class="empty">${T('Пока ограничение действует, человек может только читать: не пишет посты, комментарии и сообщения, не ставит лайки и не подписывается.')}</p>`}
      <label class="field">${T('Что сделать')}<select name="kind"><option value="temp">${T('Отстранить на время')}</option><option value="ban">${T('Забанить навсегда')}</option></select></label>
      <div class="field mod-term"><span>${T('Срок')}</span>
        <span class="mod-term-row">
          <input type="number" name="n" min="1" max="999" value="1" inputmode="numeric" aria-label="${T('Сколько')}">
          <select name="unit" aria-label="${T('Единица')}">${UNITS.map(([id, label]) => `<option value="${id}"${id === 'h' ? ' selected' : ''}>${T(label)}</option>`).join('')}</select>
        </span>
      </div>
      <label class="field">${T('Причина')}<input name="reason" maxlength="300" autocomplete="off" placeholder="${T('Её увидит человек')}"></label>
    </div>`;

  function wireRestrict(dlg) {
    const f = dlg.querySelector('form').elements;
    const sync = () => {
      dlg.querySelector('.mod-fields').hidden = f.on ? !f.on.checked : false;
      dlg.querySelector('.mod-term').hidden = f.kind.value === 'ban';
    };
    dlg.addEventListener('change', sync);
    sync();
  }

  // { until: мс | null (навсегда), reason } или null, если ограничивать не нужно.
  function readRestrict(f) {
    if (f.on && !f.on.checked) return null;
    const reason = f.reason.value.trim().slice(0, 300);
    if (f.kind.value === 'ban') return { until: null, reason };
    const n = Math.min(999, Math.max(1, parseInt(f.n.value, 10) || 1));
    return { until: Date.now() + n * UNITS.find(u => u[0] === f.unit.value)[2], reason };
  }

  // Общее окно: подтверждение (удаление или ограничение) и, если можно, поля ограничения.
  function modDialog({ title, text = '', ok, uid, toggle }) {
    return new Promise(resolve => {
      const dlg = document.createElement('dialog');
      dlg.className = 'r-crop r-ask';
      dlg.innerHTML = `
        <form method="dialog" class="r-crop-box">
          <h2></h2>
          ${text ? '<p class="empty"></p>' : ''}
          ${uid ? restrictFields(uid, toggle) : ''}
          <div class="r-crop-bar">
            <button type="button" class="btn" data-ask-cancel>${T('Отмена')}</button>
            <button class="btn danger" value="yes">${T(ok)}</button>
          </div>
        </form>`;
      dlg.querySelector('h2').textContent = title;
      if (text) dlg.querySelector('p.empty').textContent = text;
      if (uid) wireRestrict(dlg);
      dlg.querySelector('[data-ask-cancel]').addEventListener('click', () => dlg.close());
      dlg.addEventListener('close', () => {
        resolve(dlg.returnValue === 'yes' ? { restrict: uid ? readRestrict(dlg.querySelector('form').elements) : null } : null);
        dlg.remove();
      });
      document.getElementById('view').append(dlg);
      dlg.showModal();
    });
  }

  async function applyRestrict(uid, r) {
    const data = { until: r.until === null ? null : F().Timestamp.fromMillis(r.until), reason: r.reason, by: me(), at: F().serverTimestamp() };
    await F().setDoc(ref('bans', uid), data);
    roles.set(uid, { ...roles.get(uid), ban: data });
  }

  async function restrict(uid) {
    const answer = await modDialog({ title: T('Ограничить {who}', { who: userLabel(uid) }), ok: 'Ограничить', uid, toggle: false });
    if (!answer?.restrict) return;
    try {
      await applyRestrict(uid, answer.restrict);
      ctx.toast(T('Ограничение поставлено.'));
      ctx.render();
    } catch (e) { fail(e); }
  }

  // Удаление чужого поста или комментария: модератору сразу предлагаем ограничить автора, как в Telegram.
  // true — удалять; ограничение, если выбрано, ставится тут же.
  async function confirmDelete(title, author) {
    const offer = author && author !== me() && canRestrict(author);
    if (offer) await loadRoles([author]);
    const answer = await modDialog({ title, ok: 'Удалить', uid: offer && canRestrict(author) ? author : null, toggle: true });
    if (!answer) return false;
    if (answer.restrict) {
      try {
        await applyRestrict(author, answer.restrict);
        ctx.toast(T('Удалено, автор ограничен.'));
      } catch (e) { fail(e); }
    }
    return true;
  }

  async function unrestrict(uid) {
    if (!await askDialog(T, { title: T('Снять ограничение с {who}?', { who: userLabel(uid) }), ok: 'Снять' })) return;
    try {
      await F().deleteDoc(ref('bans', uid));
      roles.set(uid, { ...roles.get(uid), ban: null });
      ctx.toast(T('Ограничение снято.'));
      ctx.render();
    } catch (e) { fail(e); }
  }

  async function toggleMod(uid) {
    const on = !isModUid(uid);
    if (!await askDialog(T, { title: T(on ? 'Сделать {who} модератором?' : 'Снять модератора с {who}?', { who: userLabel(uid) }), text: on ? T('Модератор сможет отстранять и банить людей, удалять посты и комментарии. В админку он не попадёт.') : '', ok: on ? 'Назначить' : 'Снять' })) return;
    try {
      if (on) await F().setDoc(ref('mods', uid), { by: me(), at: F().serverTimestamp() });
      else await F().deleteDoc(ref('mods', uid));
      roles.set(uid, { ...roles.get(uid), mod: on });
      ctx.render();
    } catch (e) { fail(e); }
  }

  /* ---------- Приватность ---------- */

  const writeBtn = (uid, p, wide = '') => (allows(uid, 'dm')
    ? `<a class="r-pill ghost${wide}" href="#chat/${esc(p.username)}">${ICON.chat}<span>${T('Написать')}</span></a>`
    : `<span class="r-pill ghost${wide} off" title="${T('Этот человек не принимает сообщения от вас.')}" aria-disabled="true">${ICON.chat}<span>${T('Написать')}</span></span>`);

  // Кто может писать мне (dm) и добавлять в группы (groups): все, только взаимные подписки или никто.
  // Запрет писать проверяют правила базы. Список участников группы правила перебрать не умеют,
  // поэтому запрет на группы проверяет сайт того, кто добавляет.
  const PRIVACY = [['all', 'Все'], ['mutual', 'Только взаимные подписки'], ['none', 'Никто']];
  const allows = (uid, field) => {
    const v = people.get(uid)?.[field] || 'all';
    return v === 'all' || (v === 'mutual' && isMutual(uid));
  };

  function privacyFields() {
    if (!pub) return '';
    const select = (field, label) => `
      <label class="field">${T(label)}
        <select data-s-privacy="${field}">${PRIVACY.map(([v, l]) => `<option value="${v}"${(pub[field] || 'all') === v ? ' selected' : ''}>${T(l)}</option>`).join('')}</select>
      </label>`;
    return `
      <section class="edit-card">
        <div class="edit-title"><h2>${T('Приватность')}</h2><p>${T('Сохраняется сразу.')}</p></div>
        <div class="edit-fields">
          ${select('dm', 'Кто может мне писать')}
          ${select('groups', 'Кто может добавлять меня в группы')}
          <label class="field">${T('Кто видит мой день рождения')}
            <select data-s-bday>
              <option value="all"${pub.birthday ? ' selected' : ''}>${T('Все')}</option>
              <option value="none"${pub.birthday ? '' : ' selected'}>${T('Только я')}</option>
            </select>
            <small class="r-hint">${T('Другим видно только число и месяц, без года.')}</small>
          </label>
        </div>
      </section>`;
  }

  async function setPrivacy(field, value) {
    if (!pub || !PRIVACY.some(([v]) => v === value)) return;
    try {
      await F().updateDoc(ref('profiles', me()), { [field]: value });
      pub[field] = value;
      remember(me(), pub);
      ctx.toast(T('Настройки приватности сохранены.'));
    } catch (e) { fail(e); }
  }

  // День рождения открыт всем — в публичном профиле лежит ММ-ДД (без года). Скрыт — поля там нет.
  // Сама дата живёт в приватном users/<uid>, её даёт app.js (ctx.birthday).
  const monthDay = d => /(\d{2}-\d{2})$/.exec(d || '')?.[1] || '';

  async function setBirthdayPublic(select) {
    if (!pub) return;
    const md = monthDay(ctx.birthday);
    if (select.value === 'all' && !md) {
      select.value = 'none';
      ctx.toast(T('Сначала укажите день рождения в «Основном» и сохраните.'));
      return;
    }
    try {
      await F().updateDoc(ref('profiles', me()), { birthday: select.value === 'all' ? md : F().deleteField() });
      if (select.value === 'all') pub.birthday = md;
      else delete pub.birthday;
      remember(me(), pub);
      ctx.toast(T('Настройки приватности сохранены.'));
    } catch (e) { fail(e); }
  }

  // Поменяли дату в профиле: если она открыта всем, обновляем и публичную копию.
  async function syncBirthday(date) {
    if (!pub?.birthday) return;
    const md = monthDay(date);
    await F().updateDoc(ref('profiles', me()), { birthday: md || F().deleteField() });
    if (md) pub.birthday = md;
    else delete pub.birthday;
    remember(me(), pub);
  }

  // Строка в профиле: «🎂 10 ноября» или «Сегодня день рождения!».
  function birthdayLine(p) {
    const m = /^(\d{2})-(\d{2})$/.exec(p?.birthday || '');
    if (!m) return '';
    const now = new Date();
    const today = now.getMonth() + 1 === +m[1] && now.getDate() === +m[2];
    const date = new Date(2000, +m[1] - 1, +m[2]).toLocaleDateString(ctx.lang === 'en' ? 'en-US' : 'ru-RU', { day: 'numeric', month: 'long' });
    return `<p class="r-sub r-bday">🎂 ${today ? T('Сегодня день рождения!') : T('День рождения: {date}', { date })}</p>`;
  }

  // Перед созданием группы и добавлением людей: все ли разрешают добавлять себя.
  async function checkGroupPeople(uids) {
    await loadPeople(uids);
    const banned = uids.filter(uid => uid !== me() && !allows(uid, 'groups'));
    if (!banned.length) return true;
    ctx.toast(T('{who}: не разрешает добавлять себя в группы.', { who: banned.map(userLabel).join(', ') }));
    return false;
  }

  /* ---------- Аккаунт: @имя и «о себе» ---------- */

  const accountFields = () => `
    <label class="field">${T('Имя пользователя')}
      <span class="r-at"><span aria-hidden="true">@</span><input name="username" maxlength="20" pattern="[A-Za-z0-9_]{1,20}" autocomplete="username"
        value="${esc(pub?.username || '')}" ${pub ? 'required' : ''} title="${T('1–20 символов: латиница, цифры и _')}"></span>
      <small class="r-hint">${T('1–20 символов: латиница, цифры и _. По нему вас находят и упоминают.')}</small>
    </label>
    <label class="field wide">${T('О себе')}<textarea name="bio" rows="4" maxlength="300">${esc(pub?.bio || '')}</textarea></label>`;

  const netRow = (url = '') => `
    <div class="net-row">
      <img src="${netIcon(url)}" alt="" width="20" height="20">
      <input name="net" inputmode="url" autocomplete="off" aria-label="${T('Ссылка на соцсеть')}" placeholder="${T('Вставьте ссылку на свою страницу')}" value="${esc(url)}">
      <button type="button" class="net-del" data-net-del aria-label="${T('Убрать ссылку')}">×</button>
    </div>`;

  function netFields() {
    const saved = NETS.map(([id]) => pub?.links?.[id]).filter(Boolean);
    return `
      <section class="edit-card">
        <div class="edit-title"><h2>${T('Соцсети')}</h2><p>${T('Значки появятся в вашем профиле.')}</p></div>
        <div class="net-list">
          <div class="net-rows">${(saved.length ? saved : ['']).map(netRow).join('')}</div>
          <button type="button" class="r-pill ghost net-add" data-net-add ${saved.length >= NETS.length ? 'hidden' : ''}>${ICON.plus}<span>${T('Добавить соцсеть')}</span></button>
          <small class="r-hint">${T('Поддерживаются: {list}', { list: NETS.map(n => n[1]).join(', ') })}</small>
        </div>
      </section>`;
  }

  function drawNetAdd() {
    view.querySelector('[data-net-add]').hidden = view.querySelectorAll('.net-row').length >= NETS.length;
  }

  // Шапка без @имени тоже видна, но загрузить свою можно только в готовый публичный профиль.
  const bannerField = () => `
    <div class="r-banner edit-hero" style="${pub ? bannerStyle(me()) : `--c:${color(me())}`}">
      ${pub ? `
        <div class="edit-hero-actions">
          ${pub.banner ? `<button type="button" class="glass" id="banner-remove">${T('Убрать шапку')}</button>` : ''}
          <label class="glass">${T('Загрузить шапку')}<input id="banner" class="sr" type="file" accept="image/*,.heic,.heif"></label>
        </div>` : ''}
    </div>`;

  function readLinks(form) {
    const links = {};
    for (const input of form.querySelectorAll('[name=net]')) {
      const raw = input.value.trim();
      if (!raw) continue;
      const net = netOf(raw);
      if (!net) throw Object.assign(new Error('bad link'), { code: 'link/invalid' });
      if (links[net[0]]) throw Object.assign(new Error('same network'), { code: 'link/duplicate' });
      links[net[0]] = cleanLink(net[2], raw);
    }
    return links;
  }

  const accountNote = () => (pub
    ? `<a class="btn" href="#u/${esc(pub.username)}">${T('Открыть мой профиль')}</a>`
    : `<p class="msg ok">${T('Выберите @имя: без него нельзя писать посты, комментарии и сообщения.')}</p>`);

  async function saveIdentity({ username, bio, name, photo, links }) {
    username = String(username || '').trim().replace(/^@/, '').toLowerCase();
    if (!username && !pub) return;
    if (!USERNAME_RE.test(username)) throw Object.assign(new Error('bad username'), { code: 'username/invalid' });
    if (username === 'everyone') throw Object.assign(new Error('reserved'), { code: 'username/taken' });
    const old = pub?.username;
    const batch = F().writeBatch(ctx.db);
    if (username !== old) {
      const taken = await F().getDoc(ref('usernames', username));
      if (taken.exists()) throw Object.assign(new Error('taken'), { code: 'username/taken' });
      batch.set(ref('usernames', username), { uid: me() });
      if (old) batch.delete(ref('usernames', old));
    }
    const data = { username, name: name.slice(0, 80), photo: photo.length <= 100000 ? photo : '', bio: String(bio || '').trim().slice(0, 300), links };
    // update заменяет links целиком, иначе убранная из формы ссылка осталась бы в базе.
    if (pub) batch.update(ref('profiles', me()), data);
    else batch.set(ref('profiles', me()), { ...data, createdAt: F().serverTimestamp() });
    await batch.commit();
    if (old && old !== username) nameToUid.delete(old);
    pub = { ...pub, ...data, createdAt: pub?.createdAt || { toMillis: () => Date.now() } };
    remember(me(), pub);
    ctx.drawRail();
  }

  async function updatePublic(data) {
    await F().updateDoc(ref('profiles', me()), data);
    pub = { ...pub, ...data };
    remember(me(), pub);
  }

  // Имя и фото в публичном профиле повторяют приватный users/<uid>. Ошибка здесь не мешает сохранить основное.
  const mirror = data => (pub ? updatePublic(data).catch(console.error) : null);

  // Соавторы пишутся как @имена, в базе лежат uid: так они переживут смену имени.
  async function uidsByNames(text) {
    const names = [...new Set(String(text).toLowerCase().match(/[a-z0-9_]+/g) || [])];
    const uids = await Promise.all(names.map(uidByName));
    if (uids.includes(null)) throw Object.assign(new Error('unknown'), { code: 'username/unknown' });
    return uids;
  }

  /* ---------- Вход и выход ---------- */

  async function onUser(u) {
    closeRoomLive();
    stopMsgs?.();
    stopMsgs = null;
    roomId = null;
    pub = null;
    myVotes = new Map();
    following = new Set();
    followers = new Set();
    if (u) {
      const safe = p => p.catch(e => { console.error(e); return null; });
      const [p, votes, outs, ins] = await Promise.all([
        safe(F().getDoc(ref('profiles', u.uid))),
        // ponytail: все свои голоса одним запросом; когда их станут тысячи, грузить только для видимых постов
        safe(F().getDocs(F().query(col('votes'), F().where('uid', '==', u.uid)))),
        safe(F().getDocs(F().query(col('follows'), F().where('from', '==', u.uid)))),
        safe(F().getDocs(F().query(col('follows'), F().where('to', '==', u.uid)))),
      ]);
      if (p?.exists()) { pub = p.data(); remember(u.uid, pub); }
      votes?.forEach(d => { const v = d.data(); myVotes.set(`${v.kind}_${v.target}`, v.v); });
      outs?.forEach(d => following.add(d.data().to));
      ins?.forEach(d => followers.add(d.data().from));
    }
    watchChats();
    watchDrafts();
    beat(true);
  }

  /* ---------- Маршруты и события ---------- */

  function route([name, a, b]) {
    if (name === 'feed') return { name: 'feed', sort: SORTS.some(s => s[0] === a) ? a : 'hot', social: true };
    if (name === 'post' && a) return { name: 'post', id: a, focus: b || '', social: true };
    if (name === 'u' && a) return { name: 'u', handle: a.toLowerCase(), tab: PROFILE_TABS.some(t => t[0] === b) ? b || '' : '', social: true };
    if (name === 'uid' && a) return { name: 'uid', uid: a, social: true };
    if (name === 'submit') return { name: 'submit', appId: a === 'drafts' || a === 'draft' ? '' : a || '', drafts: a === 'drafts', draft: a === 'draft' ? b || '' : '', social: true };
    if (name === 'chat') return { name: 'chat', handle: (a || '').toLowerCase(), social: true };
    if (name === 'group' && a) return { name: 'chat', handle: '', group: a, social: true };
    // Чат с человеком без @имени (не выбрал имя или удалил профиль): по uid, иначе его не открыть и не отметить прочитанным.
    if (name === 'dm' && a) return { name: 'chat', handle: '', peer: a, social: true };
    return null;
  }

  function render(r) {
    if (r.name !== 'chat') { stopMsgs?.(); stopMsgs = null; roomId = null; }
    finishRecording(false);
    playing?.audio.pause();
    playing = null;
    if (r.name !== 'post') { thread = null; stopComments(); }
    if (r.name === 'feed') renderFeed(r.sort);
    else if (r.name === 'post') renderPost(r.id, r.focus);
    else if (r.name === 'u') renderProfile(r.handle, r.tab);
    else if (r.name === 'uid') renderUid(r.uid);
    else if (r.name === 'submit') renderSubmit(r.appId, r.drafts, r.draft);
    else if (r.name === 'chat') renderChat(r.handle, r.group, r.peer);
  }

  view.addEventListener('click', e => {
    const picture = viewable(e.target);
    if (picture) return openImage(picture);
    const t = e.target.closest('button, a, summary');
    if (!t) {
      // Клик по пустому месту карточки открывает пост, как на Reddit. Выделение текста не считается.
      const card = e.target.closest('.r-post[data-href]');
      if (card && !getSelection().toString()) location.hash = card.dataset.href.slice(1);
      return;
    }
    const d = t.dataset;
    if (d.vote) vote(t);
    else if (d.sFollow) toggleFollow(d.sFollow);
    else if (d.sShare !== undefined) {
      const url = `${location.origin}${location.pathname}${d.sShare}`;
      navigator.clipboard?.writeText(url).then(() => ctx.toast(T('Ссылка скопирована.')), () => ctx.toast(url));
    }
    else if (d.sReply) toggleReply(t);
    else if (d.sCollapse !== undefined) t.closest('.r-c').classList.toggle('collapsed');
    else if (d.sCancel !== undefined) {
      const form = t.closest('form');
      if (form.classList.contains('reply')) form.remove();
      else { form.reset(); clearAttach(form); document.activeElement.blur(); }
    }
    else if (d.sCancelEdit !== undefined) drawPost(true);
    else if (d.sDelDraft) {
      askDialog(T, { title: T('Удалить черновик?'), text: T('Его нельзя будет вернуть.'), ok: 'Удалить', danger: true })
        .then(yes => { if (yes) { putPostDraft(d.sDelDraft, null); renderDrafts(); } });
    }
    else if (d.sEditPost !== undefined) {
      t.closest('details').open = false;
      startPostEdit().catch(fail);
    }
    else if (d.sEditComment) {
      const c = thread.comments.find(x => x.id === d.sEditComment);
      t.closest('.r-c-content').querySelector('.r-c-body').innerHTML = editForm('comment', c.id, c.body, !!(c.image || c.sticker));
    }
    else if (d.sDelComment) deleteComment(d.sDelComment);
    else if (d.sDelCard) deleteProfileComment(d.sDelCard);
    else if (d.sticker) sendSticker(t);
    else if (d.recStart !== undefined) startRecording(t.closest('form'));
    else if (d.recCancel !== undefined) finishRecording(false);
    else if (d.voice) toggleVoice(t);
    else if (d.sRestrict) { t.closest('details')?.removeAttribute('open'); restrict(d.sRestrict); }
    else if (d.sUnrestrict) { t.closest('details')?.removeAttribute('open'); unrestrict(d.sUnrestrict); }
    else if (d.sMod) { t.closest('details')?.removeAttribute('open'); toggleMod(d.sMod); }
    else if (d.sMsgEdit) startMsgEdit(d.sMsgEdit);
    else if (d.sMsgDel) deleteMsg(d.sMsgDel);
    else if (d.sMsgCancel !== undefined) stopMsgEdit();
    else if (d.sGroupAdd !== undefined) addToGroup();
    else if (d.sGroupName !== undefined) renameGroup();
    else if (d.sGroupDelete !== undefined) deleteGroup();
    else if (d.sGroupLeave !== undefined) leaveGroup();
    else if (d.sMute !== undefined) toggleMute();
    else if (d.emoji) insertEmoji(t);
    else if (d.fmt) insertFormat(t);
    else if (d.chatUnstage !== undefined) {
      const form = t.closest('form');
      form.photos.splice(+d.chatUnstage, 1);
      drawStaged(form);
    }
    else if (d.attachClear !== undefined) {
      const item = t.closest('.attach-list > .attach-preview'); // в посте убираем одну из картинок
      if (item) item.remove();
      else clearAttach(t.closest('form'));
    }
    else if (d.galleryStep) {
      const track = t.closest('.r-gallery').querySelector('.r-gallery-track');
      track.scrollBy({ left: +d.galleryStep * track.clientWidth, behavior: 'smooth' });
    }
    else if (d.netAdd !== undefined) {
      view.querySelector('.net-rows').insertAdjacentHTML('beforeend', netRow());
      view.querySelector('.net-row:last-child input').focus();
      drawNetAdd();
    }
    else if (d.netDel !== undefined) {
      // Последнее поле не убираем, а очищаем: иначе негде будет добавить ссылку.
      if (view.querySelectorAll('.net-row').length > 1) t.closest('.net-row').remove();
      else {
        t.closest('.net-row').querySelector('input').value = '';
        t.closest('.net-row').querySelector('img').src = netIcon('');
      }
      drawNetAdd();
    }
    else if (d.sDelPost !== undefined) deletePost();
    else if (d.sBack !== undefined) { if (history.length > 1) history.back(); else location.hash = 'feed'; }
    else if (d.sJump !== undefined) {
      e.preventDefault();
      document.getElementById('r-comments')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  view.addEventListener('change', e => {
    if (e.target.closest('.r-submit')) { syncUpdateCheck(e.target.closest('form')); savePostDraft(e.target.closest('form')); } // тег, выбранный из подсказки
    if (e.target.matches('[data-s-privacy]')) setPrivacy(e.target.dataset.sPrivacy, e.target.value);
    if (e.target.matches('[data-s-bday]')) setBirthdayPublic(e.target);
    if (e.target.matches('[data-s-sort]')) { commentSort = e.target.value; drawPost(true); }
    if (e.target.matches('[data-attach]')) attach(e.target);
    if (e.target.matches('[data-chat-photo]')) sendChatPhoto(e.target);
    if (e.target.id === 'group-photo') setGroupPhoto(e.target);
  });

  // Ctrl+V и перетаскивание картинки в форму с кнопкой картинки (пост, комментарий, чат) — как выбор файла.
  // Не над формой — картинка уходит в первую такую форму на странице (новый пост, комментарий к посту, открытый чат).
  const PICK = '[data-attach], [data-chat-photo]';
  const isImage = f => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name);
  const pickInput = t => {
    const form = t?.closest('form');
    if (form) return form.querySelector(PICK);
    return t?.closest('input, textarea, [contenteditable]') ? null : view.querySelector(`form :is(${PICK})`);
  };
  async function takeImages(input, files) {
    if (input.matches('[data-attach]')) return attach(input, input.multiple ? files : files[0]);
    for (const f of files) await sendChatPhoto(input, f);
  }
  document.addEventListener('paste', e => {
    const input = pickInput(e.target instanceof Element ? e.target : null);
    const files = [...(e.clipboardData?.files || [])].filter(isImage);
    if (!input || !files.length) return;
    e.preventDefault();
    takeImages(input, files);
  });
  let dropForm = null;
  const markDrop = form => { dropForm?.classList.remove('dropping'); dropForm = form; form?.classList.add('dropping'); };
  document.addEventListener('dragover', e => {
    if (!e.dataTransfer?.types.includes('Files')) return;
    const input = pickInput(e.target.closest?.('form') || view);
    markDrop(input?.closest('form'));
    if (!input) return;
    e.preventDefault(); // иначе браузер откроет картинку вместо сайта
    e.dataTransfer.dropEffect = 'copy';
  });
  document.addEventListener('dragleave', e => { if (!e.relatedTarget) markDrop(null); });
  document.addEventListener('drop', e => {
    const input = pickInput(e.target.closest?.('form') || view);
    markDrop(null);
    if (!input) return;
    e.preventDefault();
    const files = [...(e.dataTransfer?.files || [])].filter(isImage);
    if (files.length) takeImages(input, files);
  });

  view.addEventListener('input', e => {
    if (e.target.matches('.r-submit [name=title]')) view.querySelector('.r-counter').textContent = `${e.target.value.length}/300`;
    if (e.target.matches('[data-suggest]')) updateSuggest(e.target);
    if (e.target.id === 'chat-search') searchChats(e.target.value);
    if (e.target.matches('[name=net]')) e.target.closest('.net-row').querySelector('img').src = netIcon(e.target.value.trim());
    if (e.target.closest('.r-submit')) { syncUpdateCheck(e.target.closest('form')); savePostDraft(e.target.closest('form')); }
    if (e.target.matches('.r-chat-form textarea') && roomId && !editingMsg) {
      setDraft(`chat:${roomId}`, e.target.value);
      if (e.isTrusted) sendTyping(e.target.value); // не при подстановке черновика
    }
    if (e.target.matches('.r-chat-form textarea, .r-composer textarea')) {
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, e.target.closest('[data-s-form^=edit]') ? innerHeight * 0.6 : 240)}px`;
    }
  });

  view.addEventListener('mousedown', e => {
    if (e.target.closest('[data-fmt]')) e.preventDefault(); // поле не теряет фокус, клавиатура телефона не прячется
    const item = e.target.closest('.suggest [data-i]');
    if (!item) return;
    e.preventDefault(); // иначе поле потеряет фокус раньше, чем сработает выбор
    pickSuggest(+item.dataset.i);
  });
  view.addEventListener('focusout', e => { if (e.target === suggest?.input) closeSuggest(); });
  // beforeinput, а не keydown: клавиатура Android шлёт Enter внутри набора слова, keydown там не ловится.
  view.addEventListener('beforeinput', e => {
    if (e.inputType === 'insertLineBreak' && e.target.matches('.r-submit textarea, .r-composer textarea') && continueList(e.target)) e.preventDefault();
  });
  view.addEventListener('focusin', e => {
    if (e.target.matches('[data-suggest=app]')) updateSuggest(e.target);
    if (e.target.form && e.target.matches('textarea, input[name=title]')) e.target.form.emojiField = e.target;
  });

  view.addEventListener('keydown', e => {
    if (suggest && e.target === suggest.input) {
      const n = suggest.items.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        suggest.active = (suggest.active + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
        drawSuggest();
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        pickSuggest(suggest.active);
      } else if (e.key === 'Escape') closeSuggest();
      return;
    }
    // Enter отправляет сообщение в чате, Shift+Enter — новая строка.
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.target.matches('.r-chat-form textarea')) {
      e.preventDefault();
      e.target.form.requestSubmit();
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && e.target.matches('.r-composer textarea')) {
      e.preventDefault();
      e.target.form.requestSubmit();
    }
  });

  document.addEventListener('visibilitychange', () => { if (ctx.route().name === 'chat') markSeen(); });
  document.addEventListener('click', e => {
    document.querySelectorAll('.emoji[open]').forEach(d => { if (!d.contains(e.target)) d.open = false; });
  });
  // У низа экрана панель иначе открылась бы за его краем. Событие toggle не всплывает, поэтому ловим на погружении.
  document.addEventListener('toggle', e => {
    if (!e.target.matches('.emoji[open]')) return;
    const panel = e.target.querySelector('.emoji-panel');
    // Внизу страницы панель вылезла бы за её край, тогда открываем вверх.
    e.target.classList.remove('up');
    if (panel.getBoundingClientRect().bottom > view.getBoundingClientRect().bottom) e.target.classList.add('up');
    panel.scrollIntoView({ block: 'nearest' });
  }, true);

  function onSubmit(form) {
    const kind = form.dataset.sForm;
    if (kind === 'comment') return addComment(form);
    if (kind === 'post') return addPost(form);
    if (kind === 'chat') return recorder ? finishRecording(true) : sendChat(form);
    if (kind === 'group') return createGroup(form);
    if (kind === 'edit-post' || kind === 'edit-comment') return saveEdit(form);
  }

  return {
    route,
    render,
    onUser,
    onSubmit,
    fillAppThreads,
    accountFields,
    netFields,
    privacyFields,
    syncBirthday,
    loadRoles,
    roleTags,
    banOf,
    isModUid,
    modChooser,
    accountNote,
    bannerField,
    readLinks,
    saveIdentity,
    mirror,
    updatePublic,
    isImage: url => DATA_IMAGE.test(url || ''),
    attachBar,
    imageTag,
    clearAttach,
    loadPeople,
    likeBox: (appId, n) => voteBox('a', appId, n),
    uidsByNames,
    handleOf: handle,
    nameOf: uid => (people.get(uid) ? shownName(uid) : ''),
    profileHref,
    ava,
    unreadChats: () => chats.filter(c => unread(c) && !isMuted(c)).length,
    // Самый свежий непрочитанный чат: от кого и что, для уведомления в приложении для Windows.
    lastUnread: () => {
      const c = chats.find(c => unread(c) && !isMuted(c)); // chats отсортированы от новых к старым
      if (!c) return null;
      const from = shownName(c.lastFrom);
      return {
        title: c.group ? `${from} · ${c.name}` : from,
        body: c.lastText || '',
        href: c.group ? `#group/${c.id}` : handle(c.lastFrom) ? `#chat/${handle(c.lastFrom)}` : profileHref(c.lastFrom),
      };
    },
    myHref: () => (pub ? `#u/${pub.username}` : '#account'),
    hasProfile: () => !!pub,
  };
}

/* ---------- Окно вопроса ---------- */

// Вместо браузерных confirm и prompt. Лежит внутри #view, чтобы в поле работали подсказки @.
// Возвращает текст поля, true для вопроса без поля, null при отмене.
export function askDialog(T, { title, text = '', input = false, value = '', placeholder = '', suggest = '', ok = 'Да', danger = false }) {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'r-crop r-ask';
    dlg.innerHTML = `
      <form method="dialog" class="r-crop-box">
        <h2></h2>
        ${text ? '<p class="empty"></p>' : ''}
        ${input ? `<label class="field"><input name="answer" autocomplete="off" ${suggest ? `data-suggest="${suggest}"` : ''}></label>` : ''}
        <div class="r-crop-bar">
          <button type="button" class="btn" data-ask-cancel>${T('Отмена')}</button>
          <button class="btn ${danger ? 'danger' : 'primary'}" value="yes">${T(ok)}</button>
        </div>
      </form>`;
    dlg.querySelector('h2').textContent = title;
    if (text) dlg.querySelector('p').textContent = text;
    const field = dlg.querySelector('input');
    if (field) { field.value = value; field.placeholder = placeholder; }
    dlg.querySelector('[data-ask-cancel]').addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => {
      const yes = dlg.returnValue === 'yes';
      resolve(yes ? (field ? field.value : true) : null);
      dlg.remove();
    });
    document.getElementById('view').append(dlg);
    dlg.showModal();
    field?.focus();
  });
}

/* ---------- Картинки ---------- */

// Фото с iPhone. Большинство браузеров HEIC не читает, поэтому конвертер качаем только когда такой файл выбрали.
const HEIC_LIB = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
const isHeic = file => /^image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name || '');
let heicLib = null;
let onHeic = () => {};

function loadHeicLib() {
  heicLib ||= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = HEIC_LIB;
    script.onload = () => resolve(window.heic2any);
    script.onerror = () => { heicLib = null; reject(new Error('heic lib')); };
    document.head.append(script);
  });
  return heicLib;
}

// Единая точка чтения картинки: сначала сам браузер (Safari умеет), для HEIC запасной путь через конвертер.
// Микрофон, выбранный в настройках приложения; если его отключили, берём микрофон по умолчанию.
export async function micStream() {
  let id = '';
  try { id = localStorage.getItem('mic') || ''; } catch { /* приватный режим */ }
  if (id) {
    try { return await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: id } } }); }
    catch (e) { if (e.name !== 'OverconstrainedError' && e.name !== 'NotFoundError') throw e; }
  }
  return navigator.mediaDevices.getUserMedia({ audio: true });
}

export function micError(e, T) {
  console.error(e);
  if (e?.name === 'NotFoundError') return T('Микрофон не найден. Подключите его и попробуйте ещё раз.');
  if (e?.name === 'NotReadableError') return T('Микрофон занят другой программой или выключен.');
  return T(navigator.userAgent.includes('YaytsaCloud/')
    ? 'Нет доступа к микрофону. Перезапустите приложение. Если не поможет, в Параметрах Windows откройте «Конфиденциальность → Микрофон» и включите «Разрешить классическим приложениям доступ к микрофону».'
    : 'Нет доступа к микрофону. Разрешите его в настройках браузера.');
}

export async function readImage(file) {
  try {
    return await createImageBitmap(file);
  } catch (e) {
    if (!isHeic(file)) throw e;
  }
  onHeic();
  const convert = await loadHeicLib();
  const jpeg = await convert({ blob: file, toType: 'image/jpeg', quality: 0.9 });
  return createImageBitmap(Array.isArray(jpeg) ? jpeg[0] : jpeg);
}

// Storage на бесплатном тарифе нет, поэтому картинка лежит строкой в документе. Лимит документа в базе 1 МиБ.
// ponytail: гифку нельзя ужать в браузере, не убив анимацию, поэтому она ограничена размером. Большие гифки — только через Storage.
const GIF_LIMIT = 590000;

function imageSize(url) {
  const img = new Image();
  img.src = url;
  return img.decode().then(() => img);
}

export async function fileToImage(file, { max = 1280, limit = 400000 } = {}) {
  if (file.type === 'image/gif') {
    if (file.size > GIF_LIMIT) throw new Error('big-gif');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
  const bitmap = await readImage(file);
  const k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * k);
  canvas.height = Math.round(bitmap.height * k);
  const g = canvas.getContext('2d');
  g.fillStyle = '#1B1B1B'; // JPEG без прозрачности: прозрачный PNG ляжет на цвет сайта, а не на чёрный
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  for (const q of [0.85, 0.75, 0.6, 0.45, 0.3]) {
    const url = canvas.toDataURL('image/jpeg', q);
    if (url.length <= limit) return url;
  }
  throw new Error('too-big');
}

/* ---------- Кадрирование ---------- */

// Окно с рамкой: фото двигают мышью или пальцем, масштаб — ползунком, колесом или клавишами.
// ratio 1 — круг для аватарки, больше 1 — вытянутая шапка, меньше 1 — портрет для селфи. Возвращает JPEG строкой или null, если нажали «Отмена».
export async function cropImage(file, T, { ratio = 1, out = 256, limit = 95000 } = {}) {
  const bitmap = await readImage(file);
  const { width: w, height: h } = bitmap;
  const SW = 560;  // холст в пикселях, на экране вдвое меньше — для чёткости на ретине
  const SH = Math.round(SW / ratio);
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = `r-crop${ratio > 1 ? ' wide' : ratio < 1 ? ' tall' : ''}`;
    dlg.innerHTML = `
      <form method="dialog" class="r-crop-box">
        <h2>${T('Кадрирование фото')}</h2>
        <p class="empty">${T('Перетащите фото и выберите масштаб.')}</p>
        <div class="r-crop-stage" tabindex="0" aria-label="${T('Область кадрирования. Стрелки двигают фото, плюс и минус меняют масштаб.')}">
          <canvas width="${SW}" height="${SH}"></canvas>
        </div>
        <label class="r-crop-zoom">
          <span aria-hidden="true">${ICON.minus}</span>
          <input type="range" min="1" max="4" step="0.01" value="1" aria-label="${T('Масштаб')}">
          <span aria-hidden="true">${ICON.plus}</span>
        </label>
        <div class="r-crop-bar">
          <button class="btn" value="cancel">${T('Отмена')}</button>
          <button class="btn primary" value="ok">${T('Сохранить')}</button>
        </div>
      </form>`;
    document.body.append(dlg);
    const canvas = dlg.querySelector('canvas');
    const stage = dlg.querySelector('.r-crop-stage');
    stage.style.aspectRatio = ratio;
    const range = dlg.querySelector('input[type=range]');
    const g = canvas.getContext('2d');
    const base = Math.max(SW / w, SH / h);
    let zoom = 1;
    let cx = w / 2;
    let cy = h / 2;

    const clamp = () => {
      const halfW = SW / (2 * base * zoom);
      const halfH = SH / (2 * base * zoom);
      cx = Math.min(Math.max(cx, halfW), w - halfW);
      cy = Math.min(Math.max(cy, halfH), h - halfH);
    };
    const paint = (ctx2, width, height) => {
      const k = base * zoom * (width / SW);
      ctx2.fillStyle = '#1B1B1B';
      ctx2.fillRect(0, 0, width, height);
      ctx2.imageSmoothingQuality = 'high';
      ctx2.drawImage(bitmap, width / 2 - cx * k, height / 2 - cy * k, w * k, h * k);
    };
    const draw = () => { clamp(); paint(g, SW, SH); };
    const setZoom = z => { zoom = Math.min(4, Math.max(1, z)); range.value = zoom; draw(); };

    let drag = null;
    stage.addEventListener('pointerdown', e => {
      stage.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, cx, cy };
    });
    stage.addEventListener('pointermove', e => {
      if (!drag) return;
      const k = base * zoom * (stage.clientWidth / SW);
      cx = drag.cx - (e.clientX - drag.x) / k;
      cy = drag.cy - (e.clientY - drag.y) / k;
      draw();
    });
    const end = () => { drag = null; };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('wheel', e => { e.preventDefault(); setZoom(zoom * Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
    stage.addEventListener('keydown', e => {
      const step = 20 / (base * zoom);
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (moves[e.key]) { cx += moves[e.key][0]; cy += moves[e.key][1]; draw(); e.preventDefault(); }
      if (e.key === '+' || e.key === '=') setZoom(zoom * 1.1);
      if (e.key === '-') setZoom(zoom / 1.1);
    });
    range.addEventListener('input', () => setZoom(+range.value));

    dlg.addEventListener('close', () => {
      let url = null;
      if (dlg.returnValue === 'ok') {
        const result = document.createElement('canvas');
        result.width = out;
        result.height = Math.round(out / ratio);
        paint(result.getContext('2d'), result.width, result.height);
        for (const q of [0.88, 0.8, 0.7, 0.6, 0.5]) {
          url = result.toDataURL('image/jpeg', q);
          if (url.length <= limit) break;
        }
      }
      bitmap.close?.();
      dlg.remove();
      resolve(url);
    });
    draw();
    dlg.showModal();
    stage.focus();
  });
}
