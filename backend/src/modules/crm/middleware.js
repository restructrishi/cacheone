/**
 * CRM module-specific middleware.
 * Use for validation, CRM context, or any logic that applies only to CRM routes.
 */

// Placeholder: add CRM-specific middleware (e.g. validate lead/deal body)
export function validateLeadBody(req, res, next) {
  if (req.body && !req.body.name) {
    return res.status(400).json({ success: false, message: 'Lead name is required' });
  }
  next();
}

export function validateDealBody(req, res, next) {
  if (req.body && !req.body.title) {
    return res.status(400).json({ success: false, message: 'Deal title is required' });
  }
  next();
}
