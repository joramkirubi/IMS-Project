import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useFetchData from "../hooks/useFetchData";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function SalesChart() {
  const { data: salesOrders = [], loading, error } = useFetchData(`${BASE_URL}/sales-orders/`);

  if (loading) return <p className="text-gray-500">Loading chart...</p>;
  if (error) return <p className="text-red-500">Error loading chart: {error}</p>;

  // Aggregate sales by day safely
const salesByDay = {};

salesOrders.forEach((order) => {
  if (!order.order_date) return;

  // Remove comma to make Date parsing more reliable
  const orderDate = new Date(order.order_date.replace(/,/g, ""));
  if (isNaN(orderDate.getTime())) return;

  const day = orderDate.toLocaleDateString("en-US", { weekday: "short" });
  const total = Number(order.total_amount) || 0;

  if (!salesByDay[day]) salesByDay[day] = 0;
  salesByDay[day] += total;
});

// Ensure all weekdays are shown
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const chartData = WEEKDAYS.map((day) => ({
  name: day,
  sales: salesByDay[day] || 0,
}));


  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}
