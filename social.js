// Соцчасть: профили с @именем, посты с ветками комментариев, голоса, подписки и друзья, личные чаты.
// Сервера нет: всё пишет браузер, а честность записей проверяют правила в firestore.rules.

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const EGG_COLORS = ['#6FA8FF', '#FFB347', '#A58BFF', '#FF6F91', '#6BE3B4', '#5ED0F0', '#FF8A5B', '#FFC531'];

const ICON = {
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
};

export function setupSocial(ctx) {
  const { T, esc, view } = ctx;
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
  let roomMsgs = [];
  let thread = null;           // открытый пост: { post, comments, focus }
  let commentSort = 'best';
  let shownProfile = null;     // uid открытого профиля
  let seq = 0;                 // защита от устаревших асинхронных отрисовок

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
  const isFriend = uid => following.has(uid) && followers.has(uid);
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

  // Текст пишут посетители: сначала esc, потом ссылки (только http/https) и упоминания @имя.
  const rich = s => esc(s)
    .replace(/https?:\/\/[^\s<]+[^\s<.,:;"')\]!?]/g, u => `<a class="r-link" href="${u}" target="_blank" rel="noopener nofollow ugc">${u}</a>`)
    .replace(/(^|[\s(])@([a-z0-9_]{3,20})\b/g, (_, pre, n) => `${pre}<a class="r-link" href="#u/${n}">@${n}</a>`);

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
      batch.update(ref(kind === 'p' ? 'posts' : 'tcomments', id), { score: F().increment(after - before) });
      await batch.commit();
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
    const label = mine && theirs ? 'Друзья' : mine ? 'Вы подписаны' : theirs ? 'Подписаться в ответ' : 'Подписаться';
    return `<button type="button" class="r-pill ${mine ? 'ghost' : 'primary'} ${extra}" data-s-follow="${esc(uid)}" aria-pressed="${mine}">${mine && theirs ? '✓ ' : ''}${T(label)}</button>`;
  }

  async function toggleFollow(uid) {
    if (needAccount()) return;
    const id = `${me()}_${uid}`;
    try {
      if (following.has(uid)) {
        if (isFriend(uid) && !confirm(T('Отписаться? Вы перестанете быть друзьями.'))) return;
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
    if (isFriend(uid)) return `<span class="r-tag friend">${T('друг')}</span>`;
    if (following.has(uid)) return `<span class="r-tag">${T('подписка')}</span>`;
    return '';
  }

  const DOT = '<span class="r-dot">•</span>';
  function appLink(appId) {
    const app = appId && ctx.apps.find(a => a.id === appId);
    return app ? `<a class="r-app" href="#app/${esc(app.id)}">${esc(ctx.nm(app))}</a>` : '';
  }
  const appChip = appId => (appLink(appId) ? DOT + appLink(appId) : '');

  const shareBtn = href => `<button type="button" class="r-pill" data-s-share="${esc(href)}">${ICON.share}<span>${T('Поделиться')}</span></button>`;

  const postCard = (p, { author = true } = {}) => `
    <article class="r-post" data-href="#post/${esc(p.id)}">
      <div class="r-meta">
        ${author ? `<a class="r-who" href="${profileHref(p.uid)}">${ava(p.uid, 24)}<span class="r-user">${userLabel(p.uid)}</span></a>${relation(p.uid)}<span class="r-dot">•</span>` : ''}
        ${time(p.createdAt)}
        ${appChip(p.appId)}
      </div>
      <h2 class="r-title"><a href="#post/${esc(p.id)}">${esc(p.title)}</a></h2>
      ${p.body ? `<div class="r-preview">${esc(p.body)}</div>` : ''}
      <div class="r-actions">
        ${voteBox('p', p.id, p.score)}
        <a class="r-pill" href="#post/${esc(p.id)}" aria-label="${T('Комментарии: {n}', { n: p.commentCount || 0 })}">${ICON.comment}<span>${fmt(p.commentCount || 0)}</span></a>
        ${shareBtn(`#post/${p.id}`)}
      </div>
    </article>`;

  /* ---------- Лента ---------- */

  const SORTS = [['hot', 'Популярное'], ['new', 'Новое'], ['top', 'Лучшее'], ['following', 'Подписки']];

  // Формула «горячего» как у Reddit: голоса по логарифму плюс свежесть. Подписки и друзья поднимаются выше.
  function hot(p) {
    const s = p.score || 0;
    const t = (ms(p.createdAt) || Date.now()) / 1000;
    const boost = isFriend(p.uid) ? 1.5 : following.has(p.uid) ? 1 : 0;
    return Math.sign(s) * Math.log10(Math.max(Math.abs(s), 1)) + Math.log10(1 + (p.commentCount || 0)) * 0.5 + t / 45000 + boost;
  }

  async function renderFeed(sort) {
    if (notReady()) return;
    const my = ++seq;
    document.title = `${T('Лента')} — ${T('Яйца Клауд')}`;
    view.innerHTML = feedShell(sort, `<p class="empty r-note">${T('Загрузка…')}</p>`, '');
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
    const karma = new Map();
    list.forEach(p => karma.set(p.uid, (karma.get(p.uid) || 0) + (p.score || 0) + (p.commentCount || 0)));
    const top = [...karma].filter(([uid]) => handle(uid) && uid !== me()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const aside = `
      <section class="r-card">
        <h3 class="r-card-title">${T('Лента')}</h3>
        <p class="r-card-text">${T('Популярные обсуждения со всего сайта. Посты тех, на кого вы подписаны, и друзей стоят выше.')}</p>
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
        F().getDocs(F().query(col('tcomments'), F().where('postId', '==', id))),
      ]);
      if (!p.exists()) { if (my === seq) note(T('Пост не найден или удалён.')); return; }
      post = { id: p.id, ...p.data() };
      comments = rows(c);
    } catch (e) {
      console.error(e);
      if (my === seq) note(T('Пост сейчас недоступен.'));
      return;
    }
    await loadPeople([post.uid, ...comments.map(c => c.uid)]);
    if (my !== seq) return;
    thread = { post, comments, focus };
    postTitles.set(post.id, post.title);
    drawPost();
  }

  function drawPost(keepScroll = false) {
    const { post, comments, focus } = thread;
    const y = scrollY;
    document.title = `${post.title} — ${T('Яйца Клауд')}`;
    const mine = post.uid === me();
    const menu = mine || ctx.isAdmin ? `
      <details class="r-menu">
        <summary class="r-iconbtn" aria-label="${T('Ещё')}">${ICON.dots}</summary>
        <div class="r-menu-list">
          ${mine ? `<button type="button" data-s-edit-post>${T('Изменить')}</button>` : ''}
          <button type="button" data-s-del-post>${T('Удалить')}</button>
        </div>
      </details>` : '';
    const live = comments.filter(c => !c.deleted).length;
    const sub = [people.get(post.uid)?.name ? esc(people.get(post.uid).name) : '', appLink(post.appId)].filter(Boolean).join(DOT);
    const main = `
      <article class="r-full">
        <div class="r-full-head">
          <button type="button" class="r-iconbtn r-backbtn" data-s-back aria-label="${T('Назад')}">${ICON.back}</button>
          <a href="${profileHref(post.uid)}">${ava(post.uid, 32)}</a>
          <div class="r-full-who">
            <div class="r-meta"><a class="r-user strong" href="${profileHref(post.uid)}">${userLabel(post.uid)}</a>${relation(post.uid)}<span class="r-dot">•</span>${time(post.createdAt)}${post.editedAt ? `<span class="r-dot">•</span><span>${T('изменено')}</span>` : ''}</div>
            ${sub ? `<div class="r-sub">${sub}</div>` : ''}
          </div>
          ${menu}
        </div>
        <h1 class="r-h1">${esc(post.title)}</h1>
        <div class="r-body" id="r-post-body">${post.body ? rich(post.body) : ''}</div>
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
      <div class="r-tree">${tree(comments, post, focus) || (live ? '' : `<p class="empty r-note">${T('Комментариев пока нет. Начните обсуждение!')}</p>`)}</div>`;
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
        <textarea name="text" rows="${parentId ? 3 : 1}" maxlength="5000" required aria-label="${T(parentId ? 'Ответ' : 'Комментарий')}"
          placeholder="${T(parentId ? 'Напишите ответ' : 'Присоединиться к обсуждению')}" ${autofocus ? 'autofocus' : ''}></textarea>
        <div class="r-composer-bar">
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
      const menu = !c.deleted && (mine || ctx.isAdmin) ? `
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
            <div class="r-c-body">${c.deleted ? `<p class="r-muted">${T('[комментарий удалён]')}</p>` : rich(c.body)}</div>
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

  async function addComment(form) {
    if (needAccount()) return;
    const text = form.elements.text.value.trim();
    if (!text || !thread) return;
    const { post } = thread;
    const parentId = form.dataset.parent || '';
    const button = form.querySelector('button:not([type])');
    button.disabled = true;
    try {
      const cRef = F().doc(col('tcomments'));
      const batch = F().writeBatch(ctx.db);
      batch.set(cRef, { postId: post.id, parentId, uid: me(), body: text, score: 0, deleted: false, createdAt: F().serverTimestamp() });
      batch.update(ref('posts', post.id), { commentCount: F().increment(1) });
      await batch.commit();
      const parent = parentId && thread.comments.find(c => c.id === parentId);
      ctx.notify('treply', cRef.id, parent ? parent.uid : post.uid, post.id, text);
      thread.comments.push({ id: cRef.id, postId: post.id, parentId, uid: me(), body: text, score: 0, deleted: false, createdAt: { toMillis: () => Date.now() } });
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

  function editForm(kind, id, text) {
    return `
      <form class="r-composer open" data-s-form="edit-${kind}" data-id="${esc(id)}">
        <textarea name="text" rows="5" maxlength="${kind === 'post' ? 10000 : 5000}" ${kind === 'post' ? '' : 'required'} aria-label="${T('Текст')}">${esc(text)}</textarea>
        <div class="r-composer-bar">
          <button type="button" class="r-pill ghost" data-s-cancel-edit>${T('Отмена')}</button>
          <button class="r-pill primary">${T('Сохранить')}</button>
        </div>
      </form>`;
  }

  async function saveEdit(form) {
    const text = form.elements.text.value.trim();
    const kind = form.dataset.sForm === 'edit-post' ? 'post' : 'comment';
    try {
      if (kind === 'post') {
        await F().updateDoc(ref('posts', thread.post.id), { body: text, editedAt: F().serverTimestamp() });
        Object.assign(thread.post, { body: text, editedAt: true });
      } else {
        if (!text) return;
        await F().updateDoc(ref('tcomments', form.dataset.id), { body: text, editedAt: F().serverTimestamp() });
        Object.assign(thread.comments.find(c => c.id === form.dataset.id), { body: text, editedAt: true });
      }
      drawPost(true);
    } catch (e) { fail(e); }
  }

  async function deleteComment(id) {
    if (!confirm(T('Удалить комментарий?'))) return;
    try {
      const c = thread.comments.find(x => x.id === id);
      await F().updateDoc(ref('tcomments', id), c.uid === me()
        ? { body: '', deleted: true, editedAt: F().serverTimestamp() }
        : { body: '', deleted: true });
      Object.assign(c, { body: '', deleted: true });
      drawPost(true);
    } catch (e) { fail(e); }
  }

  async function deletePost() {
    if (!confirm(T('Удалить пост? Это нельзя отменить.'))) return;
    try {
      await F().deleteDoc(ref('posts', thread.post.id));
      thread = null;
      location.hash = pub ? `u/${pub.username}` : 'feed';
    } catch (e) { fail(e); }
  }

  function authorCard(uid) {
    const p = people.get(uid);
    if (!p) return '';
    return `
      <section class="r-card r-author">
        <div class="r-banner" style="--c:${color(uid)}"></div>
        <div class="r-author-head">
          <a href="${profileHref(uid)}">${ava(uid, 56)}</a>
          <div>
            <a class="r-author-name" href="${profileHref(uid)}">${esc(shownName(uid))}</a>
            <div class="r-sub">@${esc(p.username)}</div>
          </div>
        </div>
        ${p.bio ? `<p class="r-card-text">${rich(p.bio)}</p>` : ''}
        <div class="r-author-actions">
          ${uid === me() ? `<a class="r-pill ghost wide" href="#account">${T('Изменить профиль')}</a>` : `${followBtn(uid, 'wide')}<a class="r-pill ghost wide" href="#chat/${esc(p.username)}">${ICON.chat}<span>${T('Написать')}</span></a>`}
        </div>
        ${p.createdAt ? `<p class="r-sub">${T('На сайте с {date}', { date: day(p.createdAt) })}</p>` : ''}
      </section>`;
  }

  /* ---------- Профиль ---------- */

  const PROFILE_TABS = [['', 'Обзор'], ['posts', 'Посты'], ['comments', 'Комментарии'], ['followers', 'Подписчики'], ['following', 'Подписки'], ['friends', 'Друзья']];

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
    comments = comments.filter(c => !c.deleted);
    const insSet = new Set(ins);
    const friends = outs.filter(x => insSet.has(x));
    const listed = tab === 'followers' ? ins : tab === 'following' ? outs : tab === 'friends' ? friends : [];
    await Promise.all([
      loadPeople([...listed, ...friends.slice(0, 8)]),
      Promise.all([...new Set(comments.map(c => c.postId))].filter(id => !postTitles.has(id)).map(async id => {
        try { const d = await F().getDoc(ref('posts', id)); postTitles.set(id, d.exists() ? d.data().title : ''); } catch { postTitles.set(id, ''); }
      })),
    ]);
    if (my !== seq) return;

    const p = people.get(uid);
    if (!p) return note(T('Пользователь @{name} не найден.', { name: esc(name) }));
    const isMe = uid === me();
    const karma = posts.reduce((n, x) => n + (x.score || 0), 0) + comments.reduce((n, x) => n + (x.score || 0), 0);
    document.title = `${p.name || p.username} (@${p.username}) — ${T('Яйца Клауд')}`;

    const byTime = (a, b) => ms(b.createdAt) - ms(a.createdAt);
    const commentCard = c => `
      <article class="r-post r-pcomment" data-href="#post/${esc(c.postId)}/${esc(c.id)}">
        <div class="r-meta">${ICON.comment}<a class="r-ptitle" href="#post/${esc(c.postId)}">${postTitles.get(c.postId) ? esc(postTitles.get(c.postId)) : T('[пост удалён]')}</a></div>
        <div class="r-meta"><span class="r-user strong">${userLabel(uid)}</span><span>${T('ответил(а)')}</span><span class="r-dot">•</span>${time(c.createdAt)}</div>
        <div class="r-preview">${esc(c.body)}</div>
        <div class="r-actions">
          ${voteBox('c', c.id, c.score)}
          <a class="r-pill flat" href="#post/${esc(c.postId)}/${esc(c.id)}">${ICON.comment}<span>${T('Ответить')}</span></a>
          ${shareBtn(`#post/${c.postId}/${c.id}`)}
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
      friends: 'Друзей пока нет. Друзья — это взаимная подписка.',
    }[tab];

    const stat = (n, label, href) => `<a class="r-stat" href="${href}"><b>${fmt(n)}</b><span>${T(label)}</span></a>`;
    const base = `#u/${esc(p.username)}`;
    const main = `
      <div class="r-profile" data-uid="${esc(uid)}">
        <header class="r-phead">
          <div class="r-pava">
            ${ava(uid, 76)}
            ${isMe ? `<a class="r-pava-edit" href="#account" aria-label="${T('Изменить аватар')}">${ICON.plus}</a>` : ''}
          </div>
          <div class="r-phead-text">
            <h1>${esc(p.name || p.username)}</h1>
            <p class="r-sub">@${esc(p.username)}${!isMe && followers.has(uid) ? ` <span class="r-tag">${T(isFriend(uid) ? 'друг' : 'подписан(а) на вас')}</span>` : ''}</p>
          </div>
        </header>
        <div class="r-phead-actions">
          ${isMe
            ? `<a class="r-pill ghost" href="#account">${T('Изменить профиль')}</a>`
            : `${followBtn(uid)}<a class="r-pill ghost" href="#chat/${esc(p.username)}">${ICON.chat}<span>${T('Написать')}</span></a>`}
          <span class="r-sub">${T('Подписчики')}: <b>${fmt(ins.length)}</b> · ${T('Друзья')}: <b>${fmt(friends.length)}</b></span>
        </div>
        <nav class="r-tabs" aria-label="${T('Разделы профиля')}">
          ${PROFILE_TABS.map(([id, label]) => `<a href="${base}${id ? `/${id}` : ''}" aria-current="${id === tab ? 'page' : 'false'}">${T(label)}</a>`).join('')}
        </nav>
        ${isMe && ['', 'posts'].includes(tab) ? `<a class="r-pill ghost r-create" href="#submit">${ICON.plus}<span>${T('Создать пост')}</span></a>` : ''}
        <div class="r-list">${body || `<p class="empty r-note">${T(emptyText)}</p>`}</div>
      </div>`;
    const aside = `
      <section class="r-card r-pcard">
        <div class="r-banner big" style="--c:${color(uid)}"></div>
        <h2 class="r-card-title">${esc(p.name || p.username)}</h2>
        <div class="r-author-actions">
          ${isMe
            ? `<a class="r-pill ghost wide" href="#account">${T('Изменить профиль')}</a>`
            : `${followBtn(uid, 'wide')}<a class="r-pill ghost wide" href="#chat/${esc(p.username)}">${ICON.chat}<span>${T('Написать')}</span></a>`}
        </div>
        ${p.bio ? `<p class="r-card-text">${rich(p.bio)}</p>` : ''}
        <div class="r-stats">
          <div class="r-stat"><b>${fmt(karma)}</b><span>${T('Карма')}</span></div>
          ${stat(ins.length, 'Подписчики', `${base}/followers`)}
          ${stat(outs.length, 'Подписки', `${base}/following`)}
          ${stat(friends.length, 'Друзья', `${base}/friends`)}
          <div class="r-stat"><b>${fmt(posts.length)}</b><span>${T('Посты')}</span></div>
          <div class="r-stat"><b>${esc(day(p.createdAt) || '—')}</b><span>${T('На сайте с')}</span></div>
        </div>
        ${friends.length ? `
          <h3 class="r-card-title small">${T('Друзья')}</h3>
          <div class="r-faces">${friends.slice(0, 8).map(x => `<a href="${profileHref(x)}" title="${esc(shownName(x))}">${ava(x, 36)}</a>`).join('')}</div>` : ''}
      </section>`;
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

  function renderSubmit(appId) {
    if (notReady()) return;
    document.title = `${T('Создать пост')} — ${T('Яйца Клауд')}`;
    if (!ctx.user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы создать пост.')}`);
    if (!pub) return note(`${T('Сначала выберите @имя.')} <a class="link" href="#account">${T('Открыть профиль')}</a>`);
    const main = `
      <h1 class="r-h1">${T('Создать пост')}</h1>
      <form class="r-submit" data-s-form="post">
        <div class="r-field">
          <input name="title" maxlength="300" required placeholder="${T('Заголовок')}*" aria-label="${T('Заголовок')}">
          <span class="r-counter" data-for="title">0/300</span>
        </div>
        <div class="r-field">
          <textarea name="body" rows="9" maxlength="10000" placeholder="${T('Текст (необязательно)')}" aria-label="${T('Текст')}"></textarea>
        </div>
        <label class="r-field inline">${T('О программе')}
          <select name="appId">
            <option value="">${T('Без программы')}</option>
            ${ctx.apps.map(a => `<option value="${esc(a.id)}" ${a.id === appId ? 'selected' : ''}>${esc(ctx.nm(a))}</option>`).join('')}
          </select>
        </label>
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
          <li>${T('Привяжите программу — пост будет виден и на её странице.')}</li>
          <li>${T('Упомяните человека через @имя, ссылки станут кликабельными.')}</li>
          <li>${T('Будьте вежливы. Админы могут удалить грубость.')}</li>
        </ol>
      </section>`;
    view.innerHTML = page(main, aside);
  }

  async function addPost(form) {
    if (needAccount()) return;
    const { title, body, appId } = Object.fromEntries(new FormData(form));
    if (!title.trim()) return;
    const button = form.querySelector('button:not([type])');
    button.disabled = true;
    try {
      const pRef = await F().addDoc(col('posts'), {
        uid: me(), title: title.trim(), body: body.trim(), appId: appId || '', score: 0, commentCount: 0, createdAt: F().serverTimestamp(),
      });
      location.hash = `post/${pRef.id}`;
    } catch (e) {
      button.disabled = false;
      fail(e);
    }
  }

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
  const peerOf = c => c.members.find(x => x !== me()) || me();
  const unread = c => c.lastFrom !== me() && ms(c.lastAt) > ms(c.seen?.[me()]);

  function watchChats() {
    stopChats?.();
    stopChats = null;
    chats = [];
    if (!ctx.user) return;
    stopChats = F().onSnapshot(
      F().query(col('chats'), F().where('members', 'array-contains', me())),
      async snap => {
        chats = rows(snap).sort((a, b) => (ms(b.lastAt) || Date.now()) - (ms(a.lastAt) || Date.now()));
        await loadPeople(chats.map(peerOf));
        ctx.drawInboxCount();
        if (ctx.route().name === 'chat') {
          drawChatList();
          if (roomId && !stopMsgs && chats.some(c => c.id === roomId)) openRoomStream();
          markSeen();
        }
      },
      console.error,
    );
  }

  async function renderChat(name) {
    if (notReady()) return;
    document.title = `${T('Чаты')} — ${T('Яйца Клауд')}`;
    if (!ctx.user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы писать сообщения.')}`);
    const my = ++seq;
    let peer = null;
    if (name) {
      try { peer = await uidByName(name); } catch (e) { console.error(e); }
      if (my !== seq) return;
      if (!peer) return note(T('Пользователь @{name} не найден.', { name: esc(name) }));
      await loadPeople([peer]);
      if (my !== seq) return;
    }
    const nextRoom = peer ? chatId(me(), peer) : null;
    if (nextRoom !== roomId) {
      stopMsgs?.();
      stopMsgs = null;
      roomMsgs = [];
    }
    roomId = nextRoom;
    roomPeer = peer;
    view.innerHTML = `
      <div class="r-chat${peer ? ' has-room' : ''}">
        <aside class="r-chat-list">
          <div class="r-chat-top">
            <h1>${T('Чаты')}</h1>
            <a class="link" href="#inbox">${T('Баги и идеи')}</a>
          </div>
          <div id="chat-items"></div>
        </aside>
        <section class="r-room" aria-label="${T('Переписка')}">
          ${peer ? `
            <header class="r-room-head">
              <a class="r-iconbtn r-room-back" href="#chat" aria-label="${T('Все чаты')}">${ICON.back}</a>
              <a class="r-who" href="${profileHref(peer)}">${ava(peer, 36)}<span><b>${esc(shownName(peer))}</b>${handle(peer) ? `<small>@${esc(handle(peer))}</small>` : ''}</span></a>
              ${relation(peer)}
            </header>
            <div class="r-msgs" id="chat-msgs" aria-live="polite"></div>
            ${pub ? `
              <form class="r-chat-form" data-s-form="chat">
                <textarea name="text" rows="1" maxlength="2000" required aria-label="${T('Сообщение')}" placeholder="${T('Сообщение')}"></textarea>
                <button class="r-send" aria-label="${T('Отправить')}">${ICON.send}</button>
              </form>` : `<a class="r-composer-stub" href="#account">${T('Выберите @имя в профиле, чтобы писать сообщения')}</a>`}`
            : `<div class="r-room-empty"><p class="empty">${T('Выберите чат слева или откройте профиль человека и нажмите «Написать».')}</p></div>`}
        </section>
      </div>`;
    drawChatList();
    drawMsgs();
    if (roomId && chats.some(c => c.id === roomId)) openRoomStream();
    markSeen();
    view.querySelector('.r-chat-form textarea')?.focus();
  }

  function drawChatList() {
    const box = document.getElementById('chat-items');
    if (!box) return;
    box.innerHTML = chats.map(c => {
      const peer = peerOf(c);
      return `
        <a class="r-chat-item${c.id === roomId ? ' active' : ''}${unread(c) ? ' unread' : ''}" href="${handle(peer) ? `#chat/${esc(handle(peer))}` : profileHref(peer)}">
          ${ava(peer, 40)}
          <span class="r-chat-text">
            <span class="r-chat-line"><b>${esc(shownName(peer))}</b><small>${ms(c.lastAt) ? ago(c.lastAt) : ''}</small></span>
            <span class="r-chat-last">${c.lastFrom === me() ? `${T('Вы:')} ` : ''}${esc(c.lastText)}</span>
          </span>
        </a>`;
    }).join('') || `<p class="empty r-note">${T('Переписок пока нет.')}</p>`;
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
      console.error,
    );
  }

  function drawMsgs() {
    const box = document.getElementById('chat-msgs');
    if (!box) return;
    const stick = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    let html = '';
    let prev = null;
    let lastDay = '';
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
            ${grouped ? '' : `<div class="r-meta"><b class="r-user strong">${esc(shownName(m.from))}</b><span>${new Date(t).toLocaleTimeString(ctx.lang === 'en' ? 'en-GB' : 'ru-RU', { hour: '2-digit', minute: '2-digit' })}</span></div>`}
            <div class="r-msg-text">${rich(m.text)}</div>
          </div>
        </div>`;
      prev = m;
    }
    box.innerHTML = html || `<div class="r-room-hello">${ava(roomPeer, 64)}<b>${esc(shownName(roomPeer))}</b><p class="empty">${T('Это начало вашей переписки.')}</p></div>`;
    if (stick || !roomMsgs.length) box.scrollTop = box.scrollHeight;
  }

  function markSeen() {
    const c = chats.find(x => x.id === roomId);
    if (!c || !unread(c) || document.hidden) return;
    F().updateDoc(ref('chats', c.id), { [`seen.${me()}`]: F().serverTimestamp() }).catch(console.error);
  }

  async function sendChat(form) {
    if (needAccount() || !roomId) return;
    const input = form.elements.text;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    try {
      const batch = F().writeBatch(ctx.db);
      batch.set(ref('chats', roomId), {
        members: [me(), roomPeer].sort(),
        lastText: text.slice(0, 200),
        lastFrom: me(),
        lastAt: F().serverTimestamp(),
        seen: { [me()]: F().serverTimestamp() },
      }, { merge: true });
      batch.set(F().doc(col('chats', roomId, 'msgs')), { from: me(), text, createdAt: F().serverTimestamp() });
      await batch.commit();
      if (!stopMsgs) openRoomStream();
    } catch (e) {
      input.value = text;
      fail(e);
    }
  }

  /* ---------- Аккаунт: @имя и «о себе» ---------- */

  const accountFields = () => `
    <label class="field">${T('Имя пользователя')}
      <span class="r-at"><span aria-hidden="true">@</span><input name="username" maxlength="20" pattern="[A-Za-z0-9_]{3,20}" autocomplete="username"
        value="${esc(pub?.username || '')}" ${pub ? 'required' : ''} title="${T('3–20 символов: латиница, цифры и _')}"></span>
      <small class="r-hint">${T('3–20 символов: латиница, цифры и _. По нему вас находят и упоминают.')}</small>
    </label>
    <label class="field">${T('О себе')}<textarea name="bio" rows="3" maxlength="300">${esc(pub?.bio || '')}</textarea></label>`;

  const accountNote = () => (pub
    ? `<a class="btn" href="#u/${esc(pub.username)}">${T('Открыть мой профиль')}</a>`
    : `<p class="msg ok">${T('Выберите @имя: без него нельзя писать посты, комментарии и сообщения.')}</p>`);

  async function saveIdentity({ username, bio, name, photo }) {
    username = String(username || '').trim().replace(/^@/, '').toLowerCase();
    if (!username && !pub) return;
    if (!USERNAME_RE.test(username)) throw Object.assign(new Error('bad username'), { code: 'username/invalid' });
    const old = pub?.username;
    const batch = F().writeBatch(ctx.db);
    if (username !== old) {
      const taken = await F().getDoc(ref('usernames', username));
      if (taken.exists()) throw Object.assign(new Error('taken'), { code: 'username/taken' });
      batch.set(ref('usernames', username), { uid: me() });
      if (old) batch.delete(ref('usernames', old));
    }
    const data = { username, name: name.slice(0, 80), photo: photo.length <= 100000 ? photo : '', bio: String(bio || '').trim().slice(0, 300) };
    batch.set(ref('profiles', me()), pub ? data : { ...data, createdAt: F().serverTimestamp() }, { merge: true });
    await batch.commit();
    if (old && old !== username) nameToUid.delete(old);
    pub = { ...pub, ...data, createdAt: pub?.createdAt || { toMillis: () => Date.now() } };
    remember(me(), pub);
    ctx.drawRail();
  }

  // Имя и фото в публичном профиле повторяют приватный users/<uid>. Ошибка здесь не мешает сохранить основное.
  async function mirror(data) {
    if (!pub) return;
    try {
      await F().updateDoc(ref('profiles', me()), data);
      pub = { ...pub, ...data };
      remember(me(), pub);
    } catch (e) { console.error(e); }
  }

  /* ---------- Вход и выход ---------- */

  async function onUser(u) {
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
  }

  /* ---------- Маршруты и события ---------- */

  function route([name, a, b]) {
    if (name === 'feed') return { name: 'feed', sort: SORTS.some(s => s[0] === a) ? a : 'hot', social: true };
    if (name === 'post' && a) return { name: 'post', id: a, focus: b || '', social: true };
    if (name === 'u' && a) return { name: 'u', handle: a.toLowerCase(), tab: PROFILE_TABS.some(t => t[0] === b) ? b || '' : '', social: true };
    if (name === 'uid' && a) return { name: 'uid', uid: a, social: true };
    if (name === 'submit') return { name: 'submit', appId: a || '', social: true };
    if (name === 'chat') return { name: 'chat', handle: (a || '').toLowerCase(), social: true };
    return null;
  }

  function render(r) {
    if (r.name !== 'chat') { stopMsgs?.(); stopMsgs = null; roomId = null; }
    if (r.name !== 'post') thread = null;
    if (r.name === 'feed') renderFeed(r.sort);
    else if (r.name === 'post') renderPost(r.id, r.focus);
    else if (r.name === 'u') renderProfile(r.handle, r.tab);
    else if (r.name === 'uid') renderUid(r.uid);
    else if (r.name === 'submit') renderSubmit(r.appId);
    else if (r.name === 'chat') renderChat(r.handle);
  }

  view.addEventListener('click', e => {
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
      else { form.reset(); document.activeElement.blur(); }
    }
    else if (d.sCancelEdit !== undefined) drawPost(true);
    else if (d.sEditPost !== undefined) {
      t.closest('details').open = false;
      document.getElementById('r-post-body').innerHTML = editForm('post', thread.post.id, thread.post.body || '');
    }
    else if (d.sEditComment) {
      const c = thread.comments.find(x => x.id === d.sEditComment);
      t.closest('.r-c-content').querySelector('.r-c-body').innerHTML = editForm('comment', c.id, c.body);
    }
    else if (d.sDelComment) deleteComment(d.sDelComment);
    else if (d.sDelPost !== undefined) deletePost();
    else if (d.sBack !== undefined) { if (history.length > 1) history.back(); else location.hash = 'feed'; }
    else if (d.sJump !== undefined) {
      e.preventDefault();
      document.getElementById('r-comments')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  view.addEventListener('change', e => {
    if (e.target.matches('[data-s-sort]')) { commentSort = e.target.value; drawPost(true); }
  });

  view.addEventListener('input', e => {
    if (e.target.matches('.r-submit [name=title]')) view.querySelector('.r-counter').textContent = `${e.target.value.length}/300`;
    if (e.target.matches('.r-chat-form textarea, .r-composer textarea')) {
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 240)}px`;
    }
  });

  view.addEventListener('keydown', e => {
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

  function onSubmit(form) {
    const kind = form.dataset.sForm;
    if (kind === 'comment') return addComment(form);
    if (kind === 'post') return addPost(form);
    if (kind === 'chat') return sendChat(form);
    if (kind === 'edit-post' || kind === 'edit-comment') return saveEdit(form);
  }

  return {
    route,
    render,
    onUser,
    onSubmit,
    fillAppThreads,
    accountFields,
    accountNote,
    saveIdentity,
    mirror,
    unreadChats: () => chats.filter(unread).length,
    myHref: () => (pub ? `#u/${pub.username}` : '#account'),
    hasProfile: () => !!pub,
  };
}

/* ---------- Кадрирование аватарки ---------- */

// Окно с круглой рамкой: фото двигают мышью или пальцем, масштаб — ползунком, колесом или клавишами.
// Возвращает JPEG строкой (влезает в лимит 100 000 символов) или null, если нажали «Отмена».
export async function cropImage(file, T) {
  const bitmap = await createImageBitmap(file);
  const { width: w, height: h } = bitmap;
  const S = 560;   // холст в пикселях, на экране вдвое меньше — для чёткости на ретине
  const OUT = 256;
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'r-crop';
    dlg.innerHTML = `
      <form method="dialog" class="r-crop-box">
        <h2>${T('Кадрирование фото')}</h2>
        <p class="empty">${T('Перетащите фото и выберите масштаб.')}</p>
        <div class="r-crop-stage" tabindex="0" aria-label="${T('Область кадрирования. Стрелки двигают фото, плюс и минус меняют масштаб.')}">
          <canvas width="${S}" height="${S}"></canvas>
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
    const range = dlg.querySelector('input[type=range]');
    const g = canvas.getContext('2d');
    const base = S / Math.min(w, h);
    let zoom = 1;
    let cx = w / 2;
    let cy = h / 2;

    const clamp = () => {
      const half = S / (2 * base * zoom);
      cx = Math.min(Math.max(cx, half), w - half);
      cy = Math.min(Math.max(cy, half), h - half);
    };
    const paint = (ctx2, size) => {
      const k = base * zoom * (size / S);
      ctx2.fillStyle = '#1B1B1B';
      ctx2.fillRect(0, 0, size, size);
      ctx2.imageSmoothingQuality = 'high';
      ctx2.drawImage(bitmap, size / 2 - cx * k, size / 2 - cy * k, w * k, h * k);
    };
    const draw = () => { clamp(); paint(g, S); };
    const setZoom = z => { zoom = Math.min(4, Math.max(1, z)); range.value = zoom; draw(); };

    let drag = null;
    stage.addEventListener('pointerdown', e => {
      stage.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, cx, cy };
    });
    stage.addEventListener('pointermove', e => {
      if (!drag) return;
      const k = base * zoom * (stage.clientWidth / S);
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
        const out = document.createElement('canvas');
        out.width = out.height = OUT;
        paint(out.getContext('2d'), OUT);
        for (const q of [0.88, 0.8, 0.7, 0.6, 0.5]) {
          url = out.toDataURL('image/jpeg', q);
          if (url.length <= 95000) break;
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
