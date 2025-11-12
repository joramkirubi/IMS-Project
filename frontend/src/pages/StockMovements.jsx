import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddStockMovementForm from "../components/AddStockMovementForm";

export default function StockMovements() {
  const [showForm, setShowForm] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/stock-movements/");
  const refresh = () => window.location.reload();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stock movement?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/stock-movements/${id}/`, { method: "DELETE" });
      refresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (movement) => {
    setEditingMovement(movement);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Stock Movements</h1>
        <button onClick={() => { setEditingMovement(null); setShowForm(true); }} className="px-3 py-2 bg-blue-600 text-white rounded">+ Add Stock Movement</button>
      </div>

      <DataTable title="Stock Movements" data={data} loading={loading} error={error} onEdit={handleEdit} onDelete={handleDelete} />

      {showForm && <AddStockMovementForm onClose={() => setShowForm(false)} onSuccess={refresh} editingMovement={editingMovement} />}
    </div>
  );
}

