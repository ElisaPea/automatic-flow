import { Card, ErrorState, Heading, Stack, Text } from '@af/ui';
import { toUserMessage } from '@af/api-client';
import { getMyProfile } from '../queries/get-my-profile';
import { DisplayNameForm } from './display-name-form';

/** Server Component: obtiene datos y decide qué estado pintar (error / contenido). */
export const ProfileSection = async () => {
  const result = await getMyProfile();
  if (!result.ok) return <ErrorState message={toUserMessage(result.error)} />;

  const profile = result.data;
  return (
    <Card>
      <Stack gap="md">
        <Heading level={3}>{profile.displayName ?? 'Sin nombre'}</Heading>
        <Text tone="muted" size="sm">
          Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-ES')}
        </Text>
        <DisplayNameForm defaultValue={profile.displayName ?? ''} />
      </Stack>
    </Card>
  );
};
