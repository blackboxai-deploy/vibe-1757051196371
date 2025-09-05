"use client";

import { useState, useEffect } from 'react';
import { DashboardStatsComponent } from '@/components/dashboard/dashboard-stats';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { loadInvoices, loadClients, calculateDashboardStats } from '@/lib/storage';
import { Invoice, Client, DashboardStats } from '@/types';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    overdueAmount: 0,
    averageInvoiceValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const invoicesData = loadInvoices();
        const clientsData = loadClients();
        
        // Populate client data in invoices
        const invoicesWithClients = invoicesData.map(invoice => ({
          ...invoice,
          client: clientsData.find(client => client.id === invoice.clientId),
        }));
        
        setInvoices(invoicesWithClients);

        setStats(calculateDashboardStats(invoicesData));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-sm text-blue-100">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard statistics */}
      <DashboardStatsComponent stats={stats} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RecentInvoices invoices={invoices} />
        </div>
        
        <div className="space-y-6">
          <QuickActions />
          
          {/* Business insights */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>💡</span>
              <span>Business Insights</span>
            </h3>
            
            <div className="space-y-4">
              {stats.overdueInvoices > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">⚠️</span>
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {stats.overdueInvoices} overdue invoice{stats.overdueInvoices > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Consider sending payment reminders to improve cash flow
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {stats.pendingInvoices > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500">📋</span>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        {stats.pendingInvoices} pending invoice{stats.pendingInvoices > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Follow up with clients to ensure timely payments
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {stats.totalInvoices === 0 && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-500">🚀</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Ready to start invoicing?
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Create your first invoice to begin tracking your business
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {stats.totalInvoices > 0 && stats.overdueInvoices === 0 && stats.pendingInvoices === 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✅</span>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Great job! All invoices are up to date
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Your cash flow management is excellent
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}