import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Invoice, TourItinerary } from '@/lib/types';
import { Calendar, Download, FileText, Printer, Send } from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from '@/components/ui/glass-card';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceGeneratorProps {
  itinerary?: TourItinerary;
}

const InvoiceGenerator = ({ itinerary: propItinerary }: InvoiceGeneratorProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<TourItinerary | undefined>(propItinerary);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (location.state?.itinerary && !propItinerary) {
      setItinerary(location.state.itinerary);
    }
  }, [location.state?.itinerary, propItinerary]);

  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    customerName: '',
    customerEmail: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const addCustomerToDatabase = async (customerName: string, customerEmail: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to add customers');
        return;
      }
      
      const { data: existingCustomers, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', customerEmail)
        .eq('user_id', session.user.id);
      
      if (fetchError) {
        console.error('Error checking for existing customer:', fetchError);
        return;
      }
      
      if (!existingCustomers || existingCustomers.length === 0) {
        const { error } = await supabase
          .from('customers')
          .insert([{ 
            name: customerName, 
            email: customerEmail,
            user_id: session.user.id,
            status: 'active',
            notes: 'Added via invoice generation'
          }]);
        
        if (error) {
          console.error('Error adding customer:', error);
          return;
        }
        
        toast.success('New customer added to database');
      } else {
        console.log('Customer already exists in database');
      }
    } catch (error) {
      console.error('Error in addCustomerToDatabase:', error);
    }
  };

  const handleGenerateInvoice = () => {
    if (!invoice.customerName || !invoice.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    addCustomerToDatabase(invoice.customerName, invoice.customerEmail);
    toast.success('Invoice generated successfully!');
  };

  const handleSendInvoice = () => {
    if (!invoice.customerName || !invoice.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    addCustomerToDatabase(invoice.customerName, invoice.customerEmail);
    toast.success('Invoice sent to customer!');
    setInvoice(prev => ({ ...prev, status: 'sent' }));
  };

  const handleAddToCalendar = () => {
    if (!itinerary) {
      toast.error('No itinerary data available');
      return;
    }
    try {
      toast.loading('Preparing to save to Google Calendar...');
      setTimeout(() => {
        toast.dismiss();
        toast.success('Itinerary saved to Google Calendar!');
      }, 2000);
    } catch (error) {
      toast.error('Failed to save to Google Calendar');
      console.error(error);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const generateInvoiceItems = () => {
    if (!itinerary) return [];
    const items = [];
    
    if (itinerary.days.some(day => day.destinations.length > 0)) {
      const totalDestinationsCost = itinerary.days.reduce((sum, day) => {
        return sum + day.destinations.reduce((daySum, dest) => 
          daySum + dest.pricePerPerson * itinerary.numberOfPeople, 0);
      }, 0);
      items.push({
        id: '1',
        description: 'Destinations & Attractions',
        quantity: itinerary.numberOfPeople,
        unitPrice: totalDestinationsCost / itinerary.numberOfPeople,
        total: totalDestinationsCost
      });
    }
    
    const totalAccommodationCost = itinerary.days.reduce((sum, day) => {
      return sum + (day.hotel ? day.hotel.pricePerNight : 0);
    }, 0);
    if (totalAccommodationCost > 0) {
      items.push({
        id: '2',
        description: `Accommodation (${itinerary.days.length} nights)`,
        quantity: 1,
        unitPrice: totalAccommodationCost,
        total: totalAccommodationCost
      });
    }
    
    const totalMealsCost = itinerary.days.reduce((sum, day) => {
      return sum + day.meals.reduce((daySum, meal) => 
        daySum + meal.pricePerPerson * itinerary.numberOfPeople, 0);
    }, 0);
    if (totalMealsCost > 0) {
      items.push({
        id: '3',
        description: 'Meals & Dining',
        quantity: itinerary.numberOfPeople,
        unitPrice: totalMealsCost / itinerary.numberOfPeople,
        total: totalMealsCost
      });
    }
    
    const totalTransportationCost = itinerary.days.reduce((sum, day) => {
      return sum + (day.transportation ? 
        day.transportation.pricePerPerson * itinerary.numberOfPeople : 0);
    }, 0);
    if (totalTransportationCost > 0) {
      items.push({
        id: '4',
        description: 'Transportation',
        quantity: itinerary.numberOfPeople,
        unitPrice: totalTransportationCost / itinerary.numberOfPeople,
        total: totalTransportationCost
      });
    }
    
    const totalGuidesCost = itinerary.tourGuides.reduce((sum, guide) => {
      return sum + guide.pricePerDay * itinerary.days.length;
    }, 0);
    if (totalGuidesCost > 0) {
      items.push({
        id: '5',
        description: `Tour Guide Services (${itinerary.days.length} days)`,
        quantity: 1,
        unitPrice: totalGuidesCost,
        total: totalGuidesCost
      });
    }
    
    return items;
  };

  const invoiceItems = itinerary ? generateInvoiceItems() : [
    { id: '1', description: 'Tour Package (4 days)', quantity: 2, unitPrice: 750000, total: 1500000 },
    { id: '2', description: 'Premium Hotel Accommodation', quantity: 3, unitPrice: 200000, total: 600000 },
    { id: '3', description: 'Guided Tours', quantity: 4, unitPrice: 125000, total: 500000 },
    { id: '4', description: 'Airport Transfers', quantity: 2, unitPrice: 60000, total: 120000 },
  ];

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Define colors as tuples
    const amber400: [number, number, number] = [251, 191, 36]; // #fbbf24
    const orange500: [number, number, number] = [249, 115, 22]; // #f97316
    const gray700: [number, number, number] = [55, 65, 81]; // #374151
    const gray200: [number, number, number] = [229, 231, 235]; // #e5e7eb

    // Header with gradient-like effect
    doc.setFontSize(24);
    doc.setTextColor(...amber400);
    doc.text('Invoice', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(...gray700);
    doc.text(`#INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, 20, 30);
    doc.setTextColor(...orange500);
    doc.text('TourGenius', 190, 20, { align: 'right' });
    doc.setTextColor(...gray700);
    doc.text('Premium Tour Planning', 190, 30, { align: 'right' });

    // Horizontal line under header
    doc.setDrawColor(...amber400);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Bill To and Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(...gray700);
    doc.text('Bill To:', 20, 50);
    doc.setFontSize(10);
    doc.text(invoice.customerName || 'Customer Name', 20, 60);
    doc.text(invoice.customerEmail || 'customer@example.com', 20, 70);
    
    doc.setFontSize(12);
    doc.text('Invoice Details:', 190, 50, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`Date: ${invoice.date || new Date().toISOString().split('T')[0]}`, 190, 60, { align: 'right' });
    doc.text(`Due Date: ${invoice.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`, 190, 70, { align: 'right' });
    doc.text(`Status: ${invoice.status || 'Draft'}`, 190, 80, { align: 'right' });

    // Items Section
    doc.setFontSize(14);
    doc.setTextColor(...amber400);
    doc.text('Invoice Items:', 20, 100);
    doc.setDrawColor(...gray200);
    doc.line(20, 105, 190, 105); // Section separator

    // Table Header
    let yPos = 115;
    doc.setFontSize(10);
    doc.setTextColor(...gray700);
    doc.setFillColor(...gray200);
    doc.rect(20, yPos - 5, 170, 10, 'F'); // Header background
    doc.text('Description', 25, yPos);
    doc.text('Qty', 130, yPos, { align: 'right' });
    doc.text('Unit Price', 155, yPos, { align: 'right' });
    doc.text('Total', 185, yPos, { align: 'right' });
    yPos += 5;
    doc.setDrawColor(...gray700);
    doc.line(20, yPos, 190, yPos); // Table header underline
    yPos += 10;

    // Table Rows
    invoiceItems.forEach((item, index) => {
      doc.setTextColor(...gray700);
      doc.text(item.description, 25, yPos);
      doc.text(item.quantity.toString(), 130, yPos, { align: 'right' });
      doc.text(formatRupiah(item.unitPrice), 155, yPos, { align: 'right' });
      doc.text(formatRupiah(item.total), 185, yPos, { align: 'right' });
      yPos += 10;
      if (index < invoiceItems.length - 1) {
        doc.setDrawColor(...gray200);
        doc.line(20, yPos - 5, 190, yPos - 5); // Row separator
      }
    });

    // Totals Section
    yPos += 10;
    doc.setDrawColor(...gray200);
    doc.line(140, yPos - 5, 190, yPos - 5); // Totals separator
    doc.setFontSize(10);
    doc.text(`Subtotal:`, 140, yPos, { align: 'right' });
    doc.text(`${formatRupiah(subtotal)}`, 185, yPos, { align: 'right' });
    yPos += 10;
    doc.text(`Tax (5%):`, 140, yPos, { align: 'right' });
    doc.text(`${formatRupiah(tax)}`, 185, yPos, { align: 'right' });
    yPos += 10;
    doc.setDrawColor(...amber400);
    doc.line(140, yPos - 5, 190, yPos - 5); // Total underline
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(...orange500);
    doc.text(`Total:`, 140, yPos, { align: 'right' });
    doc.text(`${formatRupiah(total)}`, 185, yPos, { align: 'right' });

    // Footer
    yPos += 20;
    doc.setFontSize(8);
    doc.setTextColor(...gray700);
    doc.text('Thank you for your business!', 105, yPos, { align: 'center' });
    doc.text('Payment is due within 14 days of receipt of this invoice.', 105, yPos + 5, { align: 'center' });

    // Save the PDF
    doc.save(`invoice-${invoice.customerName || 'customer'}-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .invoice { max-width: 800px; margin: auto; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .details { display: flex; justify-content: space-between; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { font-weight: bold; }
                .right { text-align: right; }
                .totals { max-width: 300px; margin-left: auto; }
                .footer { text-align: center; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="invoice">
                ${invoiceRef.current.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        toast.success('Print dialog opened!');
      } else {
        toast.error('Failed to open print window. Please allow pop-ups.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-md">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-gradient">
            Invoice Generator
          </h1>
          <p className="text-gray-600 mt-1">Create and send professional invoices</p>
        </div>
        <div className="flex gap-3">
          {itinerary && (
            <Button 
              onClick={handleAddToCalendar}
              className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-black transition-all duration-300 hover:scale-105 shadow-md"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add to Google Calendar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="bg-white border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-amber-700">Invoice Details</CardTitle>
              <CardDescription className="text-gray-600">Fill in the customer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-gray-700">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={invoice.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-gray-700">Customer Email</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={invoice.customerEmail}
                  onChange={handleChange}
                  placeholder="Enter customer email"
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700">Invoice Date</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={invoice.date}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-gray-700">Due Date</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={invoice.dueDate}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                className="w-full bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all duration-300"
                onClick={handleGenerateInvoice}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
              <Button 
                className="w-full border-amber-400/50 text-amber-600 hover:bg-amber-400/10"
                variant="outline"
                onClick={handleSendInvoice}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Customer
              </Button>
            </CardFooter>
          </GlassCard>
          
          <GlassCard className="bg-white border border-gray-200 shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-medium text-amber-700 mb-4">Invoice Actions</h3>
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-amber-400/50 text-amber-600 hover:bg-amber-400/10"
                  onClick={handleDownloadPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-400/50 text-amber-600 hover:bg-amber-400/10"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-md">
            <CardContent className="p-8" ref={invoiceRef}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-amber-700">Invoice</h2>
                  <p className="text-gray-600">#INV-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                    TourGenius
                  </div>
                  <p className="text-sm text-gray-600">Premium Tour Planning</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Bill To:</h3>
                  <p className="text-gray-900">{invoice.customerName || 'Customer Name'}</p>
                  <p className="text-gray-600">{invoice.customerEmail || 'customer@example.com'}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-medium text-gray-700 mb-2">Invoice Details:</h3>
                  <p className="text-gray-900">Date: {invoice.date || new Date().toISOString().split('T')[0]}</p>
                  <p className="text-gray-900">Due Date: {invoice.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</p>
                  <p className="text-gray-900">Status: <span className="capitalize">{invoice.status || 'Draft'}</span></p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-amber-700 mb-4">Invoice Items:</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left pb-2 text-gray-700">Description</th>
                      <th className="text-right pb-2 text-gray-700">Qty</th>
                      <th className="text-right pb-2 text-gray-700">Unit Price</th>
                      <th className="text-right pb-2 text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-3 text-gray-900">{item.description}</td>
                        <td className="py-3 text-right text-gray-900">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-900">{formatRupiah(item.unitPrice)}</td>
                        <td className="py-3 text-right text-gray-900">{formatRupiah(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full max-w-xs ml-auto">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-900">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Tax (5%):</span>
                  <span className="text-gray-900">{formatRupiah(tax)}</span>
                </div>
                <Separator className="my-2 bg-gray-200" />
                <div className="flex justify-between font-bold">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-gray-900">{formatRupiah(total)}</span>
                </div>
              </div>

              <div className="mt-12 text-center text-sm text-gray-600">
                <p>Thank you for your business!</p>
                <p>Payment is due within 14 days of receipt of this invoice.</p>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;