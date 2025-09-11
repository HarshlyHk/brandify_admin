import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";
import { format, addDays, subDays, startOfMonth, endOfMonth } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdBarChart,
  MdShowChart,
  MdPieChart,
} from "react-icons/md";
import { FiArrowUp, FiArrowDown, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router";

const Traffic = ({ defaultChartType = "line", showChangeChartType = true }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trafficData, setTrafficData] = useState([]);
  const [previousMonthData, setPreviousMonthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState(defaultChartType || "line");
  const navigate = useNavigate();
  // Professional color palette
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#6366f1",
  ];
  const BG_GRADIENTS = [
    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  ];

  const fetchTrafficData = async (date = currentDate) => {
    setLoading(true);
    setError("");
    try {
      const year = format(date, "yyyy");
      const month = format(date, "MM");

      // Fetch current month data
      const response = await axiosInstance.get("/traffic", {
        params: { month: `${year}-${month}` },
      });
      const dailyTraffic = response.data.traffic.dailyTraffic || {};
      const chartData = Object.entries(dailyTraffic).map(([day, value]) => ({
        date: format(new Date(day), "MMM dd"),
        visits: value,
        fullDate: day,
      }));
      setTrafficData(chartData);

      // Fetch previous month data for comparison
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const prevYear = format(prevMonth, "yyyy");
      const prevMonthNum = format(prevMonth, "MM");

      try {
        const prevResponse = await axiosInstance.get("/traffic", {
          params: { month: `${prevYear}-${prevMonthNum}` },
        });
        const prevDailyTraffic = prevResponse.data.traffic.dailyTraffic || {};
        const prevChartData = Object.entries(prevDailyTraffic).map(
          ([day, value]) => ({
            date: format(new Date(day), "MMM dd"),
            visits: value,
            fullDate: day,
          })
        );
        setPreviousMonthData(prevChartData);
      } catch (prevErr) {
        setPreviousMonthData([]);
      }
    } catch (err) {
      setError("Failed to fetch traffic data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, [currentDate]);

  const navigateMonth = (direction) => {
    const newDate =
      direction === "prev"
        ? new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const renderChart = ({ showChangeChartType }) => {
    if (!trafficData.length) return null;

    const chartProps = {
      data: trafficData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart {...chartProps}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
              <Bar
                dataKey="visits"
                fill="url(#barGradient)"
                name="Current Month"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            {!showChangeChartType && (
              <div className="mb-4 flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-gray-900 ">
                  Traffic Overview
                </h2>
                <button
                  className="text-sm cursor-pointer font-medium bg-blue-600 px-3 py-2 text-white rounded-md "
                  onClick={() => {
                    navigate("/traffic");
                  }}
                >
                  View Full Report
                </button>
              </div>
            )}

            <AreaChart
              data={trafficData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                fill="url(#areaGradient)"
                strokeWidth={2}
                name="Current Month"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default: // line chart with comparison
        // Combine current and previous month data for comparison
        const combinedData = trafficData.map((currentItem, index) => {
          const prevItem = previousMonthData[index];
          return {
            date: currentItem.date,
            currentMonth: currentItem.visits,
            previousMonth: prevItem ? prevItem.visits : 0,
          };
        });

        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: "#f0f0f0", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="currentMonth"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2 }}
                name={`${format(currentDate, "MMM yyyy")}`}
              />
              {previousMonthData.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="previousMonth"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                  name={`${format(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1
                    ),
                    "MMM yyyy"
                  )}`}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="text-xl font-bold text-gray-800">Traffic Analytics</div>
        <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
          <FiCalendar className="text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            {format(currentDate, "MMMM yyyy")}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <MdNavigateBefore size={20} className="text-gray-600" />
        </button>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            format(currentDate, "yyyy-MM") >= format(new Date(), "yyyy-MM")
          }
        >
          <MdNavigateNext size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );

  const renderChartTypeSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-fit mx-auto">
      {[
        { type: "line", label: "Line", icon: <MdShowChart size={18} /> },
        { type: "bar", label: "Bar", icon: <MdBarChart size={18} /> },
        { type: "area", label: "Area", icon: <MdShowChart size={18} /> },
      ].map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => setChartType(type)}
          className={`px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium flex items-center ${
            chartType === type
              ? `bg-blue-50 text-blue-600 border border-blue-200 shadow-inner`
              : `bg-white text-gray-600 hover:bg-gray-50 border border-transparent`
          }`}
        >
          <span className="mr-2">{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );

  const getTotalVisits = () => {
    return trafficData.reduce((sum, item) => sum + item.visits, 0);
  };

  const getAverageVisits = () => {
    if (!trafficData.length) return 0;
    return Math.round(getTotalVisits() / trafficData.length);
  };

  const getPreviousMonthTotals = () => {
    if (!previousMonthData.length) return { total: 0, average: 0 };
    const total = previousMonthData.reduce((sum, item) => sum + item.visits, 0);
    const average = Math.round(total / previousMonthData.length);
    return { total, average };
  };

  const getGrowthPercentage = () => {
    const currentTotal = getTotalVisits();
    const { total: prevTotal } = getPreviousMonthTotals();
    if (prevTotal === 0) return 0;
    return Math.round(((currentTotal - prevTotal) / prevTotal) * 100);
  };

  const getPeakDay = () => {
    if (!trafficData.length) return { date: "", visits: 0 };
    const peak = trafficData.reduce(
      (max, item) => (item.visits > max.visits ? item : max),
      { visits: 0 }
    );
    return peak;
  };

  const renderStats = () => {
    const { total: prevTotal, average: prevAverage } = getPreviousMonthTotals();
    const growthPercentage = getGrowthPercentage();
    const peakDay = getPeakDay();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Visits
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {getTotalVisits().toLocaleString()}
              </p>
            </div>
            <div
              className={`p-2 rounded-full ${
                growthPercentage >= 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {growthPercentage >= 0 ? (
                <FiArrowUp className="text-green-600" />
              ) : (
                <FiArrowDown className="text-red-600" />
              )}
            </div>
          </div>
          {prevTotal > 0 && (
            <p
              className={`text-sm font-medium mt-3 ${
                growthPercentage >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {growthPercentage >= 0 ? "+" : ""}
              {growthPercentage}% from previous month
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Average Daily
          </h3>
          <div className="flex gap-1 items-baseline">
            <p className="text-2xl font-bold text-gray-800 mt-1 ">
              {getAverageVisits().toLocaleString()}
            </p>
            {prevAverage > 0 && (
              <p className="text-sm text-gray-600 mt-3">
                <p
                  className={
                    getAverageVisits() > prevAverage
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {getAverageVisits() > prevAverage ? "↑" : "↓"}
                </p>{" "}
                <p>from {prevAverage.toLocaleString()} last month</p>
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tracking Days
          </h3>
          <div className="flex gap-1 items-baseline">
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {trafficData.length}
            </p>
            <p className="text-sm text-gray-600 mt-3">
              of {format(endOfMonth(currentDate), "dd")} days
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex gap-1 flex-col">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Peak Day
          </h3>
          <div className=" flex gap-1 items-baseline">
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {peakDay.visits.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-3">{peakDay.date}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-50  ">
      <div className="max-w-7xl mx-auto space-y-6">
        {showChangeChartType && renderHeader()}

        {showChangeChartType && renderStats()}

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          {showChangeChartType && renderChartTypeSelector()}

          {loading && (
            <div className="flex justify-center items-center h-96">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                <div className="text-sm text-gray-500">
                  Loading traffic data...
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <div className="text-sm text-red-600">{error}</div>
                <button
                  onClick={() => fetchTrafficData()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            trafficData.length > 0 &&
            renderChart({ showChangeChartType })}

          {!loading && !error && trafficData.length === 0 && (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="text-gray-400 mb-2">📊</div>
                <div className="text-sm text-gray-500">
                  No traffic data available for this period
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Traffic;
