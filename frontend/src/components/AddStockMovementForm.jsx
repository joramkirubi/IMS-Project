import { useEffect, useState } from "react";

export default function AddStockMovementForm({ onClose, onSuccess, editingMovement }) {
  const [formData, setFormData] = useState({ movement_type: "", quantity: "", reference: "", product: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/").then(r=>r.json()).then(setProducts).catch(()=>{});

    // ✅ Pre-fill form if editing
    if (editingMovement) {
      setFormData({
        movement_type: editingMovement.movement_type,
        quantity: editingMovement.quantity,
        reference: editingMovement.reference,
        product: editingMovement.product,
      });
    }
  }, [editingMovement]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const method = editingMovement ? "PUT" : "POST";
      const url = editingMovement
        ? `http://127.0.0.1:8000/api/stock-movements/${editingMovement.id}/`
        : "http://127.0.0.1:8000/api/stock-movements/";
      
      const res = await fetch(url, {
        method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSuccess(); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingMovement ? "Edit" : "Add"} Stock Movement</h3>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <select name="movement_type" value={formData.movement_type} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select movement</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
          </select>
          <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          <input name="reference" value={formData.reference} onChange={handleChange} placeholder="Reference" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <select name="product" value={formData.product} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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

