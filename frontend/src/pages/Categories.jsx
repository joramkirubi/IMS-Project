import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddCategoryForm from "../components/AddCategoryForm";

export default function Categories() {
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/categories/");

  const refreshPage = () => window.location.reload();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <DataTable title="Categories" data={data} loading={loading} error={error} />

      {showForm && (
        <AddCategoryForm
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
        />
      )}
    </div>
  );
}

