import { createMocks } from 'node-mocks-http';
import { mockStore, resetStore } from './testUtils';

jest.mock('../lib/dataStore', () => ({ store: mockStore }));

import handler from '../pages/api/library/index';
import { store } from '../lib/dataStore';

describe('/api/library', () => {
  beforeEach(() => resetStore());

  test('POST stores a record', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { id: 'r1', type: 'text', payload: 'hello' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData() as string);
    expect(data.id).toBe('r1');
    expect((await store.list()).length).toBe(1);
  });

  test('GET returns all records', async () => {
    await store.add({ id: 'r1', type: 'text', payload: 'hello' });
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData() as string);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
  });

  test('DELETE clears records', async () => {
    await store.add({ id: 'r1', type: 'text', payload: 'hello' });
    const { req, res } = createMocks({ method: 'DELETE' });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(204);
    expect((await store.list()).length).toBe(0);
  });
});
