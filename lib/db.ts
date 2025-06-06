import { Pool } from 'pg';

const { DATABASE_URL } = process.env;

let pool: Pool | null = null;

if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
  });
} else {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL not set; falling back to in-memory store');
}

export default pool;
