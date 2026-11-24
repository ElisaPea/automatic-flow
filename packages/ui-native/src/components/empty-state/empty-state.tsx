import type { ReactNode } from 'react';
import { Stack } from '../stack/stack';
import { Text } from '../text/text';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Stack align="center" gap="sm">
    <Text variant="title">{title}</Text>
    {description && <Text tone="muted">{description}</Text>}
    {action}
  </Stack>
);
