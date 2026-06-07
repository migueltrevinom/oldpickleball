import { Rsvp } from '../models/rsvp.model.js';
import { Session } from '../models/session.model.js';
import { NotFoundError, ConflictError, AppError } from '../utils/errors.js';

export class RsvpService {
  static async join(sessionId: string, userId: string) {
    const session = await Session.findById(sessionId);
    if (!session) throw new NotFoundError('Session');

    if (session.status === 'cancelled') {
      throw new AppError(400, 'Cannot join a cancelled session', 'SESSION_CANCELLED');
    }

    const existing = await Rsvp.findOne({ session: sessionId, user: userId });
    if (existing && existing.status === 'confirmed') {
      throw new ConflictError('Already joined this session');
    }
    if (existing && existing.status === 'waitlisted') {
      throw new ConflictError('Already on the waitlist');
    }

    const isFull = session.capacity.spotsAvailable <= 0;
    const status = isFull ? 'waitlisted' : 'confirmed';

    let position: number | undefined;
    if (isFull) {
      const waitlistCount = await Rsvp.countDocuments({ session: sessionId, status: 'waitlisted' });
      position = waitlistCount + 1;
    } else {
      await Session.findByIdAndUpdate(sessionId, { $inc: { 'capacity.spotsAvailable': -1 } });
      const updated = await Session.findById(sessionId);
      if (updated && updated.capacity.spotsAvailable <= 0) {
        updated.status = 'full';
        await updated.save();
      }
    }

    const rsvp = existing
      ? await Rsvp.findByIdAndUpdate(existing._id, { status, position, respondedAt: new Date(), cancelledAt: null }, { new: true })
      : await Rsvp.create({ session: sessionId, user: userId, status, position });

    return rsvp!.toJSON();
  }

  static async cancel(sessionId: string, userId: string) {
    const rsvp = await Rsvp.findOne({ session: sessionId, user: userId });
    if (!rsvp) throw new NotFoundError('RSVP');

    const wasConfirmed = rsvp.status === 'confirmed';

    rsvp.status = 'cancelled';
    rsvp.cancelledAt = new Date();
    await rsvp.save();

    if (wasConfirmed) {
      await Session.findByIdAndUpdate(sessionId, { $inc: { 'capacity.spotsAvailable': 1 } });

      const nextWaitlisted = await Rsvp.findOne({ session: sessionId, status: 'waitlisted' }).sort({ position: 1 });
      if (nextWaitlisted) {
        nextWaitlisted.status = 'confirmed';
        nextWaitlisted.position = undefined;
        await nextWaitlisted.save();
        await Session.findByIdAndUpdate(sessionId, { $inc: { 'capacity.spotsAvailable': -1 } });
      }

      const session = await Session.findById(sessionId);
      if (session && session.status === 'full' && session.capacity.spotsAvailable > 0) {
        session.status = 'open';
        await session.save();
      }
    }

    return rsvp.toJSON();
  }

  static async getBySession(sessionId: string) {
    return Rsvp.find({ session: sessionId, status: { $in: ['confirmed', 'waitlisted'] } })
      .populate('user', 'profile.displayName profile.avatar skill.selfRated stats.reliability')
      .sort({ status: 1, position: 1, respondedAt: 1 })
      .lean();
  }
}
