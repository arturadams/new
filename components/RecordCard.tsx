import { useState } from "react";

interface RecordCardProps {
  record: { id: string; type: string; payload: any };
  onCopy: (payload: any) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, payload: any) => void;
}

export default function RecordCard({
  record,
  onCopy,
  onDelete,
  onUpdate,
}: RecordCardProps) {
  const initial =
    typeof record.payload === "string"
      ? record.payload
      : JSON.stringify(record.payload, null, 2);
  const [value, setValue] = useState(initial);

  const handleSave = () => {
    onUpdate(record.id, value);
  };

  return (
    <div className="border rounded shadow-sm p-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">{record.id}</h2>
        <div className="space-x-3 text-sm">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onCopy(record.payload)}
          >
            Copy
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={() => onDelete(record.id)}
          >
            Delete
          </button>
        </div>
      </div>
      <textarea
        className="border rounded w-full p-2 text-sm font-mono"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
      />
      {value !== initial && (
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
          onClick={handleSave}
        >
          Save
        </button>
      )}
    </div>
  );
}
