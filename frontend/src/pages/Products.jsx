import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddProductForm from "../components/AddProductForm";
import api from "../api/axios"; // your axios instance

export default function Products() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products
  const { data, loading, error } = useFetchData(
    "http://127.0.0.1:8000/api/products/"
  );

  // Refresh page after CRUD
  const refreshPage = () => window.location.reload();

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`products/${id}/`); // Make sure trailing slash is present
      alert("Product deleted successfully");
      refreshPage();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  // ✅ Edit product
  const handleEdit = (product) => {
    setEditingProduct(product); // send to form
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null); // Clear form for new product
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* ✅ Pass the functions to DataTable */}
      <DataTable
        title="Products"
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form for Add/Edit */}
      {showForm && (
        <AddProductForm
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
          editingProduct={editingProduct} // send product to form
        />
      )}
    </div>
  );
}
