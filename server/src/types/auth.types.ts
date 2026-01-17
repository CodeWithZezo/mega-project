import { Types, Document } from "mongoose";

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  passwordHash: string;
  phone: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service response type
export interface IServiceResponse<T> {
  status: number;
  body: T;
}
