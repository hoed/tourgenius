import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FilePlus, 
  FileEdit, 
  Trash2, 
  Send, 
  Check, 
  Clock, 
  CircleDollarSign,
  FileDown,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Invoice } from '@/lib/types';
import { exportInvoiceToPdf } from '@/utils/invoice-pdf-exporter';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedInvoices: Invoice[] = (data || []).map(item => {
        let parsedItems: any[] = [];
        
        if (typeof item.items === 'string') {
          try {
            parsedItems = JSON.parse(item.items);
          } catch (e) {
            console.error('Error parsing invoice items:', e);
            parsedItems = [];
          }
        } else if (Array.isArray(item.items)) {
          parsedItems = item.items;
        }
        
        const validStatus = ['draft', 'sent', 'paid', 'unpaid'].includes(item.status) 
          ? item.status as 'draft' | 'sent' | 'paid' | 'unpaid'
          : 'draft';
          
        return {
          id: item.id,
          itineraryId: item.itinerary_id,
          customerName: item.customer_name,
          customerEmail: item.customer_email,
          date: item.date,
          dueDate: item.due_date,
          items: parsedItems,
          subtotal: item.subtotal,
          tax: item.tax,
          total: item.total,
          status: validStatus,
          created_at: item.created_at,
          updated_at: item.updated_at,
          user_id: item.user_id
        };
      });

      setInvoices(transformedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteInvoice = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceToDelete);
        
      if (error) throw error;
      
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleEditInvoice = (invoiceId: string) => {
    navigate(`/dashboard/invoices?edit=${invoiceId}`);
  };
  
  const handleExportToPdf = (invoice: Invoice) => {
    try {
      exportInvoiceToPdf(invoice);
      toast.success('Invoice exported to PDF');
    } catch (error) {
      console.error('Error exporting invoice to PDF:', error);
      toast.error('Failed to export invoice to PDF');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500">Sent</Badge>;
      case 'unpaid':
        return <Badge className="bg-amber-500">Unpaid</Badge>;
      case 'draft':
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'unpaid':
        return <CircleDollarSign className="h-4 w-4 text-amber-500" />;
      case 'draft':
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Loading your invoices...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Your Invoices</CardTitle>
              <CardDescription>Manage your customer invoices</CardDescription>
            </div>
            <Button
              onClick={() => navigate('/dashboard/invoices/new')}
              className="mt-4 md:mt-0 bg-amber-400 text-gray-900 hover:bg-amber-500"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Create New Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">No invoices yet</h3>
              <p className="text-sm text-gray-400 mb-4">
                Create your first invoice to get started.
              </p>
              <Button
                onClick={() => navigate('/dashboard/invoices/new')}
                className="bg-amber-400 text-gray-900 hover:bg-amber-500"
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Create New Invoice
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map(invoice => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        #{invoice.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          {getStatusBadge(invoice.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{invoice.customerName}</span>
                          <span className="text-xs text-gray-500">{invoice.customerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(invoice.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">...</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExportToPdf(invoice)}>
                              <FileDown className="mr-2 h-4 w-4" />
                              Export PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditInvoice(invoice.id)}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => confirmDeleteInvoice(invoice.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this invoice. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceList;
