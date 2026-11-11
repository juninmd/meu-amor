import { PHOTOS } from '../config.js';
import { $, boom, shuffle } from '../utils.js';
import { onOpen } from '../dialogs.js';

const PAIRS = 6, MISMATCH_MS = 900;

export const buildDeck = (srcs, rnd = Math.random) => shuffle([...srcs, ...srcs], rnd);

export function initMemory() {
  const grid = $('#memGrid');
  let state;

  const stats = () => {
    $('#memMoves').textContent = `${state.moves} jogadas`;
    $('#memPairs').textContent = `${state.pairs} / ${PAIRS} pares`;
  };

  const start = () => {
    state = { first: null, lock: false, moves: 0, pairs: 0 };
    const deck = buildDeck(PHOTOS.slice(0, PAIRS).map(p => p.src));
    grid.innerHTML = deck.map(s => `<button class="mcard" data-s="${s}" aria-label="Carta virada">`
      + '<span class="fa"><svg class="i"><use href="#i-heart"/></svg></span>'
      + `<span class="ba" style="background-image:url(${s})"></span></button>`).join('');
    stats();
  };

  grid.addEventListener('click', e => {
    const c = e.target.closest('.mcard');
    if (!c || state.lock || c.classList.contains('f') || c.classList.contains('m')) return;
    c.classList.add('f');
    if (!state.first) { state.first = c; return; }
    const a = state.first;
    state.first = null;
    state.moves++;
    if (a.dataset.s === c.dataset.s) {
      a.classList.add('m');
      c.classList.add('m');
      state.pairs++;
      if (state.pairs === PAIRS) setTimeout(() => boom({ particleCount: 150 }), 400);
    } else {
      state.lock = true;
      setTimeout(() => {
        a.classList.remove('f');
        c.classList.remove('f');
        state.lock = false;
      }, MISMATCH_MS);
    }
    stats();
  });

  $('#memAgain').addEventListener('click', start);
  onOpen('dlg-mem', start);
  start();
  return { state: () => state, start };
}
