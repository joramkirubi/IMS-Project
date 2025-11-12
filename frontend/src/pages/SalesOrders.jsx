import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddSalesOrderForm from "../components/AddSalesOrderForm";

export default function SalesOrders() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null); // <-- For editing
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/sales-orders/");
  const refresh = () => window.location.reload();

  // ✅ Handle Edit
  const handleEdit = (row) => {
    setEditData(row);
    setShowForm(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Sales Order?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/sales-orders/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Orders</h1>
        <button
          onClick={() => { setEditData(null); setShowForm(true); }}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          + Add Sales Order
        </button>
      </div>

      <DataTable
        title="Sales Orders"
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}   // Pass Edit
        onDelete={handleDelete} // Pass Delete
      />

      {showForm && (
        <AddSalesOrderForm
          onClose={() => setShowForm(false)}
          onSuccess={refresh}
          editData={editData} // <-- pass data to form if editing
        />
      )}
    </div>
  );
}
