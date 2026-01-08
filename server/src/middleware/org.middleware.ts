import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../types/express.types';
import { OrgService } from '../modules/org/org.service';
import { ForbiddenError, ValidationError } from '../utils/errors';

// Extend AuthRequest to include orgId and role
export interface OrgRequest extends AuthRequest {
  orgId?: Types.ObjectId;
  userRole?: 'admin' | 'member';
}

// Validate and attach orgId to request
export const validateOrgId = (req: OrgRequest, res: Response, next: NextFunction) => {
  const { orgId } = req.params;

  if (!orgId || !Types.ObjectId.isValid(orgId)) {
    return next(new ValidationError('Invalid organization ID'));
  }

  req.orgId = new Types.ObjectId(orgId);
  next();
};

// Check if user is a member of the organization
export const requireOrgMember = async (
  req: OrgRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const isMember = await OrgService.isMember(req.orgId!, req.userId!);

    if (!isMember) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    // Attach user's role to request
    req.userRole = await OrgService.getUserRole(req.orgId!, req.userId!) as 'admin' | 'member';

    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is an admin of the organization
export const requireOrgAdmin = async (
  req: OrgRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const isAdmin = await OrgService.isAdmin(req.orgId!, req.userId!);

    if (!isAdmin) {
      throw new ForbiddenError('You must be an admin to perform this action');
    }

    req.userRole = 'admin';

    next();
  } catch (error) {
    next(error);
  }
};