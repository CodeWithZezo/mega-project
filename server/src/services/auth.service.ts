import bcrypt from "bcryptjs";
import crypto from 'crypto';
import { Types } from 'mongoose';
import { User, Session } from '../models';
import { UnauthorizedError, NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly TOKEN_BYTES = 32;
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(): string {
    return crypto.randomBytes(this.TOKEN_BYTES).toString('hex');
  }

  static async createSession(userId: Types.ObjectId): Promise<string> {
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

    await Session.create({
      userId,
      token,
      expiresAt,
    });

    return token;
  }

  static async validateSession(token: string): Promise<Types.ObjectId> {
    const session = await Session.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    return session.userId;
  }

  static async invalidateSession(token: string): Promise<void> {
    await Session.deleteOne({ token });
  }

  static async invalidateAllUserSessions(userId: Types.ObjectId): Promise<void> {
    await Session.deleteMany({ userId });
  }

  static async register(email: string, password: string, fullName?: string, phone?: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await this.hashPassword(password);

    const user = await User.create({
      email,
      passwordHash,
      fullName,
      phone,
      isVerified: false,
    });

    const token = await this.createSession(user._id);

    logger.info('User registered successfully', { userId: user._id, email });

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await this.verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = await this.createSession(user._id);

    logger.info('User logged in successfully', { userId: user._id, email });

    // Remove passwordHash from returned user
    user.passwordHash = undefined;

    return { user, token };
  }
}
