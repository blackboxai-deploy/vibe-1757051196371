"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  title: string;
  href: string;
  icon: string;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: '📊',
    description: 'Overview and statistics',
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: '📄',
    description: 'Manage your invoices',
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: '👥',
    description: 'Manage your clients',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: '⚙️',
    description: 'Business profile & preferences',
  },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const [businessName, setBusinessName] = useState('InvoiceApp');

  useEffect(() => {
    // Load business name from localStorage
    try {
      const profile = localStorage.getItem('invoice-app-business-profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        setBusinessName(parsed.companyName || 'InvoiceApp');
      }
    } catch (error) {
      console.error('Error loading business profile:', error);
    }
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-semibold text-sm">
                I
              </div>
              <span className="font-semibold text-gray-900 truncate">
                {businessName}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="border-t px-3 py-4 space-y-2">
            <Link href="/invoices/new">
              <Button 
                className="w-full justify-start space-x-2" 
                onClick={onClose}
              >
                <span>➕</span>
                <span>New Invoice</span>
              </Button>
            </Link>
            <Link href="/clients/new">
              <Button 
                variant="outline" 
                className="w-full justify-start space-x-2"
                onClick={onClose}
              >
                <span>👤</span>
                <span>Add Client</span>
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            <div className="text-xs text-gray-500">
              Invoice Management System
            </div>
            <div className="text-xs text-gray-400 mt-1">
              v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}