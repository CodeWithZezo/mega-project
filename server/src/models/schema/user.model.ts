import mongoose,{ Schema, model, Model, models } from 'mongoose';
import { IUser } from '../models.types';

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email cannot exceed 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
      minlength: [60, 'Password hash must be at least 60 characters'],
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: [255, 'Full name cannot exceed 255 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
      match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number'],
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isVerified: 1, createdAt: -1 });

export const User: Model<IUser> =
  models.User || model<IUser>('User', UserSchema);
