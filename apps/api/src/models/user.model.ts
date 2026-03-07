import mongoose, { Schema, type Document, type Types } from 'mongoose';
import {
  USER_ROLES, GAME_FORMATS, PROFILE_VISIBILITY
} from '@oldpickleball/shared';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: typeof USER_ROLES[number];
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    location?: {
      type: 'Point';
      coordinates: [number, number];
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  skill: {
    selfRated?: number;
    duprId?: string;
    duprRating?: number;
    preferredFormats: (typeof GAME_FORMATS[number])[];
  };
  social: {
    friends: Types.ObjectId[];
    blockedUsers: Types.ObjectId[];
  };
  stats: {
    gamesPlayed: number;
    gamesOrganized: number;
    reliability: number;
    avgRating: number;
    ratingCount: number;
  };
  settings: {
    notifications: {
      push: boolean;
      email: boolean;
      nearbyGames: boolean;
      reminders: boolean;
    };
    searchRadius: number;
    visibility: typeof PROFILE_VISIBILITY[number];
  };
  refreshTokens: {
    token: string;
    expiresAt: Date;
    device?: string;
  }[];
  isVerified: boolean;
  isActive: boolean;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true },
  city: String,
  state: String,
  zip: String,
}, { _id: false });

const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: USER_ROLES, default: 'player' },
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    displayName: { type: String, trim: true },
    avatar: String,
    bio: { type: String, maxlength: 500 },
    phone: String,
    location: locationSchema,
  },
  skill: {
    selfRated: { type: Number, min: 1.0, max: 5.5 },
    duprId: String,
    duprRating: Number,
    preferredFormats: [{ type: String, enum: GAME_FORMATS }],
  },
  social: {
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    gamesOrganized: { type: Number, default: 0 },
    reliability: { type: Number, default: 100, min: 0, max: 100 },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  settings: {
    notifications: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      nearbyGames: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
    },
    searchRadius: { type: Number, default: 25 },
    visibility: { type: String, enum: PROFILE_VISIBILITY, default: 'public' },
  },
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    device: String,
  }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastActiveAt: Date,
}, {
  timestamps: true,
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'profile.location': '2dsphere' });
userSchema.index({ 'skill.selfRated': 1 });
userSchema.index({ 'skill.duprRating': 1 });

userSchema.pre('save', function () {
  if (!this.profile.displayName) {
    this.profile.displayName = `${this.profile.firstName} ${this.profile.lastName.charAt(0)}.`;
  }
});

userSchema.set('toJSON', {
  transform(_doc, ret) {
    const { passwordHash, refreshTokens, __v, ...rest } = ret;
    return rest;
  },
});

export const User = mongoose.model<IUserDocument>('User', userSchema);
