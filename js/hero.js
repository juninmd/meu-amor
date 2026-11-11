import { GREETING, PINS } from './config.js';
import { $, $$, boom, prefersReduced } from './utils.js';

const TYPE_MS = 70;

export function splitLetters(el, offset = 0) {
  el.innerHTML = [...el.dataset.split].map((ch, i) => `<span class="ch" style="--i:${i + offset}">${ch}</span>`).join('');
}

export function typeText(el, text, delay = TYPE_MS) {
  if (prefersReduced()) { el.textContent = text; return; }
  let i = 0;
  const step = () => {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, delay);
  };
  setTimeout(step, 600);
}

export function initHero(sky, music) {
  $$('[data-split]').forEach((el, n) => splitLetters(el, n * 8));
  typeText($('#typed'), GREETING);
  $('#ignite').addEventListener('click', () => {
    window.scrollTo?.({ top: 0 });
    sky.ignite();
    music.play();
    setTimeout(() => boom({ particleCount: 60, origin: { y: 0.45 }, spread: 100 }), 1500);
  });
}

export function initMap() {
  const info = $('#pinInfo');
  $$('.pin').forEach(pin => {
    const show = () => {
      const [title, text] = PINS[pin.dataset.k];
      info.innerHTML = `<b>${title}</b><p>${text}</p>`;
    };
    pin.addEventListener('click', show);
    pin.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      show();
    });
  });
}
