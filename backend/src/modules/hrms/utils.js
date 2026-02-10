/**
 * HRMS module-specific utilities.
 */

export function formatAttendanceStatus(status) {
  const map = { present: 'Present', absent: 'Absent', leave: 'Leave', half_day: 'Half Day' };
  return map[status] || status;
}

export function formatPayrollStatus(status) {
  const map = { pending: 'Pending', paid: 'Paid', failed: 'Failed' };
  return map[status] || status;
}
