import { KONAMI, SECRET_TAPS } from './config.js';
import { $, boom } from './utils.js';
import { openDialog } from './dialogs.js';

const TAP_WINDOW = 1500;

// Returns the next position in the secret sequence (restarting on a wrong key).
export function konamiStep(index, key, seq = KONAMI) {
  if (key === seq[index]) return index + 1;
  return key === seq[0] ? 1 : 0;
}

const reveal = () => { openDialog('dlg-konami'); boom({ particleCount: 150 }); };

export function initLetter() {
  const env = $('#env'), hint = $('#envHint');
  env.addEventListener('click', () => {
    const open = env.classList.toggle('open');
    env.setAttribute('aria-expanded', String(open));
    hint.textContent = open ? 'Toque de novo para guardar a carta' : 'Toque no envelope para abrir';
    // The letter grows above the envelope; reserve room so it never covers the title.
    requestAnimationFrame(() => {
      const paper = env.querySelector('.paper');
      env.style.marginTop = open ? `${Math.max(40, paper.offsetHeight - env.offsetHeight * 0.58 + 24)}px` : '';
    });
    if (open) setTimeout(() => boom({ particleCount: 50, origin: { y: 0.5 } }), 700);
  });
}

export function initSecrets() {
  let k = 0, taps = 0, tapTimer;
  addEventListener('keydown', e => {
    k = konamiStep(k, e.key);
    if (k === KONAMI.length) { k = 0; reveal(); }
  });
  $('#inf').addEventListener('click', () => {
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { taps = 0; }, TAP_WINDOW);
    if (taps >= SECRET_TAPS) { taps = 0; reveal(); }
  });
}
