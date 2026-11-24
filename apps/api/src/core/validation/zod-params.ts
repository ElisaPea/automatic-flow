import type { Request } from 'express';
import { createParamDecorator } from 'routing-controllers';
import type { z } from 'zod';
import { validationFailed } from '../errors';

type Source = 'body' | 'query' | 'params';

const zodParam = <T extends z.ZodType>(source: Source, schema: T) =>
  createParamDecorator({
    required: false,
    value: (action) => {
      const req = action.request as Request;
      const result = schema.safeParse(req[source] ?? {});
      if (!result.success) throw validationFailed(result.error.issues);
      return result.data as z.infer<T>;
    },
  });

/** Valida y tipa el body con Zod. Los errores se convierten en 422 validation_failed. */
export const ZodBody = <T extends z.ZodType>(schema: T) => zodParam('body', schema);
export const ZodQuery = <T extends z.ZodType>(schema: T) => zodParam('query', schema);
export const ZodParams = <T extends z.ZodType>(schema: T) => zodParam('params', schema);
