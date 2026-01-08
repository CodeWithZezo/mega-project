import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { AuthService } from '../services/auth.service';
import { UnauthorizedError } from '../utils/errors';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const token = authHeader.substring(7);
    const userId = await AuthService.validateSession(token);

    req.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userId = await AuthService.validateSession(token);
      req.userId = userId;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
