import { Response, NextFunction } from 'express';
import { OrgRequest } from '../../middleware/org.middleware';
import { OrgService } from './org.service';

export class OrgController {
  // POST /api/orgs
  static async createOrg(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const org = await OrgService.createOrg(name, req.userId!);

      res.status(201).json({
        success: true,
        data: { org },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/orgs
  static async getUserOrgs(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const orgs = await OrgService.getUserOrgs(req.userId!);

      res.status(200).json({
        success: true,
        data: { orgs },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/orgs/:orgId
  static async getOrg(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const org = await OrgService.getOrgById(req.orgId!);
      const stats = await OrgService.getOrgStats(req.orgId!);

      res.status(200).json({
        success: true,
        data: { 
          org,
          stats,
          userRole: req.userRole,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/orgs/:orgId
  static async updateOrg(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const org = await OrgService.updateOrg(req.orgId!, { name });

      res.status(200).json({
        success: true,
        data: { org },
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/orgs/:orgId
  static async deleteOrg(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      await OrgService.deleteOrg(req.orgId!);

      res.status(200).json({
        success: true,
        message: 'Organization deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/orgs/:orgId/members
  static async getMembers(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, role } = req.query as any;

      const result = await OrgService.getOrgMembers(req.orgId!, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        role,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/orgs/:orgId/members
  static async addMember(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const { email, role } = req.body;

      const member = await OrgService.addMember(req.orgId!, email, role);

      res.status(201).json({
        success: true,
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/orgs/:orgId/members/:memberId
  static async updateMemberRole(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const { memberId } = req.params;

      const member = await OrgService.updateMemberRole(
        req.orgId!,
        new Types.ObjectId(memberId),
        role
      );

      res.status(200).json({
        success: true,
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/orgs/:orgId/members/:memberId
  static async removeMember(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;

      await OrgService.removeMember(
        req.orgId!,
        new Types.ObjectId(memberId)
      );

      res.status(200).json({
        success: true,
        message: 'Member removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/orgs/:orgId/leave
  static async leaveOrg(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      await OrgService.leaveOrg(req.orgId!, req.userId!);

      res.status(200).json({
        success: true,
        message: 'Left organization successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/orgs/:orgId/stats
  static async getStats(req: OrgRequest, res: Response, next: NextFunction) {
    try {
      const stats = await OrgService.getOrgStats(req.orgId!);

      res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }
}