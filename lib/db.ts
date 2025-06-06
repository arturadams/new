import { Pool } from 'pg';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export default pool;
