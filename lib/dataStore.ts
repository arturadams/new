import sql from './db';
import type { NeonQueryFunction } from '@neondatabase/serverless';

export type StoredRecord = {
  id: string;
  type: string;
  payload: any;
  receivedAt: number;
  updatedAt?: number;
};

class DataStore {
  private sql: NeonQueryFunction<false, false>;

  constructor(sql: NeonQueryFunction<false, false>) {
    this.sql = sql;
    this.sql`
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload JSONB,
        received_at BIGINT NOT NULL,
        updated_at BIGINT
      )
    `.catch((err: unknown) => console.error('init table error', err));
  }

  async add(record: Omit<StoredRecord, 'receivedAt' | 'updatedAt'>): Promise<StoredRecord> {
    const receivedAt = Date.now();
    try {
      await this.sql`INSERT INTO records (id, type, payload, received_at) VALUES (${record.id}, ${record.type}, ${JSON.stringify(record.payload)}, ${receivedAt})`;
      return { ...record, receivedAt };
    } catch (err) {
      throw err;
    }
  }

  async list(): Promise<StoredRecord[]> {
    const rows = await this.sql`SELECT * FROM records`;
    return rows.map((r: any) => ({
      id: r.id,
      type: r.type,
      payload: r.payload,
      receivedAt: Number(r.received_at),
      updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
    }));
  }

  async get(id: string): Promise<StoredRecord | null> {
    const rows = await this.sql`SELECT * FROM records WHERE id = ${id}`;
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      type: r.type,
      payload: r.payload,
      receivedAt: Number(r.received_at),
      updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
    };
  }

  async update(id: string, update: Partial<Omit<StoredRecord, 'id' | 'receivedAt'>>): Promise<StoredRecord | null> {
    const record = await this.get(id);
    if (!record) return null;
    const payload = update.payload !== undefined ? update.payload : record.payload;
    const type = update.type || record.type;
    const updatedAt = Date.now();
    await this.sql`UPDATE records SET type = ${type}, payload = ${JSON.stringify(payload)}, updated_at = ${updatedAt} WHERE id = ${id}`;
    return { id, type, payload, receivedAt: record.receivedAt, updatedAt };
  }

  async remove(id: string): Promise<StoredRecord | null> {
    const record = await this.get(id);
    if (!record) return null;
    await this.sql`DELETE FROM records WHERE id = ${id}`;
    return record;
  }

  async clear(): Promise<void> {
    await this.sql`DELETE FROM records`;
  }
}

const store = new DataStore(sql);

export { store };
