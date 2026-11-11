export const $ = (s, root = document) => root.querySelector(s);
export const $$ = (s, root = document) => [...root.querySelectorAll(s)];

export const prefersReduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Storage can throw (private mode, blocked cookies); the site must keep working without it.
export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
};

export const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function boom(opts = {}) {
  if (typeof window.confetti !== 'function' || prefersReduced()) return false;
  window.confetti({
    particleCount: 80, spread: 70, origin: { y: 0.7 }, zIndex: 9999,
    colors: [cssVar('--rose') || '#ff7d9d', cssVar('--gold') || '#f2c28a', '#ffffff'], ...opts
  });
  return true;
}

export function shuffle(list, rnd = Math.random) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pick = (list, rnd = Math.random) => list[Math.floor(rnd() * list.length)];
export const fmt = n => n.toLocaleString('pt-BR');
export const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Restarting a CSS animation requires a reflow between removing and re-adding the class.
export function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
