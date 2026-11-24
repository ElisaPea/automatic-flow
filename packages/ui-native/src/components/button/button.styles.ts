import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

export const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  label: { fontSize: 16, fontWeight: '600' },
});

export const variants = {
  primary: { bg: colors.brand, fg: colors.brandFg },
  secondary: { bg: colors.surfaceMuted, fg: colors.fg },
  danger: { bg: colors.danger, fg: '#ffffff' },
} as const;

export type ButtonVariant = keyof typeof variants;
