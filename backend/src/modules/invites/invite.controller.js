import * as inviteService from './invite.service.js';
import { ROLES } from '../../middlewares/role.middleware.js';

export async function createInvite(req, res, next) {
  try {
    const { email, organizationId, role, moduleIds } = req.body;
    const inviterRole = req.user.role;
    const inviterOrgId = req.user.org_id;

    if (inviterRole === ROLES.SUPER_ADMIN) {
      if (!organizationId) return res.status(400).json({ success: false, message: 'organizationId required' });
      const data = await inviteService.createOrgAdminInvite(email, organizationId, req.user.id);
      return res.status(201).json({ success: true, data });
    }

    if (inviterRole === ROLES.ORG_ADMIN && inviterOrgId) {
      const orgId = organizationId || inviterOrgId;
      if (orgId !== inviterOrgId) return res.status(403).json({ success: false, message: 'Cannot invite to another organization' });
      const data = await inviteService.createUserInvite(email, orgId, role || 'USER', moduleIds || [], req.user.id);
      return res.status(201).json({ success: true, data });
    }

    return res.status(403).json({ success: false, message: 'Insufficient permissions' });
  } catch (err) {
    next(err);
  }
}

export async function listInvites(req, res, next) {
  try {
    const orgId = req.query.organizationId || req.resolvedOrgId || req.user?.org_id;
    if (!orgId) return res.status(400).json({ success: false, message: 'organizationId required' });
    if (req.user.role !== ROLES.SUPER_ADMIN && req.user.org_id !== orgId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const data = await inviteService.listInvitesByOrganization(orgId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
