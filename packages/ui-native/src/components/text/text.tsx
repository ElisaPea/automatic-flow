import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';
import { colors } from '../../theme/tokens';

const tones = { default: colors.fg, muted: colors.fgMuted, danger: colors.danger } as const;

export interface TextProps extends RNTextProps {
  tone?: keyof typeof tones;
  variant?: 'body' | 'small' | 'title' | 'heading';
}

export const Text = ({ tone = 'default', variant = 'body', style, ...rest }: TextProps) => (
  <RNText style={[styles[variant], { color: tones[tone] }, style]} {...rest} />
);

const styles = StyleSheet.create({
  body: { fontSize: 16 },
  small: { fontSize: 13 },
  title: { fontSize: 20, fontWeight: '600' },
  heading: { fontSize: 28, fontWeight: '700' },
});
