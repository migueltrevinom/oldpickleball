import type { Context } from 'koa';
import { SessionService } from '../services/session.service.js';
import { buildPaginationMeta } from '../utils/pagination.js';

export class SessionController {
  static async list(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const result = await SessionService.search({
      type: q.type,
      format: q.format,
      skillMin: q.skillMin ? parseFloat(q.skillMin) : undefined,
      skillMax: q.skillMax ? parseFloat(q.skillMax) : undefined,
      status: q.status,
      page: q.page ? parseInt(q.page) : undefined,
      limit: q.limit ? parseInt(q.limit) : undefined,
      sort: q.sort,
    });

    ctx.body = {
      success: true,
      data: result.sessions,
      meta: buildPaginationMeta(result.page, result.limit, result.total),
    };
  }

  static async getById(ctx: Context) {
    const session = await SessionService.getById(ctx.params.id);
    ctx.body = { success: true, data: session };
  }

  static async create(ctx: Context) {
    const session = await SessionService.create(ctx.request.body as any, ctx.state.user.sub);
    ctx.status = 201;
    ctx.body = { success: true, data: session };
  }

  static async update(ctx: Context) {
    const session = await SessionService.update(ctx.params.id, ctx.request.body as any, ctx.state.user.sub);
    ctx.body = { success: true, data: session };
  }

  static async cancel(ctx: Context) {
    const session = await SessionService.cancel(ctx.params.id, ctx.state.user.sub);
    ctx.body = { success: true, data: session };
  }
}
