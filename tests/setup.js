import { vi } from 'vitest';

// jsdom lacks layout/graphics APIs; these stand-ins keep the modules exercisable.
globalThis.__reduce = false;
window.matchMedia = query => ({
  matches: query.includes('reduced-motion') ? globalThis.__reduce : query === '(hover: hover)',
  media: query,
  addEventListener: vi.fn()
});

globalThis.__io = [];
window.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; globalThis.__io.push(this); }
  observe() {}
  disconnect() {}
};

window.requestAnimationFrame = vi.fn(cb => { cb(0); return 1; });
window.scrollTo = vi.fn();
window.confetti = vi.fn();

export function fakeCtx(alpha = 0) {
  const t = {};
  return new Proxy(t, {
    get(target, key) {
      if (key in target) return target[key];
      if (key === 'getImageData') return () => ({ data: new Uint8ClampedArray(256).fill(alpha) });
      if (key === 'createLinearGradient') return () => ({ addColorStop() {} });
      target[key] = vi.fn();
      return target[key];
    },
    set(target, key, value) { target[key] = value; return true; }
  });
}
HTMLCanvasElement.prototype.getContext = function () { return fakeCtx(); };

const proto = window.HTMLDialogElement?.prototype;
if (proto && typeof proto.showModal !== 'function') {
  proto.showModal = function () { this.setAttribute('open', ''); };
  proto.close = function () { this.removeAttribute('open'); };
}
