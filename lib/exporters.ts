import { StoredRecord } from './dataStore';

export function toPlainText(record: StoredRecord): string {
  if (typeof record.payload === 'string') return record.payload;
  if (record.payload && typeof record.payload.body === 'string') return record.payload.body;
  return JSON.stringify(record.payload, null, 2);
}

export function toMarkdown(record: StoredRecord): string {
  if (record.type === 'list' && Array.isArray(record.payload?.items)) {
    return record.payload.items.map((i: string) => `- ${i}`).join('\n');
  }
  return toPlainText(record);
}
