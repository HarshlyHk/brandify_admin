import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Eye } from 'lucide-react';

const RevenueChart = ({ analytics }) => {
  // Since we have aggregated data, we'll create a simple summary view
  // In future, you can modify this to show daily breakdown when that data is available
  
  const summaryData = [
    {
      metric: 'Sessions',
      value: analytics?.totalSessions || 0,
      icon: Eye,
      color: '#3B82F6',
      change: '+0%' // Placeholder - you can calculate this when you have historical data
    },
    {
      metric: 'Orders',
      value: analytics?.totalOrders || 0,
      icon: ShoppingCart,
      color: '#10B981',
      change: '+0%'
    },
    {
      metric: 'Revenue',
      value: analytics?.totalRevenue || 0,
      icon: DollarSign,
      color: '#F59E0B',
      change: '+0%',
      format: 'currency'
    },
    {
      metric: 'Conversion',
      value: analytics?.conversionRate || 0,
      icon: TrendingUp,
      color: '#8B5CF6',
      change: '+0%',
      format: 'percentage'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `₹${Number(value).toLocaleString('en-IN')}`;
      case 'percentage':
        return `${Number(value).toFixed(1)}%`;
      default:
        return Number(value).toLocaleString('en-IN');
    }
  };

  // Mock trend data for demonstration
  const trendData = [
    { name: 'Week 1', sessions: 120, orders: 15, revenue: 1200 },
    { name: 'Week 2', sessions: 180, orders: 22, revenue: 1800 },
    { name: 'Week 3', sessions: 250, orders: 28, revenue: 2400 },
    { name: 'Week 4', sessions: 200, orders: 25, revenue: 2000 },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className='flex flex-col'>
                  <p className="text-xs font-medium text-gray-600">{item.metric}</p>
                  <p className="text-base font-bold text-gray-900">
                    {formatValue(item.value, item.format)}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                  <Icon className="h-4 w-4" style={{ color: item.color }} />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-xs text-gray-500">{item.change} from last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue & Orders Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Revenue & Orders Trend</h3>
          <span className="text-xs text-gray-500">Last 4 weeks (sample data)</span>
        </div>
        
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-gray-200 flex gap-2 rounded-lg shadow-lg">
                      <p className="text-xs font-medium text-gray-900">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                          {entry.dataKey === 'revenue' ? 
                            `Revenue: ₹${entry.value.toLocaleString('en-IN')}` :
                            `Orders: ${entry.value}`
                          }
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stackId="1" 
              stroke="#F59E0B" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              stackId="2" 
              stroke="#10B981" 
              fillOpacity={1} 
              fill="url(#colorOrders)" 
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-3 text-xs text-gray-500">
          <p>* This is sample trend data. Actual daily breakdown will be available once historical data is collected.</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
