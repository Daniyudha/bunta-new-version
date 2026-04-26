'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EditIrrigationProfileClient from './EditIrrigationProfileClient';

export default async function EditIrrigationProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <EditIrrigationProfileClient />;
}
