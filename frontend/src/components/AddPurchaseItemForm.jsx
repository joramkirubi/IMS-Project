import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AddPurchaseItemForm({ item, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    quantity: "",
    cost_price: "",
    purchase_order: "",
    product: "",
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/purchase-orders/"),
          fetch("http://127.0.0.1:8000/api/products/"),
        ]);
        setOrders(await ordersRes.json());
        setProducts(await productsRes.json());
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        quantity: item.quantity,
        cost_price: item.cost_price,
        purchase_order: item.purchase_order, // keep numeric ID for PUT
        product: item.product,               // numeric ID
      });
    }
  }, [item]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cleanData = {
        quantity: parseInt(formData.quantity),
        cost_price: parseFloat(formData.cost_price),
        purchase_order: parseInt(formData.purchase_order),
        product: parseInt(formData.product),
      };
      if (item) {
        await api.put(`purchase-items/${item.id}/`, cleanData); // Edit
      } else {
        await api.post("purchase-items/", cleanData);           // Add
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{item ? "Edit" : "Add"} Purchase Item</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          <input name="cost_price" value={formData.cost_price} onChange={handleChange} placeholder="Cost Price" type="number" step="0.01" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          
          <select name="purchase_order" value={formData.purchase_order} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select Purchase Order</option>
            {orders.map((o) => <option key={o.id} value={o.id}>{`Order #${o.id} - ${o.status}`}</option>)}
          </select>

          <select name="product" value={formData.product} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
            <option value="">Select Product</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
