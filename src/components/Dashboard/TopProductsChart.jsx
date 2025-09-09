import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TopProductsChart = ({ analytics }) => {
  if (!analytics?.topSellingProducts?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Top Selling Products
        </h3>
        <div className="flex items-center justify-center h-48 text-sm text-gray-500">
          No product data available
        </div>
      </div>
    );
  }

  const chartData = analytics.topSellingProducts
    .slice(0, 8)
    .map((product, index) => ({
      name:
        product.productName?.length > 15
          ? `${product.productName.substring(0, 15)}...`
          : product.productName,
      fullName: product.productName,
      quantity: product.quantitySold,
      revenue: product.revenue,
      color: `hsl(${210 + index * 25}, 70%, 50%)`,
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg flex gap-2 items-center">
          <p className="text-xs font-medium text-gray-900">{data.fullName}</p>
          <p className="text-xs text-gray-600">
            Quantity: <span className="font-medium">{data.quantity}</span>
          </p>
          <p className="text-xs text-gray-600">
            Revenue:{" "}
            <span className="font-medium">
              ₹{data.revenue.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          Top Selling Products
        </h3>
        <span className="text-xs text-gray-500">By Quantity Sold</span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="quantity" radius={[4, 4, 0, 0]} name="Quantity">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Product List */}
      <div className="mt-3 space-y-1">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Product Details
        </h4>
        <div className="space-y-1">
          {analytics.topSellingProducts.slice(0, 5).map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded"
            >
              <span className="text-xs text-gray-900 font-medium">
                {product.productName}
              </span>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Qty: {product.quantitySold}</span>
                <span>₹{product.revenue.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProductsChart;
