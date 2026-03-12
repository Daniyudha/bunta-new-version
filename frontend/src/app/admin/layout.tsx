import { ReactNode } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface AdminRootLayoutProps {
  children: ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}

export const metadata = {
  title: 'Panel Admin - Irigasi Bunta Bunta',
  description: 'Dashboard administrasi untuk Sistem Irigasi Bunta Bunta',
};