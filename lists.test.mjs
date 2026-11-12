// Проверка списков в постах: node lists.test.mjs
import { readFileSync } from 'fs';
import assert from 'assert';
const src = readFileSync(new URL('./social.js', import.meta.url), 'utf8');
const grab = name => src.slice(src.indexOf(`  function ${name}(`), src.indexOf('\n  }\n', src.indexOf(`  function ${name}(`)) + 4);
const rich = s => s; // разметку упоминаний здесь не проверяем
const richBlocks = eval(`(${grab('richBlocks')})`), continueList = eval(`(${grab('continueList')})`);
assert.equal(richBlocks('Привет\n\n- раз\n- два\n\n---\n3. три\n4. четыре\nконец'),
  'Привет<ul class="r-list-ul"><li>раз</li><li>два</li></ul><hr class="r-hr"><ol class="r-list-ol" start="3"><li>три</li><li>четыре</li></ol>конец');
assert.equal(richBlocks('просто текст\n-не список'), 'просто текст\n-не список');
const ta = (value, pos = value.length) => ({ value, selectionStart: pos, selectionEnd: pos, dispatchEvent() {},
  setRangeText(t, a, b) { this.value = this.value.slice(0, a) + t + this.value.slice(b); this.selectionStart = this.selectionEnd = a + t.length; } });
let t = ta('x\n1. первый'); assert(continueList(t)); assert.equal(t.value, 'x\n1. первый\n2. ');
t = ta('- а\n- '); assert(continueList(t)); assert.equal(t.value, '- а\n');
assert(!continueList(ta('обычная строка')));
console.log('ok');
