import { query } from '../../config/db.js';

/** Placeholder model - organisation CRUD using organizations table */
export async function findAll() {
  const result = await query('SELECT id, name, slug, created_at FROM organizations ORDER BY name');
  return result.rows;
}

/** List organisations with enabled module slugs (for Super Admin panel). */
export async function findAllWithModules() {
  const result = await query(`
    SELECT o.id, o.name, o.slug, o.created_at,
           COALESCE(array_agg(m.slug) FILTER (WHERE om.enabled = true), ARRAY[]::text[]) as enabled_modules
    FROM organizations o
    LEFT JOIN organization_modules om ON om.organization_id = o.id
    LEFT JOIN modules m ON m.id = om.module_id
    GROUP BY o.id, o.name, o.slug, o.created_at
    ORDER BY o.name
  `);
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    created_at: row.created_at,
    enabled_modules: (row.enabled_modules || []).filter(Boolean),
  }));
}

export async function findById(id) {
  const result = await query(
    'SELECT id, name, slug, created_at FROM organizations WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function create(data) {
  const result = await query(
    'INSERT INTO organizations (name, slug) VALUES ($1, $2) RETURNING id, name, slug, created_at',
    [data.name, data.slug]
  );
  const org = result.rows[0];
  if (org) await enableDefaultModulesForOrg(org.id);
  return org;
}

/** Enable default modules (organisation + CRM) for a new organization. */
async function enableDefaultModulesForOrg(organizationId) {
  const mods = await query(
    "SELECT id FROM modules WHERE slug IN ('organisation', 'crm')"
  );
  for (const m of mods.rows) {
    await query(
      `INSERT INTO organization_modules (organization_id, module_id, enabled)
       VALUES ($1, $2, true)
       ON CONFLICT (organization_id, module_id) DO UPDATE SET enabled = true`,
      [organizationId, m.id]
    );
  }
}

export async function update(id, data) {
  const result = await query(
    'UPDATE organizations SET name = COALESCE($2, name), slug = COALESCE($3, slug) WHERE id = $1 RETURNING id, name, slug, created_at',
    [id, data.name, data.slug]
  );
  return result.rows[0] ?? null;
}

export async function remove(id) {
  const result = await query('DELETE FROM organizations WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] ?? null;
}
