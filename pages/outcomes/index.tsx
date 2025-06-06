import { useEffect, useState } from 'react';

interface RecordInput {
  id: string;
  type: string;
  payload: string;
}

const OutcomesPage = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [form, setForm] = useState<RecordInput>({ id: '', type: 'text', payload: '' });

  const fetchRecords = async () => {
    const res = await fetch('/api/library');
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => { fetchRecords(); }, []);

  const addRecord = async () => {
    await fetch('/api/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, payload: form.payload })
    });
    setForm({ id: '', type: 'text', payload: '' });
    fetchRecords();
  };

  const deleteRecord = async (id: string) => {
    await fetch(`/api/library/${id}`, { method: 'DELETE' });
    fetchRecords();
  };

  const clearAll = async () => {
    await fetch('/api/library', { method: 'DELETE' });
    fetchRecords();
  };

  const copyRecord = (payload: any) => {
    navigator.clipboard.writeText(typeof payload === 'string' ? payload : JSON.stringify(payload));
  };

  const updateRecord = async (id: string, payload: any) => {
    await fetch(`/api/library/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload })
    });
    fetchRecords();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Outcomes</h1>
      <div className="mb-4 flex space-x-2">
        <input className="border p-2 flex-grow" placeholder="id" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
        <select className="border p-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="text">text</option>
          <option value="list">list</option>
        </select>
        <input className="border p-2 flex-grow" placeholder="payload" value={form.payload} onChange={e => setForm({ ...form, payload: e.target.value })} />
        <button className="bg-blue-500 text-white px-3" onClick={addRecord}>Add</button>
      </div>
      <button className="text-sm text-red-600 underline" onClick={clearAll}>Clear All</button>
      <ul className="mt-4 space-y-2">
        {records.map(r => (
          <li key={r.id} className="border p-2 flex justify-between items-center">
            <div className="flex-1 mr-2">
              <div className="font-semibold">{r.id}</div>
              <textarea
                className="border w-full mt-1 p-1"
                value={typeof r.payload === 'string' ? r.payload : JSON.stringify(r.payload)}
                onChange={e => updateRecord(r.id, e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <button className="text-blue-500" onClick={() => copyRecord(r.payload)}>Copy</button>
              <button className="text-red-500" onClick={() => deleteRecord(r.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OutcomesPage;
