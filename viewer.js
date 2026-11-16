// Просмотр картинок поверх страницы, как в Telegram: колесо и щипок приближают к точке под курсором,
// двойной клик — 1× ↔ 2.5×, приближенную картинку двигают мышью или пальцем, ← → листают соседние картинки.
// list — все картинки, между которыми можно листать; start — с какой открыть.
// Картинка из data: сохраняется и копируется прямо из src; для остальных кнопки копирования нет.

const MAX = 8;

export function openImage(list, start, T, { avatar = false } = {}) {
  if (!Array.isArray(list)) list = [list];
  let index = Math.max(0, list.indexOf(start));
  const dlg = document.createElement('dialog');
  dlg.className = 'r-view zoom';
  dlg.innerHTML = `
    <div class="r-view-bar">
      <span class="r-view-count" hidden></span>
      <button type="button" data-view-copy>${T('Скопировать')}</button>
      <a data-view-save>${T('Сохранить')}</a>
      <button type="button" data-view-close aria-label="${T('Закрыть')}">×</button>
    </div>
    <button type="button" class="r-view-nav prev" data-view-prev aria-label="${T('Предыдущая')}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button type="button" class="r-view-nav next" data-view-next aria-label="${T('Следующая')}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="r-view-stage"><img alt="" draggable="false"></div>`;
  const stage = dlg.querySelector('.r-view-stage');
  const image = stage.querySelector('img');
  const copy = dlg.querySelector('[data-view-copy]');
  const save = dlg.querySelector('[data-view-save]');
  const count = dlg.querySelector('.r-view-count');
  // Аватарка маленькая (256 px): показываем её крупно, а не крошечным квадратом посреди экрана.
  image.classList.toggle('avatar', avatar);

  let s = 1, tx = 0, ty = 0;
  const apply = (smooth = false) => {
    image.classList.toggle('smooth', smooth);
    image.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    dlg.classList.toggle('zoomed', s > 1.01);
  };
  // Не даём увести картинку за край: край картинки не заходит внутрь экрана, пока она больше экрана.
  const clamp = () => {
    const w = image.offsetWidth * s, h = image.offsetHeight * s;
    const mx = Math.max(0, (w - stage.clientWidth) / 2), my = Math.max(0, (h - stage.clientHeight) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  };
  // Точка экрана (x, y) остаётся под курсором при смене масштаба.
  const zoomAt = (next, x, y, smooth) => {
    next = Math.min(MAX, Math.max(1, next));
    const r = stage.getBoundingClientRect();
    const px = x - r.left - r.width / 2, py = y - r.top - r.height / 2;
    tx = px - (px - tx) * next / s;
    ty = py - (py - ty) * next / s;
    s = next;
    if (s === 1) tx = ty = 0;
    clamp();
    apply(smooth);
  };

  const show = i => {
    index = (i + list.length) % list.length;
    const src = list[index].currentSrc || list[index].src;
    image.src = src;
    image.alt = list[index].alt || '';
    s = 1; tx = ty = 0;
    apply();
    const dataUrl = /^data:image\/(\w+);/.exec(src);
    save.href = src;
    save.download = `yaytsa-cloud.${dataUrl ? dataUrl[1].replace('jpeg', 'jpg') : 'png'}`;
    save.hidden = !dataUrl;
    copy.hidden = !dataUrl;
    copy.textContent = T('Скопировать');
    const many = list.length > 1;
    count.hidden = !many;
    count.textContent = `${index + 1} / ${list.length}`;
    dlg.querySelectorAll('.r-view-nav').forEach(b => { b.hidden = !many; });
  };

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

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    zoomAt(s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025)), e.clientX, e.clientY);
  }, { passive: false });
  stage.addEventListener('dblclick', e => {
    if (e.target !== image) return;
    zoomAt(s > 1.01 ? 1 : 2.5, e.clientX, e.clientY, true);
  });

  // Перетаскивание и щипок двумя пальцами. moved — чтобы отпускание после перетаскивания не закрыло окно.
  const pointers = new Map();
  let pan = null, pinch = null, moved = false, lastTap = 0;
  stage.addEventListener('pointerdown', e => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.setPointerCapture(e.pointerId);
    moved = false;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s };
      pan = null;
    } else pan = { x: e.clientX, y: e.clientY, tx, ty };
    // Двойное касание пальцем — то же, что двойной клик.
    if (e.pointerType === 'touch' && pointers.size === 1) {
      if (Date.now() - lastTap < 300 && e.target === image) { zoomAt(s > 1.01 ? 1 : 2.5, e.clientX, e.clientY, true); lastTap = 0; }
      else lastTap = Date.now();
    }
  });
  stage.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      zoomAt(pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, (a.x + b.x) / 2, (a.y + b.y) / 2);
      moved = true;
    } else if (pan) {
      const dx = e.clientX - pan.x, dy = e.clientY - pan.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      if (s > 1.01) { tx = pan.tx + dx; ty = pan.ty + dy; clamp(); apply(); }
    }
  });
  const up = e => {
    // Свайп вбок без приближения листает, как в галерее телефона.
    if (pan && !pinch && s <= 1.01 && list.length > 1 && pointers.size === 1) {
      const dx = e.clientX - pan.x;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - pan.y)) show(index + (dx < 0 ? 1 : -1));
    }
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 1) { const [p] = pointers.values(); pan = { x: p.x, y: p.y, tx, ty }; } else pan = null;
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  // Клик мимо картинки закрывает просмотр, как в Telegram.
  stage.addEventListener('click', e => { if (!moved && e.target === stage) dlg.close(); });

  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-view-close]')) dlg.close();
    else if (e.target.closest('[data-view-prev]')) show(index - 1);
    else if (e.target.closest('[data-view-next]')) show(index + 1);
  });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && list.length > 1) show(index - 1);
    else if (e.key === 'ArrowRight' && list.length > 1) show(index + 1);
    else if (e.key === '+' || e.key === '=') zoomAt(s * 1.4, innerWidth / 2, innerHeight / 2, true);
    else if (e.key === '-') zoomAt(s / 1.4, innerWidth / 2, innerHeight / 2, true);
    else if (e.key === '0') zoomAt(1, innerWidth / 2, innerHeight / 2, true);
  });
  addEventListener('resize', clamp);
  dlg.addEventListener('close', () => {
    removeEventListener('resize', clamp);
    dlg.remove();
    list[index]?.focus?.({ preventScroll: true });
  });
  document.body.append(dlg);
  show(index);
  dlg.showModal();
  dlg.querySelector('[data-view-close]').focus();
}
