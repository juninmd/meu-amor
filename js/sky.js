import { cssVar, prefersReduced, shuffle } from './utils.js';

const CONVERGE = 1500, HOLD = 4200, RELEASE = 5800;

export const easeOut = t => 1 - (1 - t) ** 3;

// Classic parametric heart curve, scaled by k and centred on (cx, cy).
export function heartPoint(t, k, cx, cy) {
  return {
    x: cx + 16 * Math.sin(t) ** 3 * k,
    y: cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k
  };
}

// 0..1 = how far the chosen stars are toward the heart; -1 = animation finished.
export function heartProgress(elapsed) {
  if (elapsed < CONVERGE) return easeOut(elapsed / CONVERGE);
  if (elapsed < HOLD) return 1;
  if (elapsed < RELEASE) return 1 - easeOut((elapsed - HOLD) / (RELEASE - HOLD));
  return -1;
}

export function createSky(canvas, win = window) {
  const ctx = canvas?.getContext?.('2d');
  let W = 0, H = 0, stars = [], heart = null, shoot = null, nextShoot = 3000, starC = '#fff', rose = '#ff7d9d';
  const reduce = prefersReduced();

  const recolor = () => {
    starC = cssVar('--star') || starC;
    rose = cssVar('--rose') || rose;
  };

  const resize = () => {
    const dpr = Math.min(win.devicePixelRatio || 1, 2);
    W = win.innerWidth; H = win.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(320, Math.round((W * H) / 5000)) }, () => ({
      hx: Math.random() * W, hy: Math.random() * H, r: Math.random() * 1.3 + 0.3,
      p: Math.random() * 6.3, s: 0.4 + Math.random() * 1.4
    }));
  };

  const ignite = () => {
    const k = Math.min(W, H) / 42;
    const chosen = shuffle(stars).slice(0, Math.min(80, stars.length));
    chosen.forEach((s, i) => {
      const pt = heartPoint((i / chosen.length) * Math.PI * 2, k, W / 2, H * 0.46);
      s.tx = pt.x; s.ty = pt.y;
    });
    heart = { chosen, t0: win.performance.now() };
  };

  const drawStars = (t, f) => {
    for (const s of stars) {
      const on = heart && s.tx != null;
      const a = reduce ? 0.7 : 0.3 + 0.7 * Math.abs(Math.sin((t / 1000) * s.s + s.p));
      s.x = on ? s.hx + (s.tx - s.hx) * f : s.hx;
      s.y = on ? s.hy + (s.ty - s.hy) * f : s.hy;
      ctx.globalAlpha = on ? Math.max(a, f) : a;
      ctx.fillStyle = on && f > 0.05 ? rose : starC;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * (on ? 1 + f * 1.2 : 1), 0, 7);
      ctx.fill();
    }
  };

  const drawHeartLines = f => {
    ctx.globalAlpha = ((f - 0.55) / 0.45) * 0.55;
    ctx.strokeStyle = rose;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    heart.chosen.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y)));
    ctx.closePath();
    ctx.stroke();
  };

  const drawShootingStar = t => {
    if (!shoot && t > nextShoot) {
      shoot = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.4, v: 9 + Math.random() * 5, l: 1 };
      nextShoot = t + 4000 + Math.random() * 6000;
    }
    if (!shoot) return;
    const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - 90, shoot.y - 45);
    g.addColorStop(0, starC);
    g.addColorStop(1, 'transparent');
    ctx.globalAlpha = shoot.l;
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(shoot.x, shoot.y);
    ctx.lineTo(shoot.x - 90, shoot.y - 45);
    ctx.stroke();
    shoot.x += shoot.v; shoot.y += shoot.v / 2; shoot.l -= 0.018;
    if (shoot.l <= 0) shoot = null;
  };

  const frame = t => {
    ctx.clearRect(0, 0, W, H);
    let f = 0;
    if (heart) {
      f = heartProgress(t - heart.t0);
      if (f < 0) {
        heart.chosen.forEach(s => { s.tx = null; });
        heart = null;
        f = 0;
      }
    }
    drawStars(t, f);
    if (heart && f > 0.55) drawHeartLines(f);
    if (!reduce) drawShootingStar(t);
    ctx.globalAlpha = 1;
  };

  if (!ctx) return { ignite() {}, recolor() {}, frame() {}, active: () => false };

  const loop = t => { frame(t); win.requestAnimationFrame(loop); };
  recolor();
  resize();
  win.addEventListener('resize', resize);
  win.requestAnimationFrame(loop);
  return { ignite, recolor, frame, active: () => !!heart };
}
