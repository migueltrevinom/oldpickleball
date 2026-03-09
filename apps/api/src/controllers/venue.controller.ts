import type { Context } from 'koa';
import { VenueService } from '../services/venue.service.js';
import { BookingService } from '../services/booking.service.js';
import { buildPaginationMeta } from '../utils/pagination.js';

export class VenueController {
  // ── Admin endpoints ───────────────────────────────────────────────────

  static async createVenue(ctx: Context) {
    const venue = await VenueService.createVenue(ctx.request.body as any, ctx.state.user.sub);
    ctx.status = 201;
    ctx.body = { success: true, data: venue };
  }

  static async updateVenue(ctx: Context) {
    const venue = await VenueService.updateVenue(ctx.params.id, ctx.request.body as any, ctx.state.user.sub);
    ctx.body = { success: true, data: venue };
  }

  static async getMyVenues(ctx: Context) {
    const venues = await VenueService.getMyVenues(ctx.state.user.sub);
    ctx.body = { success: true, data: venues };
  }

  static async addCourt(ctx: Context) {
    const court = await VenueService.addCourt(ctx.params.id, ctx.request.body as any, ctx.state.user.sub);
    ctx.status = 201;
    ctx.body = { success: true, data: court };
  }

  static async updateCourt(ctx: Context) {
    const court = await VenueService.updateCourt(ctx.params.courtId, ctx.request.body as any, ctx.state.user.sub);
    ctx.body = { success: true, data: court };
  }

  static async removeCourt(ctx: Context) {
    const court = await VenueService.removeCourt(ctx.params.courtId, ctx.state.user.sub);
    ctx.body = { success: true, data: court };
  }

  static async getVenueCourts(ctx: Context) {
    const courts = await VenueService.getVenueCourts(ctx.params.id);
    ctx.body = { success: true, data: courts };
  }

  static async getVenueBookings(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const result = await BookingService.getVenueBookings(ctx.params.id, ctx.state.user.sub, {
      date: q.date,
      page: q.page ? parseInt(q.page) : undefined,
      limit: q.limit ? parseInt(q.limit) : undefined,
    });
    ctx.body = {
      success: true,
      data: result.bookings,
      meta: buildPaginationMeta(result.page, result.limit, result.total),
    };
  }

  // ── User / public endpoints ───────────────────────────────────────────

  static async searchVenues(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const result = await VenueService.searchVenues({
      lat: q.lat ? parseFloat(q.lat) : undefined,
      lng: q.lng ? parseFloat(q.lng) : undefined,
      radius: q.radius ? parseFloat(q.radius) : undefined,
      city: q.city,
      state: q.state,
      page: q.page ? parseInt(q.page) : undefined,
      limit: q.limit ? parseInt(q.limit) : undefined,
    });
    ctx.body = {
      success: true,
      data: result.venues,
      meta: buildPaginationMeta(result.page, result.limit, result.total),
    };
  }

  static async getVenueDetail(ctx: Context) {
    const venue = await VenueService.getVenueDetail(ctx.params.id);
    ctx.body = { success: true, data: venue };
  }

  static async getCourtAvailability(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const date = q.date || new Date().toISOString().slice(0, 10);
    const result = await VenueService.getCourtAvailability(ctx.params.courtId, date);
    ctx.body = { success: true, data: result };
  }
}
