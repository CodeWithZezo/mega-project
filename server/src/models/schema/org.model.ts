import mongoose,{ Schema, Model } from 'mongoose';
import { IOrg } from '../models.types';

const OrgSchema = new Schema<IOrg>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      unique: true,
      trim: true,
      maxlength: [255, 'Organization name cannot exceed 255 characters'],
      minlength: [2, 'Organization name must be at least 2 characters'],
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'orgs',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

OrgSchema.index({ name: 1 });
OrgSchema.index({ createdAt: -1 });

export const Org: Model<IOrg> = mongoose.model<IOrg>('Org', OrgSchema);