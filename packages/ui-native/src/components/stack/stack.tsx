import { View, type ViewProps } from 'react-native';
import { spacing, type Spacing } from '../../theme/tokens';

export interface StackProps extends ViewProps {
  direction?: 'row' | 'column';
  gap?: Spacing;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}

export const Stack = ({ direction = 'column', gap = 'md', align, style, ...rest }: StackProps) => (
  <View
    style={[{ flexDirection: direction, gap: spacing[gap], alignItems: align }, style]}
    {...rest}
  />
);
