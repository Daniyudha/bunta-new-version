import { ReactNode } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface AdminRootLayoutProps {
  children: ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}

export const metadata = {
  title: "Panel Admin - DIMENSI",
  description: "DIGITALISASI MANAJEMEN KEPEGAWAIAN DAN PENDAMPING SISTEM IRIGASI UNTUK MENDUKUNG PENGELOLAAN IRIGASI YANG LEBIH EFEKTIF DAN EFISIEN DI WILAYAH PROVINSI SULAWESI TENGAH.",
};