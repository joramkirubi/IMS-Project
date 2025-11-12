import { useEffect, useState } from "react";
import api from "../api/axios"; // use your Axios instance

export default function AddProductForm({ onClose, onSuccess, editingProduct }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    quantity: "",
    reorder_level: "",
    cost_price: "",
    selling_price: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        sku: editingProduct.sku || "",
        description: editingProduct.description || "",
        quantity: editingProduct.quantity || "",
        reorder_level: editingProduct.reorder_level || "",
        cost_price: editingProduct.cost_price || "",
        selling_price: editingProduct.selling_price || "",
        category: editingProduct.category || "",
      });
    }
  }, [editingProduct]);

  // ✅ Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert category to integer and other numeric fields
      const submitData = {
        ...formData,
        category: parseInt(formData.category, 10),
        quantity: parseInt(formData.quantity, 10) || 0,
        reorder_level: parseInt(formData.reorder_level, 10) || 0,
        cost_price: parseFloat(formData.cost_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
      };

      if (editingProduct) {
        // ✅ Update existing product
        await api.patch(`products/${editingProduct.id}/`, submitData);
        alert("Product updated successfully!");
      } else {
        // ✅ Add new product
        await api.post("products/", submitData);
        alert("Product added successfully!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      // Display detailed error message from backend if available
      if (err.response?.data) {
        const errorMsg = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join("; ");
        setError(errorMsg || "Failed to save product");
      } else {
        setError(err.message || "Failed to save product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="reorder_level"
            value={formData.reorder_level}
            onChange={handleChange}
            placeholder="Reorder Level"
            type="number"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="cost_price"
            value={formData.cost_price}
            onChange={handleChange}
            placeholder="Cost Price"
            type="number"
            step="0.01"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            placeholder="Selling Price"
            type="number"
            step="0.01"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
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
              {loading
                ? "Saving..."
                : editingProduct
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
