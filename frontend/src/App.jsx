import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// Import your pages
import Dashboard from "./pages/Dashboard";
import AuditLogs from "./pages/AuditLogs";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import PurchaseItems from "./pages/PurchaseItems";
import PurchaseOrders from "./pages/PurchaseOrders";
import SalesItems from "./pages/SalesItems";
import SalesOrders from "./pages/SalesOrders";
import StockMovements from "./pages/StockMovements";
import Suppliers from "./pages/Suppliers";

export default function App() {
  return (
    
      <div className="min-h-screen bg-gray-100">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 ml-64 p-8 text-gray-900">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/purchase-items" element={<PurchaseItems />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/sales-items" element={<SalesItems />} />
            <Route path="/sales-orders" element={<SalesOrders />} />
            <Route path="/stock-movements" element={<StockMovements />} />
            <Route path="/suppliers" element={<Suppliers />} />
          </Routes>
        </main>
      </div>
    
  );
}
