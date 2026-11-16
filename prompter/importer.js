// Getting a script in: a Google Docs link, a .docx / .txt / .md file, or pasted text.
// Formatting is kept as light markdown: "# " headings and "- " / "1. " list items.

// docs.google.com/document/d/<id>/... → the document through its export link.
// The document must be open to "Anyone with the link".
export function googleDocId(url) {
  const m = /docs\.google\.com\/document\/(?:u\/\d+\/)?d\/([\w-]{20,})/.exec(url || '');
  return m ? m[1] : null;
}

export async function fetchGoogleDoc(id) {
  const get = async format => {
    let res;
    try {
      res = await fetch(`https://docs.google.com/document/d/${id}/export?format=${format}`, { credentials: 'omit', cache: 'no-store' });
    } catch {
      throw new Error('closed'); // a private document answers with a sign-in page that the browser blocks
    }
    if (!res.ok) throw new Error(res.status === 404 ? 'notfound' : 'closed');
    return (await res.text()).replace(/^﻿/, '');
  };
  const html = await get('html');
  if (/accounts\.google\.com\/|ServiceLogin/.test(html) && !/<h\d|<p/i.test(html)) throw new Error('closed');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const title = doc.title?.trim() || '';
  const text = htmlToText(doc.body);
  if (!text.trim()) throw new Error('closed');
  return { text, title };
}

// HTML (Google Docs export or clipboard, Word clipboard) → light markdown.
export function htmlToText(root) {
  const out = [];
  const inline = el => (el.textContent || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const listLevel = el => {
    const c = /lst-kix_\w+-(\d+)/.exec(el.className || '');
    if (c) return +c[1];
    let d = 0;
    for (let p = el.parentElement; p && p !== root; p = p.parentElement) if (p.tagName === 'UL' || p.tagName === 'OL') d++;
    return d;
  };
  const walk = node => {
    for (const el of node.children) {
      const tag = el.tagName;
      if (/^H[1-6]$/.test(tag)) { const t = inline(el); if (t) out.push(`${'#'.repeat(+tag[1])} ${t}`); continue; }
      if (tag === 'UL' || tag === 'OL') {
        let n = +(el.getAttribute('start') || 1);
        const lvl = listLevel(el);
        for (const li of el.children) {
          if (li.tagName !== 'LI') continue;
          const nested = Array.from(li.children).filter(c => c.tagName === 'UL' || c.tagName === 'OL');
          const clone = li.cloneNode(true);
          clone.querySelectorAll('ul, ol').forEach(x => x.remove());
          const t = inline(clone);
          if (t) out.push(`${'  '.repeat(lvl)}${tag === 'OL' ? `${n}.` : '-'} ${t}`);
          n++;
          nested.forEach(x => walk({ children: [x] }));
        }
        continue;
      }
      if (tag === 'P' || tag === 'LI' || tag === 'BLOCKQUOTE' || tag === 'TD' || tag === 'TH') {
        const t = inline(el);
        const cls = el.className || '';
        if (!t) { out.push(''); continue; }
        out.push(/\btitle\b/.test(cls) ? `# ${t}` : /\bsubtitle\b/.test(cls) ? `## ${t}` : t);
        continue;
      }
      if (tag === 'BR') { out.push(''); continue; }
      if (tag === 'STYLE' || tag === 'SCRIPT' || tag === 'META' || tag === 'TITLE') continue;
      if (el.children.length) walk(el);
      else { const t = inline(el); if (t) out.push(t); }
    }
  };
  walk(root);
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Markdown from anywhere (Notion export, Obsidian, plain .md) → the light markdown the prompter
// shows: headings and list items stay, emphasis, links, images, tables and quotes become text.
export function cleanMarkdown(md) {
  return md.replace(/\r/g, '')
    .replace(/^---\n[\s\S]*?\n---\n/, '')                 // front matter
    .replace(/```[\s\S]*?```/g, '')                       // code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')                 // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')              // links → their text
    .replace(/<\/?[a-z][^>]*>/gi, '')                     // stray html tags
    .split('\n').map(l => l
      .replace(/^\s*>\s?/, '')                            // quotes
      .replace(/^(\s*)[-*+]\s+\[[ xX]\]\s+/, '$1- ')       // checkboxes
      .replace(/^\s*([-*_])\1{2,}\s*$/, '')                // rules
      .replace(/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*:?-*:?\s*$/, '') // table separators
      .replace(/^\s*\|(.*)\|\s*$/, (_, row) => row.split('|').map(c => c.trim()).filter(Boolean).join(' — '))
      .replace(/(\*\*|__|~~|`)/g, '')
      .replace(/(^|\W)[*_]([^*_\n]+)[*_](?=\W|$)/g, '$1$2'))
    .join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// A tiny zip reader with the browser's own inflate (DecompressionStream) instead of a library:
// .docx, .odt and Notion's export are all zips.
function zipEntries(buf) {
  const v = new DataView(buf);
  let eocd = -1;
  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) {
    if (v.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('zip');
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const dec = new TextDecoder();
  const out = [];
  for (let n = 0; n < count; n++) {
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true), extra = v.getUint16(p + 30, true), comment = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = dec.decode(new Uint8Array(buf, p + 46, nameLen));
    out.push({
      name, size,
      bytes: async () => {
        const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
        const data = new Uint8Array(buf, start, size);
        if (method === 0) return data;
        const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Uint8Array(await new Response(stream).arrayBuffer());
      },
    });
    p += 46 + nameLen + extra + comment;
  }
  return out;
}
async function unzipEntry(buf, name) {
  const e = zipEntries(buf).find(x => x.name === name);
  return e ? new TextDecoder().decode(await e.bytes()) : null;
}

// Text files in any common encoding: UTF-8, UTF-16 with a mark, or Windows-1251 for old Russian files.
function decodeText(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes);
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes);
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^﻿/, ''); }
  catch { return new TextDecoder('windows-1251').decode(bytes); }
}

// OpenDocument (.odt): content.xml with text:h (outline level), text:p and text:list.
async function odtText(buf) {
  const xml = await unzipEntry(buf, 'content.xml');
  if (!xml) throw new Error('zip');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const out = [];
  const walk = (node, depth) => {
    for (const el of node.children) {
      const n = el.localName;
      if (n === 'h') { const t = el.textContent.trim(); if (t) out.push(`${'#'.repeat(Math.min(3, +(el.getAttribute('text:outline-level') || 1)))} ${t}`); }
      else if (n === 'p') { const t = el.textContent.replace(/\s+/g, ' ').trim(); out.push(depth >= 0 && t ? `${'  '.repeat(depth)}- ${t}` : t); }
      else if (n === 'list') walk(el, depth + 1);
      else if (n === 'list-item') walk(el, depth);
      else if (el.children.length) walk(el, depth);
    }
  };
  const body = doc.getElementsByTagName('office:text')[0] || doc.documentElement;
  walk(body, -1);
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// RTF: drop the control words and groups that aren't text, decode \'xx and \uN characters.
function rtfText(src) {
  let s = src.replace(/\{\\\*[^{}]*(\{[^{}]*\}[^{}]*)*\}/g, '')
    .replace(/\{\\(fonttbl|colortbl|stylesheet|info|pict)[\s\S]*?\}\s*\}/g, '');
  const cp = /\\ansicpg(\d+)/.exec(src)?.[1] || '1251';
  let dec;
  try { dec = new TextDecoder(`windows-${cp}`); } catch { dec = new TextDecoder('windows-1251'); }
  s = s.replace(/\\'([0-9a-f]{2})/gi, (_, h) => dec.decode(new Uint8Array([parseInt(h, 16)])))
    .replace(/\\u(-?\d+)\??/g, (_, n) => String.fromCharCode(n < 0 ? 65536 + +n : +n))
    .replace(/\\(par|line)\b ?/g, '\n').replace(/\\tab\b ?/g, ' ')
    .replace(/\\[a-z]+-?\d* ?/gi, '').replace(/[{}]/g, '').replace(/\\([\\{}])/g, '$1');
  return s.split('\n').map(l => l.trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// PDF through pdf.js, loaded only when a PDF comes in. Lines are rebuilt from the text
// positions, paragraphs from the gaps between lines, headings from a larger font size.
let pdfjs;
async function loadPdfJs() {
  if (pdfjs) return pdfjs;
  const base = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  await new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = `${base}pdf.min.js`;
    s.onload = ok;
    s.onerror = () => fail(new Error('pdf'));
    document.head.append(s);
  });
  pdfjs = window.pdfjsLib;
  pdfjs.GlobalWorkerOptions.workerSrc = `${base}pdf.worker.min.js`;
  return pdfjs;
}
async function pdfText(buf) {
  const lib = await loadPdfJs();
  const pdf = await lib.getDocument({ data: buf }).promise;
  const lines = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const { items } = await page.getTextContent();
    let cur = null;
    for (const it of items) {
      if (!it.str) { if (it.hasEOL && cur) cur.eol = true; continue; }
      const y = it.transform[5], h = Math.abs(it.transform[3]) || it.height || 10;
      if (!cur || cur.eol || Math.abs(cur.y - y) > h * 0.5) {
        cur = { y, h, text: '', page: n, eol: false };
        lines.push(cur);
      }
      cur.text += (cur.text && !/\s$/.test(cur.text) && !/^\s/.test(it.str) ? ' ' : '') + it.str;
      cur.h = Math.max(cur.h, h);
      if (it.hasEOL) cur.eol = true;
    }
  }
  const real = lines.filter(l => l.text.trim());
  if (!real.length) throw new Error('scan');
  const sizes = real.map(l => Math.round(l.h)).sort((a, b) => a - b);
  const body = sizes[Math.floor(sizes.length / 2)];
  const out = [];
  let para = '';
  const flush = () => { if (para) { out.push(para); para = ''; } };
  real.forEach((l, k) => {
    const t = l.text.replace(/\s+/g, ' ').trim();
    if (/^\d{1,4}$/.test(t)) return; // page numbers
    const prev = real[k - 1];
    const gap = prev && prev.page === l.page ? prev.y - l.y : 0;
    if (l.h >= body * 1.25 && t.length < 120) { flush(); out.push(`${l.h >= body * 1.6 ? '#' : '##'} ${t}`); return; }
    if (/^([•●▪◦\-–]|\d{1,3}[.)])\s+/.test(t)) { flush(); para = t.replace(/^[•●▪◦–]\s+/, '- '); return; }
    if (!prev || prev.page !== l.page || gap > l.h * 1.7 || /[.!?…:»"]$/.test(para) && gap > l.h * 1.35) { flush(); para = t; return; }
    para = para.endsWith('-') && /[а-яa-z]$/i.test(para.slice(-2, -1)) ? para.slice(0, -1) + t : `${para} ${t}`;
  });
  flush();
  return out.join('\n\n');
}

// Notion's "Export → Markdown & CSV" (or HTML) is a zip of pages: their text in name order.
async function zipText(buf) {
  const entries = zipEntries(buf).filter(e => !e.name.endsWith('/') && !/(^|\/)(__MACOSX|\.)/.test(e.name));
  const pick = entries.filter(e => /\.(md|markdown|html?|txt|docx)$/i.test(e.name)).sort((a, b) => a.name.localeCompare(b.name));
  if (!pick.length) throw new Error('format');
  const parts = [];
  for (const e of pick) {
    const bytes = await e.bytes();
    const nm = e.name.toLowerCase();
    if (nm.endsWith('.docx')) parts.push(await docxText(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)));
    else if (/\.html?$/.test(nm)) parts.push(htmlToText(new DOMParser().parseFromString(decodeText(bytes), 'text/html').body));
    else if (/\.(md|markdown)$/.test(nm)) parts.push(cleanMarkdown(decodeText(bytes)));
    else parts.push(decodeText(bytes));
  }
  return parts.filter(Boolean).join('\n\n');
}

async function docxText(buf) {
  const xml = await unzipEntry(buf, 'word/document.xml');
  if (!xml) throw new Error('zip');
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const parse = s => new DOMParser().parseFromString(s, 'application/xml');
  // style id → heading level (ids are localized, the names are not: "heading 1", "Title")
  const levels = {};
  const stylesXml = await unzipEntry(buf, 'word/styles.xml');
  if (stylesXml) {
    for (const st of parse(stylesXml).getElementsByTagNameNS(W, 'style')) {
      const id = st.getAttributeNS(W, 'styleId') || st.getAttribute('w:styleId');
      const name = (st.getElementsByTagNameNS(W, 'name')[0]?.getAttributeNS(W, 'val') || st.getElementsByTagNameNS(W, 'name')[0]?.getAttribute('w:val') || '').toLowerCase();
      const m = /^heading (\d)/.exec(name);
      if (m) levels[id] = +m[1];
      else if (name === 'title') levels[id] = 1;
      else if (name === 'subtitle') levels[id] = 2;
    }
  }
  const attr = (el, n) => el?.getAttributeNS(W, n) || el?.getAttribute(`w:${n}`) || '';
  const out = [];
  for (const p of parse(xml).getElementsByTagNameNS(W, 'p')) {
    let s = '';
    const walk = node => {
      for (const c of node.childNodes) {
        if (c.namespaceURI !== W) { if (c.childNodes?.length) walk(c); continue; }
        if (c.localName === 't') s += c.textContent;
        else if (c.localName === 'tab') s += ' ';
        else if (c.localName === 'br' || c.localName === 'cr') s += ' ';
        else if (c.localName !== 'p' && c.localName !== 'pPr') walk(c);
      }
    };
    walk(p);
    s = s.replace(/\s+/g, ' ').trim();
    if (!s) { out.push(''); continue; }
    const pPr = p.getElementsByTagNameNS(W, 'pPr')[0];
    const style = attr(pPr?.getElementsByTagNameNS(W, 'pStyle')[0], 'val');
    const numPr = pPr?.getElementsByTagNameNS(W, 'numPr')[0];
    if (levels[style]) out.push(`${'#'.repeat(levels[style])} ${s}`);
    else if (numPr) out.push(`${'  '.repeat(+attr(numPr.getElementsByTagNameNS(W, 'ilvl')[0], 'val') || 0)}- ${s}`);
    else out.push(s);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Any file → text. The format is told by the name and, failing that, by the first bytes.
export async function readFile(file) {
  const name = file.name.toLowerCase();
  const ext = (/\.([a-z0-9]+)$/.exec(name) || [])[1] || '';
  const buf = await file.arrayBuffer();
  const head = new Uint8Array(buf, 0, Math.min(8, buf.byteLength));
  const isZip = head[0] === 0x50 && head[1] === 0x4b;
  const isPdf = head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46;
  if (ext === 'pdf' || isPdf) return pdfText(buf);
  if (ext === 'docx' || ext === 'dotx') return docxText(buf);
  if (ext === 'odt') return odtText(buf);
  if (isZip) {
    const names = zipEntries(buf).map(e => e.name);
    if (names.includes('word/document.xml')) return docxText(buf);
    if (names.includes('content.xml')) return odtText(buf);
    return zipText(buf);
  }
  if (ext === 'doc' || (head[0] === 0xd0 && head[1] === 0xcf)) throw new Error('doc');
  const text = decodeText(new Uint8Array(buf));
  if (ext === 'rtf' || text.startsWith('{\\rtf')) return rtfText(text);
  if (/^html?$/.test(ext) || /^\s*<(!doctype html|html)/i.test(text)) return htmlToText(new DOMParser().parseFromString(text, 'text/html').body);
  if (/^(md|markdown)$/.test(ext)) return cleanMarkdown(text);
  if (text.includes('\u0000')) throw new Error('format');
  return text;
}

// Whatever was pasted or typed into the add box: a Google Docs link, or the text itself.
export const isGoogleLink = s => !!googleDocId(s.trim()) && !/\s/.test(s.trim());

export const titleFrom = (name, text) =>
  (name || '').replace(/\.[^.]+$/, '').trim() || (text.trim().split('\n')[0] || '').replace(/^#+\s*/, '').slice(0, 60).trim();
