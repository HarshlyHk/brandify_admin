import React, { useState } from 'react';
import axiosInstance from '@/config/axiosInstance';
import { Button } from '../ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const Traffic = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrafficData = async () => {
    if (!selectedDate) return;

    setLoading(true);
    setError('');

    try {
      const year = format(selectedDate, 'yyyy');
      const month = format(selectedDate, 'MM');
      const day = format(selectedDate, 'dd');

      const query = { day: `${year}-${month}-${day}` };

      const response = await axiosInstance.get('/traffic', { params: query });
      setTrafficData(response.data.traffic);
    } catch (err) {
      setError('Failed to fetch traffic data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6 text-center">
        Traffic Statistics
      </h1>

      <div className="flex flex-col md:flex-row justify-center gap-4 items-center mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">Select Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="YYYY-MM-DD"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <Button
          onClick={fetchTrafficData}
          disabled={loading || !selectedDate}
          className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition mt-4 md:mt-6"
        >
          {loading ? 'Loading...' : 'Fetch Traffic'}
        </Button>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {trafficData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">
            Traffic Data:
          </h2>
          <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 overflow-auto text-sm text-zinc-700 dark:text-zinc-200">
            <pre>{JSON.stringify(trafficData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Traffic;
