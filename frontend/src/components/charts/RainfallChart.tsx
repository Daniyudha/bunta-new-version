'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RainfallData } from '@/types/data';

interface RainfallChartProps {
  data: RainfallData[];
}

export default function RainfallChart({ data }: RainfallChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Tidak ada data curah hujan yang tersedia</p>
          <p className="text-gray-400 text-sm">Silakan tambahkan data curah hujan terlebih dahulu</p>
        </div>
      </div>
    );
  }

  // Get all unique areas from the data
  const areas = [...new Set(data.map(item => item.area))];
  
  // Group data by date for the chart - create an object for each date with values for each area
  interface ChartDataPoint {
    date: string;
    [key: string]: string | number;
  }

  const dateGroups = data.reduce<Record<string, ChartDataPoint>>((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { date: item.date };
    }
    acc[item.date][item.area] = item.rainfall;
    return acc;
  }, {});

  const chartData = Object.values(dateGroups);

  // Colors for different areas
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold text-black mb-4 text-center">Data Curah Hujan (mm)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            <Bar
              key={area}
              dataKey={area}
              fill={colors[index % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}