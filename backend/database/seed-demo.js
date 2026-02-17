/**
 * Seed demo Super Admin and optional demo org.
 * Run from backend root: node database/seed-demo.js
 *
 * Demo credentials:
 *   Email:    superadmin@demo.com
 *   Password: Admin@123
 */
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cacheone_saas',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const DEMO_EMAIL = 'superadmin@demo.com';
const DEMO_PASSWORD = 'Admin@123';

async function runMigrations() {
  const path = join(__dirname, 'migrations', '002_ensure_users_role.sql');
  if (!fs.existsSync(path)) return;
  const sql = fs.readFileSync(path, 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.replace(/--.*$/gm, '').trim())
    .filter(Boolean);
  for (const st of statements) {
    await pool.query(st + ';');
  }
}

async function run() {
  await runMigrations();

  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  try {
    await pool.query(
      `INSERT INTO users (email, password, password_hash, role, organization_id, status)
       VALUES ($1, $2, $2, 'super_admin', NULL, 'active')
       ON CONFLICT (email) DO UPDATE SET
         password = EXCLUDED.password,
         password_hash = EXCLUDED.password_hash,
         role = 'super_admin',
         status = COALESCE(users.status, 'active')`,
      [DEMO_EMAIL, hash]
    );
  } catch (err) {
    if (err.code === '42703') {
      if (err.message?.includes('password_hash')) {
        await pool.query(
          `INSERT INTO users (email, password, role, organization_id)
           VALUES ($1, $2, 'super_admin', NULL)
           ON CONFLICT (email) DO UPDATE SET password = $2, role = 'super_admin'`,
          [DEMO_EMAIL, hash]
        );
      } else if (err.message?.includes('status')) {
        await pool.query(
          `INSERT INTO users (email, password, password_hash, role, organization_id)
           VALUES ($1, $2, $2, 'super_admin', NULL)
           ON CONFLICT (email) DO UPDATE SET password = $2, password_hash = $2, role = 'super_admin'`,
          [DEMO_EMAIL, hash]
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }

  console.log('Demo Super Admin created/updated.');
  console.log('  Email:   ', DEMO_EMAIL);
  console.log('  Password:', DEMO_PASSWORD);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
