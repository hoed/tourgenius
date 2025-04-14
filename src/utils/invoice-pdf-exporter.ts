
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { Invoice, InvoiceItem } from '@/lib/types';

// Define colors for PDF
const COLORS = {
  PRIMARY: [59, 130, 246], // Blue
  SECONDARY: [249, 115, 22], // Orange
  TEXT_DARK: [33, 33, 33],
  TEXT_MEDIUM: [100, 100, 100],
  TEXT_LIGHT: [150, 150, 150],
  BACKGROUND: [255, 255, 255],
  TABLE_HEADER: [240, 249, 255], // Light blue
  TABLE_EVEN: [248, 250, 252], // Very light gray
  TABLE_ODD: [255, 255, 255],
  TABLE_BORDER: [226, 232, 240],
  SUCCESS: [16, 185, 129], // Green
  WARNING: [245, 158, 11], // Amber
  DANGER: [239, 68, 68], // Red
};

export const exportInvoiceToPdf = (invoice: Invoice) => {
  if (!invoice || !invoice.items || invoice.items.length === 0) {
    console.error('No invoice data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Invoice #${invoice.id.substring(0, 8)}`,
    subject: 'Invoice',
    author: 'TourGenius',
    creator: 'TourGenius'
  });

  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  // Add company logo/header area
  doc.setFillColor(240, 249, 255); // Light blue background
  doc.rect(margin, 15, contentWidth, 25, 'F');
  
  // Company name
  doc.setFontSize(20);
  doc.setTextColor(COLORS.PRIMARY[0], COLORS.PRIMARY[1], COLORS.PRIMARY[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('TourGenius', margin + 5, 30);
  
  // Small tagline
  doc.setFontSize(10);
  doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
  doc.setFont('helvetica', 'italic');
  doc.text('Your Tour Planning Expert', margin + 5, 36);
  
  // Invoice title and number
  doc.setFontSize(16);
  doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - margin - 40, 25);
  doc.setFontSize(11);
  doc.text(`#${invoice.id.substring(0, 8)}`, pageWidth - margin - 40, 32);
  
  // Status indicator
  const statusColors: Record<string, number[]> = {
    'paid': COLORS.SUCCESS,
    'sent': COLORS.PRIMARY,
    'unpaid': COLORS.WARNING,
    'draft': COLORS.TEXT_MEDIUM
  };
  
  const statusColor = statusColors[invoice.status] || COLORS.TEXT_MEDIUM;
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(pageWidth - margin - 30, 35, 30, 8, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(invoice.status.toUpperCase(), pageWidth - margin - 15, 40, { align: 'center' });
  
  // Add customer information
  let yPos = 55;
  
  doc.setFontSize(11);
  doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', margin, yPos);
  
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  doc.text(invoice.customerName, margin, yPos);
  yPos += 5;
  doc.text(invoice.customerEmail, margin, yPos);
  
  // Add invoice details
  yPos = 55;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details:', pageWidth - margin - 60, yPos);
  
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  doc.text(`Date: ${format(new Date(invoice.date), 'MMMM d, yyyy')}`, pageWidth - margin - 60, yPos);
  yPos += 5;
  doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'MMMM d, yyyy')}`, pageWidth - margin - 60, yPos);
  
  // Add a separator line
  yPos = 80;
  doc.setDrawColor(COLORS.TABLE_BORDER[0], COLORS.TABLE_BORDER[1], COLORS.TABLE_BORDER[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  // Table header
  yPos += 10;
  const colWidths = [contentWidth * 0.5, contentWidth * 0.15, contentWidth * 0.15, contentWidth * 0.2];
  
  // Table header with colored background
  doc.setFillColor(COLORS.TABLE_HEADER[0], COLORS.TABLE_HEADER[1], COLORS.TABLE_HEADER[2]);
  doc.rect(margin, yPos - 5, contentWidth, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
  
  let xPos = margin + 3;
  doc.text('Description', xPos, yPos);
  
  xPos += colWidths[0];
  doc.text('Quantity', xPos, yPos);
  
  xPos += colWidths[1];
  doc.text('Unit Price', xPos, yPos);
  
  xPos += colWidths[2];
  doc.text('Amount', xPos, yPos);
  
  yPos += 8;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Draw items
  invoice.items.forEach((item, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      
      // Reset yPos and add header on new page
      yPos = 20;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
      
      // Table header with colored background on new page
      doc.setFillColor(COLORS.TABLE_HEADER[0], COLORS.TABLE_HEADER[1], COLORS.TABLE_HEADER[2]);
      doc.rect(margin, yPos - 5, contentWidth, 10, 'F');
      
      let xPos = margin + 3;
      doc.text('Description', xPos, yPos);
      
      xPos += colWidths[0];
      doc.text('Quantity', xPos, yPos);
      
      xPos += colWidths[1];
      doc.text('Unit Price', xPos, yPos);
      
      xPos += colWidths[2];
      doc.text('Amount', xPos, yPos);
      
      yPos += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
    }
    
    // Alternate row background colors
    if (index % 2 === 0) {
      doc.setFillColor(COLORS.TABLE_EVEN[0], COLORS.TABLE_EVEN[1], COLORS.TABLE_EVEN[2]);
    } else {
      doc.setFillColor(COLORS.TABLE_ODD[0], COLORS.TABLE_ODD[1], COLORS.TABLE_ODD[2]);
    }
    doc.rect(margin, yPos - 5, contentWidth, 10, 'F');
    
    // Format the unit price and total as IDR
    const formattedUnitPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(item.unitPrice);
    
    const formattedTotal = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(item.total);
    
    // Description (with word wrapping if needed)
    doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
    const desc = item.description;
    
    if (desc.length > 60) {
      const firstLine = desc.substring(0, 60);
      const secondLine = desc.substring(60);
      
      doc.text(firstLine, margin + 3, yPos);
      yPos += 5;
      doc.text(secondLine, margin + 3, yPos);
      yPos += 5;
    } else {
      doc.text(desc, margin + 3, yPos);
      yPos += 10;
    }
    
    // Draw the other columns on the same horizontal line
    xPos = margin + colWidths[0] + 3;
    doc.text(item.quantity.toString(), xPos, yPos - (desc.length > 60 ? 5 : 0));
    
    xPos += colWidths[1];
    doc.text(formattedUnitPrice, xPos, yPos - (desc.length > 60 ? 5 : 0));
    
    xPos += colWidths[2];
    doc.text(formattedTotal, xPos, yPos - (desc.length > 60 ? 5 : 0));
  });
  
  // Draw summary section
  yPos += 10;
  
  // Draw a line
  doc.setDrawColor(COLORS.TABLE_BORDER[0], COLORS.TABLE_BORDER[1], COLORS.TABLE_BORDER[2]);
  doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);
  
  // Subtotal
  xPos = pageWidth - margin - colWidths[3];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Subtotal:', xPos, yPos);
  
  xPos = pageWidth - margin - 3;
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(invoice.subtotal), xPos, yPos, { align: 'right' });
  
  // Tax
  yPos += 7;
  xPos = pageWidth - margin - colWidths[3];
  doc.setFont('helvetica', 'bold');
  doc.text('Tax:', xPos, yPos);
  
  xPos = pageWidth - margin - 3;
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(invoice.tax), xPos, yPos, { align: 'right' });
  
  // Total
  yPos += 10;
  
  // Total background
  doc.setFillColor(COLORS.PRIMARY[0], COLORS.PRIMARY[1], COLORS.PRIMARY[2], 0.1);
  doc.rect(pageWidth - margin - colWidths[3] - 10, yPos - 5, colWidths[3] + 10, 10, 'F');
  
  xPos = pageWidth - margin - colWidths[3];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.PRIMARY[0], COLORS.PRIMARY[1], COLORS.PRIMARY[2]);
  doc.text('TOTAL:', xPos, yPos);
  
  xPos = pageWidth - margin - 3;
  doc.text(formatCurrency(invoice.total), xPos, yPos, { align: 'right' });
  
  // Payment information and thank you message
  yPos += 20;
  doc.setFontSize(10);
  doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Information:', margin, yPos);
  
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  doc.text('Bank: TourGenius Bank', margin, yPos);
  yPos += 5;
  doc.text('Account: 12345-6789-0000', margin, yPos);
  yPos += 5;
  doc.text('Reference: INV-' + invoice.id.substring(0, 8), margin, yPos);
  
  // Thank you message
  yPos += 15;
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
  doc.text('Thank you for your business!', margin, yPos);
  
  // Add footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.TEXT_LIGHT[0], COLORS.TEXT_LIGHT[1], COLORS.TEXT_LIGHT[2]);
  doc.text(
    'Generated by TourGenius on ' + format(new Date(), 'MMMM d, yyyy'),
    pageWidth / 2,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
  
  // Save the PDF
  doc.save(`Invoice_${invoice.id.substring(0, 8)}.pdf`);
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
