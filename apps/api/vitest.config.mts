import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC en lugar de esbuild: necesitamos emitDecoratorMetadata para TypeDI.
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: { environment: 'node', env: { LOG_LEVEL: 'silent' }, include: ['test/**/*.test.ts'] },
});
