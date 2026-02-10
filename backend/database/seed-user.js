/**
 * One-off script to create a Super Admin user. Run from backend root:
 * node database/seed-user.js
 * Default: superadmin@cacheone.local / admin123
 */
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
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

const email = process.env.SEED_EMAIL || 'superadmin@cacheone.local';
const password = process.env.SEED_PASSWORD || 'admin123';

async function run() {
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, role, organization_id)
     VALUES ($1, $2, 'super_admin', NULL)
     ON CONFLICT (email) DO UPDATE SET password_hash = $2, role = 'super_admin'`,
    [email, hash]
  );
  console.log('Super Admin user created:', email);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
