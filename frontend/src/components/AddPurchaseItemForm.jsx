import { useEffect, useState } from "react";

export default function AddPurchaseItemForm({ onClose, onSuccess }) {
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

  // ✅ Fetch products and purchase orders for dropdowns
  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/purchase-orders/"),
          fetch("http://127.0.0.1:8000/api/products/"),
        ]);
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }
    fetchData();
  }, []);

  // ✅ Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit new purchase item
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

      const response = await fetch("http://127.0.0.1:8000/api/purchase-items/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) throw new Error("Failed to add purchase item");

      onSuccess(); // Refresh table
      onClose();   // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add Purchase Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="quantity"
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="cost_price"
            onChange={handleChange}
            placeholder="Cost Price"
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
            required
          />

          {/* Purchase Order Dropdown */}
          <select
            name="purchase_order"
            onChange={handleChange}
            value={formData.purchase_order}
            className="w-full border p-2 rounded bg-white"
            required
          >
            <option value="">Select Purchase Order</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {`Order #${order.id} - ${order.status}`}
              </option>
            ))}
          </select>

          {/* Product Dropdown */}
          <select
            name="product"
            onChange={handleChange}
            value={formData.product}
            className="w-full border p-2 rounded bg-white"
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

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

