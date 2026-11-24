# Automatic Flow

Monorepo (Turborepo + pnpm) con:

| App / paquete       | Stack                                                                                         | Ruta                     |
| ------------------- | --------------------------------------------------------------------------------------------- | ------------------------ |
| **Web**             | Next.js 16 (App Router) + Tailwind 4 + Clerk                                                  | `apps/web`               |
| **Mobile**          | Expo (React Native) + expo-router + Clerk — móvil y tablet                                    | `apps/mobile`            |
| **API**             | Node.js + Express + routing-controllers (decorators) + TypeDI + PostgreSQL (Supabase) + Clerk | `apps/api`               |
| `@af/schemas`       | Esquemas Zod compartidos (contrato front ↔ back)                                              | `packages/schemas`       |
| `@af/api-client`    | Cliente HTTP tipado basado en `fetch`                                                         | `packages/api-client`    |
| `@af/ui`            | Suite de componentes web                                                                      | `packages/ui`            |
| `@af/ui-native`     | Suite de componentes mobile/tablet                                                            | `packages/ui-native`     |
| `@af/eslint-config` | Reglas de estilo compartidas                                                                  | `packages/eslint-config` |

> 📐 Antes de escribir código lee **[CODING_GUIDELINES.md](CODING_GUIDELINES.md)**.

Servicios externos:

- **Supabase** (PostgreSQL): proyecto `cnvimjwjonwcqllbqthe` (eu-west-1). El desarrollo local usa directamente esta BD.
- **Clerk**: aplicación `app_3MKUJK4usfkfPUgOCVXb0Tctu6r`.
- **Vercel**: el front se despliega en el proyecto `prj_9IzAmsAjFnsWlgIAy5eanteLm9Tw`.

---

## 1. Requisitos

- Node.js **≥ 22** (`nvm use`)
- pnpm **12** (`corepack enable`)
- Mobile: app **Expo Go** en el dispositivo, o Xcode / Android Studio para simuladores.

## 2. Instalación

```bash
pnpm install
```

## 3. Variables de entorno

Cada app tiene dos plantillas versionadas:

- `.env.development.example` → valores de **desarrollo** (cópiala a `.env.local`).
- `.env.production.example` → referencia de **producción** (se configuran en Vercel/EAS/plataforma, no como archivo).

```bash
cp apps/api/.env.development.example    apps/api/.env.local
cp apps/web/.env.development.example    apps/web/.env.local
cp apps/mobile/.env.development.example apps/mobile/.env.local
```

Los valores públicos (URL de Supabase, publishable key de Clerk) ya vienen rellenos. Completa los secretos marcados con `<...>`:

| Secreto                           | Dónde obtenerlo                                                                       | Usado en |
| --------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| `DATABASE_URL` (contraseña)       | Supabase → Project → **Connect** → Session pooler (dev) / Transaction pooler (Vercel) | api      |
| `CLERK_SECRET_KEY`                | Clerk → **API Keys**                                                                  | api, web |
| `UPSTASH_REDIS_REST_*` (opcional) | Upstash → base de datos Redis → REST API                                              | api      |

> Los `.env.local` y cualquier `.env.*` real están en `.gitignore`. Nunca se commitean.
> Comprueba el host del pooler en el dashboard de Supabase (`aws-0-…` o `aws-1-…`).

Todas las apps validan su entorno con Zod al arrancar. La API, si la configuración es inválida,
responde `503` en todas las rutas (y lo registra) en lugar de caerse.

## 4. Base de datos

Las migraciones son SQL plano en `supabase/migrations/` y se aplican en orden:

```bash
pnpm db:migrate
```

Usa `DATABASE_URL` (o `DATABASE_MIGRATION_URL` si quieres otra conexión para DDL) de `apps/api/.env.local`.
Las tablas tienen RLS activado sin políticas: solo el backend accede a los datos.

## 5. Levantar el proyecto en local

```bash
pnpm dev            # todo a la vez (TUI de Turborepo)
pnpm dev:api        # API      → http://localhost:4000
pnpm dev:web        # Web      → http://localhost:3000
pnpm dev:mobile     # Expo     → escanea el QR con Expo Go (o pulsa i / a)
```

Los paquetes compartidos (`@af/schemas`, `@af/api-client`) se compilan automáticamente antes (`dependsOn: ^build`).

Al arrancar, API y web muestran un banner con su **puerto** y URL. `pnpm dev:web` (y `pnpm dev`)
espera a que Next responda y **abre la web en Chrome** (si no está instalado, en el navegador por defecto).

- Cambiar puerto: `PORT=3001 pnpm dev:web` · `PORT` en `apps/api/.env.local` para la API.
- No abrir el navegador: `OPEN_BROWSER=false pnpm dev:web` (o `pnpm --filter @af/web dev:no-open`).
- Si el puerto de la API está ocupado, se muestra un error claro en lugar de un stack trace.

### API

- `GET /health` — liveness (sin dependencias).
- `GET /health/ready` — readiness (comprueba la BD; `503` si cae).
- `GET /v1/profile/me` — perfil del usuario autenticado (Bearer JWT de Clerk).
- `PATCH /v1/profile/me` — `{ "displayName": "..." }`.

El modo dev usa SWC (`@swc-node/register`) con recarga al guardar y soporte de `emitDecoratorMetadata`.

### Mobile

- iOS con `"supportsTablet": true` y orientación libre; el layout se adapta con `useBreakpoint`.
- En un **dispositivo físico**, `EXPO_PUBLIC_API_URL` debe ser la IP LAN de tu máquina (no `localhost`).
- El login usa la página hospedada de Clerk (`useHostedAuth`). Si Clerk lo pide, activa
  _Native API_ y añade `automaticflow://` a las redirect URLs permitidas en el dashboard.
- Para módulos nativos a medida: `npx expo prebuild` o EAS Build (`eas build`).

## 6. Calidad

```bash
pnpm lint         # ESLint con las reglas de CODING_GUIDELINES.md
pnpm typecheck    # TypeScript estricto en todo el monorepo
pnpm test         # Vitest (API: errores, health, auth, JSON inválido, config inválida...)
pnpm format       # Prettier
```

## 7. Despliegue

### Web → Vercel (`prj_9IzAmsAjFnsWlgIAy5eanteLm9Tw`)

1. Vercel → Project Settings → General → **Root Directory**: `apps/web` (framework: Next.js).
2. Install/Build los define `apps/web/vercel.json` (instala desde la raíz y compila con Turborepo).
3. Environment Variables: las de `apps/web/.env.production.example` (y las de dev para _Preview_ si se desea).

### API → Vercel Functions (modo actual)

1. Crea un **segundo proyecto** en Vercel con el mismo repositorio y **Root Directory** `apps/api`.
2. `apps/api/vercel.json` ya define install, build (`tsc` → `dist/`), la función `api/index.js` y el rewrite de todas las rutas.
3. Variables: las de `apps/api/.env.production.example`. En serverless usa el **Transaction pooler** (puerto 6543), `DB_POOL_MAX=2` y `CACHE_DRIVER=upstash`.
4. Mantén `REQUEST_TIMEOUT_MS` por debajo de `maxDuration` (10 s).

> La función reutiliza exactamente la misma `createApp()` que el servidor clásico. Se compila con
> `tsc` porque los decoradores de TypeDI necesitan `emitDecoratorMetadata`.

### API → instancia clásica (Render, Railway, Heroku, Fly, VM...)

Cualquier plataforma que pida un repositorio:

| Campo         | Valor                                                                     |
| ------------- | ------------------------------------------------------------------------- |
| Root          | raíz del repositorio                                                      |
| Build command | `pnpm install --frozen-lockfile && pnpm turbo run build --filter=@af/api` |
| Start command | `pnpm --filter @af/api start`                                             |
| Health check  | `/health/ready`                                                           |

O con Docker (desde la raíz):

```bash
docker build -f apps/api/Dockerfile -t af-api .
docker run -p 4000:4000 --env-file apps/api/.env.local af-api
```

En instancia clásica puedes subir `DB_POOL_MAX` (10–20) y usar `CACHE_DRIVER=memory` o `upstash`.
El servidor gestiona `SIGTERM` (cierre ordenado del pool) y keep-alive compatible con balanceadores.

### Mobile → EAS

```bash
cd apps/mobile
npx eas-cli build --platform all       # builds nativos
npx eas-cli env:create                 # variables EXPO_PUBLIC_* de producción
```

## 8. Caché

La API depende de la interfaz `CacheProvider` (`apps/api/src/core/cache`). Driver por `CACHE_DRIVER`:

- `memory` — LRU en proceso (dev o instancia única).
- `upstash` — Redis REST vía `fetch` (global, apto para serverless).
- `none` — desactivada.

Para añadir otro backend (Redis TCP, Memcached…) implementa `CacheProvider` y regístralo en
`cache.factory.ts`. La caché es _fail-open_: si falla, la petición continúa sin ella.

## 9. Estructura

```
apps/
  api/      src/{config,core,middlewares,modules}, api/index.js (Vercel), Dockerfile
  web/      src/{app,features,lib}, proxy.ts (Clerk)
  mobile/   app/ (expo-router), src/{features,lib}
packages/
  schemas/  api-client/  ui/  ui-native/  eslint-config/
supabase/migrations/
```
