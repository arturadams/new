export type TestRecord = {
  id: string;
  type: string;
  payload: any;
  receivedAt?: number;
  updatedAt?: number;
};

const records: TestRecord[] = [];

export const mockStore = {
  async add(record: Omit<TestRecord, 'receivedAt' | 'updatedAt'>): Promise<TestRecord> {
    const stored = { ...record, receivedAt: Date.now() };
    records.push(stored);
    return stored;
  },
  async list(): Promise<TestRecord[]> {
    return records;
  },
  async clear(): Promise<void> {
    records.length = 0;
  },
  async get(id: string): Promise<TestRecord | null> {
    return records.find(r => r.id === id) || null;
  },
  async update(id: string, update: Partial<Omit<TestRecord, 'id' | 'receivedAt'>>): Promise<TestRecord | null> {
    const record = records.find(r => r.id === id);
    if (!record) return null;
    if (update.type !== undefined) record.type = update.type;
    if (update.payload !== undefined) record.payload = update.payload;
    record.updatedAt = Date.now();
    return record;
  },
  async remove(id: string): Promise<TestRecord | null> {
    const idx = records.findIndex(r => r.id === id);
    if (idx === -1) return null;
    const [removed] = records.splice(idx, 1);
    return removed;
  },
};

export function resetStore() {
  records.length = 0;
}
