// Проверка firestore.rules на эмуляторе (нужны Java 21+, firebase-tools, firebase и @firebase/rules-unit-testing):
// firebase emulators:exec --project demo-yaytsa --only firestore "node firestore.rules.test.mjs"
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, writeBatch, collection, query, where, serverTimestamp, deleteField, increment } from 'firebase/firestore';

const env = await initializeTestEnvironment({
  projectId: 'demo-yaytsa',
  firestore: { rules: readFileSync(new URL('./firestore.rules', import.meta.url), 'utf8'), host: '127.0.0.1', port: 8080 },
});
const ADMIN = 'admin@test.dev';
const google = (email) => ({ email, email_verified: true, firebase: { sign_in_provider: 'google.com' } });
const as = (uid, token = { email: `${uid}@t.dev`, firebase: { sign_in_provider: 'password' } }) => env.authenticatedContext(uid, token).firestore();
const alice = as('alice'), bob = as('bob'), admin = as('adm', google(ADMIN)), anon = env.unauthenticatedContext().firestore();

await env.withSecurityRulesDisabled(async c => {
  const db = c.firestore();
  await setDoc(doc(db, 'admins', ADMIN), {});
  for (const u of ['alice', 'bob', 'adm']) await setDoc(doc(db, 'profiles', u), { username: u, name: u, photo: '', bio: '', createdAt: new Date() });
  await setDoc(doc(db, 'posts', 'p0'), { uid: 'bob', title: 't', body: '', appId: '', score: 0, commentCount: 0, createdAt: new Date() });
});

let n = 0;
const ok = async (name, p) => { await assertSucceeds(p); n++; console.log('  ok  ', name); };
const no = async (name, p) => { await assertFails(p); n++; console.log('  deny', name); };

// Самоапвоут
const post = (db, id, uid, score = 1) => { const b = writeBatch(db);
  b.set(doc(db, 'posts', id), { uid, title: 'x', body: '', appId: '', score, commentCount: 0, createdAt: serverTimestamp() });
  b.set(doc(db, 'votes', `p_${id}_${uid}`), { uid, kind: 'p', target: id, v: 1 }); return b.commit(); };
await ok('пост со своим голосом', post(alice, 'p1', 'alice'));
await no('счёт 5 при создании', post(alice, 'p2', 'alice', 5));
await no('счёт 1 без голоса', setDoc(doc(alice, 'posts', 'p3'), { uid: 'alice', title: 'x', body: '', appId: '', score: 1, commentCount: 0, createdAt: serverTimestamp() }));
await ok('старый клиент: счёт 0', setDoc(doc(alice, 'posts', 'p4'), { uid: 'alice', title: 'x', body: '', appId: '', score: 0, commentCount: 0, createdAt: serverTimestamp() }));
const comment = (db, id, uid, extra = {}, body = 'hi') => { const b = writeBatch(db);
  b.set(doc(db, 'tcomments', id), { postId: 'p0', parentId: '', uid, body, score: 1, deleted: false, createdAt: serverTimestamp(), ...extra });
  b.set(doc(db, 'votes', `c_${id}_${uid}`), { uid, kind: 'c', target: id, v: 1 });
  b.update(doc(db, 'posts', 'p0'), { commentCount: increment(1) }); return b.commit(); };
await ok('комментарий со своим голосом', comment(alice, 'c1', 'alice'));
await ok('только картинка', comment(alice, 'c2', 'alice', { image: 'data:image/gif;base64,AAAA' }, ''));
await no('пустой без картинки', comment(alice, 'c3', 'alice', {}, ''));
await no('картинка больше лимита', comment(alice, 'c4', 'alice', { image: 'x'.repeat(800001) }));
{ const b = writeBatch(alice); b.set(doc(alice, 'votes', 'c_c1_alice'), { uid: 'alice', kind: 'c', target: 'c1', v: 0 }); b.update(doc(alice, 'tcomments', 'c1'), { score: increment(-1) });
  await ok('снять свой голос', b.commit()); }
await ok('удалить свой с картинкой (мягко)', updateDoc(doc(alice, 'tcomments', 'c2'), { body: '', deleted: true, image: deleteField(), editedAt: serverTimestamp() }));
await no('подменить картинку', comment(bob, 'c5', 'bob', { image: 'data:image/gif;base64,AAAA' }).then(() => updateDoc(doc(bob, 'tcomments', 'c5'), { image: 'data:image/gif;base64,BBBB', editedAt: serverTimestamp() })));
await ok('админ стирает чужой', updateDoc(doc(admin, 'tcomments', 'c5'), { body: '', deleted: true, image: deleteField() }));

await ok('комментарий-стикер', comment(alice, 'cs1', 'alice', { sticker: 'laugh' }, ''));
await no('слишком длинный стикер', comment(alice, 'cs2', 'alice', { sticker: 'x'.repeat(21) }, ''));
await ok('стикер стирается с комментарием', updateDoc(doc(alice, 'tcomments', 'cs1'), { body: '', deleted: true, sticker: deleteField(), editedAt: serverTimestamp() }));
{ const b = writeBatch(alice); const id = ['alice', 'bob'].sort().join('_');
  b.set(doc(alice, 'chats', id), { members: ['alice', 'bob'], lastText: 'Стикер', lastFrom: 'alice', lastAt: serverTimestamp(), seen: {} });
  b.set(doc(collection(alice, 'chats', id, 'msgs')), { from: 'alice', text: '', sticker: 'love', createdAt: serverTimestamp() });
  await ok('стикер в личке', b.commit()); }
const media = (db, chat, id, uid, kind, withFile = true) => { const b = writeBatch(db);
  b.set(doc(db, 'chats', chat, 'msgs', id), { from: uid, text: '', media: kind, ...(kind === 'voice' ? { secs: 5 } : { ratio: 1.5 }), createdAt: serverTimestamp() });
  if (withFile) b.set(doc(db, 'chats', chat, 'media', id), { from: uid, data: 'data:image/jpeg;base64,AA' }); return b.commit(); };
await ok('фото в личке', media(alice, 'alice_bob', 'm1', 'alice', 'image'));
await ok('голосовое в личке', media(alice, 'alice_bob', 'm2', 'alice', 'voice'));
{ const b = writeBatch(alice); const id = 'm5';
  b.set(doc(alice, 'chats', 'alice_bob', 'msgs', id), { from: 'alice', text: '', media: 'voice', secs: 90, parts: 2, createdAt: serverTimestamp() });
  b.set(doc(alice, 'chats', 'alice_bob', 'media', id), { from: 'alice', data: 'AA' });
  b.set(doc(alice, 'chats', 'alice_bob', 'media', id + '_1'), { from: 'alice', data: 'BB' });
  await ok('длинное голосовое частями', b.commit()); }
await no('отметка без файла', media(alice, 'alice_bob', 'm3', 'alice', 'image', false));
await no('чужой тип файла', media(alice, 'alice_bob', 'm4', 'alice', 'video'));
await ok('собеседник видит файл', getDoc(doc(bob, 'chats', 'alice_bob', 'media', 'm1')));
await no('посторонний не видит файл', getDoc(doc(admin, 'chats', 'alice_bob', 'media', 'm1')));
await no('пустое сообщение', setDoc(doc(collection(alice, 'chats', 'alice_bob', 'msgs')), { from: 'alice', text: '', createdAt: serverTimestamp() }));

await ok('отмечаю себя в сети', setDoc(doc(alice, 'presence', 'alice'), { at: serverTimestamp() }));
await no('время нельзя подделать', setDoc(doc(alice, 'presence', 'alice'), { at: new Date(2030, 0, 1) }));
await no('за другого нельзя', setDoc(doc(bob, 'presence', 'alice'), { at: serverTimestamp() }));
await ok('статус видят все', getDoc(doc(anon, 'presence', 'alice')));

// Группы
const group = (db, id, owner, members, extra = {}) => setDoc(doc(db, 'chats', id), { group: true, name: 'Яйца', owner, members, lastText: '', lastFrom: owner, lastAt: serverTimestamp(), seen: {}, ...extra });
await ok('создаю группу', group(alice, 'g1', 'alice', ['alice', 'bob', 'adm']));
await no('группа за чужого создателя', group(alice, 'g2', 'bob', ['alice', 'bob']));
await no('группа без меня', group(alice, 'g3', 'alice', ['bob', 'adm']));
await no('группа без названия', group(alice, 'g4', 'alice', ['alice', 'bob'], { name: '' }));
await ok('участник пишет в группу', (() => { const b = writeBatch(bob);
  b.update(doc(bob, 'chats', 'g1'), { lastText: 'hi', lastFrom: 'bob', lastAt: serverTimestamp() });
  b.set(doc(collection(bob, 'chats', 'g1', 'msgs')), { from: 'bob', text: 'hi', createdAt: serverTimestamp() }); return b.commit(); })());
await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'profiles', 'eve'), { username: 'eve', name: 'e', photo: '', bio: '', createdAt: new Date() }));
const eve = as('eve');
await no('чужой не читает группу', getDoc(doc(eve, 'chats', 'g1')));
await no('чужой не читает сообщения', getDocs(collection(eve, 'chats', 'g1', 'msgs')));
await no('чужой не пишет в группу', setDoc(doc(collection(eve, 'chats', 'g1', 'msgs')), { from: 'eve', text: 'x', createdAt: serverTimestamp() }));
await no('участник не меняет состав', updateDoc(doc(bob, 'chats', 'g1'), { members: ['bob', 'adm', 'eve', 'alice'] }));
await ok('создатель меняет название и фото', updateDoc(doc(alice, 'chats', 'g1'), { name: 'Новые яйца', photo: 'data:image/jpeg;base64,AA' }));
await no('участник не меняет название', updateDoc(doc(bob, 'chats', 'g1'), { name: 'Моё' }));
await no('фото слишком большое', updateDoc(doc(alice, 'chats', 'g1'), { photo: 'x'.repeat(100001) }));
await ok('создатель добавляет', updateDoc(doc(alice, 'chats', 'g1'), { members: ['alice', 'bob', 'adm', 'eve'] }));
await ok('участник выходит', updateDoc(doc(bob, 'chats', 'g1'), { members: ['alice', 'adm', 'eve'] }));
await no('вышедший не читает', getDoc(doc(bob, 'chats', 'g1')));
await no('участник не удаляет группу', deleteDoc(doc(eve, 'chats', 'g1')));
{ let msgs; await env.withSecurityRulesDisabled(async c => { msgs = await getDocs(collection(c.firestore(), 'chats', 'g1', 'msgs')); });
  await no('участник не удаляет сообщения', deleteDoc(doc(eve, 'chats', 'g1', 'msgs', msgs.docs[0].id)));
  await ok('создатель удаляет сообщения', deleteDoc(doc(alice, 'chats', 'g1', 'msgs', msgs.docs[0].id))); }
await ok('создатель удаляет группу', deleteDoc(doc(alice, 'chats', 'g1')));
await no('личный чат не удалить', deleteDoc(doc(alice, 'chats', 'alice_bob')));

// Комментарий к программе
const ac = (db, uid, likedBy, extra = {}) => setDoc(doc(collection(db, 'comments')), { appId: 'a', uid, name: 'n', photo: '', text: 'x', createdAt: serverTimestamp(), likedBy, ...extra });
await ok('свой лайк сразу', ac(alice, 'alice', ['alice']));
await no('чужой лайк при создании', ac(alice, 'alice', ['bob']));
await ok('картинка без текста', ac(alice, 'alice', ['alice'], { text: '', image: 'data:image/png;base64,AA' }));

// Удаление ответа на удалённый пост
await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'tcomments', 'orph'), { postId: 'gone', parentId: '', uid: 'bob', body: 'x', score: 0, deleted: false, createdAt: new Date() }));
await ok('комментарий к удалённому посту стирается', deleteDoc(doc(bob, 'tcomments', 'orph')));
await no('живой чужой стереть нельзя', deleteDoc(doc(bob, 'tcomments', 'c1')));

// Логин
const name = (db, uid, u) => { const b = writeBatch(db); b.set(doc(db, 'usernames', u), { uid }); b.update(doc(db, 'profiles', uid), { username: u }); return b.commit(); };
await ok('логин из 1 символа', name(alice, 'alice', 'a'));
await no('everyone занято', name(bob, 'bob', 'everyone'));
await ok('шапка и соцсети', updateDoc(doc(alice, 'profiles', 'alice'), { banner: 'data:image/jpeg;base64,AA', links: { youtube: 'https://youtube.com/@a' } }));
await no('чужой профиль', updateDoc(doc(bob, 'profiles', 'alice'), { banner: '' }));

// Картинка поста
const imgPost = (db, id, uid, withImage = true) => { const b = writeBatch(db);
  b.set(doc(db, 'posts', id), { uid, title: 'x', body: '', appId: '', score: 1, commentCount: 0, imageRatio: 1.5, createdAt: serverTimestamp() });
  b.set(doc(db, 'votes', `p_${id}_${uid}`), { uid, kind: 'p', target: id, v: 1 });
  if (withImage) b.set(doc(db, 'postimages', id), { uid, image: 'data:image/jpeg;base64,AA' }); return b.commit(); };
await ok('пост с картинкой', imgPost(alice, 'pi1', 'alice'));
await no('отметка картинки без картинки', imgPost(alice, 'pi2', 'alice', false));
await ok('картинку видят все', getDoc(doc(anon, 'postimages', 'pi1')));
await no('картинка к чужому посту', setDoc(doc(bob, 'postimages', 'p1'), { uid: 'bob', image: 'x' }));
await no('чужую картинку не удалить', deleteDoc(doc(bob, 'postimages', 'pi1')));
await ok('автор удаляет пост', deleteDoc(doc(alice, 'posts', 'pi1')));
await ok('автор удаляет картинку', deleteDoc(doc(alice, 'postimages', 'pi1')));

// Заявка и селфи
const sub = (db, id, uid, selfie = true, consent = true) => { const b = writeBatch(db);
  b.set(doc(db, 'submissions', id), { uid, status: 'pending', createdAt: serverTimestamp(), icon: '', name: 'App', desc: 'd', file: 'https://x.dev/a.exe', size: '', features: [], needs: [], site: '', repo: '', demo: '', review: 'https://youtu.be/dQw4w9WgXcQ', coauthors: ['bob'], selfiePublic: consent });
  if (selfie) b.set(doc(db, 'selfies', id), { uid, image: 'data:image/jpeg;base64,AA' }); return b.commit(); };
await no('заявка без селфи', sub(alice, 's0', 'alice', false));
await no('заявка без согласия', sub(alice, 's00', 'alice', true, false));
await ok('заявка с селфи', sub(alice, 's1', 'alice'));
await no('файл не https', (() => { const b = writeBatch(alice); b.set(doc(alice, 'submissions', 's2'), { uid: 'alice', status: 'pending', selfiePublic: true, createdAt: serverTimestamp(), name: 'A', desc: 'd', file: 'http://x.dev/a.exe' }); b.set(doc(alice, 'selfies', 's2'), { uid: 'alice', image: 'x' }); return b.commit(); })());
await no('сразу approved', (() => { const b = writeBatch(alice); b.set(doc(alice, 'submissions', 's3'), { uid: 'alice', status: 'approved', selfiePublic: true, createdAt: serverTimestamp(), name: 'A', desc: 'd', file: 'https://x.dev/a.exe' }); b.set(doc(alice, 'selfies', 's3'), { uid: 'alice', image: 'x' }); return b.commit(); })());
await no('селфи чужому', getDoc(doc(bob, 'selfies', 's1')));
await no('селфи анониму', getDoc(doc(anon, 'selfies', 's1')));
await no('заявка чужому', getDoc(doc(bob, 'submissions', 's1')));
await ok('автор видит свои', getDocs(query(collection(alice, 'submissions'), where('uid', '==', 'alice'))));
await ok('админ видит селфи', getDoc(doc(admin, 'selfies', 's1')));
await ok('админ видит все заявки', getDocs(collection(admin, 'submissions')));
await no('автор сам себя одобряет', updateDoc(doc(alice, 'submissions', 's1'), { status: 'approved' }));
await no('автор пишет в каталог', setDoc(doc(alice, 'apps', 's1'), { name: 'x', community: true }));
{ const b = writeBatch(admin); b.set(doc(admin, 'apps', 's1'), { name: 'App', community: true, authorUid: 'alice' }); b.update(doc(admin, 'submissions', 's1'), { status: 'approved', reason: '' });
  await ok('админ одобряет', b.commit()); }
await ok('после одобрения селфи видно анониму', getDoc(doc(anon, 'selfies', 's1')));
await ok('и другому пользователю', getDoc(doc(bob, 'selfies', 's1')));
const note = (db, from, to, type, appId, id = 'n' + n) => setDoc(doc(db, 'notifications', id), { to, from, fromName: 'A', type, appId, commentId: 's1', text: 'App', createdAt: serverTimestamp(), read: false });
await ok('админ шлёт решение', note(admin, 'adm', 'alice', 'mod', 's1'));
await no('обычный не шлёт решение', note(bob, 'bob', 'alice', 'mod', 's1'));
await ok('автор удаляет заявку и селфи', (() => { const b = writeBatch(alice); b.delete(doc(alice, 'submissions', 's1')); b.delete(doc(alice, 'selfies', 's1')); return b.commit(); })());
await no('удалённое селфи больше не читается', getDoc(doc(anon, 'selfies', 's1')));

// Кто зарегистрировался
const acc = (db, uid, email, provider) => setDoc(doc(db, 'accounts', uid), { email, provider, created: 'Sat, 07 Nov 2026 00:00:00 GMT', lastSeen: serverTimestamp() });
await ok('пишу о себе', acc(alice, 'alice', 'alice@t.dev', 'password'));
await ok('повторный вход', acc(alice, 'alice', 'alice@t.dev', 'password'));
await no('чужая почта', acc(bob, 'bob', 'alice@t.dev', 'password'));
await no('пишу за другого', acc(bob, 'alice', 'bob@t.dev', 'password'));
await no('список почт обычному', getDocs(collection(bob, 'accounts')));
await no('почта анониму', getDoc(doc(anon, 'accounts', 'alice')));
await ok('список почт админу', getDocs(collection(admin, 'accounts')));

// @everyone
const cast = (db, uid, id) => { const b = writeBatch(db);
  b.set(doc(db, 'posts', id), { uid, title: '@everyone', body: '', appId: '', score: 1, commentCount: 0, createdAt: serverTimestamp() });
  b.set(doc(db, 'votes', `p_${id}_${uid}`), { uid, kind: 'p', target: id, v: 1 });
  b.set(doc(db, 'broadcasts', id), { from: uid, fromName: 'A', title: 't', createdAt: serverTimestamp() }); return b.commit(); };
await ok('админ тегает всех', cast(admin, 'adm', 'b1'));
await no('обычный не тегает всех', cast(bob, 'bob', 'b2'));
await ok('все читают', getDocs(collection(anon, 'broadcasts')));

await env.cleanup();
assert.ok(n > 30);
console.log(`\nвсе проверки прошли: ${n}`);
