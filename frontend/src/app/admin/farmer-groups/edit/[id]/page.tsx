'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const EditFarmerGroupClient = dynamic(() => import('./EditFarmerGroupClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface EditFarmerGroupPageProps {
  params: { id: string };
}

export default async function EditFarmerGroupPage({ params }: EditFarmerGroupPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <EditFarmerGroupClient id={params.id} />;
}