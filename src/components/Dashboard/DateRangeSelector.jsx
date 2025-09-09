import React from 'react';
import { Calendar, Filter, Download, RefreshCw } from 'lucide-react';

const DateRangeSelector = ({ 
  selectedRange, 
  onRangeChange, 
  onRefresh, 
  isLoading,
  lastUpdated 
}) => {
  const predefinedRanges = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
    { label: '6 Months', value: 180 },
    { label: '1 Year', value: 365 },
  ];

  const formatLastUpdated = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Date Range Selector */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Date Range:</span>
          </div>
          
          {/* Responsive Button Grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-2 sm:ml-4">
            {predefinedRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onRangeChange(range.value)}
                className={`px-2 py-1.5 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedRange === range.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3 lg:flex-shrink-0">
          {/* Last Updated - Hidden on mobile, shown on larger screens */}
          {lastUpdated && (
            <span className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex-1 sm:flex-initial ${
                isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200 flex-1 sm:flex-initial"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Info */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
          <span className="order-2 sm:order-1">
            Showing data for the last {selectedRange} days
          </span>
          
          {/* Mobile Last Updated */}
          {lastUpdated && (
            <span className="sm:hidden order-1 text-gray-400">
              Updated: {formatLastUpdated(lastUpdated)}
            </span>
          )}
          
          <span className="order-3 sm:order-2 hidden sm:block">
            Data is cached and updated daily at 1 AM
          </span>
          
          {/* Mobile Cache Info */}
          <span className="sm:hidden order-4 text-gray-400 text-xs">
            Cache updates daily at 1 AM
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;
