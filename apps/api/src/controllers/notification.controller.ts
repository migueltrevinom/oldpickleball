import type { Context } from 'koa';
import { NotificationService } from '../services/notification.service.js';
import { buildPaginationMeta } from '../utils/pagination.js';

export class NotificationController {
  static async list(ctx: Context) {
    const q = ctx.query as Record<string, string>;
    const result = await NotificationService.getByUser(
      ctx.state.user.sub,
      q.page ? parseInt(q.page) : 1,
      q.limit ? parseInt(q.limit) : 20,
    );
    ctx.body = {
      success: true,
      data: result.notifications,
      meta: buildPaginationMeta(result.page, result.limit, result.total),
    };
  }

  static async markAsRead(ctx: Context) {
    const notification = await NotificationService.markAsRead(ctx.params.id, ctx.state.user.sub);
    ctx.body = { success: true, data: notification };
  }

  static async markAllRead(ctx: Context) {
    await NotificationService.markAllRead(ctx.state.user.sub);
    ctx.body = { success: true, data: { message: 'All notifications marked as read' } };
  }

  static async unreadCount(ctx: Context) {
    const count = await NotificationService.getUnreadCount(ctx.state.user.sub);
    ctx.body = { success: true, data: { count } };
  }
}
