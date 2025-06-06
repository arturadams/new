export type StoredRecord = {
  id: string;
  type: string;
  payload: any;
  receivedAt: number;
};

class DataStore {
  private records: StoredRecord[] = [];

  add(record: Omit<StoredRecord, 'receivedAt'>) {
    const entry: StoredRecord = { ...record, receivedAt: Date.now() };
    this.records.push(entry);
    return entry;
  }

  list() {
    return this.records;
  }
}

export const store = new DataStore();
