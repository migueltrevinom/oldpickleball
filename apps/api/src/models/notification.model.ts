import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from '@oldpickleball/shared';

export interface INotificationDocument extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: typeof NOTIFICATION_TYPES[number];
  title: string;
  body: string;
  data?: {
    entityType?: 'session' | 'court' | 'user' | 'chatRoom';
    entityId?: Types.ObjectId;
    deepLink?: string;
  };
  channels: (typeof NOTIFICATION_CHANNELS[number])[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: NOTIFICATION_TYPES, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: {
    entityType: { type: String, enum: ['session', 'court', 'user', 'chatRoom'] },
    entityId: Schema.Types.ObjectId,
    deepLink: String,
  },
  channels: [{ type: String, enum: NOTIFICATION_CHANNELS }],
  isRead: { type: Boolean, default: false },
  readAt: Date,
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });

notificationSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);
