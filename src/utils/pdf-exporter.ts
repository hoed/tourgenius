
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { TourItinerary, DayItinerary } from '@/lib/types';

// Define colors for PDF
const COLORS = {
  PRIMARY: [250, 173, 20], // Amber
  SECONDARY: [236, 72, 153], // Pink
  TEXT_DARK: [33, 33, 33],
  TEXT_MEDIUM: [100, 100, 100],
  TEXT_LIGHT: [150, 150, 150],
  BACKGROUND: [255, 255, 255],
  TABLE_HEADER: [245, 245, 245],
  TABLE_BORDER: [220, 220, 220],
  HIGHLIGHT: [249, 168, 212] // Pink lighter
};

export const exportItineraryToPdf = (itinerary: TourItinerary) => {
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    console.error('No itinerary data to export');
    return;
  }

  const doc = new jsPDF();
  const startDate = itinerary.start_date ? new Date(itinerary.start_date) : new Date();
  
  // Set document properties
  doc.setProperties({
    title: `${itinerary.name} - Itinerary`,
    subject: 'Travel Itinerary',
    author: 'TourGenius',
    creator: 'TourGenius'
  });
  
  // Add title with color
  doc.setFontSize(24);
  doc.setTextColor(COLORS.PRIMARY[0], COLORS.PRIMARY[1], COLORS.PRIMARY[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(itinerary.name, 105, 20, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`Travel Itinerary for ${itinerary.numberOfPeople} person(s)`, 105, 30, { align: 'center' });
  doc.text(`Starting on ${format(startDate, 'MMMM d, yyyy')}`, 105, 37, { align: 'center' });
  
  // Add a decorative line
  doc.setDrawColor(COLORS.PRIMARY[0], COLORS.PRIMARY[1], COLORS.PRIMARY[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);
  
  // Set font for content
  doc.setFontSize(11);
  doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
  
  let yPosition = 50;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  // Generate itinerary for each day
  itinerary.days.forEach((day, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Day header with colored background
    doc.setFillColor(COLORS.PRIMARY[0], COLORS.PRIMARY[1], COLORS.PRIMARY[2], 0.1); // Light amber background
    doc.rect(margin, yPosition - 6, contentWidth, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(COLORS.PRIMARY[0], COLORS.PRIMARY[1], COLORS.PRIMARY[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Day ${day.day}`, margin + 5, yPosition);
    yPosition += 10;
    
    // Draw day content
    doc.setFont('helvetica', 'normal');
    yPosition = drawDayContent(doc, day, yPosition, margin, contentWidth);
    
    // Add a little space between days
    yPosition += 8;
    
    // Add a separator line between days (except after the last day)
    if (index < itinerary.days.length - 1) {
      doc.setDrawColor(COLORS.TABLE_BORDER[0], COLORS.TABLE_BORDER[1], COLORS.TABLE_BORDER[2]);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(margin, yPosition - 4, pageWidth - margin, yPosition - 4);
      doc.setLineDashPattern([], 0);
    }
  });
  
  // Add tour guides if any, with phone numbers included
  if (itinerary.tourGuides && itinerary.tourGuides.length > 0) {
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFillColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2], 0.1); // Light pink background
    doc.rect(margin, yPosition - 6, contentWidth, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Tour Guides', margin + 5, yPosition);
    yPosition += 10;
    
    // Create a table-like structure for tour guides
    const colWidths = [contentWidth * 0.3, contentWidth * 0.3, contentWidth * 0.4];
    const rowHeight = 12;
    
    // Table header
    doc.setFillColor(COLORS.TABLE_HEADER[0], COLORS.TABLE_HEADER[1], COLORS.TABLE_HEADER[2]);
    doc.rect(margin, yPosition - 6, contentWidth, rowHeight, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
    
    let xPos = margin + 3;
    doc.text('Name', xPos, yPosition);
    xPos += colWidths[0];
    doc.text('Expertise', xPos, yPosition);
    xPos += colWidths[1];
    doc.text('Contact & Languages', xPos, yPosition);
    
    yPosition += rowHeight;
    
    // Draw borders for header
    doc.setDrawColor(COLORS.TABLE_BORDER[0], COLORS.TABLE_BORDER[1], COLORS.TABLE_BORDER[2]);
    doc.rect(margin, yPosition - 18, contentWidth, rowHeight, 'S');
    doc.line(margin + colWidths[0], yPosition - 18, margin + colWidths[0], yPosition - 6);
    doc.line(margin + colWidths[0] + colWidths[1], yPosition - 18, margin + colWidths[0] + colWidths[1], yPosition - 6);
    
    // Table rows
    itinerary.tourGuides.forEach((guide, i) => {
      // Alternate row background color
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 6, contentWidth, rowHeight, 'F');
      }
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
      
      xPos = margin + 3;
      doc.text(guide.name, xPos, yPosition);
      
      xPos += colWidths[0];
      doc.text(guide.expertise, xPos, yPosition);
      
      xPos += colWidths[1];
      let contactInfo = guide.phoneNumber ? `Phone: ${guide.phoneNumber}` : '';
      doc.text(contactInfo, xPos, yPosition);
      
      if (guide.languages && guide.languages.length > 0) {
        yPosition += 5;
        doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
        doc.text(`Languages: ${guide.languages.join(', ')}`, xPos, yPosition);
      }
      
      // Draw borders for rows
      doc.setDrawColor(COLORS.TABLE_BORDER[0], COLORS.TABLE_BORDER[1], COLORS.TABLE_BORDER[2]);
      doc.rect(margin, yPosition - (guide.languages?.length > 0 ? 11 : 6), contentWidth, guide.languages?.length > 0 ? rowHeight + 5 : rowHeight, 'S');
      doc.line(margin + colWidths[0], yPosition - (guide.languages?.length > 0 ? 11 : 6), margin + colWidths[0], yPosition + (guide.languages?.length > 0 ? -1 : 6));
      doc.line(margin + colWidths[0] + colWidths[1], yPosition - (guide.languages?.length > 0 ? 11 : 6), margin + colWidths[0] + colWidths[1], yPosition + (guide.languages?.length > 0 ? -1 : 6));
      
      yPosition += 7;
    });
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.TEXT_LIGHT[0], COLORS.TEXT_LIGHT[1], COLORS.TEXT_LIGHT[2]);
    doc.text(
      `Generated by TourGenius on ${format(new Date(), 'MMMM d, yyyy')}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });
  }
  
  // Save the PDF
  doc.save(`${itinerary.name.replace(/\s+/g, '_')}_itinerary.pdf`);
};

// Function to draw a day's content
const drawDayContent = (doc: jsPDF, day: DayItinerary, yPosition: number, margin: number, contentWidth: number): number => {
  const textX = margin + 15; // Indentation for text
  const timeX = margin + 5; // Position for time
  
  // Destinations
  if (day.destinations && day.destinations.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Destinations:', margin, yPosition);
    yPosition += 6;
    
    // Create a table-like structure for destinations
    day.destinations.forEach((destination, index) => {
      // Alternate row background colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 5, contentWidth, 10, 'F');
      }
      
      // Time (if available)
      if (destination.time) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
        doc.text(destination.time, timeX, yPosition);
      }
      
      // Destination name
      doc.setFontSize(10);
      doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${destination.name}`, textX, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
      
      // Description (if available and not too long)
      if (destination.description && destination.description.length < 100) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
        doc.text(destination.description, textX + 5, yPosition);
        yPosition += 5;
      }
    });
    
    yPosition += 2;
  }
  
  // Activities
  if (day.activities && day.activities.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Activities:', margin, yPosition);
    yPosition += 6;
    
    // Create a table-like structure for activities
    day.activities.forEach((activity, index) => {
      // Alternate row background colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 5, contentWidth, 10, 'F');
      }
      
      // Time (if available)
      if (activity.time) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
        doc.text(activity.time, timeX, yPosition);
      }
      
      // Activity name
      doc.setFontSize(10);
      doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${activity.name}`, textX, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
      
      // Description (if available and not too long)
      if (activity.description && activity.description.length < 100) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
        doc.text(activity.description, textX + 5, yPosition);
        yPosition += 5;
      }
    });
    
    yPosition += 2;
  }
  
  // Hotel/Accommodation
  if (day.hotel) {
    doc.setFontSize(12);
    doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Accommodation:', margin, yPosition);
    yPosition += 6;
    
    // Background for hotel info
    doc.setFillColor(248, 250, 252); // Light blue-gray
    doc.rect(margin, yPosition - 5, contentWidth, 15, 'F');
    doc.setDrawColor(COLORS.TABLE_BORDER[0], COLORS.TABLE_BORDER[1], COLORS.TABLE_BORDER[2]);
    doc.rect(margin, yPosition - 5, contentWidth, 15, 'S');
    
    // Time (if available)
    if (day.hotel.time) {
      doc.setFontSize(9);
      doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
      doc.text(day.hotel.time, timeX, yPosition);
    }
    
    // Hotel name and details
    doc.setFontSize(10);
    doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${day.hotel.name} (${day.hotel.stars}★)`, textX, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 5;
    
    doc.setFontSize(9);
    doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
    doc.text(`Location: ${day.hotel.location}`, textX + 5, yPosition);
    yPosition += 7;
  }
  
  // Meals
  if (day.meals && day.meals.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Meals:', margin, yPosition);
    yPosition += 6;
    
    // Create a table-like structure for meals
    day.meals.forEach((meal, index) => {
      // Alternate row background colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 5, contentWidth, 10, 'F');
      }
      
      // Time (if available)
      if (meal.time) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
        doc.text(meal.time, timeX, yPosition);
      }
      
      // Meal details
      doc.setFontSize(10);
      doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
      doc.setFont('helvetica', 'bold');
      const mealType = meal.type.charAt(0).toUpperCase() + meal.type.slice(1);
      doc.text(`• ${mealType}: ${meal.description}`, textX, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
    });
    
    yPosition += 2;
  }
  
  // Transportation
  if (day.transportation || (day.transportationItems && day.transportationItems.length > 0)) {
    doc.setFontSize(12);
    doc.setTextColor(COLORS.SECONDARY[0], COLORS.SECONDARY[1], COLORS.SECONDARY[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Transportation:', margin, yPosition);
    yPosition += 6;
    
    // Main transportation
    if (day.transportation) {
      // Background for transportation
      doc.setFillColor(249, 246, 240); // Light amber
      doc.rect(margin, yPosition - 5, contentWidth, 10, 'F');
      doc.setDrawColor(COLORS.TABLE_BORDER[0], COLORS.TABLE_BORDER[1], COLORS.TABLE_BORDER[2]);
      doc.rect(margin, yPosition - 5, contentWidth, 10, 'S');
      
      // Time (if available)
      if (day.transportation.time) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
        doc.text(day.transportation.time, timeX, yPosition);
      }
      
      // Transportation details
      doc.setFontSize(10);
      doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
      doc.setFont('helvetica', 'bold');
      const type = day.transportation.type ? 
        (day.transportation.type.charAt(0).toUpperCase() + day.transportation.type.slice(1)) : 
        'Transportation';
      doc.text(`• ${type}: ${day.transportation.description}`, textX, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
    }
    
    // Additional transportation items
    if (day.transportationItems && day.transportationItems.length > 0) {
      day.transportationItems.forEach((item, index) => {
        // Alternate row background colors
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, yPosition - 5, contentWidth, 10, 'F');
        }
        
        // Time (if available)
        if (item.time) {
          doc.setFontSize(9);
          doc.setTextColor(COLORS.TEXT_MEDIUM[0], COLORS.TEXT_MEDIUM[1], COLORS.TEXT_MEDIUM[2]);
          doc.text(item.time, timeX, yPosition);
        }
        
        // Transportation details
        doc.setFontSize(10);
        doc.setTextColor(COLORS.TEXT_DARK[0], COLORS.TEXT_DARK[1], COLORS.TEXT_DARK[2]);
        doc.setFont('helvetica', 'bold');
        const type = item.type ? 
          (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : 
          'Transportation';
        doc.text(`• ${type}: ${item.description}`, textX, yPosition);
        doc.setFont('helvetica', 'normal');
        yPosition += 5;
      });
    }
    
    yPosition += 2;
  }
  
  return yPosition;
};
