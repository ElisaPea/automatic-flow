# Imagen para desplegar la API como servicio clásico. Construir desde la RAÍZ del repo:
#   docker build -f apps/api/Dockerfile -t af-api .
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS prune
COPY . .
RUN pnpm dlx turbo@^2 prune @af/api --docker

FROM base AS build
COPY --from=prune /repo/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=prune /repo/out/full/ .
RUN pnpm turbo run build --filter=@af/api && pnpm prune --prod

FROM node:22-alpine AS run
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=build /repo .
USER node
EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
