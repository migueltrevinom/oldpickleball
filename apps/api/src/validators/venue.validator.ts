import { z } from 'zod';
import {
  SURFACE_TYPES, COURT_ENVIRONMENTS, ACCESS_TYPES,
  FEE_PERIODS, AMENITIES,
} from '@oldpickleball/shared';

const dayHoursSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:mm format'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:mm format'),
}).nullable().optional();

export const createVenueSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().default('US'),
  }),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
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
  amenities: z.array(z.enum(AMENITIES)).optional(),
  access: z.object({
    type: z.enum(ACCESS_TYPES).default('public'),
    defaultFee: z.number().min(0).default(0),
    feePer: z.enum(FEE_PERIODS).default('hour'),
    reservationRequired: z.boolean().default(false),
  }).optional(),
});

export const updateVenueSchema = createVenueSchema.partial();

export const addCourtSchema = z.object({
  name: z.string().min(1).max(200),
  label: z.string().max(100).optional(),
  surfaceType: z.enum(SURFACE_TYPES).default('concrete'),
  environment: z.enum(COURT_ENVIRONMENTS).default('outdoor'),
  lighting: z.boolean().default(false),
  hasNets: z.boolean().default(true),
  pricePerHour: z.number().min(0).default(0),
  minBookingMinutes: z.number().int().min(30).default(60),
  maxBookingMinutes: z.number().int().min(30).default(180),
});

export const updateCourtSchema = addCourtSchema.partial();

export type CreateVenueInput = z.infer<typeof createVenueSchema>;
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;
export type AddCourtInput = z.infer<typeof addCourtSchema>;
export type UpdateCourtInput = z.infer<typeof updateCourtSchema>;
