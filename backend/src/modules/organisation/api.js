/**
 * Organisation module API helpers / route path constants.
 */

export const ORGANISATION_ROUTES = {
  LIST: '/',
  BY_ID: '/:id',
};

export function successResponse(data, statusCode = 200) {
  return { success: true, data };
}

export function errorResponse(message, statusCode = 400) {
  return { success: false, message };
}
