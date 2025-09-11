import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardAnalytics,
  setDateRange,
} from "../../features/analyticsSlice";
import { BarChart3, AlertCircle } from "lucide-react";

// Import dashboard components
import DateRangeSelector from "./DateRangeSelector";
import StatsCards from "./StatsCards";
import TopProductsChart from "./TopProductsChart";
import GeographicChart from "./GeographicChart";
import RevenueChart from "./RevenueChart";
import AbandonedCheckoutCard from "./AbandonedCheckoutCard";
import DashboardSkeleton from "./DashboardSkeleton";
import Traffic from "../Traffic/Traffic";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardAnalytics, loading, error, dateRange } = useSelector(
    (state) => state.analytics
  );
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    handleRefresh();
  }, [dispatch, dateRange]);

  const handleRefresh = () => {
    dispatch(fetchDashboardAnalytics(dateRange));
    setLastRefresh(new Date());
  };

  const handleDateRangeChange = (newRange) => {
    dispatch(setDateRange(newRange));
  };

  if (loading && !dashboardAnalytics) {
    return <DashboardSkeleton />;
  }

  if (error && !dashboardAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 max-w-md w-full text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Error Loading Analytics
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {error?.message || "Failed to load dashboard data"}
          </p>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 bg-blue-50 rounded-lg flex-shrink-0">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  Analytics Dashboard
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Comprehensive business insights and performance metrics
                </p>
              </div>
            </div>

            {dashboardAnalytics?.dateRange && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:text-right space-y-1 sm:space-y-0 sm:space-x-2 flex-wrap gap-2">
                <p className="text-xs font-medium text-gray-900 order-2 sm:order-1">
                  {dashboardAnalytics.dateRange.start} to{" "}
                  {dashboardAnalytics.dateRange.end}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 order-1 sm:order-2">
                  <span>{dashboardAnalytics.dateRange.days} days</span>
                  <span className="hidden sm:inline">| (YYYY/MM/DD)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Date Range Selector */}
        <DateRangeSelector
          selectedRange={dateRange}
          onRangeChange={handleDateRangeChange}
          onRefresh={handleRefresh}
          isLoading={loading}
          lastUpdated={lastRefresh}
        />
        {/* Loading Overlay for Refreshes */}
        {loading && dashboardAnalytics && (
          <div className="fixed top-4 right-3 sm:right-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
              <span className="text-xs">Updating...</span>
            </div>
          </div>
        )}
        {/* Main Stats Cards */}
        <StatsCards analytics={dashboardAnalytics} />
        {/* Revenue and Trends */}
        <RevenueChart analytics={dashboardAnalytics} />
        {/* Charts Grid - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4">
          {/* Top Products - Full width on mobile, 2 columns on xl+ */}
          <div className="xl:col-span-2">
            <TopProductsChart analytics={dashboardAnalytics} />
          </div>

          {/* Abandoned Checkouts - Full width on mobile, 1 column on xl+ */}
          <div className="xl:col-span-1">
            <AbandonedCheckoutCard analytics={dashboardAnalytics} />
          </div>
        </div>
        {/* Geographic Data and Insights - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <GeographicChart analytics={dashboardAnalytics} />

          {/* Quick Insights - Mobile Optimized */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-semibold text-green-800">
                  Best Performing
                </h4>
                <p className="text-xs text-green-700 mt-1 truncate">
                  {dashboardAnalytics?.topSellingProducts?.[0]?.productName ||
                    "No data"}{" "}
                  is your top seller
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-semibold text-blue-800">
                  Conversion Rate
                </h4>
                <p className="text-xs text-blue-700 mt-1">
                  {dashboardAnalytics?.conversionRate?.toFixed(2) || 0}% of
                  sessions convert
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-semibold text-purple-800">
                  Revenue Growth
                </h4>
                <p className="text-xs text-purple-700 mt-1">
                  ₹
                  {dashboardAnalytics?.totalRevenue?.toLocaleString("en-IN") ||
                    0}{" "}
                  total revenue
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-semibold text-orange-800">
                  Top Location
                </h4>
                <p className="text-xs text-orange-700 mt-1 truncate">
                  {dashboardAnalytics?.sessionsByLocation?.[0]
                    ? `${dashboardAnalytics.sessionsByLocation[0].city}, ${dashboardAnalytics.sessionsByLocation[0].state}`
                    : "No location data"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full">
          <Traffic showChangeChartType={false} defaultChartType="area" />
        </div>
        {/* Footer - Mobile Optimized */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
            <span className="text-center sm:text-left">
              Data updates daily at 1:00 AM IST
            </span>
            <span className="text-center sm:text-right">
              Last computed:{" "}
              {dashboardAnalytics?.computedAt
                ? new Date(dashboardAnalytics.computedAt).toLocaleDateString(
                    "en-IN"
                  )
                : "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
