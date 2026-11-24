import type { ReactNode } from 'react';
import { Stack } from '../stack/stack';
import { Heading } from '../text/heading';
import { Text } from '../text/text';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Stack align="center" gap="sm" className="py-10 text-center">
    <Heading level={3}>{title}</Heading>
    {description && <Text tone="muted">{description}</Text>}
    {action}
  </Stack>
);
