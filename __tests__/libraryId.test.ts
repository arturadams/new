import { createMocks } from 'node-mocks-http';
import { mockStore, resetStore } from './testUtils';

jest.mock('../lib/dataStore', () => ({ store: mockStore }));

import handler from '../pages/api/library/[id]';
import { store } from '../lib/dataStore';

describe('/api/library/[id]', () => {
  beforeEach(() => resetStore());

  test('GET returns a record', async () => {
    await store.add({ id: 'r1', type: 'text', payload: 'hello' });
    const { req, res } = createMocks({ method: 'GET', query: { id: 'r1' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData() as string);
    expect(data.id).toBe('r1');
  });

  test('PUT updates a record', async () => {
    await store.add({ id: 'r1', type: 'text', payload: 'hello' });
    const { req, res } = createMocks({
      method: 'PUT',
      query: { id: 'r1' },
      body: { payload: 'changed' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData() as string);
    expect(data.payload).toBe('changed');
  });

  test('DELETE removes a record', async () => {
    await store.add({ id: 'r1', type: 'text', payload: 'hello' });
    const { req, res } = createMocks({ method: 'DELETE', query: { id: 'r1' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(204);
    expect(await store.get('r1')).toBeNull();
  });
});
