import { REL, WED, BODAS, MES } from './config.js';
import { $, $$, fmt } from './utils.js';

const DAY = 864e5;
const UNITS = [['y', 'anos'], ['m', 'meses'], ['d', 'dias'], ['h', 'horas'], ['min', 'min'], ['s', 'seg']];
const RING = 213.6;

export function addMonths(date, months) {
  const n = new Date(date);
  n.setMonth(n.getMonth() + months);
  return n;
}

// Calendar-aware difference (years/months by calendar, the rest by clock).
export function diffParts(from, to) {
  let mo = Math.max(0, (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth());
  while (mo > 0 && addMonths(from, mo) > to) mo--;
  const ms = Math.max(0, to - addMonths(from, mo));
  return {
    y: Math.floor(mo / 12), m: mo % 12, d: Math.floor(ms / DAY),
    h: Math.floor((ms % DAY) / 36e5), min: Math.floor((ms % 36e5) / 6e4), s: Math.floor((ms % 6e4) / 1e3)
  };
}

export const daysBetween = (a, b) => Math.floor((b - a) / DAY);
export const bodasName = years => BODAS[years] || 'Amor';
export const heartbeats = (ms, bpm = 72) => (ms / 6e4) * bpm;
export const millions = n => (n / 1e6).toFixed(1).replace('.', ',');
export const shortDate = d => `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`;

export function bodasInfo(wedding, now) {
  const years = diffParts(wedding, now).y;
  const last = addMonths(wedding, years * 12);
  const next = addMonths(wedding, (years + 1) * 12);
  return {
    years,
    current: years >= 1 ? bodasName(years) : null,
    nextName: bodasName(years + 1),
    next,
    daysLeft: Math.ceil((next - now) / DAY),
    frac: (now - last) / (next - last)
  };
}

function mountUnits(el) {
  el.innerHTML = UNITS.map(([k, l]) => `<div class="unit"><b data-k="${k}">00</b><small>${l}</small></div>`).join('');
}

function paint(el, parts) {
  $$('b', el).forEach(b => {
    const v = String(parts[b.dataset.k]).padStart(2, '0');
    if (b.textContent === v) return;
    b.textContent = v;
    b.classList.remove('tick');
    void b.offsetWidth;
    b.classList.add('tick');
  });
}

const setText = (sel, text) => { const el = $(sel); if (el) el.textContent = text; };

export function tick(now = new Date()) {
  paint($('#relUnits'), diffParts(REL, now));
  const relDays = daysBetween(REL, now);
  setText('#relDays', fmt(relDays));
  setText('#todayLbl', `Hoje · dia ${fmt(relDays)}`);
  setText('#beats', `≈ ${millions(heartbeats(now - REL))} milhões de batimentos lado a lado`);

  if (now < WED) {
    setText('#wedTitle', 'Contagem regressiva');
    paint($('#wedUnits'), diffParts(now, WED));
    setText('#wedDays', fmt(Math.ceil((WED - now) / DAY)));
    return;
  }
  setText('#wedTitle', 'Casados há');
  paint($('#wedUnits'), diffParts(WED, now));
  setText('#wedDays', fmt(daysBetween(WED, now)));
  const b = bodasInfo(WED, now);
  const plural = b.daysLeft === 1 ? 'dia' : 'dias';
  $('#bodasRing').style.strokeDashoffset = String(RING * (1 - b.frac));
  setText('#bodasBadge', b.current ? `Bodas de ${b.current}` : 'Próximas bodas');
  $('#bodasTxt').innerHTML = `<strong>Bodas de ${b.nextName}</strong> em ${b.daysLeft} ${plural} · ${shortDate(b.next)}`;
  setText('#nextMsDate', shortDate(b.next));
  setText('#nextMsTitle', `Bodas de ${b.nextName}`);
  setText('#nextMs', `Nosso ${b.years + 1}º aniversário de casados. Faltam ${b.daysLeft} ${plural}.`);
}

export function initTimers() {
  mountUnits($('#relUnits'));
  mountUnits($('#wedUnits'));
  tick();
  return setInterval(tick, 1000);
}
