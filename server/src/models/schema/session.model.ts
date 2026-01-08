import mongoose, { Schema, Model } from 'mongoose';
import { ISession } from '../models.types';

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
      index: true,
      minlength: [32, 'Token must be at least 32 characters'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: true,
      validate: {
        validator: (v: Date) => v > new Date(),
        message: 'Expiration date must be in the future',
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'sessions',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

SessionSchema.index({ userId: 1, expiresAt: -1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ token: 1, expiresAt: -1 });

export const Session: Model<ISession> = mongoose.model<ISession>('Session', SessionSchema);
