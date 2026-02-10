/**
 * CRM module API helpers / route path constants.
 * Use for consistent response shape or path references within the module.
 */

export const CRM_ROUTES = {
  LEADS: '/leads',
  LEAD_BY_ID: '/leads/:id',
  DEALS: '/deals',
  DEAL_BY_ID: '/deals/:id',
};

export function successResponse(data, statusCode = 200) {
  return { success: true, data };
}

export function errorResponse(message, statusCode = 400) {
  return { success: false, message };
}
