import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { SURFACE_TYPES, COURT_ENVIRONMENTS } from '@oldpickleball/shared';

export interface IVenueCourtDocument extends Document {
  _id: Types.ObjectId;
  venue: Types.ObjectId;
  name: string;
  label?: string;
  surfaceType: typeof SURFACE_TYPES[number];
  environment: typeof COURT_ENVIRONMENTS[number];
  lighting: boolean;
  hasNets: boolean;
  pricePerHour: number;
  currency: string;
  minBookingMinutes: number;
  maxBookingMinutes: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const venueCourtSchema = new Schema<IVenueCourtDocument>({
  venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
  name: { type: String, required: true, trim: true },
  label: { type: String, trim: true },
  surfaceType: { type: String, enum: SURFACE_TYPES, default: 'concrete' },
  environment: { type: String, enum: COURT_ENVIRONMENTS, default: 'outdoor' },
  lighting: { type: Boolean, default: false },
  hasNets: { type: Boolean, default: true },
  pricePerHour: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'USD' },
  minBookingMinutes: { type: Number, default: 60 },
  maxBookingMinutes: { type: Number, default: 180 },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

venueCourtSchema.index({ venue: 1, sortOrder: 1 });
venueCourtSchema.index({ venue: 1, isActive: 1 });

venueCourtSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const VenueCourt = mongoose.model<IVenueCourtDocument>('VenueCourt', venueCourtSchema);
