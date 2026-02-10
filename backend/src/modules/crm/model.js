import { query } from '../../config/db.js';

/** Placeholder model - CRM entities. All tables must have org_id. */

export async function findLeadsByOrg(orgId) {
  const result = await query(
    'SELECT id, org_id, name, email, status, created_at FROM crm_leads WHERE org_id = $1 ORDER BY created_at DESC',
    [orgId]
  );
  return result.rows;
}

export async function findLeadById(id, orgId) {
  const result = await query(
    'SELECT id, org_id, name, email, status, created_at FROM crm_leads WHERE id = $1 AND org_id = $2',
    [id, orgId]
  );
  return result.rows[0] ?? null;
}

export async function createLead(data) {
  const result = await query(
    'INSERT INTO crm_leads (org_id, name, email, status) VALUES ($1, $2, $3, $4) RETURNING id, org_id, name, email, status, created_at',
    [data.org_id, data.name, data.email, data.status ?? 'new']
  );
  return result.rows[0];
}

export async function findDealsByOrg(orgId) {
  const result = await query(
    'SELECT id, org_id, title, value, stage, created_at FROM crm_deals WHERE org_id = $1 ORDER BY created_at DESC',
    [orgId]
  );
  return result.rows;
}

export async function findDealById(id, orgId) {
  const result = await query(
    'SELECT id, org_id, title, value, stage, created_at FROM crm_deals WHERE id = $1 AND org_id = $2',
    [id, orgId]
  );
  return result.rows[0] ?? null;
}

export async function createDeal(data) {
  const result = await query(
    'INSERT INTO crm_deals (org_id, title, value, stage) VALUES ($1, $2, $3, $4) RETURNING id, org_id, title, value, stage, created_at',
    [data.org_id, data.title, data.value, data.stage ?? 'lead']
  );
  return result.rows[0];
}
