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
 * Business logic (e.g. load user from DB) to be implemented.
 */
export async function login(email, password) {
  // Placeholder: replace with actual user lookup
  const result = await query(
    'SELECT id, email, password_hash, role, organization_id FROM users WHERE email = $1',
    [email]
  );
  const user = result.rows[0];
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    ...(user.organization_id && { org_id: user.organization_id }),
  };
  const token = createToken(tokenPayload);
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      org_id: user.organization_id ?? null,
    },
    token,
  };
}
