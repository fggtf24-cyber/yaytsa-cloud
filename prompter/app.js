// Яйца Суфлёр — a teleprompter that listens and scrolls the text by itself.
// Phone first: everything that is pressed while recording sits low on the right, under the thumb.
import { tokenize, Tracker, sentenceStart } from './align.js';
import { Listener, speechSupported } from './speech.js';
import { googleDocId, fetchGoogleDoc, readFile, titleFrom, htmlToText, cleanMarkdown, isGoogleLink } from './importer.js';

const VERSION = '1.1.0';
const NAME = 'Яйца Суфлёр'; // the name is always in Cyrillic, whatever the interface language
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
  uiLang: '', highlight: 'sentence', format: true,
};
const settings = Object.assign({}, DEFAULTS, store.get('sufler.settings', {}));
// first run: big text on a phone, a bit smaller on a computer so more of it fits
if (!settings.size) settings.size = innerWidth >= 1024 ? 34 : Math.round(Math.min(46, Math.max(28, innerWidth / 11)));
const saveSettings = () => store.set('sufler.settings', settings);

let list = store.get('sufler.list', []);
const saveList = () => store.set('sufler.list', list);
const textOf = id => store.get(`sufler.text.${id}`, '');
const findScript = id => list.find(s => s.id === id);

/* ---------- language ---------- */
const lang = settings.uiLang || (navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en');
document.documentElement.lang = lang;
const EN = {
  'Добавить текст': 'Add a script',
  'Ссылка на Google Документ': 'Google Docs link',
  'Загрузить': 'Load',
  'или': 'or',
  'Открыть файл': 'Open a file',
  'Вставить текст': 'Paste text',
  'Ещё нет текстов': 'No scripts yet',
  'PDF, Word, Notion, Google Docs или просто текст.': 'PDF, Word, Notion, Google Docs or plain text.',
  'слов': 'words',
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
  'Не хватает места в браузере.': 'Not enough browser storage.',
  'Текст обновлён': 'Text updated',
  'Название': 'Title',
  'Текст лекции': 'Script',
  'Сохранить': 'Save',
  'Без названия': 'Untitled',
  '# Заголовок, ## подзаголовок, - пункт списка. [Слова в скобках] — заметки: видны, но суфлёр их не ждёт.': '# Heading, ## subheading, - list item. [Words in brackets] are notes: shown, not expected to be spoken.',
  'Слушаю': 'Listening',
  'Пауза': 'Paused',
  'Нет сети': 'No network',
  'Скорость {n}': 'Speed {n}',
  'Дубль {n}': 'Retake {n}',
  'Продолжаю отсюда': 'Continuing from here',
  'ост. {t}': '{t} left',
  'Настройки': 'Settings',
  'Текст': 'Text',
  'Размер': 'Size',
  'Или щипком двумя пальцами по тексту': 'Or pinch the text with two fingers',
  'Интервал': 'Line spacing',
  'Поля': 'Margins',
  'Шрифт': 'Font',
  'Заголовки и списки': 'Headings and lists',
  'Как в документе': 'As in the document',
  'Выделять': 'Highlight',
  'Фразу': 'Sentence',
  'Две': 'Two',
  'Абзац': 'Paragraph',
  'Нет': 'Off',
  'Линия чтения': 'Reading line',
  'Тема': 'Theme',
  'Авто': 'Auto',
  'Светлая': 'Light',
  'Тёмная': 'Dark',
  'Зеркально': 'Mirror',
  'Для стекла суфлёра': 'For teleprompter glass',
  'Листать': 'Scrolling',
  'По голосу': 'By voice',
  'Ровно': 'Steady',
  'Слов в минуту': 'Words per minute',
  'Плавность': 'Smoothness',
  'Мягко': 'Soft',
  'Средне': 'Medium',
  'Быстро': 'Quick',
  'Язык речи': 'Speech language',
  'Дубли': 'Retakes',
  'Сам возвращаться, когда начинаю отрывок заново': 'Jump back when I start a passage again',
  'Экран': 'Screen',
  'Не гасить экран': 'Keep the screen on',
  'Во весь экран при старте': 'Fullscreen on start',
  'Журнал дублей': 'Retake log',
  'Дублей пока нет. Время считается от первого «Старт».': 'No retakes yet. Time counts from the first Start.',
  'Скопировать': 'Copy',
  'Скопировано': 'Copied',
  'Очистить': 'Clear',
  'Сбросить время': 'Reset the clock',
  'В начало': 'To the start',
  'Как пользоваться': 'How to use',
  'Нажмите ▶ и читайте: текст листается за голосом. Своими словами — можно, суфлёр подождёт.': 'Press ▶ and read: the text follows your voice. Ad-libbing is fine, it waits.',
  '↺ — назад к началу фразы (дубль), ↻ — вперёд к следующей.': '↺ goes back to the start of the sentence (a retake), ↻ forward to the next one.',
  'Сбился? Протяните текст пальцем до нужной строки или дважды нажмите на слово.': 'Out of sync? Drag the text to the right line or double-tap a word.',
  'Размер текста — щипком двумя пальцами. Касание — показать или спрятать кнопки.': 'Pinch to change the text size. Tap to show or hide the controls.',
  'Браузер не умеет распознавать речь. Откройте суфлёр в Chrome (Android, ПК) или Safari (iPhone, Mac). Пока листаю ровно.': 'This browser can’t recognize speech. Open it in Chrome (Android, PC) or Safari (iPhone, Mac). Scrolling steadily for now.',
  'Нет доступа к микрофону. Разрешите его в настройках сайта в браузере.': 'No microphone access. Allow it in the browser’s site settings.',
  'Распознаванию речи нужен интернет. Продолжаю, как только он появится.': 'Speech recognition needs the internet. It will continue once it’s back.',
  'Назад': 'Back',
  'Старт': 'Start',
  'Назад к началу фразы': 'Back to the start of the sentence',
  'Вперёд к следующей фразе': 'Forward to the next sentence',
  'Конец текста': 'End of the text',
  'Тексты хранятся только в этом браузере': 'Scripts are stored in this browser only',
  'В документе: «Настройки доступа» → «Все, у кого есть ссылка». Заголовки и списки сохранятся.': 'In the document: Share → Anyone with the link. Headings and lists are kept.',
  'Ещё': 'More',
  'Перетащите файл или выберите': 'Drop a file or choose one',
  'Выбрать файл': 'Choose a file',
  'Вставьте текст или ссылку на Google Документ': 'Paste text or a Google Docs link',
  'Добавить': 'Add',
  'Старый формат .doc не читается: сохраните его как .docx или PDF.': 'The old .doc format can’t be read: save it as .docx or PDF.',
  'В этом PDF нет текста, похоже, это скан.': 'This PDF has no text, it looks like a scan.',
  'Не получилось открыть PDF: нужен интернет при первой загрузке.': 'Couldn’t open the PDF: the first time needs the internet.',
  'Отпустите файл': 'Drop the file',
  'Содержание': 'Contents',
  'Закрыть': 'Close',
};
const T = (s, vars = {}) => (lang === 'en' ? EN[s] ?? s : s).replace(/\{(\w+)\}/g, (_, k) => vars[k]);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------- icons (Lucide-style strokes) ---------- */
const ICON = {
  back: '<path d="m15 18-6-6 6-6"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/>',
  play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1.2" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1.2" fill="currentColor" stroke="none"/>',
  prev: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  next: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  paste: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  lines: '<path d="M6 8h12M6 12h12M6 16h8"/>',
  upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

/* ---------- theme, toasts, sheets ---------- */
function applyTheme() {
  const t = settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}
applyTheme();
document.body.dataset.dropText = T('Отпустите файл');
const isDark = () => settings.theme === 'dark' || (settings.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);

function toast(msg, ms = 2400) {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  box.append(el);
  void el.offsetWidth;
  el.classList.add('in');
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 250); }, ms);
}

// A bottom sheet: slides up, closes on the scrim, the ✕, Escape or a swipe down.
function openSheet(html, { label = '', onClose } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="scrim"></div><div class="sheet" role="dialog" aria-label="${esc(label)}"><div class="grab"></div><div class="sheet-body">${html}</div></div>`;
  document.body.append(wrap);
  const sheet = $('.sheet', wrap);
  void sheet.offsetWidth; // start state painted, then slide in
  wrap.classList.add('open');
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    wrap.classList.remove('open');
    sheet.style.transform = '';
    document.removeEventListener('keydown', onKey);
    setTimeout(() => wrap.remove(), 260);
    onClose?.();
  };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  $('.scrim', wrap).addEventListener('click', close);
  // swipe down from the top of the sheet (or anywhere while the content is scrolled to the top)
  let sy = null, dy = 0;
  const body = $('.sheet-body', sheet);
  sheet.addEventListener('touchstart', e => { if (body.scrollTop <= 0 || e.target.closest('.grab')) { sy = e.touches[0].clientY; dy = 0; } }, { passive: true });
  sheet.addEventListener('touchmove', e => {
    if (sy == null) return;
    dy = e.touches[0].clientY - sy;
    if (dy > 0) { sheet.style.transition = 'none'; sheet.style.transform = `translateY(${dy}px)`; }
  }, { passive: true });
  sheet.addEventListener('touchend', () => {
    if (sy == null) return;
    sheet.style.transition = '';
    if (dy > 90) close(); else sheet.style.transform = '';
    sy = null;
  });
  return { el: sheet, body, close };
}

const fmtDur = words => {
  const min = Math.max(1, Math.round(words / 130));
  if (min < 60) return lang === 'en' ? `${min} min` : `${min} мин`;
  const h = Math.floor(min / 60), m = min % 60;
  return lang === 'en' ? `${h} h ${m} min` : `${h} ч ${m} мин`;
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
  const fresh = !s;
  if (fresh) s = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), pos: -1, takes: [] };
  if (!store.set(`sufler.text.${s.id}`, text)) { toast(T('Не хватает места в браузере.')); return null; }
  if (fresh) list.unshift(s);
  Object.assign(s, { title: title || T('Без названия'), words, updated: Date.now() });
  if (docId) s.docId = docId;
  if (s.pos >= words) s.pos = words - 1;
  saveList();
  return s;
}

async function importGoogle(url, existing) {
  const id = googleDocId(url);
  if (!id) { toast(T('Это не ссылка на Google Документ.')); return null; }
  toast(T('Загружаю…'), 1500);
  try {
    const { text, title } = await fetchGoogleDoc(id);
    const s = saveScript({ id: existing?.id, title: existing?.title || title || titleFrom('', text), text, docId: id });
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
  document.querySelectorAll('.sheet-wrap').forEach(w => w.remove());
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
  document.title = NAME;
  view.className = 'home';
  view.innerHTML = `
    <header class="home-top">
      <a class="brand" href="../" aria-label="Яйца Cloud"><img src="icon-192.png" alt=""></a>
      <button class="icon-btn" id="theme" aria-label="${T('Тема')}">${icon(isDark() ? 'sun' : 'moon')}</button>
    </header>
    <h1 class="large">${NAME}</h1>
    <div id="list"></div>
    <p class="foot">${T('Тексты хранятся только в этом браузере')} · ${esc(VERSION)}</p>
    <button class="fab" id="add" aria-label="${T('Добавить текст')}">${icon('plus')}</button>`;
  drawList();
  $('#theme').addEventListener('click', () => {
    settings.theme = isDark() ? 'light' : 'dark';
    saveSettings();
    applyTheme();
    $('#theme').innerHTML = icon(isDark() ? 'sun' : 'moon');
  });
  $('#add').addEventListener('click', addSheet);
}

// Any file: PDF, Word, Notion export, OpenDocument, RTF, Markdown, HTML, plain text.
const FILE_ERRORS = {
  doc: 'Старый формат .doc не читается: сохраните его как .docx или PDF.',
  scan: 'В этом PDF нет текста, похоже, это скан.',
  pdf: 'Не получилось открыть PDF: нужен интернет при первой загрузке.',
};
async function importFile(f) {
  toast(T('Загружаю…'), 1200);
  try {
    const text = await readFile(f);
    if (!text.trim()) throw new Error('empty');
    return saveScript({ title: titleFrom(f.name, text), text });
  } catch (err) {
    toast(T(FILE_ERRORS[err.message] || 'Не получилось прочитать файл.'), 5000);
    return null;
  }
}

function addSheet() {
  const sh = openSheet(`
    <h2 class="sheet-title">${T('Добавить текст')}</h2>
    <label class="drop" id="drop">
      <input type="file" id="file" hidden>
      <span class="drop-ic">${icon('upload')}</span>
      <b>${T(canHover ? 'Перетащите файл или выберите' : 'Выбрать файл')}</b>
      <small>PDF, Word, Notion, Google Docs, txt, md, rtf, odt</small>
    </label>
    <div class="or"><span>${T('или')}</span></div>
    <div class="paste">
      <textarea id="pastebox" rows="3" placeholder="${T('Вставьте текст или ссылку на Google Документ')}"></textarea>
      <button class="btn primary big" id="go" disabled>${T('Добавить')}</button>
    </div>`, { label: T('Добавить текст') });
  const drop = $('#drop', sh.el), box = $('#pastebox', sh.el), go = $('#go', sh.el);
  const done = s => { if (s) { sh.close(); location.hash = `#read/${s.id}`; } };
  $('#file', sh.el).addEventListener('change', async e => { const f = e.target.files[0]; if (f) done(await importFile(f)); });
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', async e => {
    e.preventDefault();
    drop.classList.remove('over');
    const f = e.dataTransfer.files[0];
    if (f) done(await importFile(f));
  });
  box.addEventListener('input', () => {
    go.disabled = !box.value.trim();
    go.textContent = T(isGoogleLink(box.value) ? 'Загрузить' : 'Добавить');
    box.style.height = 'auto';
    box.style.height = `${Math.min(220, box.scrollHeight)}px`;
  });
  // pasted from Google Docs, Notion, Word or a web page: headings and lists are kept
  box.addEventListener('paste', e => {
    const html = e.clipboardData?.getData('text/html');
    if (!html || !/<(h\d|li|p)[\s>]/i.test(html)) return;
    const text = htmlToText(new DOMParser().parseFromString(html, 'text/html').body);
    if (!text) return;
    e.preventDefault();
    box.setRangeText(text, box.selectionStart, box.selectionEnd, 'end');
    box.dispatchEvent(new Event('input'));
  });
  go.addEventListener('click', async () => {
    const v = box.value.trim();
    if (!v) return;
    if (isGoogleLink(v)) done(await importGoogle(v));
    else done(saveScript({ title: titleFrom('', v), text: /^#|\n#|\*\*|\]\(/.test(v) ? cleanMarkdown(v) : v }));
  });
}
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

// on a computer a file can be dropped anywhere on the start page
addEventListener('dragover', e => { if (view.classList.contains('home') && e.dataTransfer?.types.includes('Files')) { e.preventDefault(); document.body.classList.add('dropping'); } });
addEventListener('dragleave', e => { if (!e.relatedTarget) document.body.classList.remove('dropping'); });
addEventListener('drop', async e => {
  document.body.classList.remove('dropping');
  if (!view.classList.contains('home') || e.defaultPrevented) return;
  e.preventDefault();
  const f = e.dataTransfer.files[0];
  const s = f && await importFile(f);
  if (s) location.hash = `#read/${s.id}`;
});

function drawList() {
  const box = $('#list');
  if (!list.length) {
    box.innerHTML = `<div class="empty"><div class="empty-ic">${icon('lines')}</div><b>${T('Ещё нет текстов')}</b><p>${T('PDF, Word, Notion, Google Docs или просто текст.')}</p>
      <button class="btn primary big" id="add2">${icon('plus')}${T('Добавить текст')}</button></div>`;
    $('#add2').addEventListener('click', addSheet);
    return;
  }
  box.innerHTML = list.map(s => {
    const pct = s.words ? Math.round(100 * Math.max(0, s.pos + 1) / s.words) : 0;
    return `<div class="row" data-id="${esc(s.id)}">
      <a class="row-main" href="#read/${esc(s.id)}">
        <b>${esc(s.title)}</b>
        <small>${s.words.toLocaleString(lang)} ${T('слов')} · ${fmtDur(s.words)}${pct ? ` · ${pct}%` : ''}</small>
        ${pct ? `<span class="row-bar"><i style="width:${pct}%"></i></span>` : ''}
      </a>
      <button class="icon-btn row-more" aria-label="${T('Ещё')}">${icon('more')}</button>
    </div>`;
  }).join('');
  box.querySelectorAll('.row').forEach(row => {
    const s = findScript(row.dataset.id);
    $('.row-more', row).addEventListener('click', () => {
      const sh = openSheet(`
        <h2 class="sheet-title">${esc(s.title)}</h2>
        ${s.docId ? `<button class="action" data-act="update">${icon('refresh')}<span>${T('Обновить из Google Docs')}</span></button>` : ''}
        <button class="action" data-act="edit">${icon('edit')}<span>${T('Изменить текст')}</span></button>
        <button class="action danger" data-act="delete">${icon('trash')}<span>${T('Удалить')}</span></button>`, { label: s.title });
      sh.el.addEventListener('click', async e => {
        const act = e.target.closest('[data-act]')?.dataset.act;
        if (!act) return;
        sh.close();
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
  });
}

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
    <p class="ed-hint">${T('# Заголовок, ## подзаголовок, - пункт списка. [Слова в скобках] — заметки: видны, но суфлёр их не ждёт.')}</p>`;
  const ta = $('#text');
  ta.value = s ? textOf(s.id) : '';
  const count = () => { const n = countWords(ta.value); $('#count').textContent = n ? `${n.toLocaleString(lang)} ${T('слов')} · ${fmtDur(n)}` : ''; };
  let timer;
  ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(count, 300); });
  // pasting from Google Docs or Word keeps headings and lists
  ta.addEventListener('paste', e => {
    const html = e.clipboardData?.getData('text/html');
    if (!html || !/<(h\d|li|p)[\s>]/i.test(html)) return;
    const text = htmlToText(new DOMParser().parseFromString(html, 'text/html').body);
    if (!text) return;
    e.preventDefault();
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
    ta.dispatchEvent(new Event('input'));
  });
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
  document.title = `${script.title} — ${NAME}`;
  const text = textOf(script.id);
  const { paras, words } = tokenize(text);
  const N = words.length;
  const speechLang = () => settings.lang !== 'auto' ? settings.lang
    : (text.match(/[а-яё]/gi)?.length || 0) > (text.match(/[a-z]/gi)?.length || 0) ? 'ru-RU' : 'en-US';
  const blockHtml = b => {
    const inner = b.toks.map(t => t.i >= 0 ? `<span data-i="${t.i}">${esc(t.raw)}</span>` : `<span class="${t.note ? 'note' : 'sep'}">${esc(t.raw)}</span>`).join(' ');
    if (settings.format && b.kind === 'h') return `<div class="blk h${b.level}">${inner}</div>`;
    if (settings.format && b.kind === 'li') return `<div class="blk li" style="--d:${b.depth}"><i class="mk">${esc(b.marker)}</i>${inner}</div>`;
    return `<p>${inner}</p>`;
  };

  // headings for the table of contents on a wide screen
  const heads = settings.format ? paras.filter(b => b.kind === 'h').map(b => ({ level: b.level, first: b.toks.find(t => t.i >= 0)?.i ?? -1, text: b.toks.map(t => t.raw).join(' ') })).filter(h => h.first >= 0) : [];

  view.className = `prompter${heads.length > 1 ? ' has-outline' : ''}`;
  view.innerHTML = `
    ${heads.length > 1 ? `<nav class="outline" aria-label="${T('Содержание')}"><h2>${T('Содержание')}</h2>${heads.map((h, k) =>
      `<button class="ol l${h.level}" data-k="${k}" data-first="${h.first}">${esc(h.text)}</button>`).join('')}</nav>` : ''}
    <div class="stage" id="stage"><div class="flip"><div class="text${settings.format ? ' fmt' : ''}" id="text">${paras.map(blockHtml).join('')}
      <div class="end"><span>${T('Конец текста')}</span></div></div></div></div>
    <div class="fade top"></div><div class="fade bottom"></div>
    <div class="read-line"><i></i><i></i></div>
    <div class="dot" id="dot" aria-hidden="true"></div>
    <div class="zoom-pill" id="zoom" aria-hidden="true"></div>
    <header class="bar top-bar">
      <a class="icon-btn" href="#" aria-label="${T('Назад')}">${icon('back')}</a>
      <div class="bar-title"><b>${esc(script.title)}</b><span class="status" id="status"></span></div>
      <div class="clock"><b id="clock">0:00</b><small id="left"></small></div>
    </header>
    <footer class="bar bottom-bar">
      <div class="progress"><i id="prog"></i></div>
      <button class="ctl" id="open-settings" aria-label="${T('Настройки')}" title="${T('Настройки')}">${icon('sliders')}</button>
      <span class="grow"></span>
      <button class="ctl round" id="prev" aria-label="${T('Назад к началу фразы')}" title="${T('Назад к началу фразы')} (←)">${icon('prev')}</button>
      <button class="ctl round" id="next" aria-label="${T('Вперёд к следующей фразе')}" title="${T('Вперёд к следующей фразе')} (→)">${icon('next')}</button>
      <button class="play" id="play" aria-label="${T('Старт')}" title="${T('Старт')} / ${T('Пауза')} (Space)">${icon('play')}</button>
    </footer>`;

  const stage = $('#stage'), textEl = $('#text'), playBtn = $('#play'), statusEl = $('#status'), dot = $('#dot'), zoomPill = $('#zoom');
  const spans = Array.from(textEl.querySelectorAll('span[data-i]'));
  const tracker = new Tracker(words, { back: settings.back, retakes: settings.retakes });

  let pos = Math.min(script.pos ?? -1, N - 1); // last spoken word
  let posF = pos + 1;                         // steady mode: fractional word
  let shown = -1;                            // words up to here are marked as read
  let running = false;
  let T0 = 0, v = 0;                         // current translate and its velocity
  let lines = [], lineOf = new Int32Array(N);
  let drag = null, manualUntil = 0, zooming = null;
  let wpm = settings.wpm, lastProg = null;
  let clockStart = null, clockPaused = 0;
  let barsTimer, saveTimer, wakeLock = null, sheet = null;
  let mode = settings.mode === 'speed' || !speechSupported ? 'speed' : 'voice';
  let size = settings.size; // the size on screen right now (animates towards settings.size)
  tracker.pos = pos;

  const applyLook = () => {
    const fonts = { golos: '"Golos Text"', inter: 'Inter', serif: '"PT Serif", Georgia', system: 'ui-sans-serif, system-ui' };
    view.style.setProperty('--p-font', `${fonts[settings.font] || fonts.golos}, ui-sans-serif, system-ui, sans-serif`);
    view.style.setProperty('--p-size', `${size}px`);
    view.style.setProperty('--p-line', settings.line);
    view.style.setProperty('--p-margin', `${settings.margin}vw`);
    view.style.setProperty('--read', `${settings.readLine}%`);
    view.classList.toggle('mirror', settings.mirror);
    view.classList.toggle('serif', settings.font === 'serif');
  };
  applyLook();

  // Where each word sits, grouped into lines. Re-measured after layout changes.
  const measure = () => {
    lines = [];
    let prevTop = -1e9;
    for (let i = 0; i < N; i++) {
      const el = spans[i];
      const top = el.offsetTop; // offsetParent is .text (blocks inside are not positioned)
      if (Math.abs(top - prevTop) > 3) { lines.push({ top, h: el.offsetHeight, first: i, last: i }); prevTop = top; }
      else lines[lines.length - 1].last = i;
      lineOf[i] = lines.length - 1;
    }
  };
  // The point of the text that should sit on the reading line: it moves word by word along
  // the current line, so scrolling is continuous rather than line by line.
  const anchor = f => {
    if (!lines.length) return 0;
    const i = Math.max(0, Math.min(N - 1, Math.floor(f)));
    const L = lines[lineOf[i]];
    const next = lines[lineOf[i] + 1];
    const frac = Math.min(1, (f - L.first) / (L.last - L.first + 1));
    const step = next ? next.top - L.top : L.h;
    return L.top + L.h / 2 + Math.max(0, frac) * step - step * 0.15;
  };
  const readY = () => stage.clientHeight * settings.readLine / 100;
  const target = () => readY() - anchor(mode === 'speed' ? posF : pos + 1);

  // The chunk to read next is bright, the text after it dimmer, the read text faint.
  let focus = [0, -1];
  const focusEnd = from => {
    if (from >= N) return N - 1;
    const hl = settings.highlight;
    if (hl === 'para') { let j = from; while (j + 1 < N && words[j + 1].para === words[from].para) j++; return j; }
    let j = from, ends = hl === 'two' ? 2 : 1;
    while (j + 1 < N) { if (words[j + 1].sent && --ends === 0) break; j++; }
    if (hl === 'sentence' && j - from < 4) { j++; while (j + 1 < N && !words[j + 1].sent) j++; }
    return Math.min(N - 1, j);
  };
  const markFocus = from => {
    const on = settings.highlight !== 'none';
    textEl.classList.toggle('hl', on);
    for (let i = focus[0]; i <= focus[1]; i++) spans[i]?.classList.remove('f');
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
    if (heads.length > 1) {
      let cur = -1;
      heads.forEach((h, k) => { if (h.first <= upto + 1) cur = k; });
      view.querySelectorAll('.ol').forEach(b => b.classList.toggle('on', +b.dataset.k === cur));
    }
    $('#prog').style.width = `${N ? Math.max(0, upto + 1) / N * 100 : 0}%`;
    const leftMin = Math.max(0, N - upto - 1) / Math.max(60, mode === 'speed' ? settings.wpm : wpm);
    $('#left').textContent = upto >= N - 1 ? '' : T('ост. {t}', { t: fmtDur(leftMin * 130) });
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { script.pos = upto; saveList(); }, 800);
  };

  const setPos = (p, why) => {
    pos = Math.max(-1, Math.min(N - 1, p));
    posF = pos + 1;
    tracker.set(pos);
    lastProg = null;
    markRead(pos);
    if (why) toast(why, 1500);
  };

  /* smooth scrolling: a velocity that follows the distance to the target, itself smoothed, so
     the text glides and never jerks. Far jumps fade instead of racing across the screen. */
  let raf, lastT = performance.now(), fading = false;
  const apply = () => { textEl.style.transform = `translate3d(0, ${T0.toFixed(2)}px, 0)`; };
  const frame = now => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (running && mode === 'speed' && !drag && !zooming) {
      posF = Math.min(N, posF + settings.wpm / 60 * dt);
      const p = Math.floor(posF) - 1;
      if (p !== pos) { pos = p; markRead(pos); }
    }
    if (drag || zooming) return;
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
    if (Math.abs(err) < 0.3 && Math.abs(v) < 2) v = 0;
    T0 += v * dt;
    apply();
  };

  /* text size: animated, the current word stays on the reading line while the text reflows */
  const pinned = () => spans[Math.max(0, Math.min(N - 1, pos + 1))];
  const startZoom = () => {
    const el = pinned();
    zooming = { off: el ? T0 - (readY() - (el.offsetTop + el.offsetHeight / 2)) : 0, from: size };
    zoomPill.classList.add('on');
  };
  const liveSize = px => {
    size = Math.max(16, Math.min(96, px));
    view.style.setProperty('--p-size', `${size.toFixed(2)}px`);
    zoomPill.textContent = Math.round(size);
    const el = pinned();
    if (el) { T0 = readY() - (el.offsetTop + el.offsetHeight / 2) + zooming.off * (size / zooming.from); v = 0; apply(); }
  };
  const endZoom = () => {
    settings.size = Math.round(size);
    size = settings.size;
    view.style.setProperty('--p-size', `${size}px`);
    saveSettings();
    measure();
    zooming = null;
    zoomGoal = null;
    v = 0;
    setTimeout(() => zoomPill.classList.remove('on'), 500);
    sheet?.body.querySelector('[data-size]')?.replaceChildren(String(settings.size));
  };
  let zoomAnim, zoomGoal = null; // zoomGoal: where an animation is heading, so quick presses add up
  const zoomTo = (px, ms = 260) => {
    px = Math.max(16, Math.min(96, px));
    zoomGoal = px;
    cancelAnimationFrame(zoomAnim);
    if (!zooming) startZoom();
    const from = size, t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / ms);
      liveSize(from + (px - from) * (1 - (1 - k) ** 3));
      if (k < 1) zoomAnim = requestAnimationFrame(step); else endZoom();
    };
    zoomAnim = requestAnimationFrame(step);
  };

  /* speech */
  const listener = new Listener({
    lang: speechLang(),
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
    if (mode === 'speed') { statusEl.textContent = T('Скорость {n}', { n: settings.wpm }); statusEl.className = 'status on'; dot.className = 'dot'; return; }
    if (s === 'network') {
      statusEl.textContent = T('Нет сети'); statusEl.className = 'status warn'; dot.className = 'dot warn';
      if (!netWarned) { netWarned = true; toast(T('Распознаванию речи нужен интернет. Продолжаю, как только он появится.'), 5000); }
      return;
    }
    if (s === 'on') netWarned = false;
    statusEl.textContent = T('Слушаю'); statusEl.className = 'status on'; dot.className = 'dot on';
  }

  /* takes and sentence steps */
  const clockNow = () => (clockStart == null ? 0 : ((clockPaused || Date.now()) - clockStart) / 1000);
  script.takes ||= [];
  function addTake(idx, kind) {
    const snippet = spans.slice(idx, idx + 6).map(s => s.textContent).join(' ');
    script.takes.push({ at: Math.round(clockNow()), idx, kind, snippet });
    saveList();
    toast(`${T('Дубль {n}', { n: script.takes.length })} · «${snippet}…»`, 2000);
  }
  let lastPrev = { at: 0, idx: 0 };
  $('#prev').addEventListener('click', () => {
    // once: the start of this sentence; again within 3 s: one sentence further back
    const again = Date.now() - lastPrev.at < 3000;
    const idx = again ? sentenceStart(words, lastPrev.idx - 1) : sentenceStart(words, pos + 1);
    if (again && script.takes.length) script.takes.pop();
    lastPrev = { at: Date.now(), idx };
    setPos(idx - 1);
    addTake(idx, 'manual');
    if (running) hideBarsSoon();
  });
  $('#next').addEventListener('click', () => {
    let j = Math.max(0, pos + 2);
    while (j < N && !words[j].sent) j++;
    setPos(Math.min(N, j) - 1);
    if (running) hideBarsSoon();
  });

  view.querySelector('.outline')?.addEventListener('click', e => {
    const b = e.target.closest('.ol');
    if (b) setPos(+b.dataset.first - 1);
  });

  /* start / stop */
  function start() {
    if (!N) return;
    if (mode === 'voice' && !speechSupported) { mode = 'speed'; toast(T('Браузер не умеет распознавать речь. Откройте суфлёр в Chrome (Android, ПК) или Safari (iPhone, Mac). Пока листаю ровно.'), 7000); }
    if (pos >= N - 1) setPos(-1);
    running = true;
    view.classList.add('running');
    playBtn.innerHTML = icon('pause');
    if (clockStart == null) clockStart = Date.now();
    else if (clockPaused) { clockStart += Date.now() - clockPaused; }
    clockPaused = 0;
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
  const hideBarsSoon = () => { clearTimeout(barsTimer); barsTimer = setTimeout(() => { if (running && !sheet) view.classList.add('bare'); }, 2800); };
  view.addEventListener('pointerdown', e => { if (e.target.closest('.bar')) { showBars(); if (running) hideBarsSoon(); } });

  /* touch: one finger drags the text ("I'm here"), two fingers change the text size,
     a tap shows or hides the controls, a double tap on a word continues from it */
  const pointers = new Map();
  let lastTap = { t: 0, i: -1 }, tapTimer, noTapUntil = 0, pinchRaf = 0, pinchWant = 0;
  const dist = () => { const [a, b] = [...pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  stage.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { stage.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
    if (pointers.size === 2) {
      if (drag) { T0 = drag.T; apply(); drag = null; view.classList.remove('dragging'); }
      cancelAnimationFrame(zoomAnim);
      if (!zooming) startZoom();
      zooming.d0 = dist();
      zooming.s0 = size;
      noTapUntil = Date.now() + 400;
      return;
    }
    if (pointers.size === 1) drag = { y: e.clientY, T: T0, moved: false, id: e.pointerId };
  });
  stage.addEventListener('pointermove', e => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX; p.y = e.clientY;
    if (zooming && pointers.size >= 2) {
      pinchWant = zooming.s0 * dist() / Math.max(20, zooming.d0);
      if (!pinchRaf) pinchRaf = requestAnimationFrame(() => { pinchRaf = 0; if (zooming) liveSize(pinchWant); });
      return;
    }
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(dy) < 8) return;
    if (!drag.moved) { drag.moved = true; view.classList.add('dragging'); }
    T0 = drag.T + dy;
    v = 0;
    apply();
  });
  const endPointer = e => {
    if (!pointers.delete(e.pointerId)) return;
    if (zooming && zooming.d0 != null) {
      if (pointers.size === 0) { cancelAnimationFrame(pinchRaf); pinchRaf = 0; endZoom(); }
      return;
    }
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    view.classList.remove('dragging');
    if (d.moved) { commitFromReadLine(); return; }
    if (Date.now() < noTapUntil) return;
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
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  const noGesture = e => e.preventDefault(); // Safari's own page zoom
  document.addEventListener('gesturestart', noGesture);
  // the line on the reading line becomes the current one
  function commitFromReadLine() {
    const y = readY() - T0;
    let L = lines[0];
    for (const line of lines) { if (line.top <= y) L = line; else break; }
    if (!L) return;
    setPos(L.first - 1, T('Продолжаю отсюда'));
    v = 0;
  }
  let wheelTimer, wheelZoom = 0;
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    if (e.ctrlKey) { // trackpad pinch or Ctrl + wheel: text size
      cancelAnimationFrame(zoomAnim);
      if (!zooming) startZoom();
      wheelZoom = size * Math.exp(-e.deltaY / 120);
      liveSize(wheelZoom);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(endZoom, 250);
      return;
    }
    T0 -= e.deltaY;
    v = 0;
    apply();
    manualUntil = performance.now() + 100000;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { manualUntil = 0; commitFromReadLine(); }, 450);
  }, { passive: false });

  const onKey = e => {
    if (sheet || e.target.closest?.('input, textarea, select')) return;
    if (e.code === 'Space') { e.preventDefault(); running ? stop() : start(); }
    else if (e.code === 'ArrowLeft') $('#prev').click();
    else if (e.code === 'ArrowRight') $('#next').click();
    else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();
      const li = lineOf[Math.max(0, Math.min(N - 1, pos + 1))] + (e.code === 'ArrowDown' ? 1 : -1);
      const L = lines[Math.max(0, Math.min(lines.length - 1, li))];
      if (L) setPos(L.first - 1);
    } else if (e.key === '+' || e.key === '=') zoomTo((zoomGoal ?? settings.size) + 4);
    else if (e.key === '-') zoomTo((zoomGoal ?? settings.size) - 4);
    else if (e.code === 'Escape') location.hash = '#';
  };
  document.addEventListener('keydown', onKey);

  /* keep the screen on */
  const wake = async () => {
    if (!settings.wake || !navigator.wakeLock || document.visibilityState !== 'visible') return;
    try { wakeLock = await navigator.wakeLock.request('screen'); } catch { /* not allowed now */ }
  };
  const onVis = () => {
    if (document.visibilityState === 'visible') { wake(); if (running && mode === 'voice') listener.start(); }
    else if (running && mode === 'voice') listener.stop(); // recognition can't run hidden
  };
  document.addEventListener('visibilitychange', onVis);
  wake();

  const clockTimer = setInterval(() => { $('#clock').textContent = fmtClock(clockNow()); }, 500);

  /* layout */
  const relayout = () => {
    if (zooming) return;
    measure();
    if (!fading) { T0 = target(); v = 0; apply(); }
  };
  const ro = new ResizeObserver(() => relayout());
  ro.observe(stage);
  document.fonts?.ready.then(relayout);
  measure();
  markRead(pos, true);
  T0 = target();
  apply();
  raf = requestAnimationFrame(frame);
  setStatus('off');
  if (!store.get('sufler.helped2', false)) { openSettings(true); store.set('sufler.helped2', true); }

  /* settings */
  $('#open-settings').addEventListener('click', e => { e.stopPropagation(); openSettings(); });
  function openSettings(helpFirst = false) {
    const seg = (key, opts) => `<div class="seg" data-key="${key}">${opts.map(([val, l]) =>
      `<button data-v="${val}" class="${String(settings[key]) === String(val) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const range = (key, min, max, step, fmt = x => x) => `<div class="range"><input type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${settings[key]}"><output>${fmt(settings[key])}</output></div>`;
    const toggle = (key, label, sub = '') => `<label class="toggle"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><input type="checkbox" data-key="${key}" ${settings[key] ? 'checked' : ''}><i></i></label>`;
    const takes = script.takes || [];
    const sh = openSheet(`
      <header class="sheet-top"><h2 class="sheet-title">${T('Настройки')}</h2><button class="icon-btn" data-close aria-label="${T('Закрыть')}">${icon('x')}</button></header>
      <details class="help" ${helpFirst ? 'open' : ''}><summary>${T('Как пользоваться')}</summary>
        <ul><li>${T('Нажмите ▶ и читайте: текст листается за голосом. Своими словами — можно, суфлёр подождёт.')}</li>
        <li>${T('↺ — назад к началу фразы (дубль), ↻ — вперёд к следующей.')}</li>
        <li>${T('Сбился? Протяните текст пальцем до нужной строки или дважды нажмите на слово.')}</li>
        <li>${T('Размер текста — щипком двумя пальцами. Касание — показать или спрятать кнопки.')}</li></ul></details>
      <h3>${T('Текст')}</h3>
      <div class="set"><span>${T('Размер')}<small>${T('Или щипком двумя пальцами по тексту')}</small></span>
        <div class="stepper"><button data-size-step="-2" aria-label="−">${icon('minus')}</button><b data-size>${settings.size}</b><button data-size-step="2" aria-label="+">${icon('plus')}</button></div></div>
      ${toggle('format', T('Заголовки и списки'), T('Как в документе'))}
      <div class="set col"><span>${T('Выделять')}</span>${seg('highlight', [['sentence', T('Фразу')], ['two', T('Две')], ['para', T('Абзац')], ['none', T('Нет')]])}</div>
      <div class="set"><span>${T('Интервал')}</span>${range('line', 1.2, 2.2, 0.05, x => (+x).toFixed(2))}</div>
      <div class="set"><span>${T('Поля')}</span>${range('margin', 0, 25, 1, x => `${x}%`)}</div>
      <div class="set"><span>${T('Линия чтения')}</span>${range('readLine', 15, 60, 1, x => `${x}%`)}</div>
      <div class="set col"><span>${T('Шрифт')}</span>${seg('font', [['golos', 'Golos'], ['inter', 'Inter'], ['serif', 'Serif'], ['system', 'System']])}</div>
      <div class="set col"><span>${T('Тема')}</span>${seg('theme', [['auto', T('Авто')], ['light', T('Светлая')], ['dark', T('Тёмная')]])}</div>
      ${toggle('mirror', T('Зеркально'), T('Для стекла суфлёра'))}
      <h3>${T('Листать')}</h3>
      <div class="set col">${seg('mode', [['voice', T('По голосу')], ['speed', T('Ровно')]])}</div>
      <div class="set" data-show="speed"><span>${T('Слов в минуту')}</span>${range('wpm', 60, 220, 5)}</div>
      <div class="set col"><span>${T('Плавность')}</span>${seg('smooth', [['soft', T('Мягко')], ['medium', T('Средне')], ['fast', T('Быстро')]])}</div>
      <div class="set col" data-show="voice"><span>${T('Язык речи')}</span>${seg('lang', [['auto', T('Авто')], ['ru-RU', 'Русский'], ['en-US', 'English']])}</div>
      <div data-show="voice">${toggle('retakes', T('Дубли'), T('Сам возвращаться, когда начинаю отрывок заново'))}</div>
      <h3>${T('Экран')}</h3>
      ${toggle('wake', T('Не гасить экран'))}
      ${document.documentElement.requestFullscreen ? toggle('fullscreen', T('Во весь экран при старте')) : ''}
      <h3>${T('Журнал дублей')}</h3>
      ${takes.length ? `<ol class="takes">${takes.map((t, k) => `<li><button data-take="${t.idx}"><b>${fmtClock(t.at)}</b><span>${T('Дубль {n}', { n: k + 1 })} · «${esc(t.snippet)}…»</span></button></li>`).join('')}</ol>
        <div class="row-btns"><button class="btn" data-copy>${T('Скопировать')}</button><button class="btn" data-clear>${T('Очистить')}</button><button class="btn" data-reset>${T('Сбросить время')}</button></div>`
      : `<p class="muted">${T('Дублей пока нет. Время считается от первого «Старт».')}</p>`}
      <div class="sheet-actions">
        <button class="action" data-start>${icon('prev')}<span>${T('В начало')}</span></button>
        ${script.docId ? `<button class="action" data-update>${icon('refresh')}<span>${T('Обновить из Google Docs')}</span></button>` : ''}
        <a class="action" href="#edit/${esc(script.id)}">${icon('edit')}<span>${T('Изменить текст')}</span></a>
      </div>`, { label: T('Настройки'), onClose: () => { sheet = null; if (running) hideBarsSoon(); } });
    sheet = sh;
    showBars();
    const body = sh.body;
    const showModes = () => body.querySelectorAll('[data-show]').forEach(el => { el.hidden = el.dataset.show !== settings.mode; });
    showModes();
    body.addEventListener('input', e => {
      const k = e.target.dataset.key;
      if (!k || e.target.type !== 'range') return;
      settings[k] = +e.target.value;
      e.target.nextElementSibling.textContent = k === 'line' ? (+e.target.value).toFixed(2) : k === 'margin' || k === 'readLine' ? `${e.target.value}%` : e.target.value;
      saveSettings();
      applyLook();
      if (k === 'wpm') setStatus('on'); else relayout();
    });
    body.addEventListener('change', e => {
      const k = e.target.dataset.key;
      if (!k || e.target.type !== 'checkbox') return;
      settings[k] = e.target.checked;
      saveSettings();
      applyLook();
      if (k === 'format') { script.pos = pos; saveList(); sh.close(); if (running) stop(); route(); return; }
      if (k === 'mirror') relayout();
      if (k === 'retakes') tracker.retakes = settings.retakes;
      if (k === 'wake') { if (settings.wake) wake(); else { wakeLock?.release().catch(() => {}); wakeLock = null; } }
    });
    body.addEventListener('click', async e => {
      const b = e.target.closest('button, a');
      if (!b) return;
      if ('close' in b.dataset) { sh.close(); return; }
      if (b.dataset.sizeStep) {
        const to = Math.max(16, Math.min(96, settings.size + +b.dataset.sizeStep));
        settings.size = to;
        $('[data-size]', body).textContent = to;
        zoomTo(to);
        return;
      }
      const segEl = b.closest('.seg');
      if (segEl) {
        const k = segEl.dataset.key;
        settings[k] = b.dataset.v;
        segEl.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        saveSettings();
        if (k === 'theme') applyTheme();
        if (k === 'highlight') markRead(pos, true);
        if (k === 'font') { applyLook(); relayout(); document.fonts?.ready.then(relayout); }
        if (k === 'mode') {
          const was = running;
          if (was) stop();
          mode = settings.mode === 'speed' || !speechSupported ? 'speed' : 'voice';
          posF = pos + 1;
          showModes();
          if (was) start();
        }
        if (k === 'lang') listener.lang = speechLang();
        return;
      }
      if (b.dataset.take) { setPos(+b.dataset.take - 1); sh.close(); }
      if ('copy' in b.dataset) {
        const txt = (script.takes || []).map((t, k) => `${fmtClock(t.at)}  ${T('Дубль {n}', { n: k + 1 })}: «${t.snippet}…»`).join('\n');
        try { await navigator.clipboard.writeText(txt); toast(T('Скопировано')); } catch { /* no clipboard */ }
      }
      if ('clear' in b.dataset) { script.takes = []; saveList(); sh.close(); openSettings(); }
      if ('reset' in b.dataset) { clockStart = running ? Date.now() : null; clockPaused = 0; toast('0:00'); }
      if ('start' in b.dataset) { setPos(-1); sh.close(); }
      if ('update' in b.dataset) {
        const s = await importGoogle(`https://docs.google.com/document/d/${script.docId}/`, script);
        if (s) { sh.close(); route(); }
      }
    });
  }

  cleanup = () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(zoomAnim);
    clearInterval(clockTimer);
    clearTimeout(barsTimer);
    listener.stop();
    ro.disconnect();
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVis);
    document.removeEventListener('gesturestart', noGesture);
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
