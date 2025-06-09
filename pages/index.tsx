import { useEffect, useState } from "react";
import RecordCard from "../components/RecordCard";

interface RecordInput {
  id: string;
  type: string;
  payload: string;
}

const Home = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<RecordInput>({
    id: "",
    type: "text",
    payload: "",
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/library");
      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to fetch records", res.status, text);
        setRecords([]);
      } else {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Error fetching records", err);
      setRecords([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const addRecord = async () => {
    await fetch("/api/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, payload: form.payload }),
    });
    setForm({ id: "", type: "text", payload: "" });
    fetchRecords();
  };

  const deleteRecord = async (id: string) => {
    await fetch(`/api/library/${id}`, { method: "DELETE" });
    fetchRecords();
  };

  const clearAll = async () => {
    await fetch("/api/library", { method: "DELETE" });
    fetchRecords();
  };

  const copyRecord = (payload: any) => {
    navigator.clipboard.writeText(
      typeof payload === "string" ? payload : JSON.stringify(payload),
    );
  };

  const updateRecord = async (id: string, payload: any) => {
    await fetch(`/api/library/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload }),
    });
    fetchRecords();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Outcomes</h1>
      <div className="mb-6 bg-white p-4 rounded shadow flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
        <input
          className="border p-2 flex-grow rounded"
          placeholder="id"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="text">text</option>
          <option value="list">list</option>
        </select>
        <input
          className="border p-2 flex-grow rounded"
          placeholder="payload"
          value={form.payload}
          onChange={(e) => setForm({ ...form, payload: e.target.value })}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded"
          onClick={addRecord}
        >
          Add
        </button>
      </div>
      <button
        className="text-sm text-red-600 underline mb-4"
        onClick={clearAll}
      >
        Clear All
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {records.map((r) => (
            <RecordCard
              key={r.id}
              record={r}
              onCopy={copyRecord}
              onDelete={deleteRecord}
              onUpdate={updateRecord}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
