
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, FileText, Printer } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { Invoice, InvoiceItem } from '@/lib/types';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform the data to match our Invoice type
        if (data) {
          const transformedInvoices: Invoice[] = data.map(item => ({
            id: item.id,
            itineraryId: item.itinerary_id || undefined,
            customerName: item.customer_name,
            customerEmail: item.customer_email,
            date: item.date,
            dueDate: item.due_date,
            items: Array.isArray(item.items) ? item.items : JSON.parse(item.items as string) as InvoiceItem[],
            subtotal: item.subtotal,
            tax: item.tax,
            total: item.total,
            status: item.status as 'draft' | 'sent' | 'paid' | 'unpaid',
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_id: item.user_id
          }));
          
          setInvoices(transformedInvoices);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast.error('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unpaid':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Navigate to a detailed view of the invoice or open a modal
    navigate(`/dashboard/invoices/${invoice.id}`);
  };

  // Quick PDF generator for the invoice list view
  const generateQuickPDF = (invoice: Invoice) => {
    try {
      const doc = new jsPDF();
      
      // Define colors (simplified for quick generation)
      const amber600 = [217, 119, 6];
      const gray700 = [55, 65, 81];
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(amber600[0], amber600[1], amber600[2]);
      doc.text('Invoice', 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(gray700[0], gray700[1], gray700[2]);
      doc.text(`#INV-${invoice.id.substring(0, 8)}`, 20, 30);
      
      // Customer info
      doc.text('Bill To:', 20, 45);
      doc.text(invoice.customerName, 20, 55);
      doc.text(invoice.customerEmail, 20, 65);
      
      // Invoice details
      doc.text('Invoice Details:', 150, 45, { align: 'right' });
      doc.text(`Date: ${formatDate(invoice.date)}`, 150, 55, { align: 'right' });
      doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 150, 65, { align: 'right' });
      doc.text(`Status: ${invoice.status}`, 150, 75, { align: 'right' });
      
      // Items table header
      let y = 90;
      doc.setFontSize(14);
      doc.text('Items', 20, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.text('Description', 20, y);
      doc.text('Qty', 130, y, { align: 'right' });
      doc.text('Price', 160, y, { align: 'right' });
      doc.text('Total', 190, y, { align: 'right' });
      y += 5;
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);
      y += 10;
      
      // Items rows (simplified for quick PDF)
      invoice.items.forEach(item => {
        if (y > 250) {
          doc.addPage();
          y = 30;
        }
        
        const description = item.description.length > 60 
          ? item.description.substring(0, 57) + '...' 
          : item.description;
          
        doc.text(description, 20, y);
        doc.text(String(item.quantity), 130, y, { align: 'right' });
        doc.text(formatRupiah(item.unitPrice), 160, y, { align: 'right' });
        doc.text(formatRupiah(item.total), 190, y, { align: 'right' });
        y += 10;
      });
      
      // Totals
      y += 10;
      doc.text('Subtotal:', 150, y, { align: 'right' });
      doc.text(formatRupiah(invoice.subtotal), 190, y, { align: 'right' });
      y += 10;
      
      doc.text('Tax:', 150, y, { align: 'right' });
      doc.text(formatRupiah(invoice.tax), 190, y, { align: 'right' });
      y += 10;
      
      doc.setFontSize(12);
      doc.text('Total:', 150, y, { align: 'right' });
      doc.text(formatRupiah(invoice.total), 190, y, { align: 'right' });
      
      // Footer
      doc.setFontSize(10);
      doc.text('Thank you for your business!', 105, 280, { align: 'center' });
      
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
      return null;
    }
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const doc = generateQuickPDF(invoice);
    if (!doc) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoice.id.substring(0, 8)}</title>
          </head>
          <body>
            <iframe id="pdfFrame" style="width:100%;height:100vh;border:none;"></iframe>
            <script>
              const pdfData = "${doc.output('datauristring')}";
              document.getElementById('pdfFrame').src = pdfData;
              setTimeout(() => {
                window.print();
                window.close();
              }, 1000);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      toast.error('Failed to open print window. Please allow pop-ups.');
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const doc = generateQuickPDF(invoice);
    if (!doc) return;
    
    doc.save(`invoice-${invoice.id.substring(0, 8)}.pdf`);
    toast.success('Invoice downloaded');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-700 mb-4">Your Invoices</h2>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Yet</h3>
            <p className="text-gray-500 mb-4">You haven't created any invoices yet.</p>
            <Button 
              onClick={() => navigate('/dashboard/invoices')}
              className="bg-amber-400 text-gray-900 hover:bg-amber-500"
            >
              Create Your First Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="border border-gray-200 hover:border-amber-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Invoice #{invoice.id.substring(0, 8)}
                    </h3>
                    <div className="flex flex-wrap gap-3 items-center">
                      <p className="text-sm text-gray-500">
                        {formatDate(invoice.created_at || '')}
                      </p>
                      <Badge className={`${getStatusColor(invoice.status)} capitalize`}>
                        {invoice.status}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        {invoice.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 text-amber-700 border-amber-200 hover:bg-amber-50"
                      onClick={() => handleViewInvoice(invoice)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 text-amber-700 border-amber-200 hover:bg-amber-50"
                      onClick={() => handlePrintInvoice(invoice)}
                      title="Print"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 text-amber-700 border-amber-200 hover:bg-amber-50"
                      onClick={() => handleDownloadInvoice(invoice)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">Due: </span>
                    <span className="font-medium text-gray-700">{formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-amber-700">
                      {formatRupiah(invoice.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
