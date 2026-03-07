import type { Context } from 'koa';
import { CourtService } from '../services/court.service.js';
import { SessionService } from '../services/session.service.js';
import { buildPaginationMeta } from '../utils/pagination.js';

export class CourtController {
  static async list(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const result = await CourtService.search({
      lat: q.lat ? parseFloat(q.lat) : undefined,
      lng: q.lng ? parseFloat(q.lng) : undefined,
      radius: q.radius ? parseFloat(q.radius) : undefined,
      surface: q.surface,
      environment: q.environment,
      access: q.access,
      hasLighting: q.hasLighting !== undefined ? q.hasLighting === 'true' : undefined,
      page: q.page ? parseInt(q.page) : undefined,
      limit: q.limit ? parseInt(q.limit) : undefined,
    });

    ctx.body = {
      success: true,
      data: result.courts,
      meta: buildPaginationMeta(result.page, result.limit, result.total),
    };
  }

  static async getById(ctx: Context) {
    const court = await CourtService.getById(ctx.params.id);
    ctx.body = { success: true, data: court };
  }

  static async create(ctx: Context) {
    const court = await CourtService.create(ctx.request.body as any, ctx.state.user.sub);
    ctx.status = 201;
    ctx.body = { success: true, data: court };
  }

  static async update(ctx: Context) {
    const court = await CourtService.update(ctx.params.id, ctx.request.body as any);
    ctx.body = { success: true, data: court };
  }

  static async getSessions(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const result = await SessionService.getByCourtId(
      ctx.params.id,
      q.page ? parseInt(q.page) : 1,
      q.limit ? parseInt(q.limit) : 20,
    );
    ctx.body = {
      success: true,
      data: result.sessions,
      meta: buildPaginationMeta(result.page, result.limit, result.total),
    };
  }

  static async verify(ctx: Context) {
    const court = await CourtService.verify(ctx.params.id, ctx.state.user.sub);
    ctx.body = { success: true, data: court };
  }
}
