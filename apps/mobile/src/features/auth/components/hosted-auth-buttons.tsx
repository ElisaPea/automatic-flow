import { Button, Stack, Text } from '@af/ui-native';
import { useHostedAuth } from '@clerk/expo/hosted-auth';
import { useState } from 'react';

type Mode = 'sign-in' | 'sign-up';

/** Login con la página hospedada de Clerk (incluye email, OAuth, MFA...). */
export const HostedAuthButtons = () => {
  const { startHostedAuth } = useHostedAuth();
  const [pending, setPending] = useState<Mode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async (mode: Mode) => {
    setPending(mode);
    setError(null);
    try {
      await startHostedAuth({ mode });
    } catch {
      setError('No se pudo completar el inicio de sesión. Inténtalo de nuevo.');
    } finally {
      setPending(null);
    }
  };

  return (
    <Stack gap="sm">
      <Button
        label="Iniciar sesión"
        loading={pending === 'sign-in'}
        onPress={() => start('sign-in')}
      />
      <Button
        label="Crear cuenta"
        variant="secondary"
        loading={pending === 'sign-up'}
        onPress={() => start('sign-up')}
      />
      {error && <Text tone="danger">{error}</Text>}
    </Stack>
  );
};
