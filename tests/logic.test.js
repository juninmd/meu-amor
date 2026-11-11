import { describe, it, expect, vi } from 'vitest';
import { fakeCtx } from './setup.js';
import { addMonths, diffParts, bodasInfo, bodasName, heartbeats, millions, daysBetween, shortDate } from '../js/timers.js';
import { heartPoint, heartProgress, easeOut, createSky } from '../js/sky.js';
import { clearedRatio } from '../js/games/scratch.js';
import { konamiStep } from '../js/letter.js';
import { progress, loadDreams } from '../js/dreams.js';
import { createDeck, isCapsuleOpen, capsuleDaysLeft } from '../js/games/extras.js';
import { shuffle, store, escapeHtml, boom, pick, fmt } from '../js/utils.js';
import { rotateTo } from '../js/gallery.js';
import { buildDeck } from '../js/games/memory.js';
import { nextPercent } from '../js/games/calc.js';
import { quizMessage } from '../js/games/quiz.js';
import { effectiveTheme } from '../js/nav.js';
import { openDialog } from '../js/dialogs.js';
import { PHOTOS, KONAMI, WED } from '../js/config.js';

describe('timers', () => {
  it('computes calendar differences', () => {
    expect(diffParts(new Date(2022, 6, 28), new Date(2026, 10, 11, 12, 30, 15)))
      .toEqual({ y: 4, m: 3, d: 14, h: 12, min: 30, s: 15 });
    expect(diffParts(new Date(2022, 0, 31), new Date(2022, 1, 28)).m).toBe(0);
    expect(diffParts(new Date(2024, 0, 1), new Date(2023, 0, 1))).toEqual({ y: 0, m: 0, d: 0, h: 0, min: 0, s: 0 });
    expect(addMonths(new Date(2022, 6, 28), 12).getFullYear()).toBe(2023);
    expect(daysBetween(new Date(2022, 0, 1), new Date(2022, 0, 11))).toBe(10);
  });

  it('knows the anniversaries', () => {
    const first = bodasInfo(WED, new Date(2026, 10, 11, 12));
    expect(first).toMatchObject({ years: 0, current: null, nextName: 'Papel', daysLeft: 18 });
    expect(first.frac).toBeGreaterThan(0.9);
    const later = bodasInfo(WED, new Date(2027, 0, 1));
    expect(later).toMatchObject({ years: 1, current: 'Papel', nextName: 'Algodão' });
    expect(bodasName(11)).toBe('Amor');
    expect(shortDate(new Date(2026, 10, 29))).toBe('29 nov 2026');
  });

  it('counts heartbeats', () => {
    expect(heartbeats(6e4)).toBe(72);
    expect(millions(165_400_000)).toBe('165,4');
  });
});

describe('sky', () => {
  it('draws a heart curve and eases in and out', () => {
    expect(heartPoint(0, 1, 0, 0)).toEqual({ x: 0, y: -5 });
    expect(easeOut(1)).toBe(1);
    expect(heartProgress(0)).toBe(0);
    expect(heartProgress(2000)).toBe(1);
    expect(heartProgress(5000)).toBeGreaterThan(0);
    expect(heartProgress(9000)).toBe(-1);
  });

  it('animates stars, the heart and shooting stars', () => {
    const ctx = fakeCtx();
    const win = { innerWidth: 400, innerHeight: 400, devicePixelRatio: 2, addEventListener: vi.fn(),
      requestAnimationFrame: vi.fn(), performance: { now: () => 0 } };
    const sky = createSky({ getContext: () => ctx }, win);
    sky.frame(10);
    sky.ignite();
    expect(sky.active()).toBe(true);
    [800, 2000, 3500, 5000, 7000, 9000, 12000, 15000].forEach(t => sky.frame(t));
    expect(sky.active()).toBe(false);
    expect(ctx.arc).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
    sky.recolor();
  });

  it('degrades without canvas support', () => {
    const sky = createSky(null);
    expect(sky.active()).toBe(false);
    sky.ignite(); sky.recolor(); sky.frame();
  });
});

describe('small helpers', () => {
  it('measures scratched area', () => {
    expect(clearedRatio(new Uint8ClampedArray(128))).toBe(1);
    expect(clearedRatio(new Uint8ClampedArray(128).fill(255))).toBe(0);
    expect(clearedRatio([])).toBe(0);
  });

  it('follows the konami sequence', () => {
    let k = 0;
    KONAMI.forEach(key => { k = konamiStep(k, key); });
    expect(k).toBe(KONAMI.length);
    expect(konamiStep(3, 'x')).toBe(0);
    expect(konamiStep(3, 'ArrowUp')).toBe(1);
  });

  it('tracks dream progress and old saved checkmarks', () => {
    expect(progress([])).toBe(0);
    expect(progress([{ ok: true }, { ok: false }])).toBe(50);
    localStorage.clear();
    localStorage.setItem('bucket2', 'true');
    expect(loadDreams().map(d => d.ok)).toEqual([false, true, false, false, false]);
    localStorage.setItem('dreams', JSON.stringify([{ t: 'x', ok: true }]));
    expect(loadDreams()).toEqual([{ t: 'x', ok: true }]);
    localStorage.clear();
  });

  it('deals each reason once per round', () => {
    const draw = createDeck(['a', 'b', 'c']);
    const round = [draw(), draw(), draw()].map(r => r.text).sort();
    expect(round).toEqual(['a', 'b', 'c']);
    expect(draw().n).toBe(1);
  });

  it('opens the capsule on its date', () => {
    expect(isCapsuleOpen(new Date(2025, 0, 1))).toBe(false);
    expect(isCapsuleOpen(new Date(2026, 0, 1))).toBe(true);
    expect(capsuleDaysLeft(new Date(2025, 10, 19))).toBe(10);
  });

  it('shuffles, picks, escapes and formats', () => {
    expect(shuffle([1, 2, 3]).sort()).toEqual([1, 2, 3]);
    expect(pick(['x'])).toBe('x');
    expect(escapeHtml('<b>"&"</b>')).toBe('&lt;b&gt;&quot;&amp;&quot;&lt;/b&gt;');
    expect(fmt(1567)).toBe('1.567');
    expect(rotateTo([0, 1, 2, 3], 2)).toEqual([2, 3, 0, 1]);
    expect(rotateTo([0, 1], 9)).toEqual([0, 1]);
    expect(buildDeck(['a', 'b'])).toHaveLength(4);
    expect(nextPercent(98, () => 0.99)).toBe(100);
    expect(quizMessage(4, 4)).toMatch(/conhece/);
    expect(quizMessage(1, 4)).toMatch(/Quase/);
    expect(PHOTOS[0]).toMatchObject({ cap: '01 mai 2023', time: '23:10' });
  });

  it('survives broken storage', () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(store.get('k', 7)).toBe(7);
    expect(store.set('k', 1)).toBe(false);
    get.mockRestore(); set.mockRestore();
    expect(store.set('k', 1)).toBe(true);
    expect(store.get('k')).toBe(1);
  });

  it('respects reduced motion and missing confetti', () => {
    const c = window.confetti;
    delete window.confetti;
    expect(boom()).toBe(false);
    window.confetti = c;
    expect(boom()).toBe(true);
  });

  it('resolves the theme and opens dialogs without native support', () => {
    const root = document.createElement('div');
    expect(effectiveTheme(root)).toBe('light');
    root.dataset.theme = 'dark';
    expect(effectiveTheme(root)).toBe('dark');
    const d = document.createElement('div');
    d.id = 'fake-dialog';
    document.body.append(d);
    expect(openDialog('fake-dialog').hasAttribute('open')).toBe(true);
    expect(openDialog('missing')).toBeNull();
    d.remove();
  });
});
