import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { MESSAGE_TYPES } from '@oldpickleball/shared';

export interface IMessageDocument extends Document {
  _id: Types.ObjectId;
  chatRoom: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  type: typeof MESSAGE_TYPES[number];
  readBy: {
    user: Types.ObjectId;
    readAt: Date;
  }[];
  isDeleted: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessageDocument>({
  chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 5000 },
  type: { type: String, enum: MESSAGE_TYPES, default: 'text' },
  readBy: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now },
  }],
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

messageSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Message = mongoose.model<IMessageDocument>('Message', messageSchema);
