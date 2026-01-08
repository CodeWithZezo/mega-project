import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/express.types';
import { UserService } from './user.service';
import { AuthService } from '../../services/auth.service';

export class UserController {
  // POST /api/users/register
  static async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, phone } = req.body;

      const { user, token } = await AuthService.register(email, password, fullName, phone);

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users/login
  static async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { user, token } = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users/logout
  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.substring(7);

      if (token) {
        await AuthService.invalidateSession(token);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/me
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.userId!);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/me
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { fullName, phone } = req.body;

      const user = await UserService.updateUser(req.userId!, { fullName, phone });

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/me/password
  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;

      await UserService.changePassword(req.userId!, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please login again.',
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/users/me
  static async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.userId!);

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users/me/verify
  static async verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.verifyEmail(req.userId!);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users (Admin only - add role check middleware as needed)
  static async listUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, sort, order } = req.query as any;
      const isVerified = req.query.isVerified === 'true' ? true : 
                        req.query.isVerified === 'false' ? false : undefined;

      const result = await UserService.listUsers({
        page: page || 1,
        limit: limit || 10,
        sort: sort || 'createdAt',
        order: order || 'desc',
        isVerified,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id (Admin only - add role check middleware as needed)
  static async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id as any);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}