import { query } from '../../config/db.js';

/** Placeholder model - organisation CRUD using organizations table */
export async function findAll() {
  const result = await query(
    'SELECT id, name, slug, domain, subscription_plan, created_at FROM organizations ORDER BY name'
  );
  return result.rows;
}

/** List organisations with enabled module slugs (for Super Admin panel). */
export async function findAllWithModules() {
  const result = await query(`
    SELECT o.id, o.name, o.slug, o.domain, o.subscription_plan, o.created_at,
           COALESCE(array_agg(m.slug) FILTER (WHERE om.enabled = true), ARRAY[]::text[]) as enabled_modules
    FROM organizations o
    LEFT JOIN organization_modules om ON om.organization_id = o.id
    LEFT JOIN modules m ON m.id = om.module_id
    GROUP BY o.id, o.name, o.slug, o.domain, o.subscription_plan, o.created_at
    ORDER BY o.name
  `);
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    domain: row.domain ?? null,
    subscription_plan: row.subscription_plan ?? null,
    created_at: row.created_at,
    enabled_modules: (row.enabled_modules || []).filter(Boolean),
  }));
}

export async function findById(id) {
  const result = await query(
    'SELECT id, name, slug, domain, subscription_plan, created_at FROM organizations WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function create(data) {
  const result = await query(
    `INSERT INTO organizations (name, slug, domain, subscription_plan)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, slug, domain, subscription_plan, created_at`,
    [data.name, data.slug, data.domain ?? null, data.subscription_plan ?? null]
  );
  const org = result.rows[0];
  if (org) {
    if (data.module_ids && data.module_ids.length > 0) {
      for (const mid of data.module_ids) {
        await query(
          `INSERT INTO organization_modules (organization_id, module_id, enabled) VALUES ($1, $2, true)
           ON CONFLICT (organization_id, module_id) DO UPDATE SET enabled = true`,
          [org.id, mid]
        );
      }
    } else {
      await enableDefaultModulesForOrg(org.id);
    }
  }
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
    `UPDATE organizations SET
       name = COALESCE($2, name),
       slug = COALESCE($3, slug),
       domain = COALESCE($4, domain),
       subscription_plan = COALESCE($5, subscription_plan)
     WHERE id = $1
     RETURNING id, name, slug, domain, subscription_plan, created_at`,
    [id, data.name, data.slug, data.domain, data.subscription_plan]
  );
  return result.rows[0] ?? null;
}

export async function remove(id) {
  const result = await query('DELETE FROM organizations WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] ?? null;
}

/** Set enabled modules for an org by module slugs (replaces existing). */
export async function setModules(organizationId, moduleSlugs) {
  const mods = await query('SELECT id FROM modules WHERE slug = ANY($1)', [moduleSlugs || []]);
  const moduleIds = mods.rows.map((r) => r.id);
  await query('DELETE FROM organization_modules WHERE organization_id = $1', [organizationId]);
  for (const mid of moduleIds) {
    await query(
      'INSERT INTO organization_modules (organization_id, module_id, enabled) VALUES ($1, $2, true)',
      [organizationId, mid]
    );
  }
  return moduleIds.length;
}
