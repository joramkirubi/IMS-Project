import { useEffect, useState } from "react";

export default function AddStockMovementForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ movement_type: "", quantity: "", reference: "", product: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/").then(r=>r.json()).then(setProducts).catch(()=>{});
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/stock-movements/", {
        method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSuccess(); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Add Stock Movement</h3>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <select name="movement_type" onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select movement</option>
            <option value="stock_in">Stock In</option>
            <option value="stock_out">Stock Out</option>
          </select>
          <input name="quantity" onChange={handleChange} placeholder="Quantity" type="number" className="w-full border p-2 rounded" required />
          <input name="reference" onChange={handleChange} placeholder="Reference" className="w-full border p-2 rounded" />
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

