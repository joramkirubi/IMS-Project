import { useEffect, useState } from "react";

export default function AddPurchaseOrderForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ status: "", total_amount: "", supplier: "" });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/suppliers/")
      .then(r => r.json())
      .then(setSuppliers)
      .catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/purchase-orders/", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSuccess(); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Add Purchase Order</h3>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <select name="status" onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select status</option>
            <option value="draft">Draft</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
          </select>
          <input name="total_amount" onChange={handleChange} placeholder="Total amount" type="number" step="0.01" className="w-full border p-2 rounded" />
          <select name="supplier" onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select supplier</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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

