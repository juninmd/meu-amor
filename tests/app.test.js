import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PRIZES, BOTTLE, KONAMI, REASONS } from '../js/config.js';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const $ = s => document.querySelector(s);
const click = s => $(s).dispatchEvent(new MouseEvent('click', { bubbles: true }));
const ptr = (el, type, x = 0) => el.dispatchEvent(Object.assign(new MouseEvent(type, { bubbles: true, clientX: x }), { pointerId: 1 }));
let mod;

beforeAll(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 11, 12));
  localStorage.clear();
  document.body.innerHTML = html.match(/<body>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '');
  mod = await import('../js/main.js');
});

beforeEach(() => { window.confetti.mockClear(); });

describe('site', () => {
  it('shows the live counters and next anniversary', async () => {
    expect($('#relDays').textContent).toBe('1.567');
    expect($('#wedTitle').textContent).toBe('Casados há');
    expect($('#bodasTxt').textContent).toContain('Bodas de Papel em 18 dias');
    expect($('#nextMsTitle').textContent).toBe('Bodas de Papel');
    const { tick } = await import('../js/timers.js');
    tick(new Date(2025, 0, 1));
    expect($('#wedTitle').textContent).toBe('Contagem regressiva');
    tick(new Date(2026, 10, 28, 12));
    expect($('#bodasTxt').textContent).toContain('em 1 dia ·');
  });

  it('types the greeting and splits the names', () => {
    vi.advanceTimersByTime(3000);
    expect($('#typed').textContent).toBe('Olá, amor da minha vida…');
    expect(document.querySelectorAll('.names .ch').length).toBe(14);
  });

  it('lights the sky and starts the music', () => {
    click('#ignite');
    vi.advanceTimersByTime(1600);
    expect($('#musicPlayer').src).toContain('autoplay=1');
    expect(window.confetti).toHaveBeenCalled();
    click('#music');
    expect($('#musicPop').classList.contains('open')).toBe(true);
    click('main');
    expect($('#musicPop').classList.contains('open')).toBe(false);
  });

  it('moves through the photo stack', () => {
    click('#nextPh'); vi.advanceTimersByTime(300);
    expect($('#phCount').textContent).toBe('2 / 9');
    click('#prevPh');
    expect($('#phCount').textContent).toBe('1 / 9');
    $('#film').children[4].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect($('#phCount').textContent).toBe('5 / 9');
    $('#stack').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); vi.advanceTimersByTime(300);
    $('#stack').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect($('#phCount').textContent).toBe('5 / 9');
    const top = $('.photo.top');
    ptr(top, 'pointerdown', 100); ptr(top, 'pointermove', 300); ptr(top, 'pointerup'); vi.advanceTimersByTime(300);
    expect($('#phCount').textContent).toBe('6 / 9');
    ptr($('.photo.top'), 'pointerdown', 100); ptr($('.photo.top'), 'pointermove', 140); ptr($('.photo.top'), 'pointerup');
    expect($('#phCount').textContent).toBe('6 / 9');
  });

  it('opens a photo full screen', () => {
    const top = $('.photo.top');
    ptr(top, 'pointerdown', 10); ptr(top, 'pointerup');
    expect($('#dlg-lb').open).toBe(true);
    click('#lbNext');
    expect($('#lbImg').alt).toBe('Foto 7');
    click('#lbPrev'); click('#lbPrev');
    expect($('#lbImg').alt).toBe('Foto 5');
    $('#stack').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    $('#dlg-lb').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(250);
    expect($('#dlg-lb').open).toBe(false);
  });

  it('shows map pins', () => {
    click('.pin[data-k="1"]');
    expect($('#pinInfo').textContent).toContain('Primeiro beijo');
    $('.pin[data-k="2"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect($('#pinInfo').textContent).toContain('Futuro lar');
    $('.pin[data-k="0"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect($('#pinInfo').textContent).toContain('Futuro lar');
  });

  it('plays the memory game', () => {
    click('[data-open="dlg-mem"]');
    expect($('#dlg-mem').open).toBe(true);
    const cards = [...document.querySelectorAll('.mcard')];
    const groups = {};
    cards.forEach(c => (groups[c.dataset.s] ||= []).push(c));
    const pairs = Object.values(groups);
    const other = pairs[1][0];
    pairs[0][0].click(); other.click(); pairs[0][1].click();
    vi.advanceTimersByTime(1000);
    expect(other.classList.contains('f')).toBe(false);
    pairs.forEach(([a, b]) => { a.click(); a.click(); b.click(); });
    expect($('#memPairs').textContent).toBe('6 / 6 pares');
    vi.advanceTimersByTime(500);
    expect(window.confetti).toHaveBeenCalled();
    click('#memAgain');
    expect($('#memMoves').textContent).toBe('0 jogadas');
    click('#dlg-mem [data-close]'); vi.advanceTimersByTime(250);
    expect($('#dlg-mem').open).toBe(false);
  });

  it('reveals the scratch card', () => {
    click('[data-open="dlg-scr"]');
    expect(PRIZES).toContain($('#prize').textContent);
    const cv = $('#scrCv');
    ptr(cv, 'pointerdown', 5);
    for (let i = 0; i < 12; i++) ptr(cv, 'pointermove', 10 + i);
    expect(cv.style.opacity).toBe('0');
    ptr(cv, 'pointerup'); ptr(cv, 'pointermove', 50);
  });

  it('runs the quiz', () => {
    click('[data-open="dlg-quiz"]');
    for (let i = 0; i < 4; i++) {
      const correct = [2, 2, 2, 3][i];
      document.querySelectorAll('.q-opts button')[correct].click();
      vi.advanceTimersByTime(1000);
    }
    expect($('.q-end b').textContent).toBe('4/4');
    click('#qAgain');
    document.querySelectorAll('.q-opts button')[0].click();
    expect(document.querySelectorAll('.q-opts .no')).toHaveLength(1);
    document.querySelectorAll('.q-opts button')[1].click();
  });

  it('calculates love', () => {
    $('#n1').value = ' ';
    $('#calcForm').dispatchEvent(new Event('submit', { cancelable: true }));
    expect($('#calcErr').textContent).toMatch(/Preencha/);
    $('#n1').value = 'Antonio';
    $('#calcForm').dispatchEvent(new Event('submit', { cancelable: true }));
    vi.advanceTimersByTime(3000);
    expect($('#calcOut').textContent).toContain('∞%');
  });

  it('deals reasons, opens the capsule and the bottle', () => {
    click('[data-open="dlg-why"]'); vi.advanceTimersByTime(400);
    expect($('#whyN').textContent).toBe('Motivo 1 de 20');
    click('#whyNext'); vi.advanceTimersByTime(400);
    expect(REASONS).toContain($('#whyTxt').textContent);
    click('[data-open="dlg-cap"]');
    expect($('#capStatus').textContent).toMatch(/data chegou/);
    click('#capBtn'); vi.advanceTimersByTime(1000);
    expect($('#cap').classList.contains('open')).toBe(true);
    click('.bottle');
    expect(BOTTLE).toContain($('#bottleMsg').textContent);
    click('#bottleNext');
  });

  it('throws a surprise party', () => {
    click('#surprise');
    expect(document.querySelectorAll('.petal')).toHaveLength(28);
    document.querySelector('.petal').dispatchEvent(new Event('animationend'));
    expect(document.querySelectorAll('.petal')).toHaveLength(27);
    vi.advanceTimersByTime(3500);
    expect(window.confetti).toHaveBeenCalled();
  });

  it('keeps the dream list', () => {
    const first = $('#dream0');
    first.checked = true;
    first.dispatchEvent(new Event('change', { bubbles: true }));
    expect($('#dialPct').textContent).toBe('20%');
    $('#addInput').value = 'Conhecer o Japão';
    $('#addForm').dispatchEvent(new Event('submit', { cancelable: true }));
    $('#addForm').dispatchEvent(new Event('submit', { cancelable: true }));
    expect(document.querySelectorAll('#dlist li')).toHaveLength(6);
    for (let i = 0; i < 6; i++) { const b = $(`#dream${i}`); b.checked = true; b.dispatchEvent(new Event('change', { bubbles: true })); }
    expect($('#dialPct').textContent).toBe('100%');
    $('#dream1').checked = false;
    $('#dream1').dispatchEvent(new Event('change', { bubbles: true }));
    expect(JSON.parse(localStorage.getItem('dreams'))).toHaveLength(6);
  });

  it('opens the letter and the secrets', () => {
    click('#env');
    expect($('#env').classList.contains('open')).toBe(true);
    vi.advanceTimersByTime(800);
    click('#env');
    expect($('#envHint').textContent).toMatch(/abrir/);
    KONAMI.forEach(key => window.dispatchEvent(new KeyboardEvent('keydown', { key })));
    expect($('#dlg-konami').open).toBe(true);
    $('#dlg-konami').close();
    for (let i = 0; i < 7; i++) click('#inf');
    expect($('#dlg-konami').open).toBe(true);
    click('#inf'); vi.advanceTimersByTime(1600);
  });

  it('switches theme, follows the dock and tilts tiles', () => {
    click('#themeBtn');
    expect(document.documentElement.dataset.theme).toBe('dark');
    click('#themeBtn');
    expect(JSON.parse(localStorage.getItem('theme'))).toBe('light');
    const io = globalThis.__io[0];
    io.cb([{ isIntersecting: true, target: $('#sonhos') }, { isIntersecting: false, target: $('#inicio') }]);
    expect($('.dock a[href="#sonhos"]').classList.contains('on')).toBe(true);
    const tile = $('.tile');
    tile.dispatchEvent(new MouseEvent('pointermove', { clientX: 5, clientY: 5 }));
    expect(tile.style.transform).toContain('perspective');
    tile.dispatchEvent(new MouseEvent('pointerleave'));
    expect(tile.style.transform).toBe('');
  });

  it('isolates failures and honours reduced motion', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(mod.safe('x', () => { throw new Error('boom'); })).toBeUndefined();
    expect(err).toHaveBeenCalled();
    err.mockRestore();
    globalThis.__reduce = true;
    const { typeText } = await import('../js/hero.js');
    const el = document.createElement('p');
    typeText(el, 'oi');
    expect(el.textContent).toBe('oi');
    click('#surprise');
    click('[data-open="dlg-bottle"]');
    click('#dlg-bottle [data-close]');
    expect($('#dlg-bottle').open).toBe(false);
    globalThis.__reduce = false;
  });
});
