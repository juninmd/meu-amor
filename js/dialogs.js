import { $$, prefersReduced } from './utils.js';

const hooks = {};

// Games register what to (re)initialise each time their sheet opens.
export const onOpen = (id, fn) => { hooks[id] = fn; };

export function openDialog(id) {
  const d = document.getElementById(id);
  if (!d) return null;
  if (!d.open) {
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }
  hooks[id]?.(d);
  return d;
}

export function closeDialog(d) {
  const finish = () => {
    d.classList.remove('closing');
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  };
  if (prefersReduced()) return finish();
  d.classList.add('closing');
  setTimeout(finish, 200);
}

export function initDialogs() {
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) openDialog(opener.dataset.open);
    const closer = e.target.closest('[data-close]');
    if (closer) closeDialog(closer.closest('dialog'));
  });
  // A click whose target is the <dialog> itself landed on the backdrop.
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) closeDialog(d); }));
}
