# Instrucciones para agentes

- Sigue SIEMPRE `CODING_GUIDELINES.md`. Es obligatorio, no orientativo.
- Antes de crear UI: revisa `packages/ui` (web) y `packages/ui-native` (mobile). Compón; si falta algo, créalo en la suite.
- Contratos de datos en `packages/schemas` (Zod). HTTP solo con `fetch` vía `packages/api-client`.
- Backend: controller → service → repository; errores con `core/errors`; nunca 500. Todo debe funcionar en Vercel Functions y en servidor clásico.
- Antes de terminar: `pnpm lint && pnpm typecheck && pnpm test`.
