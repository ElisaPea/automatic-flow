import { Button } from '../button/button';
import { Stack } from '../stack/stack';
import { Text } from '../text/text';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title = 'Algo ha fallado', message, onRetry }: ErrorStateProps) => (
  <Stack align="center" gap="sm" accessibilityRole="alert">
    <Text variant="title">{title}</Text>
    <Text tone="muted">{message}</Text>
    {onRetry && <Button variant="secondary" label="Reintentar" onPress={onRetry} />}
  </Stack>
);
