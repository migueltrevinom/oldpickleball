import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { CHAT_ROOM_TYPES } from '@oldpickleball/shared';

export interface IChatRoomDocument extends Document {
  _id: Types.ObjectId;
  name?: string;
  type: typeof CHAT_ROOM_TYPES[number];
  session?: Types.ObjectId;
  court?: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: {
    content: string;
    sender: Types.ObjectId;
    sentAt: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatRoomSchema = new Schema<IChatRoomDocument>({
  name: { type: String, trim: true },
  type: { type: String, enum: CHAT_ROOM_TYPES, required: true },
  session: { type: Schema.Types.ObjectId, ref: 'Session' },
  court: { type: Schema.Types.ObjectId, ref: 'Court' },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: {
    content: String,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: Date,
  },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ session: 1 });
chatRoomSchema.index({ 'lastMessage.sentAt': -1 });

chatRoomSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const ChatRoom = mongoose.model<IChatRoomDocument>('ChatRoom', chatRoomSchema);
