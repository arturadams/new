import { Pool } from 'pg';

const {
  DATABASE_URL,
  NETLIFY_DATABASE_URL,
  NETLIFY_DATABASE_URL_UNPOOLED,
} = process.env;

const connectionString =
  DATABASE_URL || NETLIFY_DATABASE_URL || NETLIFY_DATABASE_URL_UNPOOLED;

if (!connectionString || !connectionString.startsWith('postgres')) {
  throw new Error('DATABASE_URL is missing or invalid');
}

const pool = new Pool({ connectionString });

export default pool;
