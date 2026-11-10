// Поздравление с днём рождения на весь экран: фото, имя, салют, конфетти и яйца-шарики.
// Модуль грузится, только когда у кого-то сегодня день рождения, поэтому живёт отдельно от app.js.

const EGG_COLORS = ['#6FA8FF', '#FFB347', '#A58BFF', '#FF6F91', '#FFFFFF', '#6BE3B4', '#5ED0F0', '#FF8A5B', '#FFC531'];
const pick = a => a[Math.floor(Math.random() * a.length)];
const rand = (a, b) => a + Math.random() * (b - a);

const CSS = `
.bday { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; overflow: hidden;
  background: radial-gradient(ellipse at 50% 40%, #1d1640 0%, #0b0a18 60%, #050509 100%); color: #fff;
  font-family: Onest, system-ui, sans-serif; animation: bday-in .5s ease both; }
.bday.out { animation: bday-out .45s ease both; }
.bday canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.bday-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 24px; text-align: center; pointer-events: none; }
.bday-photo { --s: min(220px, 52vw); position: relative; width: var(--s); height: var(--s); flex: none; animation: bday-pop .9s cubic-bezier(.2, 1.6, .4, 1) .2s both; }
.bday-ring, .bday-ring::after { position: absolute; inset: 0; border-radius: 50%;
  background: conic-gradient(from 0deg, ${EGG_COLORS.join(', ')}, ${EGG_COLORS[0]}); }
.bday-ring { animation: bday-spin 6s linear infinite; }
.bday-ring::after { content: ''; inset: -14px; filter: blur(26px); opacity: .55; z-index: -1; }
.bday-photo img { position: absolute; inset: 6px; width: calc(100% - 12px); height: calc(100% - 12px); border-radius: 50%; object-fit: cover; border: 4px solid #0b0a18; box-sizing: border-box; }
.bday-cap { position: absolute; top: -30px; right: -6px; font-size: 54px; line-height: 1; rotate: 14deg; animation: bday-drop .8s cubic-bezier(.2, 1.4, .4, 1) 1s both; }
.bday-hi { font-size: clamp(18px, 4vw, 24px); font-weight: 600; opacity: .85; animation: bday-up .7s ease .7s both; }
.bday-name { margin: 0; font-size: clamp(38px, 9vw, 76px); font-weight: 800; line-height: 1.05; letter-spacing: -.02em;
  background: linear-gradient(90deg, #FFC531, #FF6F91, #A58BFF, #6FA8FF, #6BE3B4, #FFC531); background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent; animation: bday-up .8s ease .9s both, bday-shine 4s linear infinite; }
.bday-wish { max-width: 30em; font-size: clamp(15px, 3.4vw, 18px); line-height: 1.5; opacity: .8; animation: bday-up .7s ease 1.2s both; }
.bday-ok { pointer-events: auto; margin-top: 10px; padding: 13px 34px; border: 0; border-radius: 999px; background: #fff; color: #111;
  font: 700 16px Onest, system-ui, sans-serif; cursor: pointer; animation: bday-up .7s ease 1.6s both; box-shadow: 0 10px 40px rgba(255, 197, 49, .35); }
.bday-ok:hover { transform: translateY(-2px); }
.bday-ok:focus-visible { outline: 3px solid #FFC531; outline-offset: 3px; }
@keyframes bday-in { from { opacity: 0; } }
@keyframes bday-out { to { opacity: 0; } }
@keyframes bday-pop { from { scale: 0; } }
@keyframes bday-spin { to { rotate: 360deg; } }
@keyframes bday-drop { from { translate: 0 -120px; opacity: 0; } }
@keyframes bday-up { from { translate: 0 24px; opacity: 0; } }
@keyframes bday-shine { to { background-position: 200% 0; } }
@media (prefers-reduced-motion: reduce) { .bday *, .bday { animation-duration: .01s !important; animation-iteration-count: 1 !important; } }
`;

export function celebrate({ name, photo, lang = 'ru' }) {
  if (document.querySelector('.bday')) return;
  const en = lang === 'en';
  if (!document.getElementById('bday-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'bday-css', textContent: CSS }));
  const root = document.createElement('div');
  root.className = 'bday';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', en ? 'Happy birthday' : 'С днём рождения');
  root.innerHTML = `
    <canvas aria-hidden="true"></canvas>
    <div class="bday-card">
      ${photo ? '<div class="bday-photo"><span class="bday-ring"></span><img alt=""><span class="bday-cap" aria-hidden="true">🥳</span></div>' : ''}
      <div class="bday-hi">${en ? 'Happy birthday,' : 'С днём рождения,'}</div>
      <h1 class="bday-name"></h1>
      <p class="bday-wish">${en
        ? 'Yaytsa Cloud wishes you bug-free releases, crazy ideas and tons of downloads! 🎉'
        : 'Яйца Cloud желает релизов без багов, безумных идей и миллиона скачиваний! 🎉'}</p>
      <button type="button" class="bday-ok">${en ? 'Thank you!' : 'Спасибо!'}</button>
    </div>`;
  root.querySelector('.bday-name').textContent = name;
  if (photo) root.querySelector('.bday-photo img').src = photo;
  document.body.append(root);
  const ok = root.querySelector('.bday-ok');
  ok.focus({ preventScroll: true });

  const stop = runSky(root.querySelector('canvas'));
  const close = () => {
    root.classList.add('out');
    removeEventListener('keydown', onKey);
    setTimeout(() => { stop(); root.remove(); }, 450);
  };
  const onKey = e => { if (e.key === 'Escape') close(); };
  addEventListener('keydown', onKey);
  ok.addEventListener('click', close);
  return close;
}

// Салют, конфетти и яйца на холсте. Клик по фону — ещё один залп в эту точку.
function runSky(canvas) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w, h;
  const size = () => {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  addEventListener('resize', size);

  const rockets = [], sparks = [], confetti = [], eggs = [];
  const burst = (x, y, color = pick(EGG_COLORS)) => {
    const n = still ? 0 : 70;
    const ring = Math.random() < .35; // иногда ровное кольцо вместо россыпи
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const v = ring ? 4.2 : rand(1, 5.5);
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(55, 85), max: 85, color: Math.random() < .25 ? '#fff' : color });
    }
  };
  const launch = () => rockets.push({ x: rand(w * .15, w * .85), y: h, vx: rand(-1, 1), vy: rand(-11, -8), color: pick(EGG_COLORS) });
  const addConfetti = (count) => {
    for (let i = 0; i < count; i++) confetti.push({
      x: rand(0, w), y: rand(-h, -10), vy: rand(1.2, 3), vx: rand(-.6, .6), r: rand(0, Math.PI), vr: rand(-.12, .12),
      s: rand(6, 11), color: pick(EGG_COLORS),
    });
  };
  const addEgg = () => eggs.push({ x: rand(0, w), y: h + 60, vy: rand(.7, 1.4), sway: rand(0, 6.28), s: rand(22, 38), color: pick(EGG_COLORS) });

  const onClick = e => { if (e.target === canvas) burst(e.clientX, e.clientY); };
  canvas.parentElement.addEventListener('click', onClick);

  if (still) return () => removeEventListener('resize', size);

  addConfetti(140);
  for (let i = 0; i < 6; i++) setTimeout(launch, 300 + i * 260);
  let t = 0, raf;
  const frame = () => {
    t++;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    if (t % 38 === 0) launch();
    if (t % 70 === 0 && eggs.length < 14) addEgg();
    if (t % 240 === 0 && confetti.length < 120) addConfetti(60);

    // Яйца поднимаются, как воздушные шарики, с ниточкой.
    for (let i = eggs.length - 1; i >= 0; i--) {
      const e = eggs[i];
      e.y -= e.vy; e.sway += .02;
      const x = e.x + Math.sin(e.sway) * 14;
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, e.y + e.s * .62); ctx.quadraticCurveTo(x + 8, e.y + e.s * 1.4, x, e.y + e.s * 2.1); ctx.stroke();
      ctx.fillStyle = e.color;
      ctx.beginPath(); ctx.ellipse(x, e.y, e.s * .48, e.s * .62, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.45)';
      ctx.beginPath(); ctx.ellipse(x - e.s * .17, e.y - e.s * .22, e.s * .1, e.s * .17, -.4, 0, Math.PI * 2); ctx.fill();
      if (e.y < -e.s * 3) eggs.splice(i, 1);
    }

    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.y += c.vy; c.x += c.vx + Math.sin((t + i) * .03) * .5; c.r += c.vr;
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.r);
      ctx.fillStyle = c.color; ctx.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2 * Math.abs(Math.cos(c.r * 2)) + 1);
      ctx.restore();
      if (c.y > h + 20) confetti.splice(i, 1);
    }

    ctx.globalCompositeOperation = 'lighter';
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += r.vx; r.y += r.vy; r.vy += .14;
      ctx.fillStyle = r.color;
      ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,220,150,.35)';
      ctx.beginPath(); ctx.arc(r.x - r.vx * 2, r.y - r.vy * 2, 1.6, 0, Math.PI * 2); ctx.fill();
      if (r.vy >= -1.2) { burst(r.x, r.y, r.color); rockets.splice(i, 1); }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vx *= .975; s.vy = s.vy * .975 + .06; s.life--;
      ctx.globalAlpha = Math.max(0, s.life / s.max);
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
      if (s.life <= 0) sparks.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
}
