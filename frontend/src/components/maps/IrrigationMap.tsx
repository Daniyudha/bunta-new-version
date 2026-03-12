'use client';

import dynamic from 'next/dynamic';
import { IrrigationArea } from '@/types/irrigation';

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./DynamicMap').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Memuat peta...</span>
    </div>
  )
}) as React.ComponentType<IrrigationMapProps>;

interface IrrigationMapProps {
  areas: IrrigationArea[];
  onAreaSelect?: (area: IrrigationArea) => void;
}

export default function IrrigationMap({ areas, onAreaSelect }: IrrigationMapProps) {
  return (
    <DynamicMap areas={areas} onAreaSelect={onAreaSelect} />
  );
}