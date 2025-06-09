const { neon } = require('@netlify/neon');

const sql = neon();

async function seed() {
  await sql`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      payload JSONB,
      received_at BIGINT NOT NULL,
      updated_at BIGINT
    );
  `;

  await sql`DELETE FROM records`;

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
    await sql`INSERT INTO records (id, type, payload, received_at) VALUES (${e.id}, ${e.type}, ${JSON.stringify(e.payload)}, ${now})`;
  }

  console.log('Inserted sample data');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
