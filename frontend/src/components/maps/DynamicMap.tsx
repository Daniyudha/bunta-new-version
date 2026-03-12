'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IrrigationArea } from '@/types/irrigation';

// Fix for default markers in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DynamicMapProps {
  areas: IrrigationArea[];
  onAreaSelect?: (area: IrrigationArea) => void;
}

export default function DynamicMap({ areas, onAreaSelect }: DynamicMapProps) {
  const center: [number, number] = [-0.9136959956309897, 122.29245556083764]; // Center between Bunta and Bunta

  const getStatusColor = (status: IrrigationArea['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: IrrigationArea['status']) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'low': return 'Low Water';
      case 'high': return 'High Water';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {areas.map((area) => (
          <Marker
            key={area.id}
            position={area.coordinates}
            eventHandlers={{
              click: () => onAreaSelect?.(area),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg mb-2">{area.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm">{area.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(area.status)}`}></span>
                    <span className="text-sm font-medium">{getStatusText(area.status)}</span>
                  </div>
                  <p className="text-sm">Water Level: <strong>{area.waterLevel}</strong></p>
                  <p className="text-sm">Area: <strong>{area.area.toLocaleString()} ha</strong></p>
                  <p className="text-sm">Canals: <strong>{area.canals} km</strong></p>
                  <p className="text-sm">Gates: <strong>{area.gates}</strong></p>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(area.lastUpdate).toLocaleString()}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}