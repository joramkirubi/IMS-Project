import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddPurchaseOrderForm from "../components/AddPurchaseOrderForm";
import api from "../api/axios"; // axios instance

export default function PurchaseOrders() {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); // For edit
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/purchase-orders/");
  
  const refresh = () => window.location.reload();

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this purchase order?")) return;
    try {
      await api.delete(`purchase-orders/${id}/`);
      refresh();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <button onClick={() => { setEditingOrder(null); setShowForm(true); }} 
          className="px-3 py-2 bg-blue-600 text-white rounded">
          + Add Purchase Order
        </button>
      </div>

      <DataTable 
        title="Purchase Orders" 
        data={data} 
        loading={loading} 
        error={error} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {showForm && (
        <AddPurchaseOrderForm 
          order={editingOrder} 
          onClose={() => setShowForm(false)} 
          onSuccess={refresh} 
        />
      )}
    </div>
  );
}
