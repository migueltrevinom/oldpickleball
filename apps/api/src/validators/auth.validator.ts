import { z } from 'zod';
import { GAME_FORMATS } from '@oldpickleball/shared';

export const requestOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must be 6 digits'),
});

export const onboardSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
  skillLevel: z.number().min(1.0).max(5.5).optional(),
  preferredFormats: z.array(z.enum(GAME_FORMATS)).optional(),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type OnboardInput = z.infer<typeof onboardSchema>;
