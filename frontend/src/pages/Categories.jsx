import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddCategoryForm from "../components/AddCategoryForm";
import api from "../api/axios";

export default function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data, loading, error } = useFetchData("categories/");

  const refreshPage = () => window.location.reload();

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`categories/${id}/`);
      alert("Deleted!");
      refreshPage();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <DataTable
        title="Categories"
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <AddCategoryForm
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
          editingCategory={editingCategory}
        />
      )}
    </div>
  );
}
