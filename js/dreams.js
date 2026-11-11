import { DREAMS } from './config.js';
import { $, boom, escapeHtml, store } from './utils.js';

const KEY = 'dreams', DIAL = 326.7;

export const progress = list => (list.length ? Math.round((list.filter(d => d.ok).length / list.length) * 100) : 0);

// Keeps checkmarks saved by the old site (bucket1..bucket5 = "true").
export function loadDreams() {
  const saved = store.get(KEY, null);
  if (Array.isArray(saved)) return saved;
  return DREAMS.map((t, i) => ({ t, ok: store.get(`bucket${i + 1}`, false) === true }));
}

export function initDreams() {
  const list = $('#dlist');
  let dreams = loadDreams();

  const render = () => {
    list.innerHTML = dreams.map((d, i) => `<li><label><input type="checkbox" id="dream${i}" data-i="${i}"${d.ok ? ' checked' : ''}>`
      + '<span class="box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>'
      + `<span class="txt">${escapeHtml(d.t)}</span></label></li>`).join('');
    const pct = progress(dreams);
    $('#dial').style.strokeDashoffset = String(DIAL * (1 - pct / 100));
    $('#dialPct').textContent = `${pct}%`;
  };

  list.addEventListener('change', e => {
    const box = e.target;
    dreams[Number(box.dataset.i)].ok = box.checked;
    store.set(KEY, dreams);
    if (box.checked) {
      const r = box.closest('label').getBoundingClientRect();
      boom({ particleCount: 30, spread: 45, origin: { x: (r.left + 30) / innerWidth, y: (r.top + r.height / 2) / innerHeight } });
    }
    render();
    if (progress(dreams) === 100) boom({ particleCount: 200, spread: 120 });
  });

  $('#addForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#addInput'), text = input.value.trim();
    if (!text) return;
    dreams.push({ t: text, ok: false });
    store.set(KEY, dreams);
    input.value = '';
    render();
  });

  render();
  return { list: () => dreams };
}
