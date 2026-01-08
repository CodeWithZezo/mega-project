import { Router } from 'express';
import { OrgController } from './org.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import { validateOrgId, requireOrgMember, requireOrgAdmin } from '../../middleware/org.middleware';
import {
  createOrgSchema,
  updateOrgSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  paginationSchema,
} from '../../utils/validators';

const router = Router();

// Organization CRUD
router.post('/', authenticate, validateBody(createOrgSchema), OrgController.createOrg);
router.get('/', authenticate, OrgController.getUserOrgs);

// Organization-specific routes (require orgId validation)
router.get(
  '/:orgId',
  authenticate,
  validateOrgId,
  requireOrgMember,
  OrgController.getOrg
);

router.put(
  '/:orgId',
  authenticate,
  validateOrgId,
  requireOrgAdmin,
  validateBody(updateOrgSchema),
  OrgController.updateOrg
);

router.delete(
  '/:orgId',
  authenticate,
  validateOrgId,
  requireOrgAdmin,
  OrgController.deleteOrg
);

// Member management
router.get(
  '/:orgId/members',
  authenticate,
  validateOrgId,
  requireOrgMember,
  validateQuery(paginationSchema),
  OrgController.getMembers
);

router.post(
  '/:orgId/members',
  authenticate,
  validateOrgId,
  requireOrgAdmin,
  validateBody(inviteMemberSchema),
  OrgController.addMember
);

router.put(
  '/:orgId/members/:memberId',
  authenticate,
  validateOrgId,
  requireOrgAdmin,
  validateBody(updateMemberRoleSchema),
  OrgController.updateMemberRole
);

router.delete(
  '/:orgId/members/:memberId',
  authenticate,
  validateOrgId,
  requireOrgAdmin,
  OrgController.removeMember
);

router.post(
  '/:orgId/leave',
  authenticate,
  validateOrgId,
  requireOrgMember,
  OrgController.leaveOrg
);

// Statistics
router.get(
  '/:orgId/stats',
  authenticate,
  validateOrgId,
  requireOrgAdmin,
  OrgController.getStats
);

export default router;
