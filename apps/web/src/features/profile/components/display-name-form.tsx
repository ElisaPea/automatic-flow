'use client';

import { Alert, Button, Field, Input, Stack } from '@af/ui';
import { useActionState } from 'react';
import { updateDisplayName, type UpdateDisplayNameState } from '../actions/update-display-name';

const initial: UpdateDisplayNameState = { status: 'idle' };

export const DisplayNameForm = ({ defaultValue }: { defaultValue: string }) => {
  const [state, action, pending] = useActionState(updateDisplayName, initial);
  return (
    <form action={action}>
      <Stack gap="sm">
        <Field label="Nombre visible" error={state.status === 'error' ? state.message : undefined}>
          {(control) => (
            <Input
              name="displayName"
              defaultValue={defaultValue}
              maxLength={80}
              required
              {...control}
            />
          )}
        </Field>
        {state.status === 'success' && <Alert tone="success">Guardado</Alert>}
        <Button type="submit" loading={pending} className="self-start">
          Guardar
        </Button>
      </Stack>
    </form>
  );
};
