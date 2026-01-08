import mongoose, { Schema, Model } from 'mongoose';
import { IApiKey } from '../models.types';

const ApiKeySchema = new Schema<IApiKey>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: [true, 'Organization ID is required'],
      index: true,
    },
    key: {
      type: String,
      required: [true, 'API key is required'],
      unique: true,
      index: true,
      minlength: [32, 'API key must be at least 32 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    revoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
      validate: {
        validator: function(v: Date | undefined) {
          return !v || v > new Date();
        },
        message: 'Expiration date must be in the future',
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'api_keys',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        ret.key = ret.key.substring(0, 8) + '...'; // Mask key in JSON
        return ret;
      },
    },
  }
);

ApiKeySchema.index({ orgId: 1, revoked: 1 });
ApiKeySchema.index({ key: 1, revoked: 1 });
ApiKeySchema.index({ orgId: 1, revoked: 1, expiresAt: -1 });
ApiKeySchema.index({ lastUsedAt: -1 });

export const ApiKey: Model<IApiKey> = mongoose.model<IApiKey>('ApiKey', ApiKeySchema);