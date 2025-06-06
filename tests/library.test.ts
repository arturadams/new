import { createMocks } from 'node-mocks-http';

jest.mock('../lib/dataStore', () => {
  const records = new Map<string, any>();
  return {
    store: {
      async clear() {
        records.clear();
      },
      async add(record: any) {
        if (records.has(record.id)) {
          const err: any = new Error('duplicate');
          err.code = '23505';
          throw err;
        }
        const entry = { ...record, receivedAt: Date.now() };
        records.set(record.id, entry);
        return entry;
      },
    },
  };
});

import handler from '../pages/api/library/index';
import { store } from '../lib/dataStore';

describe('POST /api/library duplicate', () => {
  beforeEach(async () => {
    await store.clear();
  });

  it('returns 409 when inserting an existing id', async () => {
    const { req: req1, res: res1 } = createMocks({
      method: 'POST',
      body: { id: 'dup', type: 'text', payload: 'hello' }
    });
    await handler(req1 as any, res1 as any);
    expect(res1._getStatusCode()).toBe(200);

    const { req: req2, res: res2 } = createMocks({
      method: 'POST',
      body: { id: 'dup', type: 'text', payload: 'hello' }
    });
    await handler(req2 as any, res2 as any);
    expect(res2._getStatusCode()).toBe(409);
  });
});
