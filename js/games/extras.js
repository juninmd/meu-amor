import { REASONS, BOTTLE, CAPSULE } from '../config.js';
import { $, boom, cssVar, pick, prefersReduced, replay, shuffle } from '../utils.js';
import { onOpen } from '../dialogs.js';

const DAY = 864e5, PETALS = 28, FIREWORKS_MS = 3000;

// Draws every card once before reshuffling, so reasons never repeat in a round.
export function createDeck(items, rnd = Math.random) {
  let deck = [], i = 0;
  return () => {
    if (i >= deck.length) { deck = shuffle(items, rnd); i = 0; }
    return { text: deck[i++], n: i, total: items.length };
  };
}

export const isCapsuleOpen = (now = new Date()) => now >= CAPSULE;
export const capsuleDaysLeft = (now = new Date()) => Math.ceil((CAPSULE - now) / DAY);

function initReasons() {
  const draw = createDeck(REASONS), card = $('#whyCard');
  const next = () => {
    const r = draw();
    replay(card, 'flip');
    setTimeout(() => { $('#whyTxt').textContent = r.text; }, prefersReduced() ? 0 : 300);
    $('#whyN').textContent = `Motivo ${r.n} de ${r.total}`;
  };
  $('#whyNext').addEventListener('click', () => { next(); boom({ particleCount: 30, spread: 50 }); });
  onOpen('dlg-why', next);
}

function initCapsule() {
  const cap = $('#cap'), btn = $('#capBtn'), status = $('#capStatus');
  $('#capTileTxt').textContent = isCapsuleOpen() ? 'Destrancada. Abra quando quiser.' : 'Uma mensagem para o futuro.';
  const reset = () => {
    cap.classList.remove('open', 'shake');
    btn.hidden = false;
    btn.textContent = 'Tentar abrir';
    status.textContent = isCapsuleOpen()
      ? 'A data chegou. A cápsula pode ser aberta.'
      : `Ainda faltam ${capsuleDaysLeft()} dias.`;
  };
  btn.addEventListener('click', () => {
    cap.classList.add('shake');
    btn.textContent = 'Destrancando…';
    setTimeout(() => {
      cap.classList.remove('shake');
      if (!isCapsuleOpen()) return reset();
      cap.classList.add('open');
      btn.hidden = true;
      status.textContent = 'Cápsula do tempo aberta!';
      boom();
    }, 950);
  });
  onOpen('dlg-cap', reset);
}

function initBottle() {
  const next = () => {
    $('#bottleMsg').textContent = pick(BOTTLE);
    replay($('#bottlePaper'), 'unroll');
  };
  $('#bottleNext').addEventListener('click', next);
  onOpen('dlg-bottle', next);
}

function fireworks() {
  if (typeof window.confetti !== 'function') return;
  const end = Date.now() + FIREWORKS_MS;
  const colors = [cssVar('--rose'), cssVar('--gold'), '#ffffff'];
  const it = setInterval(() => {
    const left = end - Date.now();
    if (left <= 0) return clearInterval(it);
    const base = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999, particleCount: (50 * left) / FIREWORKS_MS, colors };
    window.confetti({ ...base, origin: { x: 0.1 + Math.random() * 0.2, y: Math.random() - 0.2 } });
    window.confetti({ ...base, origin: { x: 0.7 + Math.random() * 0.2, y: Math.random() - 0.2 } });
  }, 250);
}

export function petalRain(count = PETALS) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.className = 'petal';
    p.style.cssText = `left:${Math.random() * 100}vw;animation-duration:${4 + Math.random() * 4}s;`
      + `animation-delay:${Math.random() * 2}s;--dx:${Math.random() * 200 - 100}px;`
      + `--rot:${Math.random() * 720}deg;opacity:${0.6 + Math.random() * 0.4}`;
    p.addEventListener('animationend', () => p.remove());
    document.body.append(p);
  }
}

export function initExtras() {
  initReasons();
  initCapsule();
  initBottle();
  $('#surprise').addEventListener('click', () => {
    if (prefersReduced()) return;
    fireworks();
    petalRain();
  });
}
