import useFetchData from "../hooks/useFetchData";
import DashboardCard from "../components/DashboardCard";
import SalesChart from "../components/SalesChart";
import logo from "../assets/shepherd_logo.png";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function Dashboard() {
  // Fetch data
  const { data: products = [], loading: loadingProducts, error: errorProducts } = useFetchData(`${BASE_URL}/products/`);
  const { data: suppliers = [] } = useFetchData(`${BASE_URL}/suppliers/`);
  const { data: customers = [] } = useFetchData(`${BASE_URL}/customers/`);
  const { data: auditLogs = [] } = useFetchData(`${BASE_URL}/audit-logs/`);

  if (loadingProducts) return <p className="text-gray-500">Loading dashboard...</p>;
  if (errorProducts) return <p className="text-red-500">Error: {errorProducts}</p>;

  // Derived stats
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const totalCustomers = customers.length;
  const totalStockValue = products.reduce((acc, item) => acc + item.quantity * parseFloat(item.cost_price), 0);
  const lowStock = products.filter((p) => p.quantity <= p.reorder_level);
  const recentActivities = auditLogs.slice(0, 5); // show last 5

  return (
    <div className="space-y-8">
    {/* Dashboard Header */}
<div className="flex items-center gap-5">
  <img src={logo} alt="Shepherd Logo" className="w-28 h-28 object-contain" />
  <div>
    <h1 className="text-4xl font-bold text-gray-800">Dashboard Overview</h1>
    <p className="text-lg text-gray-500">Quick summary of your inventory system</p>
  </div>
</div>



      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Products" value={totalProducts} />
        <DashboardCard title="Total Suppliers" value={totalSuppliers} />
        <DashboardCard title="Total Customers" value={totalCustomers} />
        <DashboardCard title="Stock Value" value={`KSh ${totalStockValue.toLocaleString()}`} />
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-gray-700">Sales Overview</h2>
        <SalesChart />
      </div>

      {/* Low Stock & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-700">Low Stock Alerts</h2>
          {lowStock.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {lowStock.map((item) => (
                <li key={item.id} className="py-3 flex justify-between text-sm text-gray-700">
                  <span>{item.name}</span>
                  <span className="text-red-500 font-medium">{item.quantity} left</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">All stock levels are healthy.</p>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-700">Recent Activities</h2>
          {recentActivities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((log) => (
                <li key={log.id} className="py-3 text-sm text-gray-700">
                  <span className="block font-medium">{log.action}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleString()} — {log.user || "System"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
