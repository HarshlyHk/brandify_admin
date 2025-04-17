import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "../../features/analyticsSlice";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Skeleton className="w-2/3 h-80 mb-4" />
        <Skeleton className="w-2/3 h-80" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Error: {error}
      </div>
    );

  const barData = [
    { name: "Users", value: analytics?.totalUsers || 0 },
    { name: "Products", value: analytics?.totalProducts || 0 },
    { name: "Orders", value: analytics?.totalOrders || 0 },
    { name: "Revenue", value: analytics?.totalRevenue || 0 },
    { name: "Wishlist", value: analytics?.totalWishlistItems || 0 },
    { name: "Abandoned Carts", value: analytics?.totalAbandonedCarts || 0 },
  ];

  const pieData = [
    { name: "Pending Orders", value: analytics?.totalPendingOrders || 0 },
    { name: "Complaints", value: analytics?.totalComplaints || 0 },
    { name: "Reviews", value: analytics?.totalReviews || 0 },
    { name: "Coupons", value: analytics?.totalCoupons || 0 },
  ];

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl font-bold mb-6 uppercase">Dashboard</h1>
      <div>
        <Link
          to="/traffic"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          View Traffic
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#4BC0C0"
                barSize={50}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Insights</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
