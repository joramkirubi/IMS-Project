import { Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products";
import "./index.css";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">IMS Home</h1>
      <p className="mt-2">Quick links:</p>
      <div className="mt-4 space-x-2">
        <Link to="/products" className="px-3 py-2 bg-blue-600 text-white rounded">
          Products
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <h2 className="text-lg font-semibold">Shepherd IMS (Dev)</h2>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </div>
  );
}

