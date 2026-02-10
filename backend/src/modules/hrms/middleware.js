/**
 * HRMS module-specific middleware.
 * Use for validation or logic that applies only to HRMS routes.
 */

export function validateEmployeeBody(req, res, next) {
  if (req.body && !req.body.name) {
    return res.status(400).json({ success: false, message: 'Employee name is required' });
  }
  next();
}

export function validateAttendanceBody(req, res, next) {
  if (req.body && !req.body.employee_id) {
    return res.status(400).json({ success: false, message: 'employee_id is required' });
  }
  if (req.body && !req.body.date) {
    return res.status(400).json({ success: false, message: 'date is required' });
  }
  next();
}
