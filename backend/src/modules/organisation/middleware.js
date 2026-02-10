/**
 * Organisation module-specific middleware.
 */

export function validateOrganisationBody(req, res, next) {
  if (req.body && !req.body.name) {
    return res.status(400).json({ success: false, message: 'Organisation name is required' });
  }
  if (req.body && !req.body.slug) {
    return res.status(400).json({ success: false, message: 'Organisation slug is required' });
  }
  next();
}
