import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import hiAnimeRoutes from './routes';
import { AppError } from './utils/errors';
import { fail } from './utils/response';
import config from './config';

const app = new Hono();
const origins = config.origin.includes(',')
  ? config.origin.split(',').map(o => o.trim())
  : config.origin === '*'
    ? '*'
    : [config.origin];

app.use(
  cors({
    origin: origins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
    credentials: true,
  })
);

if (!config.isProduction || config.enableLogging) {
  app.use('/api/v2/*', logger());
}

app.get('/ping', c =>
  c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL || config.isVercel ? 'vercel' : 'self-hosted',
  })
);

app.get('/favicon.ico', c => c.body(null, 204));

app.route('/api/v2', hiAnimeRoutes);
app.onError((err, c) => {
  if (err instanceof AppError) {
    return fail(c, err.message, err.statusCode, err.details);
  }

  console.error('Unexpected Error:', err.message);
  if (!config.isProduction) {
    console.error('Stack:', err.stack);
  }

  return fail(c, 'Internal server error', 500);
});

app.notFound(c => fail(c, 'Route not found', 404));

export default app;
