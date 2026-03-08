import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface ISuperAdminDocument extends Document {
  _id: Types.ObjectId;
  email: string;
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
  permissions: string[];
  refreshTokens: {
    token: string;
    expiresAt: Date;
    device?: string;
  }[];
  isActive: boolean;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const superAdminSchema = new Schema<ISuperAdminDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  otp: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
  },
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    displayName: { type: String, trim: true },
    avatar: String,
  },
  permissions: [{ type: String }],
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    device: String,
  }],
  isActive: { type: Boolean, default: true },
  lastActiveAt: Date,
}, { timestamps: true });

superAdminSchema.set('toJSON', {
  transform(_doc, ret) {
    const { otp, refreshTokens, __v, ...rest } = ret;
    return rest;
  },
});

export const SuperAdmin = mongoose.model<ISuperAdminDocument>('SuperAdmin', superAdminSchema);
