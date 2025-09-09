import React from 'react';
import { AlertTriangle, ShoppingCart, XCircle, TrendingDown } from 'lucide-react';

const AbandonedCheckoutCard = ({ analytics }) => {
  if (!analytics) return null;

  const abandonedData = analytics.abandonedCheckouts || { count: 0, value: 0 };
  const totalOrders = analytics.totalOrders || 0;
  const totalRevenue = analytics.totalRevenue || 0;
  
  // Calculate abandonment rate
  const totalPotentialOrders = totalOrders + abandonedData.count;
  const abandonmentRate = totalPotentialOrders > 0 ? 
    (abandonedData.count / totalPotentialOrders) * 100 : 0;

  // Calculate potential revenue loss
  const averageAbandonedValue = abandonedData.count > 0 ? 
    abandonedData.value / abandonedData.count : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-red-50 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Abandoned Checkouts</h3>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-red-50 rounded-lg flex flex-col gap-2">
          <p className="text-xl font-bold text-red-600">{abandonedData.count}</p>
          <p className="text-xs text-gray-600">Abandoned Carts</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg flex flex-col gap-2">
          <p className="text-xl font-bold text-orange-600">
            ₹{abandonedData.value.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-600">Lost Revenue</p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Abandonment Rate</span>
          </div>
          <span className="text-xs font-bold text-red-600">
            {abandonmentRate.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Avg. Abandoned Value</span>
          </div>
          <span className="text-xs font-bold text-gray-900">
            ₹{averageAbandonedValue.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Total Potential Orders</span>
          </div>
          <span className="text-xs font-bold text-gray-900">{totalPotentialOrders}</span>
        </div>
      </div>

      {/* Recovery Suggestions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Recovery Opportunities</h4>
        <ul className="text-xs text-blue-800 space-y-0.5">
          <li>• Send automated email reminders to abandoned cart users</li>
          <li>• Offer limited-time discounts to recover lost sales</li>
          <li>• Analyze checkout process for friction points</li>
          <li>• Implement exit-intent popups with incentives</li>
        </ul>
      </div>

      {/* Visual Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-600">Checkout Completion</span>
          <span className="text-xs text-gray-600">
            {(100 - abandonmentRate).toFixed(1)}% completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${100 - abandonmentRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AbandonedCheckoutCard;
