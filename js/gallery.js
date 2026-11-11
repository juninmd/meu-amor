import { PHOTOS } from './config.js';
import { $ } from './utils.js';
import { openDialog } from './dialogs.js';

const SWIPE = 90, TAP = 6, VISIBLE = 4;

// Rotates the order so that photo `i` is on top, keeping the cyclic sequence.
export function rotateTo(order, i) {
  const k = order.indexOf(i);
  return k < 0 ? order.slice() : [...order.slice(k), ...order.slice(0, k)];
}

export function initGallery() {
  const stack = $('#stack'), film = $('#film');
  let order = PHOTOS.map((_, i) => i), drag = null, lbIndex = 0;

  const cards = PHOTOS.map((p, i) => {
    const f = document.createElement('figure');
    f.className = 'photo';
    f.style.setProperty('--r', (Math.random() * 10 - 5).toFixed(1));
    f.innerHTML = `<img src="${p.src}" alt="Foto ${i + 1}, ${p.cap}" draggable="false">`
      + `<figcaption><span>Nº ${String(i + 1).padStart(2, '0')}</span><span>${p.cap} · ${p.time}</span></figcaption>`;
    stack.append(f);
    return f;
  });
  film.innerHTML = PHOTOS.map((p, i) => `<button aria-label="Ver foto ${i + 1}"><img src="${p.src}" alt="" loading="lazy"></button>`).join('');

  const layout = () => {
    order.forEach((idx, pos) => {
      const f = cards[idx];
      f.style.setProperty('--d', pos);
      f.style.zIndex = String(50 - pos);
      f.classList.toggle('top', pos === 0);
      f.classList.toggle('deep', pos >= VISIBLE);
    });
    $('#phCount').textContent = `${order[0] + 1} / ${PHOTOS.length}`;
    [...film.children].forEach((b, i) => b.classList.toggle('on', i === order[0]));
  };

  const fly = dir => {
    const f = cards[order[0]];
    f.style.transform = `translateX(${dir * 130}%) rotate(${dir * 24}deg)`;
    f.style.opacity = '0';
    setTimeout(() => {
      order = rotateTo(order, order[1]);
      f.style.transform = '';
      f.style.opacity = '';
      layout();
    }, 260);
  };
  const prev = () => { order = rotateTo(order, order[order.length - 1]); layout(); };

  const showLb = () => {
    const p = PHOTOS[lbIndex];
    $('#lbImg').src = p.src;
    $('#lbImg').alt = `Foto ${lbIndex + 1}`;
    $('#lbCap').textContent = `${p.cap} · ${p.time}`;
  };
  const openLb = i => { lbIndex = i; showLb(); openDialog('dlg-lb'); };
  const stepLb = d => { lbIndex = (lbIndex + d + PHOTOS.length) % PHOTOS.length; showLb(); };

  $('#nextPh').addEventListener('click', () => fly(-1));
  $('#prevPh').addEventListener('click', prev);
  $('#lbPrev').addEventListener('click', () => stepLb(-1));
  $('#lbNext').addEventListener('click', () => stepLb(1));
  film.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    order = rotateTo(order, [...film.children].indexOf(b));
    layout();
  });
  stack.tabIndex = 0;
  stack.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') fly(-1);
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Enter') openLb(order[0]);
  });

  stack.addEventListener('pointerdown', e => {
    const f = e.target.closest('.photo.top');
    if (!f) return;
    drag = { f, x0: e.clientX, dx: 0 };
    f.classList.add('dragging');
    f.setPointerCapture?.(e.pointerId);
  });
  stack.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x0;
    drag.f.style.transform = `translateX(${drag.dx}px) rotate(${drag.dx / 16}deg)`;
  });
  const endDrag = () => {
    if (!drag) return;
    const { f, dx } = drag;
    drag = null;
    f.classList.remove('dragging');
    if (Math.abs(dx) > SWIPE) return fly(Math.sign(dx));
    f.style.transform = '';
    if (Math.abs(dx) < TAP) openLb(order[0]);
  };
  stack.addEventListener('pointerup', endDrag);
  stack.addEventListener('pointercancel', endDrag);

  layout();
  return { next: () => fly(-1), prev, current: () => order[0] };
}
