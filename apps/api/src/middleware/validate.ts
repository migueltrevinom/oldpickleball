import type { Context, Next } from 'koa';
import { type ZodSchema, ZodError } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return async (ctx: Context, next: Next): Promise<void> => {
    try {
      if (schemas.body) {
        ctx.request.body = schemas.body.parse(ctx.request.body);
      }
      if (schemas.query) {
        ctx.query = schemas.query.parse(ctx.query) as Record<string, string>;
      }
      if (schemas.params) {
        ctx.params = schemas.params.parse(ctx.params);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: err.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
        };
        return;
      }
      throw err;
    }
    await next();
  };
}
