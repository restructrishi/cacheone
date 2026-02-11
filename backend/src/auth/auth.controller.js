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
    const enabled_modules = await authService.getEnabledModulesForUser(
      req.user.id,
      req.user.org_id ?? null,
      req.user.role
    );
    res.json({
      success: true,
      data: {
        user: { ...req.user, enabled_modules },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function setPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    await authService.setPasswordByToken(token, password);
    res.json({ success: true, message: 'Password set. You can sign in now.' });
  } catch (err) {
    next(err);
  }
}

export async function validateInvite(req, res, next) {
  try {
    const token = req.query.token || req.body?.token;
    const result = await authService.validateInviteToken(token);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
