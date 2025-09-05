"use client";

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { initializeSampleData } from '@/lib/storage';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initialize sample data if no data exists
    initializeSampleData();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <AppSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            {/* Page content */}
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-6 lg:px-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}