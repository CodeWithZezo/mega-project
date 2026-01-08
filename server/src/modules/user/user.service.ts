import { Types } from 'mongoose';
import { User } from '../../models/index';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { AuthService } from '../../services/auth.service';
import { logger } from '../../utils/logger';

export class UserService {
  static async getUserById(userId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static async getUserByEmail(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static async updateUser(
    userId: Types.ObjectId,
    updates: { fullName?: string; phone?: string }
  ) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    logger.info('User updated successfully', { userId });

    return user;
  }

  static async changePassword(
    userId: Types.ObjectId,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId).select('+passwordHash');

    if (!user || !user.passwordHash) {
      throw new NotFoundError('User not found');
    }

    const isValidPassword = await AuthService.verifyPassword(
      currentPassword,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    user.passwordHash = await AuthService.hashPassword(newPassword);
    await user.save();

    // Invalidate all existing sessions
    await AuthService.invalidateAllUserSessions(userId);

    logger.info('Password changed successfully', { userId });
  }

  static async deleteUser(userId: Types.ObjectId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Clean up user sessions
    await AuthService.invalidateAllUserSessions(userId);

    logger.info('User deleted successfully', { userId });

    return user;
  }

  static async verifyEmail(userId: Types.ObjectId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    logger.info('Email verified successfully', { userId });

    return user;
  }

  static async listUsers(options: {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    isVerified?: boolean;
  }) {
    const { page, limit, sort, order, isVerified } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const filter: any = {};
    if (isVerified !== undefined) {
      filter.isVerified = isVerified;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}