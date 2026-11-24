import globals from 'globals';
import base from './base.js';

export default [
  ...base,
  {
    languageOptions: {
      globals: { ...globals.node },
      // Imprescindible: con DI (TypeDI) los tipos de constructor son VALORES en runtime.
      // Así consistent-type-imports no convierte esos imports en `import type`.
      parserOptions: { experimentalDecorators: true, emitDecoratorMetadata: true },
    },
    rules: {
      // En backend se usa el logger (pino). Ni siquiera console.warn/error.
      'no-console': 'error',
    },
  },
];
