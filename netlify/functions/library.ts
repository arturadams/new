import { store, StoredRecord } from '../../lib/dataStore';

export const handler = async (event: any) => {
  const method = event.httpMethod;

  if (method === 'POST') {
    try {
      const { id, type, payload } = JSON.parse(event.body || '{}') as Omit<StoredRecord, 'receivedAt'>;
      if (!id || !type) {
        return { statusCode: 400, body: JSON.stringify({ message: 'id and type are required' }) };
      }
      const entry = await store.add({ id, type, payload });
      return { statusCode: 200, body: JSON.stringify(entry) };
    } catch (err: any) {
      if (err.code === '23505') {
        return { statusCode: 409, body: JSON.stringify({ message: 'Duplicate id' }) };
      }
      throw err;
    }
  }

  if (method === 'GET') {
    const data = await store.list();
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  if (method === 'DELETE') {
    await store.clear();
    return { statusCode: 204 };
  }

  return {
    statusCode: 405,
    headers: { Allow: 'GET, POST, DELETE' },
    body: `Method ${method} Not Allowed`,
  };
};
