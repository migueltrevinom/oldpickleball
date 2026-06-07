import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import type { Context, Next } from 'koa';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import apiRouter from './routes/index.js';

async function securityHeaders(ctx: Context, next: Next) {
  await next();
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '0');
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}

export function createApp(): Koa {
  const app = new Koa();

  app.use(securityHeaders);

  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(bodyParser({
    jsonLimit: '5mb',
  }));

  app.use(requestLogger);
  app.use(errorHandler);

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());

  app.use(async (ctx) => {
    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: { message: 'Route not found', code: 'NOT_FOUND' },
      };
    }
  });

  return app;
}
