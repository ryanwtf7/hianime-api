import { Context, Next } from 'hono';
import { fail, success } from './response';
import { AppError } from './errors';

const handler = (fn: (c: Context, next: Next) => Promise<unknown> | unknown) => {
  return async (c: Context, next: Next) => {
    try {
      const result = await fn(c, next);

      return success(c, result, 200);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return fail(c, error.message, error.statusCode, error.details);
      }
      if (error instanceof Error) {
        console.error(error.message);
        return fail(c, error.message, 500);
      }
      return fail(c, 'Internal server error', 500);
    }
  };
};
export default handler;
