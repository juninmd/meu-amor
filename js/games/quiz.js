import { QUIZ } from '../config.js';
import { $, boom } from '../utils.js';
import { onOpen } from '../dialogs.js';

const NEXT_MS = 1000;

export const quizMessage = (score, total) => (score === total ? 'Você me conhece tão bem! ❤' : 'Quase! Vamos de novo?');

export function initQuiz() {
  const box = $('#quiz');
  let index = 0, score = 0;

  const dots = () => `<div class="q-dots">${QUIZ.map((_, i) => `<i class="${i <= index ? 'on' : ''}"></i>`).join('')}</div>`;

  const finish = () => {
    box.innerHTML = `${dots()}<div class="q-end"><b>${score}/${QUIZ.length}</b>`
      + `<p class="q-msg">${quizMessage(score, QUIZ.length)}</p>`
      + '<button class="btn ghost" id="qAgain">Jogar de novo</button></div>';
    $('#qAgain').addEventListener('click', start);
    if (score === QUIZ.length) boom();
  };

  const show = () => {
    if (index >= QUIZ.length) return finish();
    const q = QUIZ[index];
    box.innerHTML = `${dots()}<p class="q-q">${q.q}</p>`
      + `<div class="q-opts">${q.o.map((o, i) => `<button data-i="${i}">${o}</button>`).join('')}</div>`;
  };

  function start() {
    index = 0;
    score = 0;
    show();
  }

  box.addEventListener('click', e => {
    const b = e.target.closest('.q-opts button');
    if (!b || b.disabled) return;
    const q = QUIZ[index], buttons = box.querySelectorAll('.q-opts button');
    buttons.forEach(x => { x.disabled = true; });
    buttons[q.c].classList.add('ok');
    if (Number(b.dataset.i) === q.c) score++;
    else b.classList.add('no');
    setTimeout(() => { index++; show(); }, NEXT_MS);
  });

  onOpen('dlg-quiz', start);
  start();
  return { score: () => score, index: () => index };
}
