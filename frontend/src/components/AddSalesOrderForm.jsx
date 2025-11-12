import { useEffect, useState } from "react";

export default function AddSalesOrderForm({ onClose, onSuccess, editData }) {
  const [formData, setFormData] = useState({ total_amount: "", status: "", customer: "", processed_by: "" });
  const [customers, setCustomers] = useState([]);
  const [auditEntries, setAuditEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/customers/").then(r=>r.json()).then(setCustomers).catch(()=>{});
    fetch("http://127.0.0.1:8000/api/audit-logs/").then(r=>r.json()).then(setAuditEntries).catch(()=>{});

    // ✅ Pre-fill form if editData is present
    if (editData) setFormData(editData);
  }, [editData]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const method = editData ? "PUT" : "POST";
      const url = editData
        ? `http://127.0.0.1:8000/api/sales-orders/${editData.id}/`
        : "http://127.0.0.1:8000/api/sales-orders/";

      const res = await fetch(url, {
        method,
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSuccess(); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">{editData ? "Edit" : "Add"} Sales Order</h3>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input name="total_amount" onChange={handleChange} value={formData.total_amount} placeholder="Total amount" type="number" step="0.01" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          <select name="status" onChange={handleChange} value={formData.status} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select name="customer" onChange={handleChange} value={formData.customer} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="processed_by" onChange={handleChange} value={formData.processed_by} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option value="">Processed by (optional)</option>
            {auditEntries.map(a => a.user && <option key={a.id} value={a.user}>{a.user}</option>)}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
