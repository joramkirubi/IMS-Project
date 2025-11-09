import React from "react";

export default function DataTable({ title, data, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-md text-center">
        ⚠️ {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md text-center">
        No {title} found.
      </div>
    );
  }

  // ✅ Filter out helper fields (_name/_display) from headers
  const headers = Object.keys(data[0]).filter(
    (key) => !key.endsWith("_name") && !key.endsWith("_display")
  );

  // ✅ Function to get best display value for each cell
  const getDisplayValue = (row, header) => {
    return (
      row[`${header}_name`] ||
      row[`${header}_display`] ||
      row[header] ||
      "N/A"
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-4 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-600 capitalize"
              >
                {header.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={
                idx % 2 === 0
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-white hover:bg-gray-100"
              }
            >
              {headers.map((header) => (
                <td key={header} className="border px-4 py-2 text-sm">
                  {getDisplayValue(row, header).toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

