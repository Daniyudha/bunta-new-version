'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Database,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Newspaper,
  Images,
  Logs,
  GalleryThumbnails,
  BookOpenCheck,
  History,
  BadgeCheck,
  UserRoundCog,
  ShieldCheck,
  MessageCircle,
  Menu,
  X,
  Archive,
} from 'lucide-react';
import { getAccessibleNavigation } from '@/lib/permissions';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

interface NavigationSection {
  title?: string | null;
  items: NavigationItem[];
}

// Icon mapping for dynamic navigation
const iconMap = {
  LayoutDashboard: LayoutDashboard,
  Newspaper: Newspaper,
  Images: Images,
  Logs: Logs,
  GalleryThumbnails: GalleryThumbnails,
  BookOpenCheck: BookOpenCheck,
  Database: Database,
  History: History,
  BadgeCheck: BadgeCheck,
  Users: Users,
  UserRoundCog: UserRoundCog,
  ShieldCheck: ShieldCheck,
  MessageCircle: MessageCircle,
  Archive: Archive,
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarMinimized, setSidebarMinimized] = useState(false); // desktop minimize
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile sidebar toggle
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // user dropdown toggle
  const pathname = usePathname();
  const { data: session } = useSession();
  const [accessibleNavigation, setAccessibleNavigation] = useState<NavigationSection[]>([]);


  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  useEffect(() => {
    if (session?.user?.permissions) {
      const navigation = getAccessibleNavigation(session.user.permissions);
      setAccessibleNavigation(navigation);
    }
  }, [session]);

  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div
          className={`${sidebarMinimized ? 'w-20' : 'w-64'
            } bg-white shadow-2xl flex flex-col fixed inset-y-0 z-50 transition-all duration-300`}
        >
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-white border-b border-gray-800">
            {!sidebarMinimized && (
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/main-logo.png"
                  alt="Admin Avatar"
                  width={180}
                  height={40}
                  className="mr-3"
                  priority />
              </div>
            )}
            <button
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              className="p-1 rounded-md text-black"
            >
              {sidebarMinimized ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="mt-8 space-y-6">
              {accessibleNavigation.map((section, idx) => (
                <div key={idx}>
                  {section.title && (
                    <div className="px-4 mb-2 text-xs font-semibold text-gray-500 tracking-wider uppercase">
                      {section.title}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item: NavigationItem) => {
                      const Icon = iconMap[item.icon as keyof typeof iconMap];
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`
                flex items-center ${sidebarMinimized ? 'justify-center' : 'space-x-3 px-4'}
                py-3 rounded-lg transition-colors
                ${isActive ? 'bg-blue-600 text-white' : 'text-black hover:bg-blue-600 hover:text-white'}
              `}
                        >
                          <Icon size={20} />
                          {!sidebarMinimized && <span>{item.name}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/main-logo.png"
              alt="Admin Avatar"
              width={180}
              height={40}
              className="mr-3"
              priority />
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-md text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="mt-8 space-y-6">
            {accessibleNavigation.map((section, idx) => (
              <div key={idx}>
                {section.title && (
                  <div className="px-4 mb-2 text-xs font-semibold text-gray-500 tracking-wider uppercase">
                    {section.title}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item: NavigationItem) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          flex items-center space-x-3 px-4
                          py-3 rounded-lg transition-colors
                          ${isActive ? 'bg-blue-600 text-white' : 'text-black hover:bg-blue-600 hover:text-white'}
                        `}
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarMinimized ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className='text-lg text-black lg:ml-0 ml-2'>
              Selamat datang, {session?.user?.name || 'Admin'} !
            </div>
            <div className="flex items-center space-x-4">
              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 hidden sm:block">
                    {session?.user?.name || 'User'}
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session?.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-blue-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
