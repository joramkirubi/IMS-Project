import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Layers,
  Users,
  Package,
  ShoppingCart,
  FileText,
  ArrowLeftRight,
  Building2,
} from "lucide-react";
import logo from "../assets/p_logo.jpg";


export default function Sidebar() {
  const { pathname } = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Audit Logs", icon: History, path: "/audit-logs" },
    { name: "Categories", icon: Layers, path: "/categories" },
    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Purchase Items", icon: ShoppingCart, path: "/purchase-items" },
    { name: "Purchase Orders", icon: FileText, path: "/purchase-orders" },
    { name: "Sales Items", icon: ShoppingCart, path: "/sales-items" },
    { name: "Sales Orders", icon: FileText, path: "/sales-orders" },
    { name: "Stock Movements", icon: ArrowLeftRight, path: "/stock-movements" },
    { name: "Suppliers", icon: Building2, path: "/suppliers" },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-900 text-gray-100 flex flex-col shadow-lg">

      <div className="p-6 border-b border-gray-800 flex items-center gap-5">
  <img
    src={logo}
    alt="Shepherd Logo"
    className="w-20 h-20 rounded-full object-contain bg-white p-2 shadow-md"
  />
  <div className="leading-snug">
    <h1 className="text-1xl font-bold text-white">Shepherd IMS</h1>
    <p className="text-base text-gray-300">Inventory System</p>
  </div>
</div>






      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "hover:bg-gray-800 text-gray-300 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="p-4 border-t border-gray-800 text-sm text-gray-500 text-center">
        © 2025 Shepherd IMS
      </footer>
    </aside>
  );
}
