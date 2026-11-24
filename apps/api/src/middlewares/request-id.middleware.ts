import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const HEADER = 'x-request-id';
const VALID = /^[\w-]{8,64}$/;

/** Propaga/genera un id de petición para correlacionar logs y errores. */
export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.header(HEADER);
  const id = incoming && VALID.test(incoming) ? incoming : randomUUID();
  res.locals.requestId = id;
  res.setHeader(HEADER, id);
  next();
};
