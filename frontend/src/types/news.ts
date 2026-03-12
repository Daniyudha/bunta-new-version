export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  tags: string[];
  readTime: number; // in minutes
  featured: boolean;
}

export const newsCategories = [
  'All',
  'Irrigation Updates',
  'Agricultural News',
  'Water Management',
  'Farmer Support',
  'Technology',
  'Events',
  'Announcements'
] as const;

export type NewsCategory = typeof newsCategories[number];

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'New Irrigation Infrastructure Completed in Bunta District',
    excerpt: 'Major upgrade to irrigation channels improves water distribution efficiency for local farmers.',
    content: 'The Bunta Irrigation Monitoring Office has successfully completed the upgrade of irrigation infrastructure in Bunta District. The project involved renovating 5km of main irrigation channels and installing modern water control gates. This upgrade is expected to improve water distribution efficiency by 30% and benefit over 150 farmers in the area.',
    category: 'Irrigation Updates',
    author: 'Ir. Budi Santoso',
    publishDate: '2025-09-03',
    imageUrl: '/images/news/irrigation-upgrade.jpg',
    tags: ['infrastructure', 'water management', 'farmers'],
    readTime: 3,
    featured: true
  },
  {
    id: '2',
    title: 'Rainfall Patterns Show Positive Trend for Agriculture',
    excerpt: 'Recent rainfall data indicates favorable conditions for the upcoming planting season.',
    content: 'Meteorological data from the past month shows consistent rainfall patterns across the Bunta region. The average rainfall of 150mm per week provides optimal conditions for rice cultivation. Farmers are advised to prepare their fields for the wet season planting, which is scheduled to begin next week.',
    category: 'Agricultural News',
    author: 'Dr. Siti Rahayu',
    publishDate: '2025-09-02',
    imageUrl: '/images/news/rainfall-patterns.jpg',
    tags: ['weather', 'planting season', 'rice cultivation'],
    readTime: 2,
    featured: true
  },
  {
    id: '3',
    title: 'Workshop on Modern Irrigation Techniques',
    excerpt: 'Free training session for farmers on water-saving irrigation methods.',
    content: 'The Irrigation Office will conduct a hands-on workshop on modern irrigation techniques this Saturday. The session will cover drip irrigation, sprinkler systems, and water conservation practices. Farmers interested in attending should register at the office by Thursday.',
    category: 'Events',
    author: 'Maria Rodriguez',
    publishDate: '2025-09-01',
    tags: ['workshop', 'training', 'water conservation'],
    readTime: 1,
    featured: false
  },
  {
    id: '4',
    title: 'Water Level Monitoring System Upgrade',
    excerpt: 'New IoT sensors installed for real-time water level monitoring across irrigation networks.',
    content: 'The office has upgraded its water level monitoring system with state-of-the-art IoT sensors. These sensors provide real-time data on water levels, flow rates, and quality parameters. The system allows for proactive management of water resources and early detection of potential issues.',
    category: 'Technology',
    author: 'Ahmad Fauzi',
    publishDate: '2025-08-30',
    imageUrl: '/images/news/iot-sensors.jpg',
    tags: ['technology', 'monitoring', 'IoT'],
    readTime: 4,
    featured: true
  },
  {
    id: '5',
    title: 'Harvest Festival Celebration Announced',
    excerpt: 'Annual harvest festival to celebrate agricultural achievements in the region.',
    content: 'The Bunta region will host its annual harvest festival next month. The event will feature agricultural exhibitions, farmer competitions, and cultural performances. All farmers and community members are invited to participate in the celebrations.',
    category: 'Events',
    author: 'Local Government',
    publishDate: '2025-08-28',
    tags: ['festival', 'celebration', 'community'],
    readTime: 2,
    featured: false
  },
  {
    id: '6',
    title: 'New Support Program for Smallholder Farmers',
    excerpt: 'Financial and technical assistance program launched for small-scale farmers.',
    content: 'A new support program has been launched to assist smallholder farmers in the region. The program offers subsidized irrigation equipment, technical training, and access to markets. Applications are now open for eligible farmers.',
    category: 'Farmer Support',
    author: 'Department of Agriculture',
    publishDate: '2025-08-25',
    imageUrl: '/images/news/farmer-support.jpg',
    tags: ['support program', 'subsidy', 'smallholders'],
    readTime: 3,
    featured: false
  }
];