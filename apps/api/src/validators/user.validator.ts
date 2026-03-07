import { z } from 'zod';
import { GAME_FORMATS, PROFILE_VISIBILITY } from '@oldpickleball/shared';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  displayName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  skillLevel: z.number().min(1.0).max(5.5).optional(),
  preferredFormats: z.array(z.enum(GAME_FORMATS)).optional(),
  settings: z.object({
    notifications: z.object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      nearbyGames: z.boolean().optional(),
      reminders: z.boolean().optional(),
    }).optional(),
    searchRadius: z.number().positive().optional(),
    visibility: z.enum(PROFILE_VISIBILITY).optional(),
  }).optional(),
});

export const changeEmailSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
});

export const verifyEmailChangeSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must be 6 digits'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type VerifyEmailChangeInput = z.infer<typeof verifyEmailChangeSchema>;
