import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddSalesOrderForm from "../components/AddSalesOrderForm";

export default function SalesOrders() {
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/sales-orders/");
  const refresh = () => window.location.reload();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Orders</h1>
        <button onClick={() => setShowForm(true)} className="px-3 py-2 bg-blue-600 text-white rounded">+ Add Sales Order</button>
      </div>

      <DataTable title="Sales Orders" data={data} loading={loading} error={error} />

      {showForm && <AddSalesOrderForm onClose={() => setShowForm(false)} onSuccess={refresh} />}
    </div>
  );
}

