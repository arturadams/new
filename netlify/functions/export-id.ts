import { store } from '../../lib/dataStore';
import { toPlainText, toMarkdown } from '../../lib/exporters';

export const handler = async (event: any) => {
  const id = event.queryStringParameters?.id;
  const format = event.queryStringParameters?.format || 'json';
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ message: 'id is required' }) };
  }

  const record = await store.get(id);
  if (!record) return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };

  if (format === 'text') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: toPlainText(record),
    };
  }

  if (format === 'markdown') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/markdown' },
      body: toMarkdown(record),
    };
  }

  return { statusCode: 200, body: JSON.stringify(record) };
};
