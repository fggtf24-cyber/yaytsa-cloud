// Яйца Суфлёр: where in the script the speaker is.
// The text is split into words; the recognizer's last few words are matched against a window of
// the text around the current position with a fuzzy local alignment (Smith–Waterman), so
// misheard words, word endings, skipped and extra words don't throw it off. A strong match
// earlier in the text means the speaker started a passage again (a retake) and the position
// jumps back there.

export function normWord(w) {
  return w.toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, '');
}

// Text → paragraphs of display tokens + the list of spoken words.
// Words in [square brackets] are notes for the speaker: shown, never expected to be heard.
export function tokenize(text) {
  const paras = [];
  const words = [];
  let depth = 0;
  let sentEnd = true;
  for (const line of text.replace(/\r/g, '').split(/\n/)) {
    if (!line.trim()) { sentEnd = true; continue; }
    const toks = [];
    for (const raw of line.trim().split(/\s+/)) {
      const opens = (raw.match(/\[/g) || []).length;
      const closes = (raw.match(/\]/g) || []).length;
      const note = depth > 0 || opens > 0;
      depth = Math.max(0, depth + opens - closes);
      const norm = normWord(raw);
      if (note || !norm) { toks.push({ raw, i: -1, note }); continue; }
      const i = words.length;
      words.push({ norm, sent: sentEnd, para: paras.length });
      toks.push({ raw, i });
      sentEnd = /[.!?…]["»”')\]]*$/.test(raw);
    }
    paras.push(toks);
    sentEnd = true;
  }
  return { paras, words };
}

function lev(a, b) {
  const m = a.length, n = b.length;
  let prev = new Array(n + 1), cur = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

// 0..1: how alike a heard word and a script word are. Russian endings change a lot, so a long
// common beginning counts as a match ("программа" ~ "программы").
export function sim(a, b) {
  if (a === b) return 1;
  const la = a.length, lb = b.length, mn = Math.min(la, lb);
  if (mn < 3 || a[0] !== b[0]) return 0;
  let cp = 0;
  while (cp < mn && a[cp] === b[cp]) cp++;
  if (cp >= 4 && cp >= mn * 0.6) return 0.85;
  if (Math.abs(la - lb) > 3) return 0;
  const r = 1 - lev(a, b) / Math.max(la, lb);
  return r >= 0.7 ? r * 0.9 : 0;
}

const Q = 12;            // how many last heard words are matched
const GAP_HEARD = 0.45;  // a heard word that is not in the text (ad-lib, misrecognition)
const GAP_TEXT = 0.3;    // a text word that was not heard (skipped or dropped by the recognizer)
const MISS = 0.5;
const TAIL = 0.6;        // per heard word after the match end: the match must reach the latest words

export class Tracker {
  constructor(words, opts = {}) {
    this.words = words;
    this.pos = -1; // index of the last word spoken
    this.back = opts.back ?? 600;  // how far back a retake is searched for (words)
    this.fwd = opts.fwd ?? 400;
    this.retakes = opts.retakes ?? true;
    this.pending = null;
    this.holdUntil = 0;
    const freq = new Map();
    for (const w of words) freq.set(w.norm, (freq.get(w.norm) || 0) + 1);
    const common = Math.max(8, words.length * 0.004);
    this.wt = words.map(w => {
      const l = w.norm.length;
      return (l <= 2 ? 0.35 : l === 3 ? 0.65 : 1) * (freq.get(w.norm) > common ? 0.6 : 1);
    });
  }

  // heard: normalized words, oldest first. Returns null or { pos, from, kind: 'forward' | 'jump' | 'retake' }
  update(heard) {
    const q = heard.filter(Boolean).slice(-Q);
    const m = q.length;
    const N = this.words.length;
    if (!m || !N) return null;
    const p = this.pos;
    const lo = Math.max(0, p - (this.retakes ? this.back : 3));
    const hi = Math.min(N, Math.max(p, 0) + this.fwd + 1);
    const n = hi - lo;
    const W = n + 1;
    const H = new Float32Array((m + 1) * W);
    const K = new Int16Array((m + 1) * W);   // long words matched along the path
    const S = new Int32Array((m + 1) * W);   // text index where the path starts
    let best = null;
    for (let i = 1; i <= m; i++) {
      const qw = q[i - 1];
      const rq = 0.55 + 0.45 * i / m; // the latest words matter more
      for (let j = 1; j <= n; j++) {
        const t = lo + j - 1;
        const c = i * W + j, d = (i - 1) * W + j - 1, u = (i - 1) * W + j, l = i * W + j - 1;
        const s = sim(qw, this.words[t].norm);
        const diag = H[d] + (s > 0 ? s * this.wt[t] * rq : -MISS);
        const up = H[u] - GAP_HEARD;
        const left = H[l] - GAP_TEXT;
        let h = 0, k = 0, st = t;
        if (diag >= up && diag >= left && diag > 0) {
          h = diag;
          k = K[d] + (s > 0 && this.words[t].norm.length >= 4 ? 1 : 0);
          st = H[d] > 0 ? S[d] : t;
        } else if (up >= left && up > 0) { h = up; k = K[u]; st = S[u]; }
        else if (left > 0) { h = left; k = K[l]; st = S[l]; }
        H[c] = h; K[c] = k; S[c] = st;
        if (s > 0 && h === diag && h > 0) {
          const val = h - TAIL * (m - i);
          const delta = t - p;
          const adj = val - (delta >= 0 ? 0.003 * delta : 0.004 * -delta);
          if (!best || adj > best.adj) best = { adj, val, k, t, start: st, delta };
        }
      }
    }
    if (!best) return this.byKeywords(heard);
    const { val, k, t, start, delta } = best;
    if (delta > 0 && delta <= 30) {
      this.pending = null;
      if (val >= 0.9 && (k >= 1 || val >= 1.5)) {
        this.pos = t;
        return { pos: t, from: p, kind: 'forward' };
      }
      return this.byKeywords(heard);
    }
    if (delta <= 0 && delta >= -2) return this.byKeywords(heard);
    let ok = false, kind = 'jump';
    if (delta > 30) ok = val >= 3 && k >= 3;
    else if (delta < -2 && this.retakes && Date.now() >= this.holdUntil) {
      // a retake usually starts a sentence again: that makes it easier to believe
      const atSentence = this.words[start]?.sent || this.words[start - 1]?.sent;
      ok = val >= (atSentence ? 2.6 : 3.2) && k >= 3;
      kind = 'retake';
    }
    if (!ok) return null;
    // A big move needs two updates in a row that agree, so an ad-lib that happens to echo
    // an earlier phrase doesn't throw the text around.
    const pend = this.pending;
    if (!pend || Math.abs(pend.t - t) > 8 || pend.kind !== kind) {
      this.pending = { t, kind, at: Date.now() };
      return null;
    }
    this.pending = null;
    this.pos = t;
    return { pos: t, from: p, kind, start };
  }

  // Paraphrase: the words are the speaker's own, but the key words of the next sentences are
  // still there, in any order. Distinct long stems heard recently that belong to one sentence
  // ahead move the position there, only forward and only a few sentences ahead.
  byKeywords(heard) {
    const p = this.pos;
    const stems = new Set(heard.slice(-20).filter(w => w.length >= 5).map(w => w.slice(0, 5)));
    if (stems.size < 2) return null;
    const N = this.words.length;
    let i = p + 1, sentences = 0, best = null;
    while (i < N && sentences < 4) {
      let j = i + 1;
      while (j < N && !this.words[j].sent) j++;
      const seen = new Set();
      let last = -1;
      for (let x = i; x < j; x++) {
        const w = this.words[x].norm;
        if (w.length < 5 || this.wt[x] < 1) continue;
        const st = w.slice(0, 5);
        if (stems.has(st) && !seen.has(st)) { seen.add(st); last = x; }
      }
      if (seen.size >= 3 && (!best || seen.size > best.n)) best = { n: seen.size, last };
      i = j;
      sentences++;
    }
    if (!best || best.last <= p) return null;
    this.pos = best.last;
    return { pos: best.last, from: p, kind: 'meaning' };
  }

  // The speaker says "I'm here": manual position. Backward jumps wait a moment so the words
  // just heard (from before the manual move) can't pull the text back.
  set(pos) {
    this.pos = pos;
    this.pending = null;
    this.holdUntil = Date.now() + 2500;
  }
}

// Index of the first word of the sentence that contains `i` (or of the previous one, `n` times back).
export function sentenceStart(words, i, n = 0) {
  let j = Math.max(0, Math.min(i, words.length - 1));
  while (j > 0 && !words[j].sent) j--;
  while (n-- > 0 && j > 0) {
    j--;
    while (j > 0 && !words[j].sent) j--;
  }
  return j;
}
