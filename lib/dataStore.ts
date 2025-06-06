import pool from './db';

export type StoredRecord = {
  id: string;
  type: string;
  payload: any;
  receivedAt: number;
  updatedAt?: number;
};

class DataStore {
  constructor() {
    pool.query(`
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload JSONB,
        received_at BIGINT NOT NULL,
        updated_at BIGINT
      )
    `).catch((err: unknown) => console.error('init table error', err));
  }

  async add(record: Omit<StoredRecord, 'receivedAt' | 'updatedAt'>): Promise<StoredRecord> {
    const receivedAt = Date.now();
    try {
      await pool.query(
        'INSERT INTO records (id, type, payload, received_at) VALUES ($1, $2, $3, $4)',
        [record.id, record.type, JSON.stringify(record.payload), receivedAt]
      );
      return { ...record, receivedAt };
    } catch (err) {
      throw err;
    }
  }

  async list(): Promise<StoredRecord[]> {
    const { rows } = await pool.query('SELECT * FROM records');
    return rows.map((r: any) => ({
      id: r.id,
      type: r.type,
      payload: r.payload,
      receivedAt: Number(r.received_at),
      updatedAt: r.updated_at ? Number(r.updated_at) : undefined,
    }));
  }

  async get(id: string): Promise<StoredRecord | null> {
    const { rows } = await pool.query('SELECT * FROM records WHERE id = $1', [id]);
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
    await pool.query(
      'UPDATE records SET type = $2, payload = $3, updated_at = $4 WHERE id = $1',
      [id, type, JSON.stringify(payload), updatedAt]
    );
    return { id, type, payload, receivedAt: record.receivedAt, updatedAt };
  }

  async remove(id: string): Promise<StoredRecord | null> {
    const record = await this.get(id);
    if (!record) return null;
    await pool.query('DELETE FROM records WHERE id = $1', [id]);
    return record;
  }

  async clear(): Promise<void> {
    await pool.query('DELETE FROM records');
  }
}

export const store = new DataStore();
