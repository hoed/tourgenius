
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/layout';
import InvoiceGenerator from '@/components/dashboard/invoices/invoice-generator';
import InvoiceList from '@/components/dashboard/invoices/invoice-list';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle, FileText, FileDown, FileEdit, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Invoice } from '@/lib/types';

const InvoicesPage = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [invoiceSource, setInvoiceSource] = useState<'manual' | 'itinerary'>('manual');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editInvoiceId = searchParams.get('edit');
    
    // If edit parameter is present, load the invoice for editing
    if (editInvoiceId) {
      fetchInvoiceForEditing(editInvoiceId);
    }
  }, [location]);
  
  const fetchInvoiceForEditing = async (invoiceId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Parse items if needed
        let parsedItems = [];
        if (typeof data.items === 'string') {
          try {
            parsedItems = JSON.parse(data.items);
          } catch (e) {
            console.error('Error parsing invoice items:', e);
            parsedItems = [];
          }
        } else {
          parsedItems = data.items;
        }
        
        const invoice: Invoice = {
          id: data.id,
          itineraryId: data.itinerary_id,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          date: data.date,
          dueDate: data.due_date,
          items: parsedItems,
          subtotal: data.subtotal,
          tax: data.tax,
          total: data.total,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          user_id: data.user_id
        };
        
        setEditingInvoice(invoice);
        setShowGenerator(true);
        
        // Set the correct source tab based on whether the invoice has an itinerary_id
        setInvoiceSource(data.itinerary_id ? 'itinerary' : 'manual');
      }
    } catch (error) {
      console.error('Error fetching invoice for editing:', error);
      toast.error('Failed to load invoice for editing');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelEditing = () => {
    // Clear editing state and navigate back to invoice list
    setEditingInvoice(null);
    setShowGenerator(false);
    // Remove the edit parameter from URL
    navigate('/dashboard/invoices');
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-md">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-gradient">
              {editingInvoice ? 'Edit Invoice' : 'Invoices Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {editingInvoice 
                ? `Editing Invoice #${editingInvoice.id.substring(0, 8)}`
                : 'Create, manage and track your invoices'}
            </p>
          </div>
          {editingInvoice ? (
            <Button 
              onClick={handleCancelEditing}
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
          ) : (
            <Button 
              onClick={() => setShowGenerator(!showGenerator)}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-gray-900 transition-all duration-300 hover:scale-105 shadow-md"
            >
              {showGenerator ? (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoices
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Invoice
                </>
              )}
            </Button>
          )}
        </div>

        {(showGenerator || editingInvoice) ? (
          <div className="space-y-6">
            <Tabs
              defaultValue="manual"
              value={invoiceSource}
              onValueChange={(value) => setInvoiceSource(value as 'manual' | 'itinerary')}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <FileEdit className="h-4 w-4" />
                  <span>Manual Input</span>
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  <span>From Itinerary</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <InvoiceGenerator source="manual" existingInvoice={editingInvoice} />
              </TabsContent>
              <TabsContent value="itinerary">
                <InvoiceGenerator source="itinerary" existingInvoice={editingInvoice} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <InvoiceList />
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvoicesPage;
