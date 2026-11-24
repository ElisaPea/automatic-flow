import { getAuth } from '@clerk/express';
import type { Request } from 'express';
import type { Action } from 'routing-controllers';
import type { AuthUser } from './auth-user';

const readAuth = (action: Action): AuthUser | null => {
  const auth = getAuth(action.request as Request);
  if (!auth.userId) return null;
  return { userId: auth.userId, sessionId: auth.sessionId, orgId: auth.orgId ?? null };
};

/** Usado por @Authorized(). Sin sesión → 401 (routing-controllers lanza AuthorizationRequiredError). */
export const authorizationChecker = (action: Action, roles: string[]): boolean => {
  const user = readAuth(action);
  if (!user) return false;
  // Ampliar aquí con roles/permisos de Clerk (orgRole, metadata) cuando haga falta.
  return roles.length === 0;
};

/** Usado por @CurrentUser(). */
export const currentUserChecker = (action: Action): AuthUser | null => readAuth(action);
