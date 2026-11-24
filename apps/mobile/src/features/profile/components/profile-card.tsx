import type { Profile } from '@af/schemas';
import { Card, Stack, Text } from '@af/ui-native';

export const ProfileCard = ({ profile }: { profile: Profile }) => (
  <Card>
    <Stack gap="xs">
      <Text variant="title">{profile.displayName ?? 'Sin nombre'}</Text>
      <Text tone="muted" variant="small">
        Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-ES')}
      </Text>
    </Stack>
  </Card>
);
