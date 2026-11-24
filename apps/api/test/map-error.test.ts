import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { AppError, mapError } from '../src/core/errors';

describe('mapError', () => {
  it('mantiene AppError', () => {
    const err = new AppError(404, 'not_found', 'x');
    expect(mapError(err)).toBe(err);
  });

  it('ZodError → 422', () => {
    const res = z.object({ a: z.string() }).safeParse({});
    expect(mapError(res.error)?.status).toBe(422);
  });

  it.each([
    ['23505', 409],
    ['22P02', 400],
    ['57014', 504],
    ['ECONNREFUSED', 503],
    ['42P01', 503],
  ])('pg %s → %i', (code, status) => {
    expect(mapError({ code })?.status).toBe(status);
  });

  it('JSON mal formado → 400', () => {
    expect(mapError({ type: 'entity.parse.failed', status: 400 })?.status).toBe(400);
  });

  it('error desconocido → null (bug a corregir)', () => {
    expect(mapError(new Error('boom'))).toBeNull();
  });
});
