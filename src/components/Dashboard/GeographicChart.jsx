import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MapPin } from 'lucide-react';

const GeographicChart = ({ analytics }) => {
  if (!analytics?.sessionsByLocation?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions by Location</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No geographic data available
        </div>
      </div>
    );
  }

  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const chartData = analytics.sessionsByLocation.slice(0, 10).map((location, index) => ({
    name: `${location.city}, ${location.state}`,
    value: location.sessions,
    color: COLORS[index % COLORS.length],
    fullLocation: `${location.city}, ${location.state}, ${location.country?.toUpperCase()}`
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.fullLocation}</p>
          <p className="text-sm text-gray-600">
            Sessions: <span className="font-medium">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
          {payload?.slice(0, 6).map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700 truncate">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Sessions by Location</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend payload={chartData} />

      {/* Location List */}
      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Top Locations</h4>
        <div className="space-y-2">
          {analytics.sessionsByLocation.slice(0, 8).map((location, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-900">
                  {location.city}, {location.state}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {location.sessions}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeographicChart;
