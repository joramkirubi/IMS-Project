import { useState } from "react";

export default function AddSupplierForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/suppliers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSuccess(); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Add Supplier</h3>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <input name="name" onChange={handleChange} required placeholder="Name" className="w-full border p-2 rounded" />
          <input name="contact_person" onChange={handleChange} placeholder="Contact Person" className="w-full border p-2 rounded" />
          <input name="phone" onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
          <input name="email" onChange={handleChange} placeholder="Email" type="email" className="w-full border p-2 rounded" />
          <input name="address" onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

