import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBreakpoint } from '../../hooks/use-breakpoint';
import { colors, spacing } from '../../theme/tokens';

const TABLET_CONTENT_WIDTH = 720;

/** Contenedor de pantalla: safe-area + scroll + ancho máximo centrado en tablet. */
export const Screen = ({ children }: { children: ReactNode }) => {
  const { isTablet } = useBreakpoint();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, isTablet && styles.tablet]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.md, gap: spacing.md },
  tablet: {
    width: '100%',
    maxWidth: TABLET_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: spacing.xl,
  },
});
