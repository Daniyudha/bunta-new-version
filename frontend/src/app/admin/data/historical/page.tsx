'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const HistoricalDataClient = dynamic(() => import('./HistoricalDataClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default async function HistoricalData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <HistoricalDataClient />;
}