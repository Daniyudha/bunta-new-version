import { ReactNode } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface AdminRootLayoutProps {
  children: ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}

export const metadata = {
  title: "Panel Admin - Cikasda UPT PSDA Wilayah II",
  description: "Pengembangan dan Pengelolaan Jaringan Irigasi dan Rawa, serta Pengelolaan dan Konservasi Sungai, Danau, Pantai dan Air Baku di Wilayah Provinsi Sulawesi Tengah.",
};