import { Container } from 'typedi';
import { ENV, type Env } from './config/env';
import { CACHE, createCache } from './core/cache';
import { logger } from './core/logger/logger';

/** Registra en el contenedor las dependencias que no son clases @Service (config, caché...). */
export const registerProviders = (env: Env): void => {
  Container.set(ENV, env);
  if (!Container.has(CACHE)) Container.set(CACHE, createCache(env, logger));
};
