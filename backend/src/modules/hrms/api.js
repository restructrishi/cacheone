/**
 * HRMS module API helpers / route path constants.
 */

export const HRMS_ROUTES = {
  EMPLOYEES: '/employees',
  EMPLOYEE_BY_ID: '/employees/:id',
  ATTENDANCE: '/attendance',
  PAYROLL: '/payroll',
};

export function successResponse(data, statusCode = 200) {
  return { success: true, data };
}

export function errorResponse(message, statusCode = 400) {
  return { success: false, message };
}
