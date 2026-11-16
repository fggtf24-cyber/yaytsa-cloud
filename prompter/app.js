// Яйца Суфлёр — a teleprompter that listens and scrolls the text by itself.
import { tokenize, Tracker, sentenceStart } from './align.js';
import { Listener, speechSupported } from './speech.js';
import { googleDocId, fetchGoogleDoc, readFile, titleFrom } from './importer.js';

const VERSION = '1.0.0';
const $ = (s, el = document) => el.querySelector(s);
const view = $('#view');

/* ---------- storage ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* private mode */ } },
};
const DEFAULTS = {
  theme: 'auto', font: 'golos', size: 0, line: 1.5, margin: 6, readLine: 32, smooth: 'soft',
  mirror: false, mode: 'voice', wpm: 130, lang: 'auto', retakes: true, back: 600, wake: true, fullscreen: true,
  uiLang: '', highlight: 'sentence',
};
const settings = Object.assign({}, DEFAULTS, store.get('sufler.settings', {}));
if (!settings.size) settings.size = Math.round(Math.min(46, Math.max(28, Math.min(innerWidth, 900) / 11)));
const saveSettings = () => store.set('sufler.settings', settings);

let list = store.get('sufler.list', []);
const saveList = () => store.set('sufler.list', list);
const textOf = id => store.get(`sufler.text.${id}`, '');
const findScript = id => list.find(s => s.id === id);

/* ---------- language ---------- */
const lang = settings.uiLang || (navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en');
document.documentElement.lang = lang;
const EN = {
  'Суфлёр': 'Prompter',
  'Суфлёр, который слушает вас и сам листает текст': 'A prompter that listens to you and scrolls the text by itself',
  'Ссылка на Google Документ': 'Google Docs link',
  'Загрузить': 'Load',
  'Открыть файл': 'Open a file',
  'Вставить текст': 'Paste text',
  'Мои тексты': 'My scripts',
  'Пока пусто. Добавьте текст лекции одним из способов выше.': 'Nothing here yet. Add your script in one of the ways above.',
  'слов': 'words',
  'прочитано': 'read',
  'Обновить из Google Docs': 'Update from Google Docs',
  'Изменить текст': 'Edit text',
  'Удалить': 'Delete',
  'Удалить «{t}»?': 'Delete “{t}”?',
  'Загружаю…': 'Loading…',
  'Документ закрыт. В Google Документах: «Настройки доступа» → «Все, у кого есть ссылка».': 'The document is private. In Google Docs: Share → General access → Anyone with the link.',
  'Документ не найден. Проверьте ссылку.': 'Document not found. Check the link.',
  'Это не ссылка на Google Документ.': 'This is not a Google Docs link.',
  'Такой формат не читается. Нужен .docx, .txt или .md.': 'This format can’t be read. Use .docx, .txt or .md.',
  'Не получилось прочитать файл.': 'Couldn’t read the file.',
  'Текст обновлён': 'Text updated',
  'Название': 'Title',
  'Текст лекции': 'Script',
  'Сохранить': 'Save',
  'Отмена': 'Cancel',
  'Без названия': 'Untitled',
  'Слова в [квадратных скобках] — заметки для себя: суфлёр их показывает, но не ждёт.': 'Words in [square brackets] are notes to yourself: shown, but not expected to be spoken.',
  'Слушаю': 'Listening',
  'Пауза': 'Paused',
  'Нет сети': 'No network',
  'Скорость': 'Speed',
  'Дубль': 'Retake',
  'Дубль {n}': 'Retake {n}',
  'Продолжаю отсюда': 'Continuing from here',
  'осталось': 'left',
  'Настройки': 'Settings',
  'Текст': 'Text',
  'Размер': 'Size',
  'Интервал': 'Line spacing',
  'Поля': 'Margins',
  'Шрифт': 'Font',
  'Линия чтения': 'Reading line',
  'Плавность': 'Smoothness',
  'Выделять': 'Highlight',
  'Фразу': 'Sentence',
  'Две фразы': 'Two sentences',
  'Абзац': 'Paragraph',
  'Нет': 'Off',
  'Меньше текст': 'Smaller text',
  'Больше текст': 'Larger text',
  'Мягко': 'Soft',
  'Средне': 'Medium',
  'Быстро': 'Quick',
  'Зеркально': 'Mirror',
  'Для стекла суфлёра': 'For teleprompter glass',
  'Тема': 'Theme',
  'Как в системе': 'System',
  'Светлая': 'Light',
  'Тёмная': 'Dark',
  'Листать': 'Scrolling',
  'По голосу': 'By voice',
  'С постоянной скоростью': 'At a steady speed',
  'Слов в минуту': 'Words per minute',
  'Язык речи': 'Speech language',
  'Авто': 'Auto',
  'Дубли': 'Retakes',
  'Сам возвращаться назад, когда начинаю отрывок заново': 'Jump back when I start a passage again',
  'Не гасить экран': 'Keep the screen on',
  'Во весь экран при старте': 'Fullscreen on start',
  'Журнал дублей': 'Retake log',
  'Дублей пока нет. Время считается от первого нажатия «Старт».': 'No retakes yet. Time counts from the first Start.',
  'Скопировать': 'Copy',
  'Скопировано': 'Copied',
  'Очистить': 'Clear',
  'Сбросить время': 'Reset the clock',
  'Как пользоваться': 'How to use',
  'Нажмите «Старт» и читайте: текст листается за голосом. Своими словами — можно, суфлёр подождёт.': 'Press Start and read: the text follows your voice. Ad-libbing is fine, it waits.',
  'Сбился? Прокрутите текст пальцем до нужной строки — суфлёр продолжит с линии чтения. Или дважды нажмите на слово.': 'Out of sync? Drag the text to the right line and it continues from the reading line. Or double-tap a word.',
  '«Дубль» — назад к началу фразы, ещё раз — к предыдущей. Начнёте фразу заново вслух — вернётся сам.': '“Retake” goes back to the start of the sentence, again for the one before. Start a sentence again aloud and it jumps back by itself.',
  'Нажмите на экран, чтобы показать или спрятать кнопки.': 'Tap the screen to show or hide the controls.',
  'Браузер не умеет распознавать речь. Откройте суфлёр в Chrome (Android, ПК) или Safari (iPhone, Mac). Пока листаю с постоянной скоростью.': 'This browser can’t recognize speech. Open it in Chrome (Android, PC) or Safari (iPhone, Mac). Scrolling at a steady speed for now.',
  'Нет доступа к микрофону. Разрешите его в настройках сайта в браузере.': 'No microphone access. Allow it in the browser’s site settings.',
  'Распознаванию речи нужен интернет. Продолжаю, как только он появится.': 'Speech recognition needs the internet. It will continue once it’s back.',
  'Назад': 'Back',
  'Старт': 'Start',
  'Голосовое управление': 'Voice control',
  'Конец текста': 'End of the text',
  'В начало': 'To the start',
  'Тексты хранятся только в этом браузере.': 'Scripts are stored in this browser only.',
  'Как добавить лекцию из Google Документов': 'Adding a script from Google Docs',
  'В документе нажмите «Настройки доступа» и выберите «Все, у кого есть ссылка». Скопируйте ссылку и вставьте сюда. Поправили текст в документе — нажмите «Обновить».': 'In the document, press Share and set General access to Anyone with the link. Copy the link and paste it here. Edited the document? Press Update.',
  'Обновить': 'Update',
  'Место в тексте': 'Position',
  'ещё': 'more',
};
const T = (s, vars = {}) => (lang === 'en' ? EN[s] ?? s : s).replace(/\{(\w+)\}/g, (_, k) => vars[k]);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------- icons (Lucide-style strokes) ---------- */
const ICON = {
  back: '<path d="m15 18-6-6 6-6"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/>',
  play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1.2" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1.2" fill="currentColor" stroke="none"/>',
  retake: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  paste: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  more: '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  doc: '<path d="M4 4h16v16H4z" opacity="0"/><path d="M7 7h10M7 11h10M7 15h6"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

/* ---------- theme & toasts ---------- */
function applyTheme() {
  const t = settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}
applyTheme();

function toast(msg, ms = 2600) {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  box.append(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 250); }, ms);
}

const fmtDur = words => {
  const min = Math.max(1, Math.round(words / 130));
  if (min < 60) return lang === 'en' ? `≈ ${min} min` : `≈ ${min} мин`;
  const h = Math.floor(min / 60), m = min % 60;
  return lang === 'en' ? `≈ ${h} h ${m} min` : `≈ ${h} ч ${m} мин`;
};
const fmtClock = sec => {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + `:${String(s).padStart(2, '0')}`;
};
const countWords = text => tokenize(text).words.length;

/* ---------- scripts ---------- */
function saveScript({ id, title, text, docId }) {
  const words = countWords(text);
  let s = id && findScript(id);
  if (!s) {
    s = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), pos: -1, takes: [] };
    list.unshift(s);
  }
  Object.assign(s, { title: title || T('Без названия'), words, updated: Date.now() });
  if (docId) s.docId = docId;
  if (s.pos >= words) s.pos = words - 1;
  if (!store.set(`sufler.text.${s.id}`, text)) { toast(T('Не получилось прочитать файл.')); return null; }
  saveList();
  return s;
}

async function importGoogle(url, existing) {
  const id = googleDocId(url);
  if (!id) { toast(T('Это не ссылка на Google Документ.')); return null; }
  toast(T('Загружаю…'), 1500);
  try {
    const text = await fetchGoogleDoc(id);
    const s = saveScript({ id: existing?.id, title: existing?.title || titleFrom('', text), text, docId: id });
    if (existing && s) toast(T('Текст обновлён'));
    return s;
  } catch (e) {
    toast(T(e.message === 'notfound' ? 'Документ не найден. Проверьте ссылку.' : 'Документ закрыт. В Google Документах: «Настройки доступа» → «Все, у кого есть ссылка».'), 6000);
    return null;
  }
}

/* ---------- router ---------- */
let cleanup = null;
function route() {
  cleanup?.();
  cleanup = null;
  const [name, id] = location.hash.replace(/^#\/?/, '').split('/');
  if (name === 'read' && findScript(id)) renderPrompter(findScript(id));
  else if (name === 'edit') renderEditor(findScript(id));
  else renderHome();
  view.classList.remove('enter');
  void view.offsetWidth;
  view.classList.add('enter');
}
addEventListener('hashchange', route);

/* ---------- home ---------- */
function renderHome() {
  document.title = `${T('Суфлёр')} — Яйца Cloud`;
  view.className = 'home';
  view.innerHTML = `
    <header class="home-top">
      <a class="brand" href="../" title="Яйца Cloud"><img src="icon-192.png" alt=""><span>Яйца ${T('Суфлёр')}</span></a>
      <button class="icon-btn" id="theme" aria-label="${T('Тема')}">${icon(isDark() ? 'sun' : 'moon')}</button>
    </header>
    <section class="hero">
      <h1>${T('Суфлёр, который слушает вас и сам листает текст')}</h1>
    </section>
    <section class="card import">
      <form id="gdoc" class="gdoc">
        <span class="gfield"><span class="field-ic">${icon('link')}</span><input type="url" inputmode="url" id="gurl" placeholder="${T('Ссылка на Google Документ')}" autocomplete="off"></span>
        <button class="btn primary" type="submit">${T('Загрузить')}</button>
      </form>
      <details class="hint"><summary>${T('Как добавить лекцию из Google Документов')}</summary>
        <p>${T('В документе нажмите «Настройки доступа» и выберите «Все, у кого есть ссылка». Скопируйте ссылку и вставьте сюда. Поправили текст в документе — нажмите «Обновить».')}</p>
      </details>
      <div class="import-row">
        <label class="btn"><input type="file" id="file" accept=".docx,.txt,.md,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden>${icon('file')}${T('Открыть файл')}</label>
        <a class="btn" href="#edit">${icon('paste')}${T('Вставить текст')}</a>
      </div>
    </section>
    <section class="scripts">
      <h2>${T('Мои тексты')}</h2>
      <div id="list"></div>
      <p class="foot">${T('Тексты хранятся только в этом браузере.')} · v${esc(VERSION)}</p>
    </section>`;
  drawList();
  $('#theme').addEventListener('click', () => {
    settings.theme = isDark() ? 'light' : 'dark';
    saveSettings();
    applyTheme();
    $('#theme').innerHTML = icon(isDark() ? 'sun' : 'moon');
  });
  $('#gdoc').addEventListener('submit', async e => {
    e.preventDefault();
    const s = await importGoogle($('#gurl').value.trim());
    if (s) location.hash = `#read/${s.id}`;
  });
  $('#file').addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const text = await readFile(f);
      const s = saveScript({ title: titleFrom(f.name, text), text });
      if (s) location.hash = `#read/${s.id}`;
    } catch (err) {
      toast(T(err.message === 'format' ? 'Такой формат не читается. Нужен .docx, .txt или .md.' : 'Не получилось прочитать файл.'), 5000);
    }
  });
}
const isDark = () => settings.theme === 'dark' || (settings.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);

function drawList() {
  const box = $('#list');
  if (!list.length) { box.innerHTML = `<p class="empty">${T('Пока пусто. Добавьте текст лекции одним из способов выше.')}</p>`; return; }
  box.innerHTML = list.map(s => {
    const pct = s.words ? Math.round(100 * Math.max(0, s.pos + 1) / s.words) : 0;
    return `<div class="row" data-id="${esc(s.id)}">
      <a class="row-main" href="#read/${esc(s.id)}">
        <span class="row-ic">${icon('doc')}</span>
        <span class="row-text"><b>${esc(s.title)}</b><small>${s.words.toLocaleString(lang)} ${T('слов')} · ${fmtDur(s.words)}${pct ? ` · ${T('прочитано')} ${pct}%` : ''}</small></span>
      </a>
      <button class="icon-btn row-more" aria-label="${T('ещё')}">${icon('more')}</button>
      <div class="menu" hidden>
        ${s.docId ? `<button data-act="update">${icon('refresh')}${T('Обновить из Google Docs')}</button>` : ''}
        <button data-act="edit">${icon('edit')}${T('Изменить текст')}</button>
        <button data-act="delete" class="danger">${icon('trash')}${T('Удалить')}</button>
      </div>
      ${pct ? `<span class="row-bar" style="--p:${pct}%"></span>` : ''}
    </div>`;
  }).join('');
  box.querySelectorAll('.row').forEach(row => {
    const s = findScript(row.dataset.id);
    const menu = $('.menu', row);
    $('.row-more', row).addEventListener('click', e => {
      e.stopPropagation();
      const open = menu.hidden;
      document.querySelectorAll('.menu').forEach(m => { m.hidden = true; });
      menu.hidden = !open;
    });
    menu.addEventListener('click', async e => {
      const act = e.target.closest('button')?.dataset.act;
      menu.hidden = true;
      if (act === 'edit') location.hash = `#edit/${s.id}`;
      if (act === 'update') { await importGoogle(`https://docs.google.com/document/d/${s.docId}/`, s); drawList(); }
      if (act === 'delete' && confirm(T('Удалить «{t}»?', { t: s.title }))) {
        list = list.filter(x => x !== s);
        saveList();
        store.del(`sufler.text.${s.id}`);
        drawList();
      }
    });
  });
}
document.addEventListener('click', e => { if (!e.target.closest('.menu, .row-more')) document.querySelectorAll('.menu').forEach(m => { m.hidden = true; }); });

/* ---------- editor ---------- */
function renderEditor(s) {
  view.className = 'editor';
  view.innerHTML = `
    <header class="ed-top">
      <a class="icon-btn" href="${s ? `#read/${esc(s.id)}` : '#'}" aria-label="${T('Назад')}">${icon('back')}</a>
      <span class="ed-count" id="count"></span>
      <button class="btn primary" id="save">${T('Сохранить')}</button>
    </header>
    <input class="ed-title" id="title" placeholder="${T('Название')}" value="${esc(s?.title || '')}">
    <textarea class="ed-text" id="text" placeholder="${T('Текст лекции')}"></textarea>
    <p class="ed-hint">${T('Слова в [квадратных скобках] — заметки для себя: суфлёр их показывает, но не ждёт.')}</p>`;
  const ta = $('#text');
  ta.value = s ? textOf(s.id) : '';
  const count = () => { const n = countWords(ta.value); $('#count').textContent = n ? `${n.toLocaleString(lang)} ${T('слов')} · ${fmtDur(n)}` : ''; };
  let timer;
  ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(count, 300); });
  count();
  if (!s) ta.focus();
  $('#save').addEventListener('click', () => {
    if (!ta.value.trim()) return;
    const saved = saveScript({ id: s?.id, title: $('#title').value.trim() || titleFrom('', ta.value), text: ta.value });
    if (saved) location.hash = `#read/${saved.id}`;
  });
}

/* ---------- prompter ---------- */
function renderPrompter(script) {
  document.title = `${script.title} — ${T('Суфлёр')}`;
  const text = textOf(script.id);
  const { paras, words } = tokenize(text);
  const N = words.length;
  const speechLang = settings.lang !== 'auto' ? settings.lang
    : (text.match(/[а-яё]/gi)?.length || 0) > (text.match(/[a-z]/gi)?.length || 0) ? 'ru-RU' : 'en-US';

  view.className = 'prompter';
  view.innerHTML = `
    <div class="stage" id="stage"><div class="flip"><div class="text" id="text">${paras.map(p =>
      `<p>${p.map(t => t.i >= 0 ? `<span data-i="${t.i}">${esc(t.raw)}</span>` : `<span class="${t.note ? 'note' : 'sep'}">${esc(t.raw)}</span>`).join(' ')}</p>`).join('')}
      <div class="end"><span>${T('Конец текста')}</span></div></div></div></div>
    <div class="fade top"></div><div class="fade bottom"></div>
    <div class="read-line"><i></i><i></i></div>
    <div class="dot" id="dot" aria-hidden="true"></div>
    <header class="bar top-bar">
      <a class="icon-btn" href="#" aria-label="${T('Назад')}">${icon('back')}</a>
      <div class="bar-title"><b>${esc(script.title)}</b><span class="status" id="status"></span></div>
      <button class="icon-btn size-btn" id="smaller" aria-label="${T('Меньше текст')}">A<sup>−</sup></button>
      <button class="icon-btn size-btn big" id="larger" aria-label="${T('Больше текст')}">A<sup>+</sup></button>
      <button class="icon-btn" id="open-settings" aria-label="${T('Настройки')}">${icon('sliders')}</button>
    </header>
    <footer class="bar bottom-bar">
      <button class="pill" id="retake">${icon('retake')}<span>${T('Дубль')}</span></button>
      <button class="play" id="play" aria-label="${T('Старт')}">${icon('play')}</button>
      <div class="clock"><b id="clock">0:00</b><small id="left"></small></div>
      <div class="progress"><i id="prog"></i></div>
    </footer>
    <div class="sheet-wrap" id="sheet" hidden><div class="scrim"></div><div class="sheet" role="dialog" aria-label="${T('Настройки')}"></div></div>`;

  const stage = $('#stage'), textEl = $('#text'), playBtn = $('#play'), statusEl = $('#status'), dot = $('#dot');
  const spans = Array.from(textEl.querySelectorAll('span[data-i]'));
  const tracker = new Tracker(words, { back: settings.back, retakes: settings.retakes });

  let pos = Math.min(script.pos ?? -1, N - 1); // last spoken word
  let posF = pos + 1;                         // steady-speed mode: fractional word
  let shown = -1;                            // words up to here are marked as read
  let running = false;
  let T0 = 0, v = 0;                         // current translate and its velocity
  let lines = [], lineOf = new Int32Array(N);
  let drag = null, manualUntil = 0;
  let wpm = settings.wpm, lastProg = null;
  let clockStart = null, clockPaused = 0;
  let barsTimer, saveTimer, wakeLock = null;
  let mode = settings.mode === 'speed' || !speechSupported ? 'speed' : 'voice';

  tracker.pos = pos;

  const applyLook = () => {
    const fonts = { golos: '"Golos Text"', inter: 'Inter', serif: '"PT Serif", Georgia', system: 'ui-sans-serif, system-ui' };
    view.style.setProperty('--p-font', `${fonts[settings.font] || fonts.golos}, ui-sans-serif, system-ui, sans-serif`);
    view.style.setProperty('--p-size', `${settings.size}px`);
    view.style.setProperty('--p-line', settings.line);
    view.style.setProperty('--p-margin', `${settings.margin}vw`);
    view.style.setProperty('--read', `${settings.readLine}%`);
    view.classList.toggle('mirror', settings.mirror);
    view.classList.toggle('serif', settings.font === 'serif');
  };
  applyLook();

  // Where each word sits, grouped into lines. Re-measured on resize and font changes.
  const measure = () => {
    lines = [];
    let prevTop = -1e9;
    for (let i = 0; i < N; i++) {
      const el = spans[i];
      const top = el.offsetTop; // offsetParent is .text
      if (Math.abs(top - prevTop) > 3) { lines.push({ top, h: el.offsetHeight, first: i, last: i }); prevTop = top; }
      else lines[lines.length - 1].last = i;
      lineOf[i] = lines.length - 1;
    }
  };
  // The point of the text (in px from its top) that should sit on the reading line:
  // it moves word by word along the current line, so scrolling is continuous.
  const anchor = f => {
    if (!lines.length) return 0;
    const i = Math.max(0, Math.min(N - 1, Math.floor(f)));
    const L = lines[lineOf[i]];
    const next = lines[lineOf[i] + 1];
    const frac = Math.min(1, ((f - L.first) / (L.last - L.first + 1)));
    const step = next ? next.top - L.top : L.h;
    return L.top + L.h / 2 + Math.max(0, frac) * step - step * 0.15;
  };
  const readY = () => stage.clientHeight * settings.readLine / 100;
  const target = () => readY() - anchor(mode === 'speed' ? posF : pos + 1);

  // The chunk to read next is bright, the text after it a little dimmer, so the eye has a
  // clear block to hold on to: the rest of the sentence, two sentences, or the paragraph.
  let focus = [0, -1];
  const focusEnd = from => {
    if (from >= N) return N - 1;
    const hl = settings.highlight;
    if (hl === 'para') { let j = from; while (j + 1 < N && words[j + 1].para === words[from].para) j++; return j; }
    let j = from, ends = hl === 'two' ? 2 : 1;
    while (j + 1 < N) { if (words[j + 1].sent && --ends === 0) break; j++; }
    // a very short rest of a sentence: take the next one too
    if (hl === 'sentence' && j - from < 4) { j++; while (j + 1 < N && !words[j + 1].sent) j++; }
    return Math.min(N - 1, j);
  };
  const markFocus = from => {
    const on = settings.highlight !== 'none';
    textEl.classList.toggle('hl', on);
    const [a, b] = focus;
    for (let i = a; i <= b; i++) spans[i]?.classList.remove('f');
    if (!on) { focus = [0, -1]; return; }
    const e = focusEnd(from);
    for (let i = from; i <= e; i++) spans[i].classList.add('f');
    focus = [from, e];
  };
  const markRead = (upto, force) => {
    if (upto === shown && !force) return;
    if (upto > shown) for (let i = Math.max(0, shown + 1); i <= upto && i < N; i++) spans[i].classList.add('r');
    else for (let i = Math.max(0, upto + 1); i <= shown && i < N; i++) spans[i].classList.remove('r');
    shown = upto;
    markFocus(upto + 1);
    const p = N ? Math.max(0, upto + 1) / N : 0;
    $('#prog').style.width = `${p * 100}%`;
    const left = Math.max(0, N - upto - 1) / Math.max(60, mode === 'speed' ? settings.wpm : wpm);
    $('#left').textContent = upto >= N - 1 ? '' : upto >= 0 ?`${T('осталось')} ${fmtDur(left * 130)}`.replace('≈ ', '≈') : `${N.toLocaleString(lang)} ${T('слов')}`;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { script.pos = upto; saveList(); }, 800);
  };

  const setPos = (p, why) => {
    pos = Math.max(-1, Math.min(N - 1, p));
    posF = pos + 1;
    tracker.set(pos);
    lastProg = null;
    markRead(pos);
    if (why) toast(why, 1600);
  };

  // smooth scrolling: a velocity that follows the distance to the target, itself smoothed,
  // so the text glides and never jerks. Far jumps (a retake) fade instead of racing.
  let raf, lastT = performance.now(), fading = false;
  const frame = now => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (running && mode === 'speed' && !drag) {
      posF = Math.min(N, posF + settings.wpm / 60 * dt);
      const p = Math.floor(posF) - 1;
      if (p !== pos) { pos = p; markRead(pos); }
    }
    if (drag) return;
    const goal = target();
    const err = goal - T0;
    const h = stage.clientHeight;
    if (Math.abs(err) > h * 0.8 && !fading && now > manualUntil) {
      fading = true;
      textEl.classList.add('hide');
      setTimeout(() => { T0 = target(); v = 0; apply(); textEl.classList.remove('hide'); fading = false; }, 160);
      return;
    }
    if (now < manualUntil) return;
    const tau = { soft: 1.1, medium: 0.7, fast: 0.4 }[settings.smooth] || 1.1;
    const maxV = h * 1.2;
    const want = Math.max(-maxV, Math.min(maxV, err / tau));
    v += (want - v) * (1 - Math.exp(-dt / 0.35));
    if (Math.abs(err) < 0.3 && Math.abs(v) < 2) { v = 0; }
    T0 += v * dt;
    apply();
  };
  const apply = () => { textEl.style.transform = `translate3d(0, ${T0.toFixed(2)}px, 0)`; };

  /* speech */
  const listener = new Listener({
    lang: speechLang,
    onWords: heard => {
      if (!running || mode !== 'voice' || drag) return;
      dot.classList.remove('hit'); void dot.offsetWidth; dot.classList.add('hit');
      const r = tracker.update(heard);
      if (!r) return;
      if (r.kind === 'forward' && lastProg) {
        const dtm = (Date.now() - lastProg.t) / 60000;
        if (dtm > 0.05) { wpm = wpm * 0.8 + Math.min(260, Math.max(60, (r.pos - lastProg.p) / dtm)) * 0.2; lastProg = { t: Date.now(), p: r.pos }; }
      } else lastProg = { t: Date.now(), p: r.pos };
      pos = r.pos;
      posF = pos + 1;
      markRead(pos);
      if (r.kind === 'retake') addTake(r.start ?? pos, 'auto');
    },
    onState: s => setStatus(s),
    onError: () => { toast(T('Нет доступа к микрофону. Разрешите его в настройках сайта в браузере.'), 6000); stop(); },
  });
  let netWarned = false;
  function setStatus(s) {
    if (!running) { statusEl.textContent = T('Пауза'); statusEl.className = 'status'; dot.className = 'dot'; return; }
    if (mode === 'speed') { statusEl.textContent = `${T('Скорость')} ${settings.wpm}`; statusEl.className = 'status on'; dot.className = 'dot'; return; }
    if (s === 'network') {
      statusEl.textContent = T('Нет сети'); statusEl.className = 'status warn'; dot.className = 'dot warn';
      if (!netWarned) { netWarned = true; toast(T('Распознаванию речи нужен интернет. Продолжаю, как только он появится.'), 5000); }
      return;
    }
    if (s === 'on') netWarned = false;
    statusEl.textContent = T('Слушаю'); statusEl.className = 'status on'; dot.className = 'dot on';
  }

  /* takes */
  const clockNow = () => (clockStart == null ? 0 : (Date.now() - clockStart) / 1000);
  script.takes ||= [];
  function addTake(idx, kind) {
    const snippet = words.slice(idx, idx + 6).map((w, k) => spans[idx + k]?.textContent || w.norm).join(' ');
    script.takes.push({ at: Math.round(clockNow()), idx, kind, snippet });
    saveList();
    toast(`${T('Дубль {n}', { n: script.takes.length })} · «${snippet}…»`, 2200);
  }
  let lastRetake = { at: 0, idx: 0 };
  $('#retake').addEventListener('click', () => {
    // once: the start of this sentence; again within 3 s: one sentence further back
    const again = Date.now() - lastRetake.at < 3000;
    const idx = again ? sentenceStart(words, lastRetake.idx - 1) : sentenceStart(words, pos + 1);
    if (again && script.takes.length) script.takes.pop();
    lastRetake = { at: Date.now(), idx };
    setPos(idx - 1);
    addTake(idx, 'manual');
  });

  /* start / stop */
  async function start() {
    if (!N) return;
    if (mode === 'voice' && !speechSupported) { mode = 'speed'; toast(T('Браузер не умеет распознавать речь. Откройте суфлёр в Chrome (Android, ПК) или Safari (iPhone, Mac). Пока листаю с постоянной скоростью.'), 7000); }
    if (pos >= N - 1) setPos(-1);
    running = true;
    view.classList.add('running');
    playBtn.innerHTML = icon('pause');
    if (clockStart == null) clockStart = Date.now();
    else if (clockPaused) { clockStart += Date.now() - clockPaused; clockPaused = 0; }
    if (mode === 'voice') { tracker.set(pos); tracker.holdUntil = 0; listener.start(); }
    setStatus('on');
    hideBarsSoon();
    if (settings.fullscreen && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
    }
  }
  function stop() {
    running = false;
    view.classList.remove('running');
    playBtn.innerHTML = icon('play');
    listener.stop();
    clockPaused = Date.now();
    setStatus('off');
    showBars();
  }
  playBtn.addEventListener('click', e => { e.stopPropagation(); running ? stop() : start(); });

  /* bars */
  const showBars = () => { view.classList.remove('bare'); clearTimeout(barsTimer); };
  const hideBarsSoon = () => { clearTimeout(barsTimer); barsTimer = setTimeout(() => { if (running && $('#sheet').hidden) view.classList.add('bare'); }, 2500); };
  view.addEventListener('pointerdown', e => { if (e.target.closest('.bar')) { showBars(); if (running) hideBarsSoon(); } });

  /* touch: drag the text to say "I'm here", tap to show controls, double tap a word to jump to it */
  let lastTap = { t: 0, i: -1 }, tapTimer;
  stage.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    drag = { y: e.clientY, T: T0, moved: false, id: e.pointerId };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(dy) < 8) return;
    if (!drag.moved) { drag.moved = true; view.classList.add('dragging'); showBars(); }
    T0 = drag.T + dy;
    v = 0;
    apply();
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    view.classList.remove('dragging');
    if (d.moved) { commitFromReadLine(); if (running) hideBarsSoon(); return; }
    // a tap
    const span = e.target.closest?.('span[data-i]');
    const now = Date.now();
    if (span && now - lastTap.t < 320 && Math.abs(+span.dataset.i - lastTap.i) < 4) {
      clearTimeout(tapTimer);
      setPos(+span.dataset.i - 1, T('Продолжаю отсюда'));
      lastTap = { t: 0, i: -1 };
      return;
    }
    lastTap = { t: now, i: span ? +span.dataset.i : -1 };
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      if (view.classList.contains('bare')) { showBars(); if (running) hideBarsSoon(); }
      else if (running) view.classList.add('bare');
    }, 300);
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  // the line on the reading line becomes the current one
  function commitFromReadLine() {
    const y = readY() - T0;
    let L = lines[0];
    for (const line of lines) { if (line.top <= y) L = line; else break; }
    if (!L) return;
    setPos(L.first - 1, T('Продолжаю отсюда'));
    v = 0;
  }
  let wheelTimer;
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    T0 -= e.deltaY;
    v = 0;
    apply();
    manualUntil = performance.now() + 100000;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { manualUntil = 0; commitFromReadLine(); }, 450);
  }, { passive: false });

  const onKey = e => {
    if (!$('#sheet').hidden || e.target.closest?.('input, textarea, select')) return;
    if (e.code === 'Space') { e.preventDefault(); running ? stop() : start(); }
    else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();
      const li = lineOf[Math.max(0, pos + 1)] + (e.code === 'ArrowDown' ? 1 : -1);
      const L = lines[Math.max(0, Math.min(lines.length - 1, li))];
      if (L) setPos(L.first - 1);
    } else if (e.key === 'r' || e.key === 'к') $('#retake').click();
    else if (e.code === 'Escape') location.hash = '#';
  };
  document.addEventListener('keydown', onKey);

  /* keep the screen on */
  const wake = async () => {
    if (!settings.wake || !navigator.wakeLock || document.visibilityState !== 'visible') return;
    try { wakeLock = await navigator.wakeLock.request('screen'); } catch { /* not allowed now */ }
  };
  const onVis = () => {
    if (document.visibilityState === 'visible') wake();
    else if (running && mode === 'voice') { listener.stop(); } // recognition can't run hidden
    if (document.visibilityState === 'visible' && running && mode === 'voice') listener.start();
  };
  document.addEventListener('visibilitychange', onVis);
  wake();

  /* clock */
  const clockTimer = setInterval(() => {
    $('#clock').textContent = fmtClock(clockStart == null ? 0 : ((clockPaused || Date.now()) - clockStart) / 1000);
  }, 500);

  /* layout */
  const relayout = () => {
    measure();
    if (!fading) { T0 = target(); v = 0; apply(); }
  };
  const ro = new ResizeObserver(() => relayout());
  ro.observe(stage);
  document.fonts?.ready.then(relayout);
  measure();
  markRead(pos);
  T0 = target();
  apply();
  raf = requestAnimationFrame(frame);
  setStatus('off');
  if (pos < 0 && !store.get('sufler.helped', false)) { openSheet(true); store.set('sufler.helped', true); }

  /* settings sheet */
  $('#open-settings').addEventListener('click', e => { e.stopPropagation(); openSheet(); });
  const resize = d => {
    settings.size = Math.max(18, Math.min(80, settings.size + d));
    saveSettings();
    applyLook();
    relayout();
    toast(`${settings.size}px`, 900);
  };
  $('#smaller').addEventListener('click', () => resize(-2));
  $('#larger').addEventListener('click', () => resize(2));
  function openSheet(helpFirst = false) {
    const wrap = $('#sheet');
    const sheet = $('.sheet', wrap);
    const seg = (key, opts) => `<div class="seg" data-key="${key}">${opts.map(([v, l]) =>
      `<button data-v="${v}" class="${String(settings[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const range = (key, min, max, step, fmt = x => x) => `<div class="range"><input type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${settings[key]}"><output>${fmt(settings[key])}</output></div>`;
    const toggle = (key, label, sub = '') => `<label class="toggle"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><input type="checkbox" data-key="${key}" ${settings[key] ? 'checked' : ''}><i></i></label>`;
    const takes = script.takes || [];
    sheet.innerHTML = `
      <div class="grab"></div>
      <header class="sheet-top"><h2>${T('Настройки')}</h2><button class="icon-btn" data-close aria-label="${T('Отмена')}">${icon('x')}</button></header>
      <div class="sheet-body">
        <details class="help" ${helpFirst ? 'open' : ''}><summary>${T('Как пользоваться')}</summary>
          <ul><li>${T('Нажмите «Старт» и читайте: текст листается за голосом. Своими словами — можно, суфлёр подождёт.')}</li>
          <li>${T('Сбился? Прокрутите текст пальцем до нужной строки — суфлёр продолжит с линии чтения. Или дважды нажмите на слово.')}</li>
          <li>${T('«Дубль» — назад к началу фразы, ещё раз — к предыдущей. Начнёте фразу заново вслух — вернётся сам.')}</li>
          <li>${T('Нажмите на экран, чтобы показать или спрятать кнопки.')}</li></ul></details>
        <h3>${T('Текст')}</h3>
        <div class="set"><span>${T('Размер')}</span>${range('size', 18, 80, 1, x => `${x}`)}</div>
        <div class="set"><span>${T('Интервал')}</span>${range('line', 1.2, 2.2, 0.05, x => (+x).toFixed(2))}</div>
        <div class="set"><span>${T('Поля')}</span>${range('margin', 0, 25, 1, x => `${x}%`)}</div>
        <div class="set col"><span>${T('Шрифт')}</span>${seg('font', [['golos', 'Golos'], ['inter', 'Inter'], ['serif', 'PT Serif'], ['system', 'System']])}</div>
        <div class="set"><span>${T('Линия чтения')}</span>${range('readLine', 15, 60, 1, x => `${x}%`)}</div>
        <div class="set col"><span>${T('Тема')}</span>${seg('theme', [['auto', T('Как в системе')], ['light', T('Светлая')], ['dark', T('Тёмная')]])}</div>
        ${toggle('mirror', T('Зеркально'), T('Для стекла суфлёра'))}
        <h3>${T('Листать')}</h3>
        <div class="set col">${seg('mode', [['voice', T('По голосу')], ['speed', T('С постоянной скоростью')]])}</div>
        <div class="set" data-show="speed"><span>${T('Слов в минуту')}</span>${range('wpm', 60, 220, 5)}</div>
        <div class="set col"><span>${T('Выделять')}</span>${seg('highlight', [['sentence', T('Фразу')], ['two', T('Две фразы')], ['para', T('Абзац')], ['none', T('Нет')]])}</div>
        <div class="set col"><span>${T('Плавность')}</span>${seg('smooth', [['soft', T('Мягко')], ['medium', T('Средне')], ['fast', T('Быстро')]])}</div>
        <div class="set col" data-show="voice"><span>${T('Язык речи')}</span>${seg('lang', [['auto', T('Авто')], ['ru-RU', 'Русский'], ['en-US', 'English']])}</div>
        <div data-show="voice">${toggle('retakes', T('Дубли'), T('Сам возвращаться назад, когда начинаю отрывок заново'))}</div>
        ${toggle('wake', T('Не гасить экран'))}
        ${document.documentElement.requestFullscreen ? toggle('fullscreen', T('Во весь экран при старте')) : ''}
        <h3>${T('Журнал дублей')}</h3>
        ${takes.length ? `<ol class="takes">${takes.map((t, k) => `<li><button data-take="${t.idx}"><b>${fmtClock(t.at)}</b><span>${T('Дубль {n}', { n: k + 1 })} · «${esc(t.snippet)}…»</span></button></li>`).join('')}</ol>
          <div class="row-btns"><button class="btn" data-copy>${T('Скопировать')}</button><button class="btn" data-clear>${T('Очистить')}</button><button class="btn" data-reset>${T('Сбросить время')}</button></div>`
        : `<p class="muted">${T('Дублей пока нет. Время считается от первого нажатия «Старт».')}</p>`}
        <div class="row-btns"><button class="btn" data-start>${T('В начало')}</button>${script.docId ? `<button class="btn" data-update>${icon('refresh')}${T('Обновить из Google Docs')}</button>` : ''}<a class="btn" href="#edit/${esc(script.id)}">${icon('edit')}${T('Изменить текст')}</a></div>
      </div>`;
    const showModes = () => sheet.querySelectorAll('[data-show]').forEach(el => { el.hidden = el.dataset.show !== settings.mode; });
    showModes();
    wrap.hidden = false;
    requestAnimationFrame(() => wrap.classList.add('open'));
    showBars();
    const close = () => { wrap.classList.remove('open'); setTimeout(() => { wrap.hidden = true; }, 220); if (running) hideBarsSoon(); };
    $('.scrim', wrap).onclick = close;
    $('[data-close]', sheet).onclick = close;
    sheet.oninput = e => {
      const k = e.target.dataset.key;
      if (!k || e.target.type !== 'range') return;
      settings[k] = +e.target.value;
      e.target.nextElementSibling.textContent = k === 'line' ? (+e.target.value).toFixed(2) : k === 'margin' || k === 'readLine' ? `${e.target.value}%` : e.target.value;
      saveSettings();
      applyLook();
      if (k !== 'wpm') relayout();
      if (k === 'wpm') setStatus('on');
    };
    sheet.onchange = e => {
      const k = e.target.dataset.key;
      if (!k || e.target.type !== 'checkbox') return;
      settings[k] = e.target.checked;
      saveSettings();
      applyLook();
      if (k === 'mirror') relayout();
      if (k === 'retakes') tracker.retakes = settings.retakes;
      if (k === 'wake') { if (settings.wake) wake(); else { wakeLock?.release().catch(() => {}); wakeLock = null; } }
    };
    sheet.onclick = async e => {
      const b = e.target.closest('button');
      if (!b) return;
      const segEl = b.closest('.seg');
      if (segEl) {
        const k = segEl.dataset.key;
        settings[k] = b.dataset.v;
        segEl.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        saveSettings();
        if (k === 'theme') applyTheme();
        if (k === 'highlight') markRead(pos, true);
        if (k === 'font') { applyLook(); document.fonts?.ready.then(relayout); relayout(); }
        if (k === 'mode') {
          const was = running;
          if (was) stop();
          mode = settings.mode === 'speed' || !speechSupported ? 'speed' : 'voice';
          posF = pos + 1;
          showModes();
          if (was) start();
        }
        if (k === 'lang') listener.lang = settings.lang !== 'auto' ? settings.lang : speechLang;
        return;
      }
      if (b.dataset.take) { setPos(+b.dataset.take - 1); close(); }
      if ('copy' in b.dataset) {
        const txt = (script.takes || []).map((t, k) => `${fmtClock(t.at)}  ${T('Дубль {n}', { n: k + 1 })}: «${t.snippet}…»`).join('\n');
        try { await navigator.clipboard.writeText(txt); toast(T('Скопировано')); } catch { /* no clipboard */ }
      }
      if ('clear' in b.dataset) { script.takes = []; saveList(); openSheet(); }
      if ('reset' in b.dataset) { clockStart = running ? Date.now() : null; clockPaused = 0; toast('0:00'); }
      if ('start' in b.dataset) { setPos(-1); close(); }
      if ('update' in b.dataset) {
        const s = await importGoogle(`https://docs.google.com/document/d/${script.docId}/`, script);
        if (s) { close(); route(); }
      }
    };
  }

  cleanup = () => {
    cancelAnimationFrame(raf);
    clearInterval(clockTimer);
    clearTimeout(barsTimer);
    listener.stop();
    ro.disconnect();
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVis);
    wakeLock?.release().catch(() => {});
    script.pos = pos;
    saveList();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };
}

route();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
