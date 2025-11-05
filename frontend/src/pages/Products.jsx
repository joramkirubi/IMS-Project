import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        // Handles both raw arrays and paginated API responses
        setProducts(data.results || data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-400">Loading...</p>
    );

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="bg-gray-800 p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-400">{product.description}</p>
              <p className="text-green-400 mt-2">
                Price: ${product.price}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

