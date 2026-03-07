import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../utils/token.js';
import { AppError } from '../utils/errors.js';
import { EmailService } from './email.service.js';
import { env } from '../config/env.js';

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export class AuthService {
  /**
   * Step 1: Request OTP
   * - If user exists → send sign-in OTP
   * - If user doesn't exist → create user, send welcome OTP
   */
  static async requestOTP(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    const isNewUser = !user;

    if (!user) {
      user = await User.create({ email: normalizedEmail });
    }

    if (!user.isActive) {
      throw new AppError(403, 'Account is deactivated', 'ACCOUNT_DEACTIVATED');
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    user.otp = { code: otpCode, expiresAt, attempts: 0 };
    await user.save();

    await EmailService.sendOTP(normalizedEmail, otpCode, isNewUser);

    return {
      message: 'Verification code sent to your email',
      isNewUser,
      email: normalizedEmail,
    };
  }

  /**
   * Step 2: Verify OTP → issue tokens
   */
  static async verifyOTP(email: string, code: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.otp?.code) {
      throw new AppError(400, 'No pending verification. Please request a new code.', 'NO_PENDING_OTP');
    }

    if (user.otp.attempts >= 5) {
      user.otp = undefined;
      await user.save();
      throw new AppError(429, 'Too many attempts. Please request a new code.', 'TOO_MANY_ATTEMPTS');
    }

    if (user.otp.expiresAt < new Date()) {
      user.otp = undefined;
      await user.save();
      throw new AppError(400, 'Code has expired. Please request a new one.', 'OTP_EXPIRED');
    }

    if (user.otp.code !== code) {
      user.otp.attempts += 1;
      await user.save();
      const remaining = 5 - user.otp.attempts;
      throw new AppError(400, `Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, 'INVALID_OTP');
    }

    user.otp = undefined;
    user.isVerified = true;
    user.lastActiveAt = new Date();

    user.refreshTokens = user.refreshTokens.filter(rt => rt.expiresAt > new Date());
    const refreshToken = generateRefreshToken();
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    await user.save();

    const accessToken = generateAccessToken(user);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      isOnboarded: user.isOnboarded,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refresh(oldRefreshToken: string) {
    const user = await User.findOne({
      'refreshTokens.token': oldRefreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() },
    });

    if (!user) {
      throw new AppError(401, 'Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== oldRefreshToken);

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Logout — revoke refresh token
   */
  static async logout(userId: string, refreshToken: string) {
    await User.updateOne(
      { _id: userId },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );
  }
}
