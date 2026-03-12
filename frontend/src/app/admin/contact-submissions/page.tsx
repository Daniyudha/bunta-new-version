'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { hasAccessToRoute } from '@/lib/permissions';

const ContactSubmissionsClient = dynamic(() => import('./ContactSubmissionsClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default async function ContactSubmissionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Check if user has permission to view contact submissions using the same logic as sidebar
  const userPermissions = session.user?.permissions || [];
  if (!hasAccessToRoute(userPermissions, '/admin/contact-submissions')) {
    redirect('/admin/dashboard');
  }

  return <ContactSubmissionsClient />;
}