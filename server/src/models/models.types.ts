// ==================== src/types/models.types.ts ====================
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash?: string;
  fullName?: string;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IOrg extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
}

export interface IOrgUser extends Document {
  _id: Types.ObjectId;
  orgId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'admin' | 'member';
}

export interface IApiKey extends Document {
  _id: Types.ObjectId;
  orgId: Types.ObjectId;
  key: string;
  description?: string;
  revoked: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}