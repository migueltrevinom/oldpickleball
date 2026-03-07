import { Court } from '../models/court.model.js';
import { NotFoundError } from '../utils/errors.js';
import { slugify } from '@oldpickleball/shared';
import type { CreateCourtInput, UpdateCourtInput } from '../validators/court.validator.js';

export class CourtService {
  static async search(filters: {
    lat?: number; lng?: number; radius?: number;
    surface?: string; environment?: string; access?: string;
    hasLighting?: boolean; page?: number; limit?: number;
  }) {
    const query: Record<string, unknown> = { isActive: true };
    const pageNum = filters.page || 1;
    const limitNum = filters.limit || 20;

    if (filters.lat && filters.lng) {
      const radiusMeters = (filters.radius || 25) * 1609.34;
      query['location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [filters.lng, filters.lat] },
          $maxDistance: radiusMeters,
        },
      };
    }

    if (filters.surface) query['details.surfaceType'] = filters.surface;
    if (filters.environment) query['details.environment'] = filters.environment;
    if (filters.access) query['access.type'] = filters.access;
    if (filters.hasLighting !== undefined) query['details.lighting'] = filters.hasLighting;

    const [courts, total] = await Promise.all([
      Court.find(query).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Court.countDocuments(query),
    ]);

    return { courts, total, page: pageNum, limit: limitNum };
  }

  static async getById(courtId: string) {
    const court = await Court.findById(courtId).populate('community.addedBy', 'profile.displayName profile.avatar');
    if (!court) throw new NotFoundError('Court');
    return court.toJSON();
  }

  static async create(input: CreateCourtInput, userId: string) {
    let slug = slugify(input.name);
    const existingSlug = await Court.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const court = await Court.create({
      name: input.name,
      slug,
      description: input.description,
      location: {
        type: 'Point',
        coordinates: input.location.coordinates,
        address: input.location.address,
        city: input.location.city,
        state: input.location.state,
        zip: input.location.zip,
        country: input.location.country,
      },
      details: input.details,
      amenities: input.amenities || [],
      access: input.access,
      hours: input.hours,
      photos: input.photos || [],
      community: { addedBy: userId },
    });

    return court.toJSON();
  }

  static async update(courtId: string, input: UpdateCourtInput) {
    const court = await Court.findByIdAndUpdate(courtId, { $set: input }, { new: true });
    if (!court) throw new NotFoundError('Court');
    return court.toJSON();
  }

  static async verify(courtId: string, userId: string) {
    const court = await Court.findByIdAndUpdate(
      courtId,
      {
        $addToSet: { 'community.verifiedBy': userId },
        $set: { 'community.lastVerified': new Date() },
      },
      { new: true }
    );
    if (!court) throw new NotFoundError('Court');
    return court.toJSON();
  }
}
