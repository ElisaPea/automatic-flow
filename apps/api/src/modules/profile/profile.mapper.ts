import type { Profile } from '@af/schemas';
import type { ProfileRow } from './profile.types';

/** Fila de BD → DTO público. Nunca devolver filas crudas al cliente. */
export const toProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  clerkUserId: row.clerk_user_id,
  displayName: row.display_name,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});
