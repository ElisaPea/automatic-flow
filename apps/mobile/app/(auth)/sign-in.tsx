import { Screen, Stack, Text } from '@af/ui-native';
import { HostedAuthButtons } from '@/features/auth/components/hosted-auth-buttons';

export default function SignInScreen() {
  return (
    <Screen>
      <Stack gap="lg">
        <Text variant="heading">Automatic Flow</Text>
        <Text tone="muted">Inicia sesión para continuar</Text>
        <HostedAuthButtons />
      </Stack>
    </Screen>
  );
}
