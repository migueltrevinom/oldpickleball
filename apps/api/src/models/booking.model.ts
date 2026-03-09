import mongoose, { Schema, type Document, type Types } from 'mongoose';

const BOOKING_STATUSES = ['confirmed', 'pending', 'cancelled', 'completed', 'no_show'] as const;

export interface IBookingDocument extends Document {
  _id: Types.ObjectId;
  venue: Types.ObjectId;
  court: Types.ObjectId;
  user: Types.ObjectId;
  userModel: string;
  date: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
  currency: string;
  status: typeof BOOKING_STATUSES[number];
  notes?: string;
  cancelledAt?: Date;
  cancelledBy?: Types.ObjectId;
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>({
  venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
  court: { type: Schema.Types.ObjectId, ref: 'VenueCourt', required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  userModel: { type: String, enum: ['User', 'CourtAdmin', 'CourtStaff', 'SuperAdmin'], default: 'User' },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  price: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: BOOKING_STATUSES, default: 'confirmed' },
  notes: { type: String, maxlength: 500 },
  cancelledAt: Date,
  cancelledBy: Schema.Types.ObjectId,
  checkedIn: { type: Boolean, default: false },
  checkedInAt: Date,
}, { timestamps: true });

bookingSchema.index({ court: 1, date: 1, startTime: 1 });
bookingSchema.index({ venue: 1, date: 1 });
bookingSchema.index({ user: 1, date: 1 });
bookingSchema.index({ status: 1, date: 1 });
// Prevent double-booking the same court at the same time
bookingSchema.index(
  { court: 1, date: 1, startTime: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['confirmed', 'pending'] } } }
);

bookingSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Booking = mongoose.model<IBookingDocument>('Booking', bookingSchema);
