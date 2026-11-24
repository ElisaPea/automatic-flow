import { HealthController } from './health/health.controller';
import { ProfileController } from './profile/profile.controller';

/** Registro explícito de controllers: más rápido y fiable que globs en serverless. */
export const controllers = [HealthController, ProfileController];
