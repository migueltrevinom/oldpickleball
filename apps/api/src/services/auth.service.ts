import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { SuperAdmin } from '../models/super-admin.model.js';
import { CourtAdmin } from '../models/court-admin.model.js';
import { CourtStaff } from '../models/court-staff.model.js';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../utils/token.js';
import { AppError } from '../utils/errors.js';
import { EmailService } from './email.service.js';
import { env } from '../config/env.js';
import type { SystemRole, RoleModel } from '@oldpickleball/shared';

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

interface RoleDetectionResult {
  user: { _id: { toString(): string }; email: string; otp?: unknown; isActive: boolean; isOnboarded?: boolean; refreshTokens: unknown[]; save(): Promise<unknown>; toJSON(): unknown };
  role: SystemRole;
  roleModel: RoleModel;
}

async function detectUserRole(email: string): Promise<RoleDetectionResult | null> {
  const superAdmin = await SuperAdmin.findOne({ email });
  if (superAdmin) return { user: superAdmin as unknown as RoleDetectionResult['user'], role: 'super_admin', roleModel: 'SuperAdmin' };

  const courtAdmin = await CourtAdmin.findOne({ email });
  if (courtAdmin) return { user: courtAdmin as unknown as RoleDetectionResult['user'], role: 'court_admin', roleModel: 'CourtAdmin' };

  const courtStaff = await CourtStaff.findOne({ email });
  if (courtStaff) return { user: courtStaff as unknown as RoleDetectionResult['user'], role: 'court_staff', roleModel: 'CourtStaff' };

  const player = await User.findOne({ email });
  if (player) return { user: player as unknown as RoleDetectionResult['user'], role: 'player', roleModel: 'User' };

  return null;
}

export class AuthService {
  static async requestOTP(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    let result = await detectUserRole(normalizedEmail);
    const isNewUser = !result;

    if (!result) {
      const newUser = await User.create({ email: normalizedEmail });
      result = { user: newUser as unknown as RoleDetectionResult['user'], role: 'player', roleModel: 'User' };
    }

    if (!result.user.isActive) {
      throw new AppError(403, 'Account is deactivated', 'ACCOUNT_DEACTIVATED');
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    (result.user as Record<string, unknown>).otp = { code: otpCode, expiresAt, attempts: 0 };
    await result.user.save();

    await EmailService.sendOTP(normalizedEmail, otpCode, isNewUser);

    return {
      message: 'Verification code sent to your email',
      isNewUser,
      email: normalizedEmail,
    };
  }

  static async verifyOTP(email: string, code: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await detectUserRole(normalizedEmail);

    if (!result) {
      throw new AppError(400, 'No pending verification. Please request a new code.', 'NO_PENDING_OTP');
    }

    const user = result.user;
    const otp = (user as Record<string, unknown>).otp as { code: string; expiresAt: Date; attempts: number } | undefined;

    if (!otp?.code) {
      throw new AppError(400, 'No pending verification. Please request a new code.', 'NO_PENDING_OTP');
    }

    if (otp.attempts >= 5) {
      (user as Record<string, unknown>).otp = undefined;
      await user.save();
      throw new AppError(429, 'Too many attempts. Please request a new code.', 'TOO_MANY_ATTEMPTS');
    }

    if (otp.expiresAt < new Date()) {
      (user as Record<string, unknown>).otp = undefined;
      await user.save();
      throw new AppError(400, 'Code has expired. Please request a new one.', 'OTP_EXPIRED');
    }

    if (otp.code !== code) {
      otp.attempts += 1;
      await user.save();
      const remaining = 5 - otp.attempts;
      throw new AppError(400, `Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, 'INVALID_OTP');
    }

    (user as Record<string, unknown>).otp = undefined;
    (user as Record<string, unknown>).lastActiveAt = new Date();

    const refreshTokens = user.refreshTokens as { token: string; expiresAt: Date; device?: string }[];
    const validTokens = refreshTokens.filter((rt: { expiresAt: Date }) => rt.expiresAt > new Date());
    const refreshToken = generateRefreshToken();
    validTokens.push({ token: refreshToken, expiresAt: getRefreshTokenExpiry() });
    (user as Record<string, unknown>).refreshTokens = validTokens;

    await user.save();

    const isOnboarded = (user as Record<string, unknown>).isOnboarded !== false;

    const accessToken = generateAccessToken({
      _id: user._id,
      email: user.email,
      role: result.role,
      roleModel: result.roleModel,
      isOnboarded,
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      role: result.role,
      roleModel: result.roleModel,
      isOnboarded,
    };
  }

  static async refresh(oldRefreshToken: string) {
    const query = {
      'refreshTokens.token': oldRefreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() },
    };

    const checks: { find: () => Promise<RoleDetectionResult['user'] | null>; role: SystemRole; roleModel: RoleModel }[] = [
      { find: () => SuperAdmin.findOne(query) as unknown as Promise<RoleDetectionResult['user'] | null>, role: 'super_admin', roleModel: 'SuperAdmin' },
      { find: () => CourtAdmin.findOne(query) as unknown as Promise<RoleDetectionResult['user'] | null>, role: 'court_admin', roleModel: 'CourtAdmin' },
      { find: () => CourtStaff.findOne(query) as unknown as Promise<RoleDetectionResult['user'] | null>, role: 'court_staff', roleModel: 'CourtStaff' },
      { find: () => User.findOne(query) as unknown as Promise<RoleDetectionResult['user'] | null>, role: 'player', roleModel: 'User' },
    ];

    for (const { find, role, roleModel } of checks) {
      const user = await find();
      if (user) {
        const refreshTokens = user.refreshTokens as { token: string; expiresAt: Date; device?: string }[];
        (user as Record<string, unknown>).refreshTokens = refreshTokens.filter(rt => rt.token !== oldRefreshToken);

        const isOnboarded = (user as Record<string, unknown>).isOnboarded !== false;
        const accessToken = generateAccessToken({
          _id: user._id,
          email: user.email,
          role,
          roleModel,
          isOnboarded,
        });
        const newRefreshToken = generateRefreshToken();
        (user.refreshTokens as unknown[]).push({
          token: newRefreshToken,
          expiresAt: getRefreshTokenExpiry(),
        });
        await user.save();

        return { accessToken, refreshToken: newRefreshToken };
      }
    }

    throw new AppError(401, 'Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
  }

  static async logout(userId: string, refreshToken: string, roleModel: string) {
    const models: Record<string, typeof User> = {
      SuperAdmin: SuperAdmin as unknown as typeof User,
      CourtAdmin: CourtAdmin as unknown as typeof User,
      CourtStaff: CourtStaff as unknown as typeof User,
      User,
    };
    const Model = models[roleModel] || User;
    await Model.updateOne(
      { _id: userId },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );
  }
}
