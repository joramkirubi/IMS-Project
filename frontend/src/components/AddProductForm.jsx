import { useEffect, useState } from "react";

export default function AddProductForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    quantity: "",
    reorder_level: "",
    cost_price: "",
    selling_price: "",
    category: "", // Foreign key
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch categories for the dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add product");

      onSuccess(); // Refresh
      onClose(); // Close modal
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
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Text Fields */}
          <input name="name" onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
          <input name="sku" onChange={handleChange} placeholder="SKU" className="w-full border p-2 rounded" required />
          <input name="description" onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
          <input name="quantity" onChange={handleChange} placeholder="Quantity" type="number" className="w-full border p-2 rounded" />
          <input name="reorder_level" onChange={handleChange} placeholder="Reorder Level" type="number" className="w-full border p-2 rounded" />
          <input name="cost_price" onChange={handleChange} placeholder="Cost Price" type="number" step="0.01" className="w-full border p-2 rounded" />
          <input name="selling_price" onChange={handleChange} placeholder="Selling Price" type="number" step="0.01" className="w-full border p-2 rounded" />

          {/* Category Dropdown */}
          <select
            name="category"
            onChange={handleChange}
            value={formData.category}
            className="w-full border p-2 rounded bg-white"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Buttons */}
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
