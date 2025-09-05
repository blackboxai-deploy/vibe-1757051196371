"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types';
import { formatCurrency, formatDateShort, getStatusColor, getStatusLabel } from '@/lib/invoice-utils';

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (recentInvoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📄</span>
            <span>Recent Invoices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-gray-400 mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No invoices yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first invoice to get started
            </p>
            <Link href="/invoices/new">
              <Button>
                <span className="mr-2">➕</span>
                Create Invoice
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <span>📄</span>
          <span>Recent Invoices</span>
        </CardTitle>
        <Link href="/invoices">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                    <p className="text-sm text-gray-600 truncate">
                      {invoice.client?.company || 'Unknown Client'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(invoice.total)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateShort(invoice.issueDate)}
                  </p>
                </div>
                
                <Badge 
                  variant="outline"
                  className={getStatusColor(invoice.status)}
                >
                  {getStatusLabel(invoice.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {invoices.length > 5 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Link href="/invoices">
              <Button variant="ghost" size="sm">
                View {invoices.length - 5} more invoices
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}