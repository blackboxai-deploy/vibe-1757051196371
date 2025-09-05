"use client";

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
}

const getPageInfo = (pathname: string) => {
  if (pathname === '/') {
    return {
      title: 'Dashboard',
      description: 'Overview of your business performance',
      breadcrumbs: [{ label: 'Dashboard', href: '/' }],
    };
  }
  
  if (pathname === '/invoices') {
    return {
      title: 'Invoices',
      description: 'Manage and track your invoices',
      breadcrumbs: [
        { label: 'Dashboard', href: '/' },
        { label: 'Invoices', href: '/invoices' },
      ],
    };
  }
  
  if (pathname === '/invoices/new') {
    return {
      title: 'Create Invoice',
      description: 'Create a new invoice for your client',
      breadcrumbs: [
        { label: 'Dashboard', href: '/' },
        { label: 'Invoices', href: '/invoices' },
        { label: 'New Invoice', href: '/invoices/new' },
      ],
    };
  }
  
  if (pathname.startsWith('/invoices/') && pathname.endsWith('/edit')) {
    return {
      title: 'Edit Invoice',
      description: 'Modify invoice details',
      breadcrumbs: [
        { label: 'Dashboard', href: '/' },
        { label: 'Invoices', href: '/invoices' },
        { label: 'Edit Invoice', href: pathname },
      ],
    };
  }
  
  if (pathname.startsWith('/invoices/')) {
    return {
      title: 'View Invoice',
      description: 'Invoice details and actions',
      breadcrumbs: [
        { label: 'Dashboard', href: '/' },
        { label: 'Invoices', href: '/invoices' },
        { label: 'View Invoice', href: pathname },
      ],
    };
  }
  
  if (pathname === '/clients') {
    return {
      title: 'Clients',
      description: 'Manage your client database',
      breadcrumbs: [
        { label: 'Dashboard', href: '/' },
        { label: 'Clients', href: '/clients' },
      ],
    };
  }
  
  if (pathname === '/clients/new') {
    return {
      title: 'Add Client',
      description: 'Add a new client to your database',
      breadcrumbs: [
        { label: 'Dashboard', href: '/' },
        { label: 'Clients', href: '/clients' },
        { label: 'Add Client', href: '/clients/new' },
      ],
    };
  }
  
  if (pathname === '/settings') {
    return {
      title: 'Settings',
      description: 'Business profile and preferences',
      breadcrumbs: [
        { label: 'Dashboard', href: '/' },
        { label: 'Settings', href: '/settings' },
      ],
    };
  }
  
  return {
    title: 'Page',
    description: '',
    breadcrumbs: [{ label: 'Dashboard', href: '/' }],
  };
};

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const pageInfo = getPageInfo(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 lg:px-6">
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm">
          {pageInfo.breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center space-x-2">
              {index > 0 && (
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {index === pageInfo.breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-900">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="font-medium text-gray-600 hover:text-gray-900"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Page title and description */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 truncate lg:text-2xl">
            {pageInfo.title}
          </h1>
          {pageInfo.description && (
            <p className="text-sm text-gray-600 truncate hidden sm:block">
              {pageInfo.description}
            </p>
          )}
        </div>
      </div>

      {/* Header actions */}
      <div className="flex items-center space-x-2">
        {pathname === '/invoices' && (
          <Link href="/invoices/new">
            <Button size="sm">
              <span className="mr-1">➕</span>
              New Invoice
            </Button>
          </Link>
        )}
        
        {pathname === '/clients' && (
          <Link href="/clients/new">
            <Button size="sm">
              <span className="mr-1">👤</span>
              Add Client
            </Button>
          </Link>
        )}

        {/* User menu placeholder */}
        <div className="flex items-center space-x-2 pl-2 border-l">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">U</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-900">User</div>
            <div className="text-xs text-gray-500">Business Owner</div>
          </div>
        </div>
      </div>
    </header>
  );
}