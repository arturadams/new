import { Pool } from 'pg';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL || !DATABASE_URL.startsWith('postgres')) {
  throw new Error('DATABASE_URL is missing or invalid');
}

const pool = new Pool({ connectionString: DATABASE_URL });

export default pool;
