import { Button } from '../button/button';
import { Stack } from '../stack/stack';
import { Heading } from '../text/heading';
import { Text } from '../text/text';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title = 'Algo ha fallado', message, onRetry }: ErrorStateProps) => (
  <Stack align="center" gap="sm" className="py-10 text-center" role="alert">
    <Heading level={3}>{title}</Heading>
    <Text tone="muted">{message}</Text>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        Reintentar
      </Button>
    )}
  </Stack>
);
