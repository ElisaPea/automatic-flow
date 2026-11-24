import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

export const Card = ({ style, ...rest }: ViewProps) => (
  <View style={[styles.card, style]} {...rest} />
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius,
    padding: spacing.lg,
  },
});
