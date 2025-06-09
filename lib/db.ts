import { neon } from '@netlify/neon';

// `neon()` automatically reads the connection string from the appropriate
// environment variable (`DATABASE_URL`, `NETLIFY_DATABASE_URL`, or
// `NETLIFY_DATABASE_URL_UNPOOLED`).
const sql = neon();

export default sql;
