import { $ } from './utils.js';
import { createSky } from './sky.js';
import { initTimers } from './timers.js';
import { initHero, initMap } from './hero.js';
import { initGallery } from './gallery.js';
import { initDialogs } from './dialogs.js';
import { initMemory } from './games/memory.js';
import { initScratch } from './games/scratch.js';
import { initQuiz } from './games/quiz.js';
import { initCalc } from './games/calc.js';
import { initExtras } from './games/extras.js';
import { initDreams } from './dreams.js';
import { initLetter, initSecrets } from './letter.js';
import { initTheme, initMusic, initDock, initTilt } from './nav.js';

// Each feature fails alone instead of taking the whole page down with it.
export const safe = (name, fn) => {
  try {
    return fn();
  } catch (err) {
    console.error(`[meu-amor] ${name} falhou`, err);
    return undefined;
  }
};

export function boot() {
  const sky = createSky($('#sky'));
  const music = safe('música', initMusic) || { play() {} };
  safe('tema', () => initTheme(sky));
  safe('hero', () => initHero(sky, music));
  safe('contadores', initTimers);
  safe('galeria', initGallery);
  safe('mapa', initMap);
  safe('sheets', initDialogs);
  safe('memória', initMemory);
  safe('raspadinha', initScratch);
  safe('quiz', initQuiz);
  safe('calculadora', initCalc);
  safe('extras', initExtras);
  safe('sonhos', initDreams);
  safe('carta', initLetter);
  safe('segredos', initSecrets);
  safe('dock', initDock);
  safe('tilt', initTilt);
  return sky;
}

boot();
