import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export const success = (c: Context, data: unknown, statusCode: number = 200) => {
  return c.json({ success: true, data }, statusCode as ContentfulStatusCode);
};

export const fail = (
  c: Context,
  message: string = 'internal server error',
  statusCode: number = 500,
  details: unknown = null
) => {
  return c.json({ success: false, message, details }, statusCode as ContentfulStatusCode);
};
