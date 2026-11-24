'use server';

import { updateProfileSchema, type Profile } from '@af/schemas';
import { toUserMessage } from '@af/api-client';
import { serverApi } from '@/lib/api/server-api';

export type UpdateDisplayNameState =
  | { status: 'idle' }
  | { status: 'success'; profile: Profile }
  | { status: 'error'; message: string };

export const updateDisplayName = async (
  _prev: UpdateDisplayNameState,
  formData: FormData,
): Promise<UpdateDisplayNameState> => {
  // Validación en cliente-servidor con el MISMO esquema que usa la API.
  const parsed = updateProfileSchema.safeParse({ displayName: formData.get('displayName') });
  if (!parsed.success)
    return { status: 'error', message: 'El nombre debe tener entre 1 y 80 caracteres.' };

  const result = await (await serverApi()).profile.update(parsed.data);
  if (!result.ok) return { status: 'error', message: toUserMessage(result.error) };
  return { status: 'success', profile: result.data };
};
