'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateIrrigationProfileClient from './CreateIrrigationProfileClient';

export default async function CreateIrrigationProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <CreateIrrigationProfileClient />;
}
