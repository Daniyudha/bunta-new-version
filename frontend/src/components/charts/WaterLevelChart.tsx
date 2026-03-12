'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WaterLevelData } from '@/types/data';

interface WaterLevelChartProps {
  data: WaterLevelData[];
}

export default function WaterLevelChart({ data }: WaterLevelChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Tidak ada data level air yang tersedia</p>
          <p className="text-gray-400 text-sm">Silakan tambahkan data level air terlebih dahulu</p>
        </div>
      </div>
    );
  }

  // Get all unique areas from the data
  const areas = [...new Set(data.map(item => item.area))];
  
  // Group data by date for the chart - create an object for each date with values for each area
  const dateGroups = data.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = {};
    }
    acc[item.date][item.area] = item.level;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const chartData = Object.entries(dateGroups).map(([date, areas]) => ({
    date,
    ...areas
  }));

  // Colors for different areas
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="w-full h-80 mb-10">
      <h3 className="text-lg font-semibold text-black mb-4 text-center">Tren Ketinggian Air (meter)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {areas.map((area, index) => (
            <Line
              key={area}
              type="monotone"
              dataKey={area}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}