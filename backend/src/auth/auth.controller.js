/**
 * Auth controller - placeholder.
 * Delegates to auth.service for login/signup/token refresh.
 */

import * as authService from './auth.service.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    // Placeholder: return current user from req.user (set by auth middleware)
    res.json({ success: true, data: { user: req.user } });
  } catch (err) {
    next(err);
  }
}
