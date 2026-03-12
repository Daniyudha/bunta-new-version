export interface IrrigationArea {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  area: number; // in hectares
  waterLevel: number; // in meters
  status: 'normal' | 'low' | 'high' | 'critical';
  lastUpdate: string;
  canals: number;
  gates: number;
}

export const irrigationAreas: IrrigationArea[] = [
  {
    id: 'bunta',
    name: 'Bunta Irrigation Area',
    description: 'Serves agricultural lands with efficient water distribution systems in Bunta District.',
    coordinates: [-0.9136959956309897, 122.29245556083764], // Approximate coordinates for Bunta, Central Sulawesi
    area: 2.481,
    waterLevel: 2.1,
    status: 'normal',
    lastUpdate: '2025-09-04T10:30:00Z',
    canals: 11,
    gates: 45
  }
];