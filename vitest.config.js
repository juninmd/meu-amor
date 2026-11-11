import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['js/**/*.js'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }
    }
  }
});
