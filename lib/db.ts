import { Pool } from 'pg';

const { DATABASE_URL } = process.env;

let pool: Pool | null = null;

if (DATABASE_URL && DATABASE_URL.startsWith('postgres')) {
  pool = new Pool({
    connectionString: DATABASE_URL,
  });
} else {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL missing or invalid; falling back to in-memory store');
}

export default pool;
