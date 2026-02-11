import { query } from '../../config/db.js';
import { hashPassword } from '../../auth/auth.service.js';
import { ROLES } from '../../middlewares/role.middleware.js';
import { ForbiddenError } from '../../utils/errors.js';
import crypto from 'crypto';

const INVITE_EXPIRY_HOURS = 72;

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Super Admin invites Org Admin: email + organizationId, role = org_admin, no password, status = invited.
 */
export async function createOrgAdminInvite(email, organizationId, invitedByUserId) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) throw new ForbiddenError('User with this email already exists.');

  const org = await query('SELECT id FROM organizations WHERE id = $1', [organizationId]);
  if (org.rows.length === 0) throw new ForbiddenError('Organization not found.');

  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);
  const userIns = await query(
    `INSERT INTO users (email, password_hash, role, organization_id, status)
     VALUES ($1, NULL, $2, $3, 'invited')
     RETURNING id, email, role, organization_id, status`,
    [email, ROLES.ORG_ADMIN, organizationId]
  );
  const user = userIns.rows[0];
  const token = generateToken();
  await query(
    'INSERT INTO invite_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, token, expiresAt]
  );
  const inviteLink = `${process.env.APP_URL || 'http://localhost:5173'}/set-password?token=${token}`;
  await sendInviteEmail(email, inviteLink, 'org_admin');
  return { user: { id: user.id, email: user.email, role: user.role, status: user.status }, token, inviteLink };
}

/**
 * Org Admin invites User: email + organizationId (from context) + role (org_admin or module_user) + moduleIds (for module_user).
 */
export async function createUserInvite(email, organizationId, role, moduleIds, invitedByUserId) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) throw new ForbiddenError('User with this email already exists.');

  const orgMods = await query(
    `SELECT module_id FROM organization_modules WHERE organization_id = $1 AND enabled = true`,
    [organizationId]
  );
  const allowedModuleIds = orgMods.rows.map((r) => r.module_id);

  const roleValue = role === 'ADMIN' ? ROLES.ORG_ADMIN : ROLES.MODULE_USER;
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);
  const userIns = await query(
    `INSERT INTO users (email, password_hash, role, organization_id, status)
     VALUES ($1, NULL, $2, $3, 'invited')
     RETURNING id, email, role, organization_id, status`,
    [email, roleValue, organizationId]
  );
  const user = userIns.rows[0];
  if (roleValue === ROLES.MODULE_USER && Array.isArray(moduleIds) && moduleIds.length > 0) {
    const bySlug = await query('SELECT id, slug FROM modules WHERE slug = ANY($1)', [moduleIds]);
    for (const m of bySlug.rows) {
      if (allowedModuleIds.includes(m.id)) {
        await query(
          'INSERT INTO user_module_access (user_id, module_id) VALUES ($1, $2) ON CONFLICT (user_id, module_id) DO NOTHING',
          [user.id, m.id]
        );
      }
    }
  }
  const token = generateToken();
  await query(
    'INSERT INTO invite_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, token, expiresAt]
  );
  const inviteLink = `${process.env.APP_URL || 'http://localhost:5173'}/set-password?token=${token}`;
  await sendInviteEmail(email, inviteLink, roleValue);
  return { user: { id: user.id, email: user.email, role: user.role, status: user.status }, token, inviteLink };
}

async function sendInviteEmail(toEmail, inviteLink, role) {
  if (process.env.SENDGRID_API_KEY || process.env.MAILER_URL) {
    // Integrate with your email provider (SendGrid, etc.)
  }
  console.log(`[Invite] ${toEmail} (${role}): ${inviteLink}`);
}

export async function listInvitesByOrganization(organizationId) {
  const result = await query(
    `SELECT u.id, u.email, u.role, u.status, u.created_at
     FROM users u
     WHERE u.organization_id = $1 AND u.role != $2
     ORDER BY u.created_at DESC`,
    [organizationId, 'super_admin']
  );
  return result.rows;
}
