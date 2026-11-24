import type { ReactNode } from 'react';
import { Stack } from '../stack/stack';
import { Text } from '../text/text';

export interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export const Field = ({ label, error, children }: FieldProps) => (
  <Stack gap="xs">
    <Text variant="small">{label}</Text>
    {children}
    {error && (
      <Text variant="small" tone="danger" accessibilityLiveRegion="polite">
        {error}
      </Text>
    )}
  </Stack>
);
