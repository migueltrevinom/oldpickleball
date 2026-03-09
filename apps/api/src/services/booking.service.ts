import { Booking } from '../models/booking.model.js';
import { VenueCourt } from '../models/venue-court.model.js';
import { Venue } from '../models/venue.model.js';
import { NotFoundError, ConflictError, ForbiddenError, AppError } from '../utils/errors.js';
import type { CreateBookingInput } from '../validators/booking.validator.js';

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export class BookingService {
  static async createBooking(input: CreateBookingInput, userId: string, userModel: string) {
    const court = await VenueCourt.findById(input.courtId);
    if (!court || !court.isActive) throw new NotFoundError('Court');

    const venue = await Venue.findById(court.venue);
    if (!venue || !venue.isActive) throw new NotFoundError('Venue');

    const dateObj = new Date(input.date + 'T00:00:00Z');
    const dayIndex = dateObj.getUTCDay();
    const dayName = DAYS_OF_WEEK[dayIndex];

    const dayHours = venue.hours?.[dayName];
    if (!dayHours) {
      throw new AppError(400, 'Venue is closed on this day', 'VENUE_CLOSED');
    }

    const startMin = timeToMinutes(input.startTime);
    const endMin = timeToMinutes(input.endTime);
    const openMin = timeToMinutes(dayHours.open);
    const closeMin = timeToMinutes(dayHours.close);

    if (startMin < openMin || endMin > closeMin) {
      throw new AppError(400, 'Booking time is outside venue operating hours', 'OUTSIDE_HOURS');
    }

    if (endMin <= startMin) {
      throw new AppError(400, 'End time must be after start time', 'INVALID_TIME');
    }

    const overlap = await Booking.findOne({
      court: input.courtId,
      date: dateObj,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startTime: { $lt: input.endTime }, endTime: { $gt: input.startTime } },
      ],
    });

    if (overlap) {
      throw new ConflictError('This time slot is already booked');
    }

    const durationMinutes = endMin - startMin;
    const price = (court.pricePerHour / 60) * durationMinutes;

    const booking = await Booking.create({
      venue: court.venue,
      court: input.courtId,
      user: userId,
      userModel,
      date: dateObj,
      startTime: input.startTime,
      endTime: input.endTime,
      durationMinutes,
      price: Math.round(price * 100) / 100,
      currency: court.currency,
      status: 'confirmed',
      notes: input.notes,
    });

    return booking.toJSON();
  }

  static async cancelBooking(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking');

    const isOwner = booking.user.toString() === userId;

    if (!isOwner) {
      const venue = await Venue.findById(booking.venue);
      const isAdmin = venue && venue.admin.toString() === userId;
      if (!isAdmin) {
        throw new ForbiddenError('You cannot cancel this booking');
      }
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = booking.user;
    await booking.save();

    return booking.toJSON();
  }

  static async getMyBookings(userId: string, filters: {
    page?: number; limit?: number; status?: string; upcoming?: boolean;
  }) {
    const query: Record<string, unknown> = { user: userId };
    const pageNum = filters.page || 1;
    const limitNum = filters.limit || 20;

    if (filters.status) query.status = filters.status;
    if (filters.upcoming) query.date = { $gte: new Date() };

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('venue', 'name slug location')
        .populate('court', 'name label surfaceType')
        .sort({ date: -1, startTime: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(query),
    ]);

    return { bookings, total, page: pageNum, limit: limitNum };
  }

  static async getVenueBookings(venueId: string, adminId: string, filters: {
    date?: string; page?: number; limit?: number;
  }) {
    const venue = await Venue.findById(venueId);
    if (!venue) throw new NotFoundError('Venue');
    if (venue.admin.toString() !== adminId) {
      throw new ForbiddenError('You do not own this venue');
    }

    const query: Record<string, unknown> = { venue: venueId };
    const pageNum = filters.page || 1;
    const limitNum = filters.limit || 20;

    if (filters.date) {
      query.date = new Date(filters.date + 'T00:00:00Z');
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('court', 'name label')
        .sort({ date: 1, startTime: 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(query),
    ]);

    return { bookings, total, page: pageNum, limit: limitNum };
  }

  static async getCourtBookings(courtId: string, date: string) {
    const dateObj = new Date(date + 'T00:00:00Z');
    const bookings = await Booking.find({
      court: courtId,
      date: dateObj,
      status: { $in: ['confirmed', 'pending'] },
    }).sort({ startTime: 1 }).lean();

    return bookings;
  }
}
