import { KONAMI, SECRET_TAPS } from './config.js';
import { $, boom } from './utils.js';
import { openDialog } from './dialogs.js';

const TAP_WINDOW = 1500;

// Returns the next position in the secret sequence. On a wrong key it falls back to the longest
// typed suffix that still starts the code, so ↑↑↑↓↓… keeps going; letters ignore Caps Lock/Shift.
export function konamiStep(index, key, seq = KONAMI) {
  const k = key.length === 1 ? key.toLowerCase() : key;
  if (k === seq[index]) return index + 1;
  const typed = [...seq.slice(0, index), k];
  for (let len = Math.min(index, seq.length - 1); len > 0; len--) {
    if (typed.slice(-len).every((x, i) => x === seq[i])) return len;
  }
  return 0;
}

const reveal = () => { openDialog('dlg-konami'); boom({ particleCount: 150 }); };

export function initLetter() {
  const env = $('#env'), hint = $('#envHint');
  let burst;
  env.addEventListener('click', () => {
    const open = env.classList.toggle('open');
    env.setAttribute('aria-expanded', String(open));
    hint.textContent = open ? 'Toque de novo para guardar a carta' : 'Toque no envelope para abrir';
    // The letter grows above the envelope; reserve room so it never covers the title.
    requestAnimationFrame(() => {
      const paper = env.querySelector('.paper');
      env.style.marginTop = open ? `${Math.max(40, paper.offsetHeight - env.offsetHeight * 0.58 + 24)}px` : '';
    });
    clearTimeout(burst);
    if (open) burst = setTimeout(() => boom({ particleCount: 50, origin: { y: 0.5 } }), 700);
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
