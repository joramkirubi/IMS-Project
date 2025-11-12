import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddPurchaseItemForm from "../components/AddPurchaseItemForm";
import api from "../api/axios";

export default function PurchaseItems() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/purchase-items/");

  const refreshPage = () => window.location.reload();

  const formattedData = data.map((item) => ({
    id: item.id,
    purchase_order: item.purchase_order_display || `PO-${item.purchase_order}` || "N/A",
    product: item.product_name || item.product || "N/A",
    quantity: item.quantity,
    cost_price: item.cost_price,
  }));

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this purchase item?")) return;
    try {
      await api.delete(`purchase-items/${id}/`);
      refreshPage();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchase Items</h1>
        <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Add Purchase Item
        </button>
      </div>

      <DataTable
        title="Purchase Items"
        data={formattedData}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <AddPurchaseItemForm
          item={editingItem}
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
        />
      )}
    </div>
  );
}
