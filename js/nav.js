import { MUSIC_AUTOPLAY } from './config.js';
import { $, $$, prefersReduced, store } from './utils.js';

export function effectiveTheme(root = document.documentElement) {
  return root.dataset.theme || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

export function initTheme(sky) {
  $('#themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    root.dataset.theme = effectiveTheme(root) === 'dark' ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
    sky.recolor();
  });
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => sky.recolor());
}

export function initMusic() {
  const btn = $('#music'), pop = $('#musicPop'), player = $('#musicPlayer');
  const setOpen = open => {
    pop.classList.toggle('open', open);
    pop.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => setOpen(!pop.classList.contains('open')));
  document.addEventListener('click', e => { if (!e.target.closest('#music,#musicPop')) setOpen(false); });
  // Browsers only allow autoplay after a user gesture, so this runs from a click.
  return {
    play() {
      if (!player.src.includes('autoplay')) player.src += MUSIC_AUTOPLAY;
      btn.classList.add('playing');
    }
  };
}

export function initDock() {
  const links = $$('.dock a');
  if (typeof IntersectionObserver !== 'function') return;
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === `#${en.target.id}`));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach(s => io.observe(s));
}

export function initTilt() {
  if (prefersReduced() || !window.matchMedia?.('(hover: hover)').matches) return;
  $$('.tile').forEach(t => {
    t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `perspective(900px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
    });
    t.addEventListener('pointerleave', () => { t.style.transform = ''; });
  });
}
