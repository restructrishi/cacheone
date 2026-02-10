import * as hrmsModel from './model.js';

/** HRMS service - placeholder. Employee Management App consumes HRMS APIs only. */
export async function listEmployees(orgId) {
  return hrmsModel.findEmployeesByOrg(orgId);
}

export async function getEmployeeById(id, orgId) {
  return hrmsModel.findEmployeeById(id, orgId);
}

export async function createEmployee(data) {
  return hrmsModel.createEmployee(data);
}

export async function listAttendance(orgId, fromDate, toDate) {
  return hrmsModel.findAttendanceByOrg(orgId, fromDate, toDate);
}

export async function createAttendance(data) {
  return hrmsModel.createAttendance(data);
}

export async function listPayroll(orgId, period) {
  return hrmsModel.findPayrollByOrg(orgId, period);
}

export async function createPayroll(data) {
  return hrmsModel.createPayroll(data);
}
