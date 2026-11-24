import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

export interface InputProps extends TextInputProps {
  invalid?: boolean;
}

export const Input = ({ invalid, style, ...rest }: InputProps) => (
  <TextInput
    placeholderTextColor={colors.fgMuted}
    style={[styles.input, invalid && styles.invalid, style]}
    {...rest}
  />
);

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.fg,
    backgroundColor: colors.surface,
  },
  invalid: { borderColor: colors.danger },
});
