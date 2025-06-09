import { neon } from '@netlify/neon';

const {
  DATABASE_URL,
  NETLIFY_DATABASE_URL,
  NETLIFY_DATABASE_URL_UNPOOLED,
} = process.env;

const connectionString =
  DATABASE_URL || NETLIFY_DATABASE_URL || NETLIFY_DATABASE_URL_UNPOOLED;

if (!connectionString || !connectionString.startsWith('postgres')) {
  throw new Error('Database connection string is missing or invalid');
}

const sql = neon(connectionString);

export default sql;
