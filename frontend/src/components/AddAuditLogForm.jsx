import { useEffect, useState } from "react";

export default function AddAuditLogForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ action: "", description: "", user: "" });
  const [auditEntries, setAuditEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // try fetch audit-users from audit logs to pick a user id if available
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/audit-logs/").then(r=>r.json()).then(setAuditEntries).catch(()=>{});
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/audit-logs/", {
        method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSuccess(); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Add Audit Log</h3>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <input name="action" onChange={handleChange} placeholder="Action" className="w-full border p-2 rounded" required />
          <input name="description" onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
          <select name="user" onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select user (optional)</option>
            {auditEntries.map(a => a.user && <option key={a.id} value={a.user}>{a.user}</option>)}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

