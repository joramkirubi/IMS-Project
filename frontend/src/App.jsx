import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider } from "./context/AuthProvider";
import AuthContext from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";

// Import pages
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
import Login from "./pages/Login";

function AppContent() {
  const { pathname } = useLocation();
  const { isAuthenticated, loading } = useContext(AuthContext);
  const isLoginPage = pathname === "/login";

  // Auto-redirect logged-in users away from login page
  if (isLoginPage && isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Only show sidebar for authenticated users */}
      <PrivateRoute>
        <Sidebar />
      </PrivateRoute>

      {/* Main content */}
      <main className={`flex-1 p-8 text-gray-900 ${!isLoginPage ? "ml-64" : ""}`}>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <PrivateRoute>
                <AuditLogs />
              </PrivateRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />

          <Route
            path="/purchase-items"
            element={
              <PrivateRoute>
                <PurchaseItems />
              </PrivateRoute>
            }
          />

          <Route
            path="/purchase-orders"
            element={
              <PrivateRoute>
                <PurchaseOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/sales-items"
            element={
              <PrivateRoute>
                <SalesItems />
              </PrivateRoute>
            }
          />

          <Route
            path="/sales-orders"
            element={
              <PrivateRoute>
                <SalesOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/stock-movements"
            element={
              <PrivateRoute>
                <StockMovements />
              </PrivateRoute>
            }
          />

          <Route
            path="/suppliers"
            element={
              <PrivateRoute>
                <Suppliers />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      
        <AppContent />
      
    </AuthProvider>
  );
}
