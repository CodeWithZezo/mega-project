import { Request, Response, NextFunction } from "express";
import { JWTUtils } from "../utils/jwt.utils";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = JWTUtils.verifyAccessToken(token) as { userId: string; email: string };
    if (!payload) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
