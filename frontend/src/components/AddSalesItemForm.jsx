import { useEffect, useState } from "react";

export default function AddSalesItemForm({ onClose, onSuccess, editData }) {
  const [formData, setFormData] = useState({ quantity: "", selling_price: "", sales_order: "", product: "" });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch orders and products for dropdowns
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sales-orders/")
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {});
    fetch("http://127.0.0.1:8000/api/products/")
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {});

    // ✅ Pre-fill form if editing
    if (editData) {
      setFormData({
        quantity: editData.quantity,
        selling_price: editData.selling_price,
        sales_order: editData.sales_order,
        product: editData.product,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = editData ? "PUT" : "POST";
      const url = editData
        ? `http://127.0.0.1:8000/api/sales-items/${editData.id}/`
        : "http://127.0.0.1:8000/api/sales-items/";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: parseInt(formData.quantity),
          selling_price: parseFloat(formData.selling_price),
          sales_order: parseInt(formData.sales_order),
          product: parseInt(formData.product),
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editData ? "Edit" : "Add"} Sales Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="quantity"
            onChange={handleChange}
            value={formData.quantity}
            placeholder="Quantity"
            type="number"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            name="selling_price"
            onChange={handleChange}
            value={formData.selling_price}
            placeholder="Selling Price"
            type="number"
            step="0.01"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <select
            name="sales_order"
            onChange={handleChange}
            value={formData.sales_order}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select Sales Order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.status}
              </option>
            ))}
          </select>

          <select
            name="product"
            onChange={handleChange}
            value={formData.product}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
