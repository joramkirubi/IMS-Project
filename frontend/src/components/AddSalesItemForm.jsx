import { useEffect, useState } from "react";

export default function AddSalesItemForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ quantity: "", selling_price: "", sales_order: "", product: "" });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sales-orders/").then(r=>r.json()).then(setOrders).catch(()=>{});
    fetch("http://127.0.0.1:8000/api/products/").then(r=>r.json()).then(setProducts).catch(()=>{});
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/sales-items/", {
        method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSuccess(); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Add Sales Item</h3>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <input name="quantity" onChange={handleChange} placeholder="Quantity" type="number" className="w-full border p-2 rounded" required />
          <input name="selling_price" onChange={handleChange} placeholder="Selling price" type="number" step="0.01" className="w-full border p-2 rounded" />
          <select name="sales_order" onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select order</option>
            {orders.map(o => <option key={o.id} value={o.id}>{o.id} - {o.status}</option>)}
          </select>
          <select name="product" onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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

