import { query } from '../../config/db.js';

/** Placeholder model - HRMS entities. All tables must have org_id. Employee App consumes these. */

export async function findEmployeesByOrg(orgId) {
  const result = await query(
    'SELECT id, org_id, name, email, department, created_at FROM employees WHERE org_id = $1 ORDER BY name',
    [orgId]
  );
  return result.rows;
}

export async function findEmployeeById(id, orgId) {
  const result = await query(
    'SELECT id, org_id, name, email, department, created_at FROM employees WHERE id = $1 AND org_id = $2',
    [id, orgId]
  );
  return result.rows[0] ?? null;
}

export async function createEmployee(data) {
  const result = await query(
    'INSERT INTO employees (org_id, name, email, department) VALUES ($1, $2, $3, $4) RETURNING id, org_id, name, email, department, created_at',
    [data.org_id, data.name, data.email, data.department ?? null]
  );
  return result.rows[0];
}

export async function findAttendanceByOrg(orgId, fromDate, toDate) {
  const result = await query(
    'SELECT id, org_id, employee_id, date, status, created_at FROM hrms_attendance WHERE org_id = $1 AND date >= $2 AND date <= $3 ORDER BY date DESC',
    [orgId, fromDate, toDate]
  );
  return result.rows;
}

export async function createAttendance(data) {
  const result = await query(
    'INSERT INTO hrms_attendance (org_id, employee_id, date, status) VALUES ($1, $2, $3, $4) RETURNING id, org_id, employee_id, date, status, created_at',
    [data.org_id, data.employee_id, data.date, data.status ?? 'present']
  );
  return result.rows[0];
}

export async function findPayrollByOrg(orgId, period) {
  const result = await query(
    'SELECT id, org_id, employee_id, period, amount, status FROM hrms_payroll WHERE org_id = $1 AND period = $2 ORDER BY employee_id',
    [orgId, period]
  );
  return result.rows;
}

export async function createPayroll(data) {
  const result = await query(
    'INSERT INTO hrms_payroll (org_id, employee_id, period, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, org_id, employee_id, period, amount, status',
    [data.org_id, data.employee_id, data.period, data.amount, data.status ?? 'pending']
  );
  return result.rows[0];
}
