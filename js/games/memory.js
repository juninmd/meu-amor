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

  // The photo number lets screen reader users find the matching card; the image itself has no alt.
  const label = c => {
    const pos = `Carta ${c.dataset.i}`;
    if (c.classList.contains('m')) return `${pos}, foto ${c.dataset.n}, par encontrado`;
    return c.classList.contains('f') ? `${pos}, foto ${c.dataset.n}` : `${pos}, virada para baixo`;
  };
  const relabel = (...cards) => cards.forEach(c => c.setAttribute('aria-label', label(c)));

  const start = () => {
    state = { first: null, lock: false, moves: 0, pairs: 0 };
    const srcs = PHOTOS.slice(0, PAIRS).map(p => p.src);
    const deck = buildDeck(srcs);
    grid.innerHTML = deck.map((s, i) => `<button class="mcard" data-s="${s}" data-i="${i + 1}" data-n="${srcs.indexOf(s) + 1}"`
      + ` aria-label="Carta ${i + 1}, virada para baixo">`
      + '<span class="fa"><svg class="i"><use href="#i-heart"/></svg></span>'
      + `<span class="ba" style="background-image:url(${s})"></span></button>`).join('');
    stats();
  };

  grid.addEventListener('click', e => {
    const c = e.target.closest('.mcard');
    if (!c || state.lock || c.classList.contains('f') || c.classList.contains('m')) return;
    c.classList.add('f');
    relabel(c);
    if (!state.first) { state.first = c; return; }
    const a = state.first;
    state.first = null;
    state.moves++;
    if (a.dataset.s === c.dataset.s) {
      a.classList.add('m');
      c.classList.add('m');
      relabel(a, c);
      a.setAttribute('aria-disabled', 'true');
      c.setAttribute('aria-disabled', 'true');
      state.pairs++;
      if (state.pairs === PAIRS) setTimeout(() => boom({ particleCount: 150 }), 400);
    } else {
      state.lock = true;
      setTimeout(() => {
        a.classList.remove('f');
        c.classList.remove('f');
        relabel(a, c);
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
