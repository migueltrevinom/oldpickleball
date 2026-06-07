import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { AMENITIES, ACCESS_TYPES, FEE_PERIODS } from '@oldpickleball/shared';

export interface IVenueDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours: Record<string, { open: string; close: string } | null>;
  amenities: (typeof AMENITIES[number])[];
  access: {
    type: typeof ACCESS_TYPES[number];
    defaultFee: number;
    feePer: typeof FEE_PERIODS[number];
    reservationRequired: boolean;
  };
  photos: string[];
  mapImage?: string;
  admin: Types.ObjectId;
  courtCount: number;
  ratings: {
    avgRating: number;
    ratingCount: number;
  };
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dayHoursSchema = new Schema({
  open: { type: String, required: true },
  close: { type: String, required: true },
}, { _id: false });

const venueSchema = new Schema<IVenueDocument>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, maxlength: 2000 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'US' },
  },
  contact: {
    phone: String,
    email: String,
    website: String,
  },
  hours: {
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
  },
  amenities: [{ type: String, enum: AMENITIES }],
  access: {
    type: { type: String, enum: ACCESS_TYPES, default: 'public' },
    defaultFee: { type: Number, default: 0, min: 0 },
    feePer: { type: String, enum: FEE_PERIODS, default: 'hour' },
    reservationRequired: { type: Boolean, default: false },
  },
  photos: [String],
  mapImage: String,
  admin: { type: Schema.Types.ObjectId, ref: 'CourtAdmin', required: true },
  courtCount: { type: Number, default: 0 },
  ratings: {
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

venueSchema.index({ location: '2dsphere' });
venueSchema.index({ slug: 1 }, { unique: true });
venueSchema.index({ admin: 1 });
venueSchema.index({ isActive: 1, 'ratings.avgRating': -1 });

venueSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Venue = mongoose.model<IVenueDocument>('Venue', venueSchema);
