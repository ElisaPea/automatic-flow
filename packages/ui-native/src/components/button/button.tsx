import { Pressable, Text } from 'react-native';
import { Spinner } from '../spinner/spinner';
import { styles, variants, type ButtonVariant } from './button.styles';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({ label, onPress, variant = 'primary', loading, disabled }: ButtonProps) => {
  const { bg, fg } = variants[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading && <Spinner color={fg} />}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
};
