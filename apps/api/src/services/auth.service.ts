import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../utils/token.js';
import { AppError, ConflictError } from '../utils/errors.js';
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js';

const SALT_ROUNDS = 12;

export class AuthService {
  static async register(input: RegisterInput) {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await User.create({
      email: input.email.toLowerCase(),
      passwordHash,
      profile: {
        firstName: input.firstName,
        lastName: input.lastName,
      },
      skill: {
        selfRated: input.skillLevel,
        preferredFormats: input.preferredFormats || [],
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });
    await user.save();

    return { user: user.toJSON(), accessToken, refreshToken };
  }

  static async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    user.refreshTokens = user.refreshTokens.filter(rt => rt.expiresAt > new Date());
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });
    user.lastActiveAt = new Date();
    await user.save();

    return { user: user.toJSON(), accessToken, refreshToken };
  }

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

  static async logout(userId: string, refreshToken: string) {
    await User.updateOne(
      { _id: userId },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );
  }
}
