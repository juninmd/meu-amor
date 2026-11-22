# AGENTS.md

Meu Amor: a personal, static birthday-style web page in vanilla JS (hero, letter, gallery, dreams, mini-games). No backend.

## Stack

- Vanilla JS ES modules (`js/`), CSS (`css/`), static `index.html`.
- Tests: Vitest with jsdom and v8 coverage (`vitest.config.js`).
- Node 22 in CI (`pages.yml`). Dependencies are pinned in `package-lock.json`.

## Commands

```bash
npm ci               # setup (CI uses npm, not pnpm)
npm test             # vitest run --coverage (80% thresholds on js/**/*.js)
./.github/scripts/build-site.sh _site   # copy the publishable files to _site/ (what Pages deploys)
```

CI: `validate.yml` runs `npm ci && npm test` when `package-lock.json` exists. `pages.yml` builds and deploys `_site/`.

## Structure

- `index.html`: single page. `css/`: `base.css`, `sections.css`, `playground.css`.
- `js/`: `main.js` (entry), `config.js` (texts and settings), `hero.js`, `letter.js`, `gallery.js`, `dreams.js`, `sky.js`, `timers.js`, `nav.js`, `dialogs.js`, `utils.js`.
- `js/games/`: mini-games (`calc`, `extras`, `memory`, `quiz`, `scratch`).
- `photo_*.jpg` (root): gallery photos referenced by `js/config.js`, `index.html` and `README.md`. Personal content, do not rename or remove.
- `docs/readme/`: README screenshots.
- `tests/`: `app.test.js`, `logic.test.js`, `setup.js`.

## Conventions

- Code principles: DRY, KISS, single responsibility per module, and no speculative features (YAGNI).
- Max 180 lines per code file. Split the file when it grows.
- Naming: camelCase for variables and functions, PascalCase for classes.
- Comments explain why the code does something, not what it does. Keep them short.
- Use configuration files for inputs and settings (`js/config.js`), not hardcoded values.
- All code must be tested. Coverage thresholds (80% lines, functions, branches, statements) are enforced by `vitest.config.js`; do not lower them.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.

## Gotchas

- `build-site.sh` publishes only top-level `*.html|css|js|jpg|png|svg|webp|ico` plus `css/` and `js/`. Add a new top-level asset type there, or Pages will skip it.
- The `photo_*.jpg` files at the root are personal photos. Changing them changes the published page.
- No secrets are used. Keep personal data out of new files beyond the content the page already shows.
