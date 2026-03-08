import type { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { ITokenPayload, SystemRole } from '@oldpickleball/shared';

export async function authenticate(ctx: Context, next: Next): Promise<void> {
  const authHeader = ctx.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    ctx.throw(401, 'Access token required');
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as ITokenPayload;
    ctx.state.user = payload;
  } catch {
    ctx.throw(401, 'Invalid or expired access token');
  }

  await next();
}

export function optionalAuth(ctx: Context, next: Next): Promise<void> {
  const authHeader = ctx.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as ITokenPayload;
      ctx.state.user = payload;
    } catch {
      // proceed without auth
    }
  }
  return next();
}

export function requireRole(...roles: SystemRole[]) {
  return async (ctx: Context, next: Next): Promise<void> => {
    if (!ctx.state.user) {
      ctx.throw(401, 'Authentication required');
    }
    if (!roles.includes(ctx.state.user.role)) {
      ctx.throw(403, 'Insufficient permissions');
    }
    await next();
  };
}

export function requireOnboarded() {
  return async (ctx: Context, next: Next): Promise<void> => {
    if (!ctx.state.user) {
      ctx.throw(401, 'Authentication required');
    }
    if (!ctx.state.user.isOnboarded) {
      ctx.throw(403, 'Please complete your profile first');
    }
    await next();
  };
}
