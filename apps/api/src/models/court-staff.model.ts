import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface ICourtStaffDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  phone?: string;
  otp?: {
    code: string;
    expiresAt: Date;
    attempts: number;
  };
  profile: {
    firstName: string;
    lastName: string;
    displayName?: string;
    avatar?: string;
  };
  courtAdmin: Types.ObjectId;
  assignedCourts: Types.ObjectId[];
  permissions: string[];
  refreshTokens: {
    token: string;
    expiresAt: Date;
    device?: string;
  }[];
  isOnboarded: boolean;
  isActive: boolean;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const STAFF_PERMISSIONS = [
  'view_bookings',
  'check_in_players',
  'manage_sessions',
  'view_calendar',
] as const;

const courtStaffSchema = new Schema<ICourtStaffDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  otp: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    displayName: { type: String, trim: true },
    avatar: String,
  },
  courtAdmin: { type: Schema.Types.ObjectId, ref: 'CourtAdmin', required: true },
  assignedCourts: [{ type: Schema.Types.ObjectId, ref: 'Court' }],
  permissions: [{ type: String, enum: STAFF_PERMISSIONS }],
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    device: String,
  }],
  isOnboarded: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastActiveAt: Date,
}, { timestamps: true });

courtStaffSchema.set('toJSON', {
  transform(_doc, ret) {
    const { otp, refreshTokens, __v, ...rest } = ret;
    return rest;
  },
});

export const CourtStaff = mongoose.model<ICourtStaffDocument>('CourtStaff', courtStaffSchema);
