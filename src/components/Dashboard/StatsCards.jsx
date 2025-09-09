import React from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, ShoppingBag, Eye, MapPin } from 'lucide-react';

const StatsCard = ({ title, value, change, changeType, icon: Icon, formatValue }) => {
  const formatters = {
    currency: (val) => `₹${Number(val).toLocaleString('en-IN')}`,
    number: (val) => Number(val).toLocaleString('en-IN'),
    percentage: (val) => `${Number(val).toFixed(1)}%`,
    default: (val) => val
  };

  const formatter = formatters[formatValue] || formatters.default;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-xl font-bold text-gray-900">{formatter(value)}</p>
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${
            changeType === 'up' ? 'text-green-600' : 
            changeType === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {changeType === 'up' && <TrendingUp className="h-4 w-4" />}
            {changeType === 'down' && <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">{change}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCards = ({ analytics }) => {
  if (!analytics) return null;

  const stats = [
    {
      title: 'Total Sessions',
      value: analytics.totalSessions || 0,
      icon: Eye,
      formatValue: 'number',
    },
    {
      title: 'Landing Page Views',
      value: analytics.landingPageViews || 0,
      icon: Eye,
      formatValue: 'number',
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders || 0,
      icon: ShoppingCart,
      formatValue: 'number',
    },
    {
      title: 'Total Revenue',
      value: analytics.totalRevenue || 0,
      icon: DollarSign,
      formatValue: 'currency',
    },
    {
      title: 'Average Order Value',
      value: analytics.averageOrderValue || 0,
      icon: ShoppingBag,
      formatValue: 'currency',
    },
    {
      title: 'Conversion Rate',
      value: analytics.conversionRate || 0,
      icon: TrendingUp,
      formatValue: 'percentage',
    },
    {
      title: 'Abandoned Checkouts',
      value: analytics.abandonedCheckouts?.count || 0,
      icon: ShoppingCart,
      formatValue: 'number',
    },
    {
      title: 'Abandoned Value',
      value: analytics.abandonedCheckouts?.value || 0,
      icon: DollarSign,
      formatValue: 'currency',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
