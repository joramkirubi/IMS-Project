import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddSupplierForm from "../components/AddSupplierForm";
import api from "../api/axios";

export default function Suppliers() {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const { data, loading, error } = useFetchData("suppliers/");

  const refreshPage = () => window.location.reload();

  const handleDelete = async (id) => {
    if (!confirm("Delete this supplier?")) return;
    try {
      await api.delete(`suppliers/${id}/`);
      alert("Deleted!");
      refreshPage();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Supplier
        </button>
      </div>

      <DataTable
        title="Suppliers"
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <AddSupplierForm
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
          editingSupplier={editingSupplier}
        />
      )}
    </div>
  );
}
