import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';

const SALT_ROUNDS = 10;

/**
 * Hash password for storage.
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare plain password with hash.
 */
export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

/**
 * Generate JWT for user. Payload: { id, email, role, org_id (if not super_admin) }.
 */
export function createToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

/**
 * Authenticate user by email/password. Returns user + token.
 * Rejects invited users (must set password via invite link first).
 * Password read: prefers password_hash, fallback to legacy password column for backward compatibility.
 * Supports both schemas: table with both columns, or legacy table with only password.
 */
export async function login(email, password) {
  let user;
  try {
    const result = await query(
      `SELECT id, email, password, password_hash, role, organization_id, status
       FROM users
       WHERE email = $1`,
      [email]
    );
    user = result.rows[0];
  } catch (err) {
    if (err.code === '42703' && err.message?.includes('password_hash')) {
      const result = await query(
        `SELECT id, email, password, role, organization_id
         FROM users
         WHERE email = $1`,
        [email]
      );
      const row = result.rows[0];
      user = row ? { ...row, password_hash: null, status: row.status ?? 'active' } : null;
    } else {
      throw err;
    }
  }
  if (!user) throw new UnauthorizedError('Invalid credentials');

  if (user.status === 'invited') {
    throw new UnauthorizedError('Please set your password using the invite link sent to your email.');
  }

  const enabled_modules = await getEnabledModulesForUser(
    user.id,
    user.organization_id ?? null,
    user.role
  );
  const storedHash = user.password_hash ?? user.password;
  if (!storedHash) throw new UnauthorizedError('Invalid credentials');
  const valid = await comparePassword(password, storedHash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const tokenPayload = {
    userId: user.id,
    id: user.id,
    email: user.email,
    role: user.role,
    orgId: user.organization_id ?? null,
    ...(user.organization_id && { org_id: user.organization_id }),
    assignedModules: enabled_modules,
  };
  const accessToken = createToken(tokenPayload);
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.organization_id ?? null,
      enabled_modules,
    },
    token: accessToken,
  };
}

/**
 * Get enabled module slugs for a user (for sidebar/API). Super Admin gets all; Org Admin gets org modules; User gets user_module_access or org modules.
 */
export async function getEnabledModulesForUser(userId, orgId, role) {
  try {
    if (role === 'super_admin') {
      const r = await query('SELECT slug FROM modules ORDER BY slug');
      return r.rows.map((row) => row.slug);
    }
    if (!orgId) return [];
    const orgModules = await query(
      `SELECT m.slug FROM organization_modules om
       JOIN modules m ON m.id = om.module_id
       WHERE om.organization_id = $1 AND om.enabled = true`,
      [orgId]
    );
    const orgSlugs = orgModules.rows.map((r) => r.slug);
    if (role === 'org_admin') return orgSlugs;
    const userModules = await query(
      `SELECT m.slug FROM user_module_access uma
       JOIN modules m ON m.id = uma.module_id
       WHERE uma.user_id = $1`,
      [userId]
    );
    if (userModules.rows.length > 0) {
      return userModules.rows.map((r) => r.slug).filter((s) => orgSlugs.includes(s));
    }
    return orgSlugs;
  } catch (err) {
    if (err.code === '42P01') {
      return [];
    }
    throw err;
  }
}

/**
 * Set password via invite token; activate user.
 */
export async function setPasswordByToken(token, newPassword) {
  const t = await query(
    'SELECT it.id, it.user_id, it.expires_at FROM invite_tokens it WHERE it.token = $1',
    [token]
  );
  const row = t.rows[0];
  if (!row) throw new UnauthorizedError('Invalid or expired invite link.');
  if (new Date(row.expires_at) < new Date()) {
    await query('DELETE FROM invite_tokens WHERE id = $1', [row.id]);
    throw new UnauthorizedError('Invite link has expired.');
  }
  const hash = await hashPassword(newPassword);
  await query(
    'UPDATE users SET password_hash = $2, status = $3 WHERE id = $1',
    [row.user_id, hash, 'active']
  );
  await query('DELETE FROM invite_tokens WHERE user_id = $1', [row.user_id]);
  return row.user_id;
}

/**
 * Validate invite token; return email and validity for set-password page.
 */
export async function validateInviteToken(token) {
  const t = await query(
    'SELECT it.id, it.user_id, it.expires_at, u.email FROM invite_tokens it JOIN users u ON u.id = it.user_id WHERE it.token = $1 AND u.status = $2',
    [token, 'invited']
  );
  const row = t.rows[0];
  if (!row) return { valid: false, email: null };
  if (new Date(row.expires_at) < new Date()) return { valid: false, email: row.email };
  return { valid: true, email: row.email };
}
