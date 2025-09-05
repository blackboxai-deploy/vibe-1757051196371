"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { loadClients, deleteClient } from '@/lib/storage';
import { Client } from '@/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm]);

  const loadData = () => {
    try {
      const clientsData = loadClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(term) ||
        client.company.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone?.toLowerCase().includes(term)
      );
    }

    // Sort by most recent
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setFilteredClients(filtered);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        deleteClient(clientId);
        loadData();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client. They may be associated with existing invoices.');
      }
    }
  };

  const formatAddress = (client: Client) => {
    const { street, city, state, zipCode } = client.address;
    return `${street}, ${city}, ${state} ${zipCode}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header with search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
        
        <Link href="/clients/new">
          <Button>
            <span className="mr-2">👤</span>
            Add Client
          </Button>
        </Link>
      </div>

      {/* Clients table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Clients ({filteredClients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <span className="text-6xl">👥</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {clients.length === 0 ? 'No clients yet' : 'No clients match your search'}
              </h3>
              <p className="text-gray-500 mb-4">
                {clients.length === 0 
                  ? 'Add your first client to start creating invoices'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {clients.length === 0 && (
                <Link href="/clients/new">
                  <Button>
                    <span className="mr-2">👤</span>
                    Add Your First Client
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {client.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="text-sm text-gray-500">
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {formatAddress(client)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span>⋮</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Link href={`/invoices/new?clientId=${client.id}`}>
                                Create Invoice
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClient(client.id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}