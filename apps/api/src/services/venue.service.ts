import { Venue } from '../models/venue.model.js';
import { VenueCourt } from '../models/venue-court.model.js';
import { Booking } from '../models/booking.model.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { slugify } from '@oldpickleball/shared';
import type { CreateVenueInput, UpdateVenueInput, AddCourtInput, UpdateCourtInput } from '../validators/venue.validator.js';

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

function assertAdmin(venueAdminId: string, requesterId: string) {
  if (venueAdminId !== requesterId) {
    throw new ForbiddenError('You do not own this venue');
  }
}

export class VenueService {
  // ── CourtAdmin methods ────────────────────────────────────────────────

  static async createVenue(input: CreateVenueInput, adminId: string) {
    let slug = slugify(input.name);
    const existing = await Venue.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const venue = await Venue.create({
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
      contact: input.contact || {},
      hours: input.hours || {},
      amenities: input.amenities || [],
      access: input.access || {},
      admin: adminId,
    });

    return venue.toJSON();
  }

  static async updateVenue(venueId: string, input: UpdateVenueInput, adminId: string) {
    const venue = await Venue.findById(venueId);
    if (!venue) throw new NotFoundError('Venue');
    assertAdmin(venue.admin.toString(), adminId);

    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.location) {
      updateData.location = {
        type: 'Point',
        coordinates: input.location.coordinates,
        address: input.location.address,
        city: input.location.city,
        state: input.location.state,
        zip: input.location.zip,
        country: input.location.country,
      };
    }
    if (input.contact) updateData.contact = input.contact;
    if (input.hours) updateData.hours = input.hours;
    if (input.amenities) updateData.amenities = input.amenities;
    if (input.access) updateData.access = input.access;

    const updated = await Venue.findByIdAndUpdate(venueId, { $set: updateData }, { new: true });
    return updated!.toJSON();
  }

  static async getMyVenues(adminId: string) {
    const venues = await Venue.find({ admin: adminId }).sort({ createdAt: -1 }).lean();
    return venues;
  }

  static async addCourt(venueId: string, input: AddCourtInput, adminId: string) {
    const venue = await Venue.findById(venueId);
    if (!venue) throw new NotFoundError('Venue');
    assertAdmin(venue.admin.toString(), adminId);

    const courtCount = await VenueCourt.countDocuments({ venue: venueId, isActive: true });

    const court = await VenueCourt.create({
      venue: venueId,
      name: input.name,
      label: input.label,
      surfaceType: input.surfaceType,
      environment: input.environment,
      lighting: input.lighting,
      hasNets: input.hasNets,
      pricePerHour: input.pricePerHour,
      minBookingMinutes: input.minBookingMinutes,
      maxBookingMinutes: input.maxBookingMinutes,
      sortOrder: courtCount,
    });

    await Venue.findByIdAndUpdate(venueId, { $inc: { courtCount: 1 } });

    return court.toJSON();
  }

  static async updateCourt(courtId: string, input: UpdateCourtInput, adminId: string) {
    const court = await VenueCourt.findById(courtId);
    if (!court) throw new NotFoundError('Court');

    const venue = await Venue.findById(court.venue);
    if (!venue) throw new NotFoundError('Venue');
    assertAdmin(venue.admin.toString(), adminId);

    const updated = await VenueCourt.findByIdAndUpdate(courtId, { $set: input }, { new: true });
    return updated!.toJSON();
  }

  static async removeCourt(courtId: string, adminId: string) {
    const court = await VenueCourt.findById(courtId);
    if (!court) throw new NotFoundError('Court');

    const venue = await Venue.findById(court.venue);
    if (!venue) throw new NotFoundError('Venue');
    assertAdmin(venue.admin.toString(), adminId);

    court.isActive = false;
    await court.save();
    await Venue.findByIdAndUpdate(court.venue, { $inc: { courtCount: -1 } });

    return court.toJSON();
  }

  static async getVenueCourts(venueId: string) {
    const courts = await VenueCourt.find({ venue: venueId, isActive: true })
      .sort({ sortOrder: 1 })
      .lean();
    return courts;
  }

  // ── Finder / public methods ───────────────────────────────────────────

  static async searchVenues(filters: {
    lat?: number; lng?: number; radius?: number;
    city?: string; state?: string;
    page?: number; limit?: number;
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

    if (filters.city) query['location.city'] = { $regex: new RegExp(filters.city, 'i') };
    if (filters.state) query['location.state'] = { $regex: new RegExp(filters.state, 'i') };

    const [venues, total] = await Promise.all([
      Venue.find(query)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Venue.countDocuments(query),
    ]);

    return { venues, total, page: pageNum, limit: limitNum };
  }

  static async getVenueDetail(venueId: string): Promise<Record<string, unknown>> {
    const venue = await Venue.findById(venueId);
    if (!venue) throw new NotFoundError('Venue');

    const courts = await VenueCourt.find({ venue: venueId, isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    return { ...venue.toJSON(), courts };
  }

  static async getCourtAvailability(courtId: string, date: string) {
    const court = await VenueCourt.findById(courtId);
    if (!court) throw new NotFoundError('Court');

    const venue = await Venue.findById(court.venue);
    if (!venue) throw new NotFoundError('Venue');

    const dateObj = new Date(date + 'T00:00:00Z');
    const dayIndex = dateObj.getUTCDay();
    const dayName = DAYS_OF_WEEK[dayIndex];

    const dayHours = venue.hours?.[dayName];
    if (!dayHours) {
      return { date, court: court.toJSON(), slots: [] };
    }

    const bookings = await Booking.find({
      court: courtId,
      date: dateObj,
      status: { $in: ['confirmed', 'pending'] },
    }).lean();

    const bookedTimes = new Set(
      bookings.flatMap((b) => {
        const times: string[] = [];
        let [h, m] = b.startTime.split(':').map(Number);
        const [endH, endM] = b.endTime.split(':').map(Number);
        while (h < endH || (h === endH && m < endM)) {
          times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
          m += 30;
          if (m >= 60) { h += 1; m -= 60; }
        }
        return times;
      })
    );

    const slots: { time: string; available: boolean }[] = [];
    const [openH, openM] = dayHours.open.split(':').map(Number);
    const [closeH, closeM] = dayHours.close.split(':').map(Number);
    let curH = openH;
    let curM = openM;

    while (curH < closeH || (curH === closeH && curM < closeM)) {
      const timeStr = `${String(curH).padStart(2, '0')}:${String(curM).padStart(2, '0')}`;
      slots.push({ time: timeStr, available: !bookedTimes.has(timeStr) });
      curM += 30;
      if (curM >= 60) { curH += 1; curM -= 60; }
    }

    return { date, court: court.toJSON(), slots };
  }
}
