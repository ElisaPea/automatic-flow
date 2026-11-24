import { ActivityIndicator } from 'react-native';
import { colors } from '../../theme/tokens';

export const Spinner = ({ color = colors.brand }: { color?: string }) => (
  <ActivityIndicator color={color} accessibilityLabel="Cargando" />
);
