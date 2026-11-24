import 'reflect-metadata';
import { clerkMiddleware } from '@clerk/express';
import express, { type Express } from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { loadEnv, type Env } from './config/env';
import { authorizationChecker, currentUserChecker } from './core/auth/checkers';
import { CACHE } from './core/cache';
import { logger } from './core/logger/logger';
import { registerProviders } from './container';
import * as mw from './middlewares';
import { controllers } from './modules';
import { createUnavailableApp } from './unavailable-app';

const buildApp = (env: Env): Express => {
  registerProviders(env);
  useContainer(Container);

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', true); // IP real detrás de Vercel/Load balancers
  app.use(mw.requestId, mw.requestLogger, mw.requestTimeout(env.REQUEST_TIMEOUT_MS));
  app.use(...mw.securityAndPerf(env));
  app.use(
    mw.rateLimit(Container.get(CACHE), {
      max: env.RATE_LIMIT_MAX,
      windowSeconds: env.RATE_LIMIT_WINDOW_S,
    }),
  );
  app.use(express.json({ limit: env.BODY_LIMIT }));
  // Clerk solo en rutas de negocio: /health queda libre y rápido.
  app.use(
    '/v1',
    clerkMiddleware({ secretKey: env.CLERK_SECRET_KEY, publishableKey: env.CLERK_PUBLISHABLE_KEY }),
  );

  useExpressServer(app, {
    controllers,
    defaultErrorHandler: false,
    validation: false,
    classTransformer: false,
    authorizationChecker,
    currentUserChecker,
  });

  app.use(mw.notFound);
  app.use(mw.errorHandler);
  return app;
};

/** Crea la app Express. Si la configuración es inválida, devuelve una app que responde 503. */
export const createApp = (source: NodeJS.ProcessEnv = process.env): Express => {
  const result = loadEnv(source);
  if (result.ok) return buildApp(result.env);
  logger.fatal({ issues: result.issues }, 'Configuración inválida: la API responderá 503');
  return createUnavailableApp();
};
