import mongoose, { Schema, type Document, type Types } from 'mongoose';
import {
  SURFACE_TYPES, COURT_ENVIRONMENTS, ACCESS_TYPES,
  FEE_PERIODS, AMENITIES, EDIT_STATUSES
} from '@oldpickleball/shared';

export interface ICourtDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country: string;
  };
  details: {
    courtCount: number;
    surfaceType?: typeof SURFACE_TYPES[number];
    environment?: typeof COURT_ENVIRONMENTS[number];
    lighting: boolean;
    hasNets: boolean;
  };
  amenities: (typeof AMENITIES[number])[];
  access: {
    type: typeof ACCESS_TYPES[number];
    fee: number;
    feePer?: typeof FEE_PERIODS[number];
    reservationUrl?: string;
  };
  hours: Record<string, { open: string; close: string } | null>;
  photos: string[];
  owner?: Types.ObjectId;
  community: {
    addedBy: Types.ObjectId;
    verifiedBy: Types.ObjectId[];
    lastVerified?: Date;
    edits: {
      userId: Types.ObjectId;
      field: string;
      oldValue: unknown;
      newValue: unknown;
      timestamp: Date;
      status: typeof EDIT_STATUSES[number];
    }[];
  };
  ratings: {
    avgRating: number;
    ratingCount: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dayHoursSchema = new Schema({
  open: { type: String, required: true },
  close: { type: String, required: true },
}, { _id: false });

const courtSchema = new Schema<ICourtDocument>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, maxlength: 2000 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'US' },
  },
  details: {
    courtCount: { type: Number, default: 1, min: 1 },
    surfaceType: { type: String, enum: SURFACE_TYPES },
    environment: { type: String, enum: COURT_ENVIRONMENTS },
    lighting: { type: Boolean, default: false },
    hasNets: { type: Boolean, default: true },
  },
  amenities: [{ type: String, enum: AMENITIES }],
  access: {
    type: { type: String, enum: ACCESS_TYPES, default: 'public' },
    fee: { type: Number, default: 0, min: 0 },
    feePer: { type: String, enum: FEE_PERIODS },
    reservationUrl: String,
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
  photos: [String],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  community: {
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    verifiedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastVerified: Date,
    edits: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      field: String,
      oldValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now },
      status: { type: String, enum: EDIT_STATUSES, default: 'pending' },
    }],
  },
  ratings: {
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

courtSchema.index({ location: '2dsphere' });
courtSchema.index({ slug: 1 }, { unique: true });
courtSchema.index({ 'details.environment': 1, 'details.surfaceType': 1 });
courtSchema.index({ 'access.type': 1 });
courtSchema.index({ 'ratings.avgRating': -1 });

courtSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Court = mongoose.model<ICourtDocument>('Court', courtSchema);
