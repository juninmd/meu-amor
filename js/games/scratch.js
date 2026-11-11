import { PRIZES } from '../config.js';
import { $, boom, pick } from '../utils.js';
import { onOpen } from '../dialogs.js';

const BRUSH = 24, REVEAL = 0.5, SAMPLE = 64, CHECK_EVERY = 12;
const FOIL = ['#c99a4e', '#f5dca0', '#c99a4e', '#f5dca0'];

// Fraction of transparent pixels, sampling every 16th pixel's alpha byte.
export function clearedRatio(data, stride = SAMPLE) {
  let clear = 0, total = 0;
  for (let i = 3; i < data.length; i += stride) {
    total++;
    if (!data[i]) clear++;
  }
  return total ? clear / total : 0;
}

export function initScratch() {
  const cv = $('#scrCv');
  let ctx = null, down = false, strokes = 0;

  const reset = () => {
    $('#prize').textContent = pick(PRIZES);
    ctx = cv.getContext?.('2d') || null;
    down = false;
    strokes = 0;
    if (!ctx) return false;
    const w = cv.offsetWidth, h = cv.offsetHeight;
    cv.width = w; cv.height = h;
    cv.style.opacity = '1';
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, 0, w, h);
    FOIL.forEach((c, i) => g.addColorStop(i / (FOIL.length - 1), c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#6b4512';
    ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦  RASPE AQUI  ✦', w / 2, h / 2 + 4);
    ctx.globalCompositeOperation = 'destination-out';
    return true;
  };

  const scratch = e => {
    if (!down || !ctx) return;
    const r = cv.getBoundingClientRect();
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, BRUSH, 0, 7);
    ctx.fill();
    if (++strokes % CHECK_EVERY) return;
    if (clearedRatio(ctx.getImageData(0, 0, cv.width, cv.height).data) > REVEAL) {
      down = false;
      cv.style.opacity = '0';
      boom();
    }
  };

  cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture?.(e.pointerId); scratch(e); });
  cv.addEventListener('pointermove', scratch);
  const stop = () => { down = false; };
  cv.addEventListener('pointerup', stop);
  cv.addEventListener('pointercancel', stop);

  onOpen('dlg-scr', reset);
  return { reset };
}
