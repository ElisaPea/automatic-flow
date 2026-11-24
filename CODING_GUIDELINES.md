# Guía de codificación

> **Directriz máxima:** fluidez en el frontend, respuestas rápidas en el backend.
> **Regla de oro de la API:** cubrir todos los casos. Un `500` es un bug.

Estas reglas son obligatorias. Muchas se comprueban con ESLint (`pnpm lint`) y bloquean el CI;
el resto se revisa en code review. Si una regla molesta, se cambia esta guía en un PR, no se ignora.

---

## 1. Reglas generales (todo el monorepo)

| Regla                                                                                           | Cómo se aplica                                 |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Archivos pequeños: **≤ 200 líneas** (≤ 150 en componentes React)                                | ESLint `max-lines`                             |
| Funciones cortas: **≤ 60 líneas** (≤ 80 en componentes)                                         | ESLint `max-lines-per-function`                |
| Complejidad ciclomática **≤ 10**, anidamiento **≤ 3**, **≤ 4** parámetros                       | ESLint `complexity`, `max-depth`, `max-params` |
| Prohibido `any`. Usa `unknown` + validación Zod                                                 | ESLint `no-explicit-any`                       |
| Imports de solo tipos con `import type`                                                         | ESLint `consistent-type-imports`               |
| **Siempre `fetch`**. Prohibido axios, ky, got, node-fetch...                                    | ESLint `no-restricted-imports`                 |
| Nada de `console.log`. Backend: `logger` (pino). Front: solo `console.error/warn` en boundaries | ESLint `no-console`                            |
| Nunca un `catch {}` vacío ni tragarse errores                                                   | ESLint `no-empty` + review                     |
| Formato con Prettier (`pnpm format`)                                                            | Prettier                                       |
| Nombres de archivo en `kebab-case`; un concepto por archivo                                     | Review                                         |
| Sin "magic numbers": constantes con nombre (`TTL_SECONDS`, `SLOW_MS`)                           | Review                                         |

### Validación de tipos con Zod

- **Todo dato que cruza una frontera se valida con Zod**: body/query/params en la API, respuestas
  de la API en los clientes, variables de entorno en todas las apps.
- Los esquemas compartidos viven en **`@af/schemas`**. Front, mobile y back importan el mismo
  esquema; nunca se duplican tipos a mano. El tipo se deriva: `type X = z.infer<typeof xSchema>`.

### Gestión de errores — siempre

- Ninguna función asíncrona se deja sin tratar su error.
- Los errores se identifican por **código estable** (`ErrorCode` en `@af/schemas`), nunca por el texto.
- Los clientes **nunca lanzan**: `@af/api-client` devuelve `ApiResult<T>` (`{ ok: true, data } | { ok: false, error }`)
  y la UI debe pintar ambos casos.

---

## 2. Frontend (web y mobile)

### 2.1 Suite de componentes primero

1. **Antes de crear cualquier funcionalidad** se comprueba la suite: `@af/ui` (web) y `@af/ui-native` (mobile).
2. Si una feature necesita UI, **primero se intenta componer** con componentes existentes
   (`Stack` + `Card` + `Text` + `Button`...). **La composición es la clave.**
3. Si falta algo, **se crea en la suite** (`packages/ui` / `packages/ui-native`), nunca dentro de la app.
   La app solo contiene componentes de _feature_ que componen piezas de la suite.
4. Si un componente se añade en una suite, se valora añadir su equivalente en la otra.
5. Los tokens (colores, radios, espaciados) se mantienen sincronizados entre
   `packages/ui/src/styles.css` y `packages/ui-native/src/theme/tokens.ts`.

### 2.2 Componentes pequeños

- Un componente por archivo, una carpeta por componente en la suite (`components/button/button.tsx`).
- Variantes y estilos en archivos aparte cuando crecen (`button.variants.ts`, `button.styles.ts`).
- Props explícitas y tipadas; aceptar `className`/`style` para composición.
- Sin lógica de datos en componentes de la suite: son **presentacionales**.
- Accesibilidad por defecto: roles, `aria-*`, `accessibilityRole`, labels enlazados (`Field`).

### 2.3 Separación de lógica

Estructura por feature:

```
features/<feature>/
  components/   # UI de la feature (compone la suite)
  hooks/        # estado y efectos (mobile / client components)
  queries/      # lectura de datos (web: server-only)
  actions/      # mutaciones (web: Server Actions)
```

- Los componentes no llaman a `fetch` directamente: usan el cliente de `@af/api-client`
  a través de `queries/`, `actions/` o `hooks/`.
- Web: datos en **Server Components** por defecto; `'use client'` solo donde hay interacción.

### 2.4 Fluidez

- Toda vista con datos tiene **3 estados**: carga (`Skeleton`/`Spinner`), error (`ErrorState` con
  reintento) y contenido (o `EmptyState`).
- Web: `Suspense` + streaming y `loading.tsx` para pintar al instante; `error.tsx` en cada segmento
  relevante y `global-error.tsx` como red final.
- Botones con `loading` durante mutaciones (`useActionState`); nada de dobles envíos.
- Evitar _layout shift_: los skeletons tienen el tamaño del contenido final.
- Mobile/tablet: usar `Screen` (safe-area + ancho máximo en tablet) y `useBreakpoint` para adaptar layouts.

---

## 3. Backend (API)

### 3.1 Arquitectura en capas

```
modules/<feature>/
  <feature>.controller.ts   # HTTP: rutas, @Authorized, @ZodBody. SIN lógica.
  <feature>.service.ts      # Negocio + caché. Sin Express ni SQL.
  <feature>.repository.ts   # Solo SQL parametrizado.
  <feature>.mapper.ts       # Fila BD → DTO público (nunca devolver filas crudas).
  <feature>.types.ts        # Tipos internos (filas).
```

- Todas las clases son `@Service()` de TypeDI y reciben dependencias **por constructor**.
- Dependencias que no son clases (config, caché) se inyectan con tokens: `@Inject(ENV)`, `@Inject(CACHE)`.
- Los controllers se registran explícitamente en `src/modules/index.ts` (nada de globs).
- **Nunca `import type`** para clases inyectadas por constructor: TypeDI necesita el valor en runtime.

### 3.2 Validación

- Entrada: `@ZodBody(schema)`, `@ZodQuery(schema)`, `@ZodParams(schema)` → 422 `validation_failed` automático.
- Los esquemas de entrada/salida se definen en `@af/schemas`.

### 3.3 Cubrir todos los casos — 500 es inaceptable

- Lanza siempre errores de `core/errors` (`notFound()`, `conflict()`, `forbidden()`...).
- `DatabaseService` ya traduce errores de Postgres (duplicado → 409, timeout → 504,
  BD caída/no migrada → 503...). Si aparece un código nuevo, se añade a `pg-error.ts`.
- El `errorHandler` solo responde 500 ante un error **no mapeado**, y lo registra como
  `fatal` con `UNHANDLED_ERROR`. **Cualquier `UNHANDLED_ERROR` en logs es un bug prioritario**:
  se corrige mapeando el caso.
- Cada endpoint nuevo incluye tests de: éxito, validación (422), auth (401/403), no encontrado (404)
  y dependencia caída (503).
- Respuesta de error homogénea: `{ error: { code, message, requestId, details? } }`.

### 3.4 Middlewares para problemas comunes

Antes de escribir lógica repetida en un controller, se resuelve con un middleware en `src/middlewares/`:

| Middleware                  | Problema que resuelve                                |
| --------------------------- | ---------------------------------------------------- |
| `requestId`                 | Correlación de logs/errores                          |
| `requestLogger`             | Latencia por petición; marca peticiones lentas       |
| `requestTimeout`            | 504 controlado antes de que la plataforma corte      |
| `securityAndPerf`           | helmet, CORS con preflight cacheado 24h, compresión  |
| `rateLimit`                 | Abuso / picos (sobre el `CacheProvider`)             |
| `publicCache` / `noStore`   | Cache-Control para CDN (lecturas públicas) o privado |
| `notFound` / `errorHandler` | Formato de error uniforme                            |

### 3.5 Rendimiento

- Una consulta por petición siempre que sea posible (`INSERT ... ON CONFLICT ... RETURNING`).
- Selecciona columnas explícitas, nunca `SELECT *`. Índices para cada filtro nuevo.
- Lecturas frecuentes: `cacheAside()` con TTL corto e invalidación en escritura.
- Lecturas públicas: `publicCache({ sMaxAge })` para que la CDN responda sin tocar la función.
- Clerk solo se monta en `/v1`: los health checks no pagan verificación de JWT.

### 3.6 Caché

- Los servicios dependen solo de la interfaz `CacheProvider` (token `CACHE`).
- Drivers: `memory` (por instancia), `upstash` (Redis REST vía fetch, global), `none`.
- Para añadir otro (Redis TCP, Memcached...): implementar `CacheProvider` y registrarlo en `cache.factory.ts`.
- La caché es **fail-open** (`ResilientCache`): si cae, se registra y la petición continúa.

### 3.7 Compatible con serverless **y** servidor clásico

Toda feature debe funcionar en ambos modos (hoy Vercel Functions; mañana una instancia):

- **Sin estado en memoria que deba persistir** entre peticiones (usar BD o `CacheProvider`).
- Nada de `setInterval`, colas o websockets en el proceso; trabajos en segundo plano → servicio externo.
- Nada de escribir en disco (el filesystem de Vercel es de solo lectura).
- Conexiones reutilizables (`getPool()` singleton en `globalThis`) y pool pequeño en serverless.
- `createApp()` es el único punto de construcción: `server.ts` (clásico) y `api/index.js` (Vercel) lo reutilizan.
- Cualquier operación debe terminar por debajo de `REQUEST_TIMEOUT_MS`.

---

## 4. Checklist de PR

- [ ] ¿He reutilizado/compuesto componentes de la suite? ¿Los nuevos están en la suite?
- [ ] ¿Archivos y funciones pequeños? `pnpm lint` sin errores ni warnings nuevos.
- [ ] ¿Toda entrada/salida validada con Zod desde `@af/schemas`?
- [ ] ¿Estados de carga, error y vacío en la UI?
- [ ] ¿Todos los casos del endpoint cubiertos y testeados (sin 500)?
- [ ] ¿Funciona igual en Vercel Functions y como servidor clásico?
- [ ] ¿Variables de entorno nuevas añadidas a `.env.*.example` y al esquema Zod?
- [ ] `pnpm typecheck && pnpm test` en verde.
