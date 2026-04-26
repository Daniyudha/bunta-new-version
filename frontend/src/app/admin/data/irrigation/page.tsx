'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import IrrigationDataClient from './IrrigationDataClient';

export default async function IrrigationData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <IrrigationDataClient />;
}
