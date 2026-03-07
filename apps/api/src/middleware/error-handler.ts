import type { Context, Next } from 'koa';
import { env } from '../config/env.js';

export async function errorHandler(ctx: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (err: unknown) {
    const error = err as { status?: number; statusCode?: number; message?: string; code?: string; stack?: string };
    const status = error.status || error.statusCode || 500;
    ctx.status = status;
    ctx.body = {
      success: false,
      error: {
        message: error.message || 'Internal Server Error',
        code: error.code || 'INTERNAL_ERROR',
        ...(env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    };

    if (status >= 500) {
      console.error(`[ERROR] ${ctx.method} ${ctx.path}:`, err);
    }
  }
}
