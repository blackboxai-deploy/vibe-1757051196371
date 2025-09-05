"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { formatCurrency } from '@/lib/invoice-utils';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      description: 'All-time earnings',
      icon: '💰',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      description: 'This month\'s earnings',
      icon: '📈',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      description: `${stats.paidInvoices} paid`,
      icon: '📄',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices.toString(),
      description: 'Awaiting payment',
      icon: '⏳',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Overdue Amount',
      value: formatCurrency(stats.overdueAmount),
      description: `${stats.overdueInvoices} invoices`,
      icon: '⚠️',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Average Invoice',
      value: formatCurrency(stats.averageInvoiceValue),
      description: 'Per invoice value',
      icon: '📊',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}