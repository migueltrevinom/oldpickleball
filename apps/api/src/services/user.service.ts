import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { NotFoundError, AppError, ConflictError } from '../utils/errors.js';
import { EmailService } from './email.service.js';
import { env } from '../config/env.js';
import type { UpdateProfileInput } from '../validators/user.validator.js';
import type { OnboardInput } from '../validators/auth.validator.js';

export class UserService {
  static async getById(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User');
    return user.toJSON();
  }

  static async onboard(userId: string, input: OnboardInput) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User');
    if (user.isOnboarded) {
      throw new AppError(400, 'Profile already completed', 'ALREADY_ONBOARDED');
    }

    user.profile.firstName = input.firstName;
    user.profile.lastName = input.lastName;
    user.profile.displayName = `${input.firstName} ${input.lastName.charAt(0)}.`;
    if (input.phone) user.phone = input.phone;
    if (input.skillLevel !== undefined) user.skill.selfRated = input.skillLevel;
    if (input.preferredFormats) user.skill.preferredFormats = input.preferredFormats;
    if (input.location) {
      user.profile.location = {
        type: 'Point',
        coordinates: input.location.coordinates,
        city: input.location.city,
        state: input.location.state,
        zip: input.location.zip,
      };
    }

    user.isOnboarded = true;
    await user.save();
    return user.toJSON();
  }

  static async getPublicProfile(userId: string) {
    const user = await User.findById(userId).select(
      '-settings -social.blockedUsers -refreshTokens'
    );
    if (!user || !user.isActive) throw new NotFoundError('User');
    return user.toJSON();
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const update: Record<string, unknown> = {};

    if (input.firstName) update['profile.firstName'] = input.firstName;
    if (input.lastName) update['profile.lastName'] = input.lastName;
    if (input.displayName !== undefined) update['profile.displayName'] = input.displayName;
    if (input.bio !== undefined) update['profile.bio'] = input.bio;
    if (input.phone !== undefined) update['profile.phone'] = input.phone;
    if (input.location) {
      update['profile.location'] = {
        type: 'Point',
        coordinates: input.location.coordinates,
        city: input.location.city,
        state: input.location.state,
        zip: input.location.zip,
      };
    }
    if (input.skillLevel !== undefined) update['skill.selfRated'] = input.skillLevel;
    if (input.preferredFormats) update['skill.preferredFormats'] = input.preferredFormats;

    if (input.settings?.notifications) {
      for (const [key, val] of Object.entries(input.settings.notifications)) {
        if (val !== undefined) update[`settings.notifications.${key}`] = val;
      }
    }
    if (input.settings?.searchRadius !== undefined) {
      update['settings.searchRadius'] = input.settings.searchRadius;
    }
    if (input.settings?.visibility !== undefined) {
      update['settings.visibility'] = input.settings.visibility;
    }

    const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true });
    if (!user) throw new NotFoundError('User');
    return user.toJSON();
  }

  /**
   * Step 1: Request email change → OTP sent to NEW email
   */
  static async requestEmailChange(userId: string, newEmail: string) {
    const normalizedEmail = newEmail.toLowerCase().trim();
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User');

    if (user.email === normalizedEmail) {
      throw new AppError(400, 'New email is the same as your current email', 'SAME_EMAIL');
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ConflictError('This email is already associated with another account');
    }

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    user.pendingEmail = {
      email: normalizedEmail,
      otp: { code: otpCode, expiresAt, attempts: 0 },
    };
    await user.save();

    await EmailService.sendEmailChangeVerification(normalizedEmail, otpCode, user.email);

    return { message: 'Verification code sent to your new email address' };
  }

  /**
   * Step 2: Verify OTP sent to new email → swap emails
   */
  static async verifyEmailChange(userId: string, code: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User');

    if (!user.pendingEmail?.otp?.code) {
      throw new AppError(400, 'No pending email change. Please request one first.', 'NO_PENDING_CHANGE');
    }

    const pending = user.pendingEmail;

    if (pending.otp.attempts >= 5) {
      user.pendingEmail = undefined;
      await user.save();
      throw new AppError(429, 'Too many attempts. Please request a new code.', 'TOO_MANY_ATTEMPTS');
    }

    if (pending.otp.expiresAt < new Date()) {
      user.pendingEmail = undefined;
      await user.save();
      throw new AppError(400, 'Code has expired. Please request a new one.', 'OTP_EXPIRED');
    }

    if (pending.otp.code !== code) {
      pending.otp.attempts += 1;
      await user.save();
      const remaining = 5 - pending.otp.attempts;
      throw new AppError(400, `Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, 'INVALID_OTP');
    }

    const takenCheck = await User.findOne({ email: pending.email });
    if (takenCheck) {
      user.pendingEmail = undefined;
      await user.save();
      throw new ConflictError('This email was claimed by another account while your change was pending');
    }

    const oldEmail = user.email;
    const newEmail = pending.email;
    const displayName = user.profile.displayName || user.profile.firstName || 'Player';

    user.email = newEmail;
    user.pendingEmail = undefined;
    await user.save();

    await EmailService.sendEmailChangedNotice(oldEmail, newEmail, displayName);

    return user.toJSON();
  }

  static async getNearby(lat: number, lng: number, radiusMiles: number, limit = 20) {
    const radiusMeters = radiusMiles * 1609.34;
    return User.find({
      'profile.location': {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusMeters,
        },
      },
      isActive: true,
      'settings.visibility': 'public',
    })
      .select('profile.firstName profile.lastName profile.displayName profile.avatar skill stats')
      .limit(limit)
      .lean();
  }
}
