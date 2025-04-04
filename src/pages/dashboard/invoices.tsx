
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/layout';
import InvoiceGenerator from '@/components/dashboard/invoices/invoice-generator';
import InvoiceList from '@/components/dashboard/invoices/invoice-list';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';

const InvoicesPage = () => {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-md">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-gradient">
              Invoices Management
            </h1>
            <p className="text-gray-600 mt-1">Create, manage and track your invoices</p>
          </div>
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
        </div>

        {showGenerator ? (
          <InvoiceGenerator />
        ) : (
          <InvoiceList />
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvoicesPage;
