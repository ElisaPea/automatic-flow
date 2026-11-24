// Entrada para Vercel Functions. Reutiliza exactamente la misma app que el servidor clásico.
// El código se compila con tsc (necesitamos emitDecoratorMetadata) → importamos desde dist.
const { createApp } = require('../dist/app');

module.exports = createApp();
