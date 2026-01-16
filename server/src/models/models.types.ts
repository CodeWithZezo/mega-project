// ==================== src/types/models.types.ts ====================
import { Document, Types } from 'mongoose';
import { Role, Status } from './enums';
export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName?: string;
  email: string;
  passwordHash?: string;
  phone?: string| null;
  isVerified: boolean;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganization extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  passwordPolicy: IPasswordPolicy;
  phoneRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPasswordPolicy {
  minLength: number;
  requireNumbers: boolean;
  requireUppercase: boolean;
  requireSpecialChars: boolean;
}

export interface IMembership extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orgId: Types.ObjectId;
  role: Role;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession extends Document {
  userId: Types.ObjectId;
  refreshToken: string; 
  createdAt: Date;
  updatedAt: Date;
}