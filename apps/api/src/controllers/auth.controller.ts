import type { Context } from 'koa';
import { AuthService } from '../services/auth.service.js';
import { UserService } from '../services/user.service.js';
import { EmailService } from '../services/email.service.js';
import type { RequestOtpInput, VerifyOtpInput, OnboardInput } from '../validators/auth.validator.js';

export class AuthController {
  /**
   * POST /auth/request-otp
   * Open — sends OTP to email, creates user if new
   */
  static async requestOtp(ctx: Context) {
    const { email } = ctx.request.body as RequestOtpInput;
    const result = await AuthService.requestOTP(email);
    ctx.body = { success: true, data: result };
  }

  /**
   * POST /auth/verify-otp
   * Open — verifies OTP, returns tokens
   */
  static async verifyOtp(ctx: Context) {
    const { email, code } = ctx.request.body as VerifyOtpInput;
    const result = await AuthService.verifyOTP(email, code);

    ctx.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    ctx.body = {
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        role: result.role,
        roleModel: result.roleModel,
        isOnboarded: result.isOnboarded,
      },
    };
  }

  /**
   * POST /auth/onboard
   * Protected — completes profile after first OTP verification
   */
  static async onboard(ctx: Context) {
    const input = ctx.request.body as OnboardInput;
    const userId = ctx.state.user.sub;

    const user = await UserService.onboard(userId, input);

    await EmailService.sendWelcome(user.email, user.profile.firstName || 'Player');

    ctx.body = { success: true, data: user };
  }

  /**
   * POST /auth/refresh
   * Open — exchanges refresh token for new access token
   */
  static async refresh(ctx: Context) {
    const refreshToken = ctx.cookies.get('refreshToken')
      || (ctx.request.body as { refreshToken?: string })?.refreshToken;

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

    ctx.body = { success: true, data: { accessToken: result.accessToken } };
  }

  /**
   * POST /auth/logout
   * Protected — revokes refresh token
   */
  static async logout(ctx: Context) {
    const refreshToken = ctx.cookies.get('refreshToken')
      || (ctx.request.body as { refreshToken?: string })?.refreshToken;
    const userId = ctx.state.user?.sub;

    if (userId && refreshToken) {
      const roleModel = ctx.state.user?.roleModel || 'User';
      await AuthService.logout(userId, refreshToken, roleModel);
    }

    ctx.cookies.set('refreshToken', null);
    ctx.body = { success: true, data: { message: 'Logged out' } };
  }
}
