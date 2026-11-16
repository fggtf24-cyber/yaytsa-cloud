// Getting a script in: a Google Docs link, a .docx / .txt / .md file, or pasted text.

// docs.google.com/document/d/<id>/... → plain text through the export link.
// The document must be open to "Anyone with the link".
export function googleDocId(url) {
  const m = /docs\.google\.com\/document\/(?:u\/\d+\/)?d\/([\w-]{20,})/.exec(url || '');
  return m ? m[1] : null;
}

export async function fetchGoogleDoc(id) {
  let res;
  try {
    res = await fetch(`https://docs.google.com/document/d/${id}/export?format=txt`, { credentials: 'omit', cache: 'no-store' });
  } catch {
    throw new Error('closed'); // a private document answers with a sign-in page that the browser blocks
  }
  if (!res.ok) throw new Error(res.status === 404 ? 'notfound' : 'closed');
  const text = (await res.text()).replace(/^﻿/, '');
  if (/^\s*<!doctype html/i.test(text)) throw new Error('closed');
  return text;
}

// A .docx is a zip; only word/document.xml is needed. A tiny zip reader with the browser's
// own inflate (DecompressionStream) instead of a library.
async function unzipEntry(buf, name) {
  const v = new DataView(buf);
  let eocd = -1;
  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) {
    if (v.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('zip');
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const dec = new TextDecoder();
  for (let n = 0; n < count; n++) {
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true), extra = v.getUint16(p + 30, true), comment = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const entry = dec.decode(new Uint8Array(buf, p + 46, nameLen));
    if (entry === name) {
      const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      const data = new Uint8Array(buf, start, size);
      if (method === 0) return dec.decode(data);
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return new Response(stream).text();
    }
    p += 46 + nameLen + extra + comment;
  }
  throw new Error('zip');
}

async function docxText(buf) {
  const xml = await unzipEntry(buf, 'word/document.xml');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const out = [];
  for (const p of doc.getElementsByTagNameNS(W, 'p')) {
    let s = '';
    const walk = node => {
      for (const c of node.childNodes) {
        if (c.namespaceURI !== W) { if (c.childNodes?.length) walk(c); continue; }
        if (c.localName === 't') s += c.textContent;
        else if (c.localName === 'tab') s += ' ';
        else if (c.localName === 'br' || c.localName === 'cr') s += '\n';
        else if (c.localName !== 'p') walk(c);
      }
    };
    walk(p);
    out.push(s);
  }
  return out.join('\n');
}

export async function readFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx')) return docxText(await file.arrayBuffer());
  if (name.endsWith('.doc') || name.endsWith('.pdf')) throw new Error('format');
  return (await file.text()).replace(/^﻿/, '');
}

export const titleFrom = (name, text) =>
  (name || '').replace(/\.[^.]+$/, '').trim() || (text.trim().split('\n')[0] || '').slice(0, 60).trim();
