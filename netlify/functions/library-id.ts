import { store } from '../../lib/dataStore';

export const handler = async (event: any) => {
  const method = event.httpMethod;
  const id = event.queryStringParameters?.id;

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ message: 'id is required' }) };
  }

  if (method === 'GET') {
    const record = await store.get(id);
    if (!record) return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
    return { statusCode: 200, body: JSON.stringify(record) };
  }

  if (method === 'PUT') {
    const update = JSON.parse(event.body || '{}');
    const record = await store.update(id, update);
    if (!record) return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
    return { statusCode: 200, body: JSON.stringify(record) };
  }

  if (method === 'DELETE') {
    const deleted = await store.remove(id);
    if (!deleted) return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
    return { statusCode: 204 };
  }

  return {
    statusCode: 405,
    headers: { Allow: 'GET, PUT, DELETE' },
    body: `Method ${method} Not Allowed`,
  };
};
