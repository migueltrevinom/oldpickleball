import mongoose, { Schema, type Document, type Types } from 'mongoose';
import {
  SESSION_TYPES, GAME_FORMATS, SESSION_STATUSES, VISIBILITY_OPTIONS
} from '@oldpickleball/shared';

export interface ISessionDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  type: typeof SESSION_TYPES[number];
  format: typeof GAME_FORMATS[number];
  court: Types.ObjectId;
  organizer: Types.ObjectId;
  schedule: {
    startTime: Date;
    endTime: Date;
    recurring: {
      enabled: boolean;
      frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
      endDate?: Date;
      parentId?: Types.ObjectId;
    };
  };
  skillRange: {
    min: number;
    max: number;
  };
  capacity: {
    min: number;
    max: number;
    spotsAvailable: number;
  };
  cost: {
    amount: number;
    currency: string;
    splitEvenly: boolean;
    perPlayer?: number;
  };
  status: typeof SESSION_STATUSES[number];
  visibility: typeof VISIBILITY_OPTIONS[number];
  chatRoom?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISessionDocument>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 2000 },
  type: { type: String, enum: SESSION_TYPES, required: true },
  format: { type: String, enum: GAME_FORMATS, default: 'any' },
  court: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurring: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'] },
      endDate: Date,
      parentId: { type: Schema.Types.ObjectId, ref: 'Session' },
    },
  },
  skillRange: {
    min: { type: Number, default: 1.0, min: 1.0, max: 5.5 },
    max: { type: Number, default: 5.5, min: 1.0, max: 5.5 },
  },
  capacity: {
    min: { type: Number, default: 2, min: 1 },
    max: { type: Number, default: 16, min: 1 },
    spotsAvailable: { type: Number, default: 16 },
  },
  cost: {
    amount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
    splitEvenly: { type: Boolean, default: true },
    perPlayer: Number,
  },
  status: { type: String, enum: SESSION_STATUSES, default: 'open' },
  visibility: { type: String, enum: VISIBILITY_OPTIONS, default: 'public' },
  chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
}, {
  timestamps: true,
});

sessionSchema.index({ court: 1, 'schedule.startTime': 1 });
sessionSchema.index({ organizer: 1 });
sessionSchema.index({ status: 1, 'schedule.startTime': 1 });
sessionSchema.index({ 'skillRange.min': 1, 'skillRange.max': 1 });
sessionSchema.index({ type: 1 });

sessionSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Session = mongoose.model<ISessionDocument>('Session', sessionSchema);
