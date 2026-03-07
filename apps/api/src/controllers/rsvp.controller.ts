import type { Context } from 'koa';
import { RsvpService } from '../services/rsvp.service.js';

export class RsvpController {
  static async join(ctx: Context) {
    const rsvp = await RsvpService.join(ctx.params.id, ctx.state.user.sub);
    ctx.status = 201;
    ctx.body = { success: true, data: rsvp };
  }

  static async cancel(ctx: Context) {
    const rsvp = await RsvpService.cancel(ctx.params.id, ctx.state.user.sub);
    ctx.body = { success: true, data: rsvp };
  }

  static async list(ctx: Context) {
    const rsvps = await RsvpService.getBySession(ctx.params.id);
    ctx.body = { success: true, data: rsvps };
  }
}
