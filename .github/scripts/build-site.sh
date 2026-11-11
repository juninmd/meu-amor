#!/usr/bin/env bash
# Copies only what the browser needs, so tests, tooling and docs are never published.
set -euo pipefail
out="${1:-_site}"
rm -rf "$out"
mkdir -p "$out"
find . -maxdepth 1 -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.jpg' \
  -o -name '*.png' -o -name '*.svg' -o -name '*.webp' -o -name '*.ico' \) \
  ! -name 'vitest.config.js' -exec cp {} "$out/" \;
for dir in css js; do
  if [ -d "$dir" ]; then cp -r "$dir" "$out/"; fi
done
touch "$out/.nojekyll"
echo "Site montado em $out:" && find "$out" -type f | sort
