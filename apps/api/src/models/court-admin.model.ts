import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface ICourtAdminDocument extends Document {
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
    bio?: string;
    companyName?: string;
  };
  courts: Types.ObjectId[];
  staff: Types.ObjectId[];
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

const courtAdminSchema = new Schema<ICourtAdminDocument>({
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
    bio: { type: String, maxlength: 500 },
    companyName: { type: String, trim: true },
  },
  courts: [{ type: Schema.Types.ObjectId, ref: 'Court' }],
  staff: [{ type: Schema.Types.ObjectId, ref: 'CourtStaff' }],
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    device: String,
  }],
  isOnboarded: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastActiveAt: Date,
}, { timestamps: true });

courtAdminSchema.set('toJSON', {
  transform(_doc, ret) {
    const { otp, refreshTokens, __v, ...rest } = ret;
    return rest;
  },
});

export const CourtAdmin = mongoose.model<ICourtAdminDocument>('CourtAdmin', courtAdminSchema);
