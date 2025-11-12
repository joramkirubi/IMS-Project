import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import DataTable from "../components/DataTable";
import AddAuditLogForm from "../components/AddAuditLogForm";

export default function AuditLogs() {
  const [showForm, setShowForm] = useState(false);
  // Poll audit logs every 5 seconds so frontend updates elsewhere show up quickly
  const { data, loading, error } = useFetchData("http://127.0.0.1:8000/api/audit-logs/", { pollInterval: 5000 });
  const refresh = () => window.location.reload();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <button onClick={() => setShowForm(true)} className="px-3 py-2 bg-blue-600 text-white rounded">+ Add Audit Log</button>
      </div>

      <DataTable title="Audit Logs" data={data} loading={loading} error={error} />

      {showForm && <AddAuditLogForm onClose={() => setShowForm(false)} onSuccess={refresh} />}
    </div>
  );
}

