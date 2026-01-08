import mongoose, { Schema, Model } from 'mongoose';
import { IOrgUser } from '../models.types';
const OrgUserSchema = new Schema<IOrgUser>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: [true, 'Organization ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'member'],
        message: 'Role must be either admin or member',
      },
      default: 'member',
      required: true,
    },
  },
  {
    timestamps: false,
    collection: 'org_users',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

OrgUserSchema.index({ orgId: 1, userId: 1 }, { unique: true });
OrgUserSchema.index({ userId: 1 });
OrgUserSchema.index({ orgId: 1, role: 1 });

export const OrgUser: Model<IOrgUser> = mongoose.model<IOrgUser>('OrgUser', OrgUserSchema);