import { z } from 'zod';
import {
  SESSION_TYPES, GAME_FORMATS, VISIBILITY_OPTIONS
} from '@oldpickleball/shared';

export const createSessionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(SESSION_TYPES),
  format: z.enum(GAME_FORMATS).default('any'),
  courtId: z.string().min(1),
  schedule: z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    recurring: z.object({
      enabled: z.boolean().default(false),
      frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).optional(),
      endDate: z.string().datetime().optional(),
    }).optional(),
  }),
  skillRange: z.object({
    min: z.number().min(1.0).max(5.5).default(1.0),
    max: z.number().min(1.0).max(5.5).default(5.5),
  }).optional(),
  capacity: z.object({
    min: z.number().int().min(1).default(2),
    max: z.number().int().min(1).default(16),
  }).optional(),
  cost: z.object({
    amount: z.number().min(0).default(0),
    currency: z.string().default('USD'),
    splitEvenly: z.boolean().default(true),
  }).optional(),
  visibility: z.enum(VISIBILITY_OPTIONS).default('public'),
});

export const updateSessionSchema = createSessionSchema.partial();

export const sessionQuerySchema = z.object({
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().positive().optional(),
  type: z.enum(SESSION_TYPES).optional(),
  format: z.enum(GAME_FORMATS).optional(),
  skillMin: z.coerce.number().min(1.0).max(5.5).optional(),
  skillMax: z.coerce.number().min(1.0).max(5.5).optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
