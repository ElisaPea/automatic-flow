import { Button, Screen, Stack, Text, useBreakpoint } from '@af/ui-native';
import { useClerk } from '@clerk/expo';
import { ProfileSection } from '@/features/profile/components/profile-section';

export default function HomeScreen() {
  const { signOut } = useClerk();
  const { isTablet } = useBreakpoint();
  return (
    <Screen>
      <Stack gap="lg">
        <Text variant="heading">{isTablet ? 'Dashboard' : 'Inicio'}</Text>
        <ProfileSection />
        <Button label="Cerrar sesión" variant="secondary" onPress={() => void signOut()} />
      </Stack>
    </Screen>
  );
}
