import { z } from 'zod';
import {
  SURFACE_TYPES, COURT_ENVIRONMENTS, ACCESS_TYPES,
  FEE_PERIODS, AMENITIES
} from '@oldpickleball/shared';

const dayHoursSchema = z.object({
  open: z.string(),
  close: z.string(),
}).nullable().optional();

export const createCourtSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().default('US'),
  }),
  details: z.object({
    courtCount: z.number().int().min(1).default(1),
    surfaceType: z.enum(SURFACE_TYPES).optional(),
    environment: z.enum(COURT_ENVIRONMENTS).optional(),
    lighting: z.boolean().default(false),
    hasNets: z.boolean().default(true),
  }).optional(),
  amenities: z.array(z.enum(AMENITIES)).optional(),
  access: z.object({
    type: z.enum(ACCESS_TYPES).default('public'),
    fee: z.number().min(0).default(0),
    feePer: z.enum(FEE_PERIODS).optional(),
    reservationUrl: z.string().url().optional(),
  }).optional(),
  hours: z.object({
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
  }).optional(),
  photos: z.array(z.string().url()).optional(),
});

export const updateCourtSchema = createCourtSchema.partial();

export const courtQuerySchema = z.object({
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().positive().optional(),
  surface: z.enum(SURFACE_TYPES).optional(),
  environment: z.enum(COURT_ENVIRONMENTS).optional(),
  access: z.enum(ACCESS_TYPES).optional(),
  hasLighting: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type CreateCourtInput = z.infer<typeof createCourtSchema>;
export type UpdateCourtInput = z.infer<typeof updateCourtSchema>;
