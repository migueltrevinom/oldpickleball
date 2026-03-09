import type { Context } from 'koa';
import { BookingService } from '../services/booking.service.js';
import { buildPaginationMeta } from '../utils/pagination.js';

export class BookingController {
  static async createBooking(ctx: Context) {
    const body = ctx.request.body as any;
    const userModel = ctx.state.user.role === 'player' ? 'User'
      : ctx.state.user.role === 'court_admin' ? 'CourtAdmin'
      : ctx.state.user.role === 'court_staff' ? 'CourtStaff'
      : 'SuperAdmin';

    const booking = await BookingService.createBooking(body, ctx.state.user.sub, userModel);
    ctx.status = 201;
    ctx.body = { success: true, data: booking };
  }

  static async cancelBooking(ctx: Context) {
    const booking = await BookingService.cancelBooking(ctx.params.id, ctx.state.user.sub);
    ctx.body = { success: true, data: booking };
  }

  static async getMyBookings(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const result = await BookingService.getMyBookings(ctx.state.user.sub, {
      page: q.page ? parseInt(q.page) : undefined,
      limit: q.limit ? parseInt(q.limit) : undefined,
      status: q.status,
      upcoming: q.upcoming === 'true',
    });
    ctx.body = {
      success: true,
      data: result.bookings,
      meta: buildPaginationMeta(result.page, result.limit, result.total),
    };
  }
}
