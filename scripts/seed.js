const { Pool } = require('pg');

const {
  DATABASE_URL,
  NETLIFY_DATABASE_URL,
  NETLIFY_DATABASE_URL_UNPOOLED,
} = process.env;

const connectionString =
  DATABASE_URL || NETLIFY_DATABASE_URL || NETLIFY_DATABASE_URL_UNPOOLED;

const pool = new Pool({
  connectionString,
});

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      payload JSONB,
      received_at BIGINT NOT NULL,
      updated_at BIGINT
    );
  `);

  await pool.query('DELETE FROM records');

  const now = Date.now();
  const entries = [
    { id: 'greeting', type: 'text', payload: 'Hello, world!' },
    {
      id: 'todos',
      type: 'list',
      payload: { items: ['Buy milk', 'Study Next.js'] },
    },
    { id: 'quote', type: 'text', payload: 'Stay hungry, stay foolish.' },
  ];

  for (const e of entries) {
    await pool.query(
      'INSERT INTO records (id, type, payload, received_at) VALUES ($1, $2, $3, $4)',
      [e.id, e.type, JSON.stringify(e.payload), now]
    );
  }

  console.log('Inserted sample data');
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
