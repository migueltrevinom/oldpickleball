import { Session } from '../models/session.model.js';
import { Court } from '../models/court.model.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import type { CreateSessionInput, UpdateSessionInput } from '../validators/session.validator.js';

export class SessionService {
  static async search(filters: {
    type?: string; format?: string;
    skillMin?: number; skillMax?: number;
    status?: string; page?: number; limit?: number;
    sort?: string;
  }) {
    const query: Record<string, unknown> = {};
    const pageNum = filters.page || 1;
    const limitNum = filters.limit || 20;

    if (filters.type) query.type = filters.type;
    if (filters.format) query.format = filters.format;
    if (filters.status) query.status = filters.status;
    else query.status = { $in: ['open', 'full'] };

    if (filters.skillMin !== undefined) query['skillRange.min'] = { $gte: filters.skillMin };
    if (filters.skillMax !== undefined) query['skillRange.max'] = { $lte: filters.skillMax };

    query['schedule.startTime'] = { $gte: new Date() };

    const sortField = filters.sort || 'schedule.startTime';
    const sortOrder = sortField.startsWith('-') ? -1 : 1;
    const sortKey = sortField.replace(/^-/, '');

    const [sessions, total] = await Promise.all([
      Session.find(query)
        .populate('court', 'name slug location details')
        .populate('organizer', 'profile.displayName profile.avatar skill.selfRated')
        .sort({ [sortKey]: sortOrder })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Session.countDocuments(query),
    ]);

    return { sessions, total, page: pageNum, limit: limitNum };
  }

  static async getById(sessionId: string) {
    const session = await Session.findById(sessionId)
      .populate('court', 'name slug location details amenities')
      .populate('organizer', 'profile.displayName profile.avatar skill.selfRated');
    if (!session) throw new NotFoundError('Session');
    return session.toJSON();
  }

  static async create(input: CreateSessionInput, userId: string) {
    const court = await Court.findById(input.courtId);
    if (!court) throw new NotFoundError('Court');

    const maxSpots = input.capacity?.max || 16;

    const session = await Session.create({
      title: input.title,
      description: input.description,
      type: input.type,
      format: input.format,
      court: input.courtId,
      organizer: userId,
      schedule: {
        startTime: new Date(input.schedule.startTime),
        endTime: new Date(input.schedule.endTime),
        recurring: input.schedule.recurring || { enabled: false },
      },
      skillRange: input.skillRange || { min: 1.0, max: 5.5 },
      capacity: {
        min: input.capacity?.min || 2,
        max: maxSpots,
        spotsAvailable: maxSpots,
      },
      cost: input.cost || { amount: 0, currency: 'USD', splitEvenly: true },
      visibility: input.visibility,
    });

    return session.toJSON();
  }

  static async update(sessionId: string, input: UpdateSessionInput, userId: string) {
    const session = await Session.findById(sessionId);
    if (!session) throw new NotFoundError('Session');
    if (session.organizer.toString() !== userId) {
      throw new ForbiddenError('Only the organizer can update this session');
    }

    Object.assign(session, input);
    if (input.schedule?.startTime) session.schedule.startTime = new Date(input.schedule.startTime);
    if (input.schedule?.endTime) session.schedule.endTime = new Date(input.schedule.endTime);

    await session.save();
    return session.toJSON();
  }

  static async cancel(sessionId: string, userId: string) {
    const session = await Session.findById(sessionId);
    if (!session) throw new NotFoundError('Session');
    if (session.organizer.toString() !== userId) {
      throw new ForbiddenError('Only the organizer can cancel this session');
    }

    session.status = 'cancelled';
    await session.save();
    return session.toJSON();
  }

  static async getByCourtId(courtId: string, page = 1, limit = 20) {
    const query = {
      court: courtId,
      'schedule.startTime': { $gte: new Date() },
      status: { $in: ['open', 'full'] },
    };
    const [sessions, total] = await Promise.all([
      Session.find(query)
        .populate('organizer', 'profile.displayName profile.avatar')
        .sort({ 'schedule.startTime': 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Session.countDocuments(query),
    ]);
    return { sessions, total, page, limit };
  }
}
