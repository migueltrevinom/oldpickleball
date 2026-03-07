import { User } from '../models/user.model.js';
import { NotFoundError } from '../utils/errors.js';
import type { UpdateProfileInput } from '../validators/user.validator.js';

export class UserService {
  static async getById(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User');
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
