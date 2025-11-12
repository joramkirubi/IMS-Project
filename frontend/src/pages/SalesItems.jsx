import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddSalesItemForm from "../components/AddSalesItemForm";

export default function SalesItems() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null); // <-- For editing
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/sales-items/");

  const refreshPage = () => window.location.reload();

  // ✅ Handle Edit
  const handleEdit = (row) => {
    setEditData(row);
    setShowForm(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Sales Item?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/sales-items/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      refreshPage();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Items</h1>
        <button
          onClick={() => { setEditData(null); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Sales Item
        </button>
      </div>

      <DataTable
        title="Sales Items"
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}   // Pass Edit
        onDelete={handleDelete} // Pass Delete
      />

      {showForm && (
        <AddSalesItemForm
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
          editData={editData} // Pass edit data to form
        />
      )}
    </div>
  );
}
