import { $, boom } from '../utils.js';

const STEP_MS = 40, FINAL_MS = 400;

export const nextPercent = (p, rnd = Math.random) => Math.min(100, p + 3 + Math.floor(rnd() * 6));

export function initCalc() {
  const out = $('#calcOut'), err = $('#calcErr');
  let timer = null;

  $('#calcForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!$('#n1').value.trim() || !$('#n2').value.trim()) {
      err.textContent = 'Preencha os dois nomes para calcular.';
      return;
    }
    err.textContent = '';
    clearInterval(timer);
    let p = 0;
    timer = setInterval(() => {
      p = nextPercent(p);
      out.innerHTML = `<b>${p}%</b>`;
      if (p < 100) return;
      clearInterval(timer);
      setTimeout(() => {
        out.innerHTML = '<b>∞%</b><span>Almas gêmeas!</span>';
        boom({ particleCount: 120 });
      }, FINAL_MS);
    }, STEP_MS);
  });
}
