import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddSalesItemForm from "../components/AddSalesItemForm";

export default function SalesItems() {
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/sales-items/");

  const refreshPage = () => window.location.reload();

  // ✅ Format displayed data properly
  const formattedData = data.map((item) => ({
    id: item.id,
    sales_order: item.sales_order_display || `SO-${item.sales_order}` || "N/A",
    product: item.product_name || item.product || "N/A",
    quantity: item.quantity,
    selling_price: item.selling_price,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Items</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Sales Item
        </button>
      </div>

      <DataTable
        title="Sales Items"
        data={formattedData}
        loading={loading}
        error={error}
      />

      {showForm && (
        <AddSalesItemForm
          onClose={() => setShowForm(false)}
          onSuccess={refreshPage}
        />
      )}
    </div>
  );
}

