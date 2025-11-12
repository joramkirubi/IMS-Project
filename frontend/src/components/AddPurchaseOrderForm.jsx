import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AddPurchaseOrderForm({ order, onClose, onSuccess }) {
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

  useEffect(() => {
    if (order) setFormData(order); // Populate form for edit
  }, [order]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(null);
    try {
      if (order) {
        await api.put(`purchase-orders/${order.id}/`, formData); // Edit
      } else {
        await api.post("purchase-orders/", formData); // Add
      }
      onSuccess(); 
      onClose();
    } catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  return (
  <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">{order ? "Edit" : "Add"} Purchase Order</h3>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <select name="status" onChange={handleChange} value={formData.status} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select status</option>
            <option value="draft">Draft</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
          </select>
          <input name="total_amount" onChange={handleChange} value={formData.total_amount || ""} placeholder="Total amount" type="number" step="0.01" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <select name="supplier" onChange={handleChange} value={formData.supplier || ""} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select supplier</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
