import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { RATING_TAGS } from '@oldpickleball/shared';

export interface IPlayerRatingDocument extends Document {
  _id: Types.ObjectId;
  session: Types.ObjectId;
  rater: Types.ObjectId;
  target: Types.ObjectId;
  overall: number;
  tags: (typeof RATING_TAGS[number])[];
  comment?: string;
  createdAt: Date;
}

const playerRatingSchema = new Schema<IPlayerRatingDocument>({
  session: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  rater: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  overall: { type: Number, required: true, min: 1, max: 5 },
  tags: [{ type: String, enum: RATING_TAGS }],
  comment: { type: String, maxlength: 280 },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

playerRatingSchema.index({ target: 1, createdAt: -1 });
playerRatingSchema.index({ session: 1, rater: 1, target: 1 }, { unique: true });

playerRatingSchema.set('toJSON', {
  transform(_doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const PlayerRating = mongoose.model<IPlayerRatingDocument>('PlayerRating', playerRatingSchema);
