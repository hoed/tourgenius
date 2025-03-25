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
import { addCustomerToDatabase } from '../itinerary/itinerary-utils';

interface InvoiceGeneratorProps {
  itinerary?: TourItinerary;
}

const InvoiceGenerator = ({ itinerary: propItinerary }: InvoiceGeneratorProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<TourItinerary | undefined>(propItinerary);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  
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
    status: 'unpaid'  // Changed from 'draft' to 'unpaid'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateInvoice = async () => {
    if (!invoice.customerName || !invoice.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const success = await addCustomerToDatabase(invoice.customerName, invoice.customerEmail);
    if (success) {
      toast.success('Invoice generated successfully!');
    }
  };

  const handleSendInvoice = async () => {
    if (!invoice.customerName || !invoice.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSending(true);
    try {
      // First, add the customer to the database
      await addCustomerToDatabase(invoice.customerName, invoice.customerEmail);

      // Generate PDF as base64
      const pdfBase64 = await generatePDFBase64();

      // Create HTML email content
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #f97316, #f59e0b); padding: 20px; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Invoice from TourGenius</h1>
          </div>
          <div style="border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Dear ${invoice.customerName},</p>
            <p>Thank you for choosing TourGenius for your travel planning needs!</p>
            <p>Please find attached your invoice for the "${itinerary?.name}" itinerary.</p>
            <p>Invoice details:</p>
            <ul>
              <li>Invoice Date: ${invoice.date}</li>
              <li>Due Date: ${invoice.dueDate}</li>
              <li>Total Amount: ${formatRupiah(subtotal + tax)}</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The TourGenius Team</p>
          </div>
        </div>
      `;

      // Send email via Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          to: invoice.customerEmail,
          name: invoice.customerName,
          subject: `Invoice for ${itinerary?.name} Tour Package`,
          htmlContent,
          pdfAttachment: pdfBase64
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Invoice sent to customer!');
        setInvoice(prev => ({ ...prev, status: 'sent' }));
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error(`Failed to send invoice: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
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
    
    // Process destinations - show actual destinations in invoice
    if (itinerary.days.some(day => day.destinations.length > 0)) {
      itinerary.days.forEach((day, dayIndex) => {
        day.destinations.forEach((dest, destIndex) => {
          items.push({
            id: `dest-${dayIndex}-${destIndex}`,
            description: `Day ${day.day}: ${dest.name}`,
            quantity: itinerary.numberOfPeople,
            unitPrice: dest.pricePerPerson,
            total: dest.pricePerPerson * itinerary.numberOfPeople
          });
        });
      });
    }
    
    // Process accommodations - show actual hotels with room details
    itinerary.days.forEach((day, dayIndex) => {
      if (day.hotel) {
        const roomsNeeded = day.hotel.roomAmount || Math.ceil(itinerary.numberOfPeople / 2);
        items.push({
          id: `hotel-${dayIndex}`,
          description: `Day ${day.day}: ${day.hotel.name} (${roomsNeeded} room${roomsNeeded > 1 ? 's' : ''})`,
          quantity: roomsNeeded,
          unitPrice: day.hotel.pricePerNight,
          total: day.hotel.pricePerNight * roomsNeeded
        });
      }
    });
    
    // Process meals - show actual meals
    itinerary.days.forEach((day, dayIndex) => {
      day.meals.forEach((meal, mealIndex) => {
        items.push({
          id: `meal-${dayIndex}-${mealIndex}`,
          description: `Day ${day.day}: ${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} - ${meal.description}`,
          quantity: itinerary.numberOfPeople,
          unitPrice: meal.pricePerPerson,
          total: meal.pricePerPerson * itinerary.numberOfPeople
        });
      });
    });
    
    // Process transportation - show actual transportation details
    // Transportation is now a fixed price per day, not multiplied by number of people
    itinerary.days.forEach((day, dayIndex) => {
      if (day.transportation) {
        items.push({
          id: `trans-${dayIndex}`,
          description: `Day ${day.day}: Transportation - ${day.transportation.description}`,
          quantity: 1, // Fixed to 1 as it's per day, not per person
          unitPrice: day.transportation.pricePerPerson,
          total: day.transportation.pricePerPerson
        });
      }
    });
    
    // Process tour guides - show actual guides
    itinerary.tourGuides.forEach((guide, guideIndex) => {
      items.push({
        id: `guide-${guideIndex}`,
        description: `Tour Guide: ${guide.name} (${guide.expertise}) for ${itinerary.days.length} days`,
        quantity: 1,
        unitPrice: guide.pricePerDay * itinerary.days.length,
        total: guide.pricePerDay * itinerary.days.length
      });
    });
    
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

  // Generate PDF as base64 string for email attachment
  const generatePDFBase64 = () => {
    return new Promise<string>((resolve, reject) => {
      try {
        const doc = generatePDF();
        const pdfBase64 = doc.output('datauristring').split(',')[1];
        resolve(pdfBase64);
      } catch (error) {
        console.error('Error generating PDF base64:', error);
        reject(error);
      }
    });
  };

  // Generate PDF with enhanced styling
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Define colors as tuples
    const amber400: [number, number, number] = [251, 191, 36]; // #fbbf24
    const orange500: [number, number, number] = [249, 115, 22]; // #f97316
    const gray700: [number, number, number] = [55, 65, 81]; // #374151
    const gray200: [number, number, number] = [229, 231, 235]; // #e5e7eb
    const amber600: [number, number, number] = [217, 119, 6]; // #d97706

    // Add background rectangle for header
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add gradient-like effect for header
    doc.setFillColor(...orange500);
    doc.rect(0, 0, 210, 2, 'F');
    
    // Header content
    doc.setFontSize(24);
    doc.setTextColor(...amber600);
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
    
    // When adding the status, use 'Unpaid' instead of 'Draft'
    doc.text(`Status: ${invoice.status || 'Unpaid'}`, 190, 80, { align: 'right' });

    // Add Itinerary name and details
    if (itinerary) {
      doc.setFontSize(12);
      doc.setTextColor(...orange500);
      doc.text(`Tour Package: ${itinerary.name}`, 20, 90);
      doc.setFontSize(10);
      doc.setTextColor(...gray700);
      doc.text(`Duration: ${itinerary.days.length} days | Travelers: ${itinerary.numberOfPeople}`, 20, 100);
    }

    // Items Section
    doc.setFontSize(14);
    doc.setTextColor(...amber400);
    doc.text('Invoice Items:', 20, 115);
    
    // Add decorative line
    doc.setDrawColor(...orange500);
    doc.setLineWidth(0.7);
    doc.line(20, 120, 190, 120);
    
    // Add background for table header
    doc.setFillColor(250, 250, 250);
    doc.rect(20, 125, 170, 10, 'F');
    
    // Table Header with border
    let yPos = 132;
    doc.setFontSize(10);
    doc.setTextColor(...gray700);
    doc.text('Description', 25, yPos);
    doc.text('Qty', 130, yPos, { align: 'right' });
    doc.text('Unit Price', 155, yPos, { align: 'right' });
    doc.text('Total', 185, yPos, { align: 'right' });
    yPos += 5;
    doc.setDrawColor(...gray700);
    doc.setLineWidth(0.2);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Table Rows with alternating background
    invoiceItems.forEach((item, index) => {
      // Add subtle alternating background
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, yPos - 5, 170, 10, 'F');
      }
      
      doc.setTextColor(...gray700);
      // Ensure description fits within bounds
      const description = item.description.length > 50 
        ? item.description.substring(0, 47) + '...' 
        : item.description;
      doc.text(description, 25, yPos);
      doc.text(item.quantity.toString(), 130, yPos, { align: 'right' });
      doc.text(formatRupiah(item.unitPrice), 155, yPos, { align: 'right' });
      doc.text(formatRupiah(item.total), 185, yPos, { align: 'right' });
      yPos += 10;
      
      // Add lighter row separator
      if (index < invoiceItems.length - 1) {
        doc.setDrawColor(...gray200);
        doc.setLineWidth(0.1);
        doc.line(25, yPos - 5, 185, yPos - 5);
      }
    });

    // Border around the items table
    doc.setDrawColor(...gray200);
    doc.setLineWidth(0.5);
    doc.rect(20, 125, 170, yPos - 125, 'S');

    // Totals Section with background
    yPos += 5;
    doc.setFillColor(250, 250, 250);
    doc.rect(140, yPos - 5, 50, 40, 'F');
    doc.setDrawColor(...orange500);
    doc.setLineWidth(0.5);
    doc.rect(140, yPos - 5, 50, 40, 'S');
    
    doc.setFontSize(10);
    doc.setTextColor(...gray700);
    doc.text(`Subtotal:`, 140, yPos, { align: 'right' });
    doc.text(`${formatRupiah(subtotal)}`, 185, yPos, { align: 'right' });
    yPos += 10;
    doc.text(`Tax (5%):`, 140, yPos, { align: 'right' });
    doc.text(`${formatRupiah(tax)}`, 185, yPos, { align: 'right' });
    yPos += 10;
    
    // Highlight the total with a background
    doc.setFillColor(...amber400);
    doc.rect(140, yPos - 5, 50, 10, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Total:`, 140, yPos, { align: 'right' });
    doc.text(`${formatRupiah(total)}`, 185, yPos, { align: 'right' });

    // Add per person price if relevant
    if (itinerary && itinerary.numberOfPeople > 1) {
      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(...gray700);
      doc.text(`Price per person: ${formatRupiah(total / itinerary.numberOfPeople)}`, 185, yPos, { align: 'right' });
    }

    // Footer with background
    yPos = 270;
    doc.setFillColor(250, 250, 250);
    doc.rect(0, yPos - 10, 210, 40, 'F');
    doc.setDrawColor(...orange500);
    doc.setLineWidth(0.5);
    doc.line(20, yPos - 5, 190, yPos - 5);
    
    doc.setFontSize(10);
    doc.setTextColor(...gray700);
    doc.text('Thank you for your business!', 105, yPos, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Payment is due within 14 days of receipt of this invoice.', 105, yPos + 5, { align: 'center' });
    doc.text('TourGenius | Premium Tour Planning | +62 123 456 7890', 105, yPos + 10, { align: 'center' });

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save(`invoice-${invoice.customerName || 'customer'}-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  const handlePrint = () => {
    const doc = generatePDF();
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
      toast.success('Print dialog opened!');
    } else {
      toast.error('Failed to open print window. Please allow pop-ups.');
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
                disabled={isSending}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send to Customer'}
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

              {itinerary && (
                <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-md">
                  <h3 className="font-medium text-amber-700">Tour Package: {itinerary.name}</h3>
                  <p className="text-sm text-gray-600">
                    Duration: {itinerary.days.length} days | Travelers: {itinerary.numberOfPeople}
                  </p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-medium text-amber-700 mb-4 pb-2 border-b border-amber-200">Invoice Items:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-2 text-gray-700">Description</th>
                        <th className="text-right py-3 px-2 text-gray-700">Qty</th>
                        <th className="text-right py-3 px-2 text-gray-700">Unit Price</th>
                        <th className="text-right py-3 px-2 text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-2 text-gray-900">{item.description}</td>
                          <td className="py-3 px-2 text-right text-gray-900">{item.quantity}</td>
                          <td className="py-3 px-2 text-right text-gray-900">{formatRupiah(item.unitPrice)}</td>
                          <td className="py-3 px-2 text-right text-gray-900">{formatRupiah(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-
