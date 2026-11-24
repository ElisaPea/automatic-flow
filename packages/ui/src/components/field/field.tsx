import { useId, type ReactElement } from 'react';
import { Text } from '../text/text';

export interface FieldProps {
  label: string;
  error?: string;
  /** Recibe el id y los atributos aria para enlazar label/errores con el control. */
  children: (control: {
    id: string;
    'aria-describedby'?: string;
    invalid: boolean;
  }) => ReactElement;
}

export const Field = ({ label, error, children }: FieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children({ id, 'aria-describedby': error ? errorId : undefined, invalid: Boolean(error) })}
      {error && (
        <Text id={errorId} tone="danger" size="sm">
          {error}
        </Text>
      )}
    </div>
  );
};
