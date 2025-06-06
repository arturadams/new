import fs from 'fs';
import path from 'path';

export type StoredRecord = {
  id: string;
  type: string;
  payload: any;
  receivedAt: number;
  updatedAt?: number;
};

const DB_PATH = path.join(process.cwd(), 'lib', 'db.json');

function readFile(): StoredRecord[] {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as StoredRecord[];
  } catch {
    return [];
  }
}

function writeFile(data: StoredRecord[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

class DataStore {
  private records: StoredRecord[] = readFile();

  add(record: Omit<StoredRecord, 'receivedAt' | 'updatedAt'>) {
    if (this.records.find((r) => r.id === record.id)) {
      throw new Error('Record with this id already exists');
    }
    const entry: StoredRecord = { ...record, receivedAt: Date.now() };
    this.records.push(entry);
    writeFile(this.records);
    return entry;
  }

  list() {
    return this.records;
  }

  get(id: string) {
    return this.records.find((r) => r.id === id) || null;
  }

  update(id: string, update: Partial<Omit<StoredRecord, 'id' | 'receivedAt'>>) {
    const record = this.records.find((r) => r.id === id);
    if (!record) return null;
    Object.assign(record, update, { updatedAt: Date.now() });
    writeFile(this.records);
    return record;
  }

  remove(id: string) {
    const idx = this.records.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const [deleted] = this.records.splice(idx, 1);
    writeFile(this.records);
    return deleted;
  }

  clear() {
    this.records = [];
    writeFile(this.records);
  }
}

export const store = new DataStore();
