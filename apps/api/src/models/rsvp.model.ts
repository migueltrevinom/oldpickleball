import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { RSVP_STATUSES } from '@oldpickleball/shared';

export interface IRsvpDocument extends Document {
  _id: Types.ObjectId;
  session: Types.ObjectId;
  user: Types.ObjectId;
  status: typeof RSVP_STATUSES[number];
  position?: number;
  respondedAt: Date;
  cancelledAt?: Date;
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rsvpSchema = new Schema<IRsvpDocument>({
  session: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: RSVP_STATUSES, default: 'confirmed' },
  position: Number,
  respondedAt: { type: Date, default: Date.now },
  cancelledAt: Date,
  checkedIn: { type: Boolean, default: false },
  checkedInAt: Date,
}, {
  timestamps: true,
});

rsvpSchema.index({ session: 1, user: 1 }, { unique: true });
rsvpSchema.index({ session: 1, status: 1 });
rsvpSchema.index({ user: 1, status: 1 });

rsvpSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Rsvp = mongoose.model<IRsvpDocument>('Rsvp', rsvpSchema);
