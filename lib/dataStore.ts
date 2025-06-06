import pool from './db';
import type { Pool } from 'pg';

export type StoredRecord = {
  id: string;
  type: string;
  payload: any;
  receivedAt: number;
  updatedAt?: number;
};

class DataStore {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.pool
      .query(`
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload JSONB,
        received_at BIGINT NOT NULL,
        updated_at BIGINT
      )
    `)
      .catch((err: unknown) => console.error('init table error', err));
  }

  async add(record: Omit<StoredRecord, 'receivedAt' | 'updatedAt'>): Promise<StoredRecord> {
    const receivedAt = Date.now();
    try {
      await this.pool.query(
        'INSERT INTO records (id, type, payload, received_at) VALUES ($1, $2, $3, $4)',
        [record.id, record.type, JSON.stringify(record.payload), receivedAt]
      );
      return { ...record, receivedAt };
    } catch (err) {
      throw err;
    }
  }

  async list(): Promise<StoredRecord[]> {
    const { rows } = await this.pool.query('SELECT * FROM records');
    return rows.map((r: any) => ({
      id: r.id,
      type: r.type,
      payload: r.payload,
      receivedAt: Number(r.received_at),
      updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
    }));
  }

  async get(id: string): Promise<StoredRecord | null> {
    const { rows } = await this.pool.query('SELECT * FROM records WHERE id = $1', [id]);
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
    await this.pool.query(
      'UPDATE records SET type = $2, payload = $3, updated_at = $4 WHERE id = $1',
      [id, type, JSON.stringify(payload), updatedAt]
    );
    return { id, type, payload, receivedAt: record.receivedAt, updatedAt };
  }

  async remove(id: string): Promise<StoredRecord | null> {
    const record = await this.get(id);
    if (!record) return null;
    await this.pool.query('DELETE FROM records WHERE id = $1', [id]);
    return record;
  }

  async clear(): Promise<void> {
    await this.pool.query('DELETE FROM records');
  }
}

class MemoryStore {
  private records = new Map<string, StoredRecord>();

  async add(record: Omit<StoredRecord, 'receivedAt' | 'updatedAt'>): Promise<StoredRecord> {
    if (this.records.has(record.id)) {
      const err: any = new Error('duplicate');
      err.code = '23505';
      throw err;
    }
    const receivedAt = Date.now();
    const entry = { ...record, receivedAt };
    this.records.set(record.id, entry);
    return entry;
  }

  async list(): Promise<StoredRecord[]> {
    return Array.from(this.records.values());
  }

  async get(id: string): Promise<StoredRecord | null> {
    return this.records.get(id) || null;
  }

  async update(id: string, update: Partial<Omit<StoredRecord, 'id' | 'receivedAt'>>): Promise<StoredRecord | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const payload = update.payload !== undefined ? update.payload : existing.payload;
    const type = update.type || existing.type;
    const updatedAt = Date.now();
    const updated = { ...existing, type, payload, updatedAt };
    this.records.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<StoredRecord | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    this.records.delete(id);
    return existing;
  }

  async clear(): Promise<void> {
    this.records.clear();
  }
}

let store: DataStore | MemoryStore;

if (pool) {
  store = new DataStore(pool);
} else {
  store = new MemoryStore();
}

export { store };
