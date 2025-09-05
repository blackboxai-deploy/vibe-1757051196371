"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  const actions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice for your client',
      href: '/invoices/new',
      icon: '📄',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Add Client',
      description: 'Add a new client to your database',
      href: '/clients/new',
      icon: '👥',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'View Reports',
      description: 'Check your business performance',
      href: '/invoices?filter=paid',
      icon: '📊',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Settings',
      description: 'Configure your business profile',
      href: '/settings',
      icon: '⚙️',
      color: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>⚡</span>
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${action.color}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{action.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {action.description}
                    </p>
                    <Button 
                      size="sm" 
                      className={`text-white ${action.buttonColor}`}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}