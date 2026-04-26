'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import IrrigationProfilesManagementClient from './IrrigationProfilesManagementClient';

export default async function IrrigationProfilesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <IrrigationProfilesManagementClient />;
}
