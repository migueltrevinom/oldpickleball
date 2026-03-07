import type { Context } from 'koa';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(ctx: Context) {
    const result = await AuthService.register(ctx.request.body as any);

    ctx.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: { user: result.user, accessToken: result.accessToken },
    };
  }

  static async login(ctx: Context) {
    const result = await AuthService.login(ctx.request.body as any);

    ctx.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    ctx.body = {
      success: true,
      data: { user: result.user, accessToken: result.accessToken },
    };
  }

  static async refresh(ctx: Context) {
    const refreshToken = ctx.cookies.get('refreshToken')
      || (ctx.request.body as any)?.refreshToken;

    if (!refreshToken) {
      ctx.throw(400, 'Refresh token required');
    }

    const result = await AuthService.refresh(refreshToken);

    ctx.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    ctx.body = {
      success: true,
      data: { accessToken: result.accessToken },
    };
  }

  static async logout(ctx: Context) {
    const refreshToken = ctx.cookies.get('refreshToken')
      || (ctx.request.body as any)?.refreshToken;
    const userId = ctx.state.user?.sub;

    if (userId && refreshToken) {
      await AuthService.logout(userId, refreshToken);
    }

    ctx.cookies.set('refreshToken', null);
    ctx.body = { success: true, data: { message: 'Logged out' } };
  }
}
