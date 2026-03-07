import type { Context } from 'koa';
import { UserService } from '../services/user.service.js';

export class UserController {
  static async getMe(ctx: Context) {
    const user = await UserService.getById(ctx.state.user.sub);
    ctx.body = { success: true, data: user };
  }

  static async updateMe(ctx: Context) {
    const user = await UserService.updateProfile(ctx.state.user.sub, ctx.request.body as any);
    ctx.body = { success: true, data: user };
  }

  static async getById(ctx: Context) {
    const user = await UserService.getPublicProfile(ctx.params.id);
    ctx.body = { success: true, data: user };
  }

  static async getNearby(ctx: Context) {
    const { lat, lng, radius, limit } = ctx.query;
    if (!lat || !lng) {
      ctx.throw(400, 'lat and lng query parameters are required');
    }
    const users = await UserService.getNearby(
      parseFloat(lat as string),
      parseFloat(lng as string),
      parseFloat((radius as string) || '25'),
      parseInt((limit as string) || '20', 10),
    );
    ctx.body = { success: true, data: users };
  }
}
