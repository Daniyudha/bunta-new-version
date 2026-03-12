export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
}

export const galleryCategories = [
  'All',
  'Infrastructure',
  'Events',
  'Construction',
  'Harvest',
  'Community',
  'Technology'
] as const;

export type GalleryCategory = typeof galleryCategories[number];

export const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Main Irrigation Channel',
    description: 'Primary irrigation channel serving Bunta District with modern water control systems.',
    imageUrl: '/images/gallery/channel-1.jpg',
    category: 'Infrastructure',
    date: '2025-08-15',
    type: 'image'
  },
  {
    id: '2',
    title: 'Water Gate Installation',
    description: 'Installation of automated water control gates for efficient water distribution.',
    imageUrl: '/images/gallery/gate-installation.jpg',
    category: 'Construction',
    date: '2025-08-10',
    type: 'image'
  },
  {
    id: '3',
    title: 'Harvest Festival 2025',
    description: 'Annual harvest celebration with farmers and community members.',
    imageUrl: '/images/gallery/harvest-festival.jpg',
    category: 'Events',
    date: '2025-07-20',
    type: 'image'
  },
  {
    id: '4',
    title: 'Farmer Training Workshop',
    description: 'Workshop on modern irrigation techniques for local farmers.',
    imageUrl: '/images/gallery/workshop.jpg',
    category: 'Community',
    date: '2025-07-15',
    type: 'image'
  },
  {
    id: '5',
    title: 'IoT Sensor Deployment',
    description: 'Installation of IoT sensors for real-time water monitoring.',
    imageUrl: '/images/gallery/iot-sensors.jpg',
    category: 'Technology',
    date: '2025-07-10',
    type: 'image'
  },
  {
    id: '6',
    title: 'Canal Maintenance',
    description: 'Regular maintenance of irrigation canals to ensure optimal performance.',
    imageUrl: '/images/gallery/maintenance.jpg',
    category: 'Infrastructure',
    date: '2025-07-05',
    type: 'image'
  },
  {
    id: '7',
    title: 'Community Meeting',
    description: 'Monthly meeting with farmers to discuss irrigation schedules and issues.',
    imageUrl: '/images/gallery/meeting.jpg',
    category: 'Community',
    date: '2025-06-25',
    type: 'image'
  },
  {
    id: '8',
    title: 'Rice Field Irrigation',
    description: 'Efficient water distribution in rice fields during the wet season.',
    imageUrl: '/images/gallery/rice-field.jpg',
    category: 'Harvest',
    date: '2025-06-20',
    type: 'image'
  },
  {
    id: '9',
    title: 'New Pump Station',
    description: 'Recently completed pump station for Bunta District irrigation network.',
    imageUrl: '/images/gallery/pump-station.jpg',
    category: 'Infrastructure',
    date: '2025-06-15',
    type: 'image'
  }
];