import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { testEnv } from './test-env';

const app = createApp(testEnv);

describe('app', () => {
  it('GET /health → 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('GET /health/ready sin BD → 503 (nunca 500)', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.status).toBe(503);
    expect(res.body.checks.database).toBe('down');
  });

  it('ruta inexistente → 404 con formato de error', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });

  it('sin token → 401', async () => {
    const res = await request(app).get('/v1/profile/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('unauthorized');
  });

  it('JSON mal formado → 400', async () => {
    const res = await request(app)
      .patch('/v1/profile/me')
      .set('Content-Type', 'application/json')
      .send('{bad');
    expect(res.status).toBe(400);
  });

  it('config inválida → 503', async () => {
    const res = await request(createApp({})).get('/health');
    expect(res.status).toBe(503);
  });
});
