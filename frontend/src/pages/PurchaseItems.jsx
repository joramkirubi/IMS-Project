import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddPurchaseItemForm from "../components/AddPurchaseItemForm";

export default function PurchaseItems() {
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/purchase-items/");

  const refreshPage = () => window.location.reload();

  // ✅ Format displayed data properly
  const formattedData = data.map((item) => ({
    id: item.id,
    purchase_order: item.purchase_order_display || `PO-${item.purchase_order}` || "N/A",
    product: item.product_name || item.product || "N/A",
    quantity: item.quantity,
    cost_price: item.cost_price,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchase Items</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Purchase Item
        </button>
      </div>

      <DataTable
        title="Purchase Items"
        data={formattedData}
        loading={loading}
        error={error}
      />

      {showForm && (
        <AddPurchaseItemForm
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
        />
      )}
    </div>
  );
}
