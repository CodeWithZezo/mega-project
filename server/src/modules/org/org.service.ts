import { Types } from 'mongoose';
import { Org, OrgUser, User, ApiKey } from '../../models';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export class OrgService {
  // Create a new organization
  static async createOrg(name: string, userId: Types.ObjectId) {
    // Check if org name already exists
    const existingOrg = await Org.findOne({ name });
    if (existingOrg) {
      throw new ConflictError('Organization name already exists');
    }

    // Create organization
    const org = await Org.create({ name });

    // Add creator as admin
    await OrgUser.create({
      orgId: org._id,
      userId,
      role: 'admin',
    });

    logger.info('Organization created', { orgId: org._id, userId, name });

    return org;
  }

  // Get organization by ID
  static async getOrgById(orgId: Types.ObjectId) {
    const org = await Org.findById(orgId);
    if (!org) {
      throw new NotFoundError('Organization not found');
    }
    return org;
  }

  // Update organization
  static async updateOrg(orgId: Types.ObjectId, updates: { name?: string }) {
    // Check if new name already exists
    if (updates.name) {
      const existingOrg = await Org.findOne({ 
        name: updates.name, 
        _id: { $ne: orgId } 
      });
      if (existingOrg) {
        throw new ConflictError('Organization name already exists');
      }
    }

    const org = await Org.findByIdAndUpdate(
      orgId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    logger.info('Organization updated', { orgId });

    return org;
  }

  // Delete organization
  static async deleteOrg(orgId: Types.ObjectId) {
    const org = await Org.findByIdAndDelete(orgId);

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // Clean up related data
    await Promise.all([
      OrgUser.deleteMany({ orgId }),
      ApiKey.deleteMany({ orgId }),
    ]);

    logger.info('Organization deleted', { orgId });

    return org;
  }

  // Get user's organizations
  static async getUserOrgs(userId: Types.ObjectId) {
    const orgUsers = await OrgUser.find({ userId })
      .populate('orgId')
      .sort({ role: 1 }); // Admins first

    const orgs = orgUsers.map(ou => ({
      org: ou.orgId,
      role: ou.role,
    }));

    return orgs;
  }

  // Get organization members
  static async getOrgMembers(
    orgId: Types.ObjectId,
    options: {
      page: number;
      limit: number;
      role?: 'admin' | 'member';
    }
  ) {
    const { page, limit, role } = options;
    const skip = (page - 1) * limit;

    const filter: any = { orgId };
    if (role) {
      filter.role = role;
    }

    const [members, total] = await Promise.all([
      OrgUser.find(filter)
        .populate('userId', 'email fullName phone isVerified createdAt')
        .sort({ role: 1, _id: -1 })
        .skip(skip)
        .limit(limit),
      OrgUser.countDocuments(filter),
    ]);

    const formattedMembers = members.map(m => ({
      userId: m.userId._id,
      email: (m.userId as any).email,
      fullName: (m.userId as any).fullName,
      phone: (m.userId as any).phone,
      isVerified: (m.userId as any).isVerified,
      role: m.role,
      joinedAt: (m.userId as any).createdAt,
    }));

    return {
      members: formattedMembers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Add member to organization
  static async addMember(
    orgId: Types.ObjectId,
    email: string,
    role: 'admin' | 'member'
  ) {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found with this email');
    }

    // Check if user is already a member
    const existingMember = await OrgUser.findOne({ orgId, userId: user._id });
    if (existingMember) {
      throw new ConflictError('User is already a member of this organization');
    }

    // Add user to organization
    const orgUser = await OrgUser.create({
      orgId,
      userId: user._id,
      role,
    });

    logger.info('Member added to organization', { orgId, userId: user._id, role });

    return {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      role,
    };
  }

  // Update member role
  static async updateMemberRole(
    orgId: Types.ObjectId,
    memberId: Types.ObjectId,
    newRole: 'admin' | 'member'
  ) {
    const orgUser = await OrgUser.findOneAndUpdate(
      { orgId, userId: memberId },
      { $set: { role: newRole } },
      { new: true }
    ).populate('userId', 'email fullName');

    if (!orgUser) {
      throw new NotFoundError('Member not found in this organization');
    }

    logger.info('Member role updated', { orgId, userId: memberId, newRole });

    return {
      userId: orgUser.userId._id,
      email: (orgUser.userId as any).email,
      fullName: (orgUser.userId as any).fullName,
      role: orgUser.role,
    };
  }

  // Remove member from organization
  static async removeMember(orgId: Types.ObjectId, memberId: Types.ObjectId) {
    // Check how many admins are left
    const adminCount = await OrgUser.countDocuments({ orgId, role: 'admin' });
    const memberToRemove = await OrgUser.findOne({ orgId, userId: memberId });

    if (!memberToRemove) {
      throw new NotFoundError('Member not found in this organization');
    }

    // Prevent removing the last admin
    if (memberToRemove.role === 'admin' && adminCount <= 1) {
      throw new ValidationError('Cannot remove the last admin. Transfer ownership or add another admin first.');
    }

    await OrgUser.deleteOne({ orgId, userId: memberId });

    logger.info('Member removed from organization', { orgId, userId: memberId });
  }

  // Leave organization
  static async leaveOrg(orgId: Types.ObjectId, userId: Types.ObjectId) {
    // Check if user is a member
    const membership = await OrgUser.findOne({ orgId, userId });
    if (!membership) {
      throw new NotFoundError('You are not a member of this organization');
    }

    // Check if user is the last admin
    if (membership.role === 'admin') {
      const adminCount = await OrgUser.countDocuments({ orgId, role: 'admin' });
      if (adminCount <= 1) {
        throw new ValidationError('You are the last admin. Transfer ownership or add another admin before leaving.');
      }
    }

    await OrgUser.deleteOne({ orgId, userId });

    logger.info('User left organization', { orgId, userId });
  }

  // Check user's role in organization
  static async getUserRole(orgId: Types.ObjectId, userId: Types.ObjectId): Promise<'admin' | 'member' | null> {
    const orgUser = await OrgUser.findOne({ orgId, userId });
    return orgUser ? orgUser.role : null;
  }

  // Check if user is admin
  static async isAdmin(orgId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const role = await this.getUserRole(orgId, userId);
    return role === 'admin';
  }

  // Check if user is member (admin or member)
  static async isMember(orgId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const role = await this.getUserRole(orgId, userId);
    return role !== null;
  }

  // Get organization statistics
  static async getOrgStats(orgId: Types.ObjectId) {
    const [memberCount, adminCount, apiKeyCount] = await Promise.all([
      OrgUser.countDocuments({ orgId }),
      OrgUser.countDocuments({ orgId, role: 'admin' }),
      ApiKey.countDocuments({ orgId, revoked: false }),
    ]);

    return {
      totalMembers: memberCount,
      totalAdmins: adminCount,
      totalActiveApiKeys: apiKeyCount,
    };
  }
}
