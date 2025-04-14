import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Save, Send, FileText, Calendar, Users, Loader2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { Invoice, InvoiceItem } from '@/lib/types';

interface InvoiceGeneratorProps {
  source?: 'manual' | 'itinerary';
  existingInvoice?: Invoice | null;
}

const InvoiceGenerator = ({ source = 'manual', existingInvoice = null }: InvoiceGeneratorProps) => {
  // Basic invoice state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  });
  
  // Items state
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  
  // Totals
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(11); // 11% VAT in Indonesia
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Itinerary selection state (for itinerary-based invoices)
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);

  // Load existing invoice data if provided
  useEffect(() => {
    if (existingInvoice) {
      setCustomerName(existingInvoice.customerName);
      setCustomerEmail(existingInvoice.customerEmail);
      setDate(existingInvoice.date);
      setDueDate(existingInvoice.dueDate);
      setItems(existingInvoice.items);
      setSubtotal(existingInvoice.subtotal);
      setTax(existingInvoice.tax);
      setTotal(existingInvoice.total);
      
      if (existingInvoice.itineraryId) {
        setSelectedItineraryId(existingInvoice.itineraryId);
      }
    }
  }, [existingInvoice]);

  // Fetch itineraries if source is "itinerary"
  useEffect(() => {
    if (source === 'itinerary') {
      fetchItineraries();
    }
  }, [source]);

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals();
  }, [items, taxRate]);

  const fetchItineraries = async () => {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItineraries(data || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      toast.error('Failed to load itineraries');
    }
  };

  const loadItineraryData = async (itineraryId: string) => {
    setIsLoadingItinerary(true);
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', itineraryId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Parse JSON fields if needed
        const parsedDays = typeof data.days === 'string' ? JSON.parse(data.days) : data.days;
        const parsedGuides = typeof data.tour_guides === 'string' ? JSON.parse(data.tour_guides) : data.tour_guides;
        
        // Initialize invoice items array
        const newItems: InvoiceItem[] = [];
        
        // Add main tour package
        newItems.push({
          id: uuidv4(),
          description: `Tour Package: ${data.name}`,
          quantity: data.number_of_people || 1,
          unitPrice: Math.round(data.total_price / (data.number_of_people || 1)),
          total: data.total_price
        });
        
        // Add destinations from each day
        if (parsedDays && parsedDays.length > 0) {
          parsedDays.forEach((day: any, index: number) => {
            // Add destinations for this day
            if (day.destinations && day.destinations.length > 0) {
              day.destinations.forEach((dest: any) => {
                newItems.push({
                  id: uuidv4(),
                  description: `Day ${index + 1} - Destination: ${dest.name}`,
                  quantity: data.number_of_people || 1,
                  unitPrice: dest.pricePerPerson || 0,
                  total: (dest.pricePerPerson || 0) * (data.number_of_people || 1)
                });
              });
            }
            
            // Add hotel for this day
            if (day.hotel) {
              const roomsNeeded = day.hotel.roomAmount || Math.ceil((data.number_of_people || 1) / 2);
              newItems.push({
                id: uuidv4(),
                description: `Day ${index + 1} - Accommodation: ${day.hotel.name} (${day.hotel.stars}★)`,
                quantity: roomsNeeded,
                unitPrice: day.hotel.pricePerNight || 0,
                total: (day.hotel.pricePerNight || 0) * roomsNeeded
              });
            }
            
            // Add meals for this day
            if (day.meals && day.meals.length > 0) {
              day.meals.forEach((meal: any) => {
                const mealType = meal.type.charAt(0).toUpperCase() + meal.type.slice(1);
                newItems.push({
                  id: uuidv4(),
                  description: `Day ${index + 1} - ${mealType}: ${meal.description}`,
                  quantity: data.number_of_people || 1,
                  unitPrice: meal.pricePerPerson || 0,
                  total: (meal.pricePerPerson || 0) * (data.number_of_people || 1)
                });
              });
            }
            
            // Add transportation for this day
            if (day.transportation) {
              newItems.push({
                id: uuidv4(),
                description: `Day ${index + 1} - Transportation: ${day.transportation.type} - ${day.transportation.description}`,
                quantity: 1, // Transportation is a flat fee
                unitPrice: day.transportation.pricePerPerson || 0,
                total: day.transportation.pricePerPerson || 0
              });
            }
            
            // Add additional transportation items
            if (day.transportationItems && day.transportationItems.length > 0) {
              day.transportationItems.forEach((item: any) => {
                newItems.push({
                  id: uuidv4(),
                  description: `Day ${index + 1} - Additional ${item.type}: ${item.description}`,
                  quantity: 1, // Transportation is a flat fee
                  unitPrice: item.pricePerPerson || 0,
                  total: item.pricePerPerson || 0
                });
              });
            }
          });
        }
        
        // Add tour guides information with phone numbers, but not their price
        if (parsedGuides && parsedGuides.length > 0) {
          parsedGuides.forEach((guide: any) => {
            const phoneInfo = guide.phoneNumber ? ` (Contact: ${guide.phoneNumber})` : '';
            const languages = guide.languages && guide.languages.length > 0 
              ? ` - Languages: ${guide.languages.join(', ')}` 
              : '';
            
            newItems.push({
              id: uuidv4(),
              description: `Tour Guide: ${guide.name} - ${guide.expertise}${phoneInfo}${languages}`,
              quantity: 1,
              unitPrice: 0, // Not showing the price in the invoice
              total: 0
            });
          });
        }
        
        setItems(newItems);
        
        // Try to get customer name from the itinerary if available
        const itineraryName = data.name || 'Tour Itinerary';
        setCustomerName(`Customer for ${itineraryName}`);
        setSelectedItineraryId(itineraryId);
        
        // Calculate totals based on new items
        calculateTotals(newItems);
      }
    } catch (error) {
      console.error('Error loading itinerary data:', error);
      toast.error('Failed to load itinerary data');
    } finally {
      setIsLoadingItinerary(false);
    }
  };

  const calculateTotals = (itemsToCalculate = items) => {
    const newSubtotal = itemsToCalculate.reduce((sum, item) => sum + item.total, 0);
    const newTax = newSubtotal * (taxRate / 100);
    const newTotal = newSubtotal + newTax;
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  };

  const updateItemTotal = (index: number, quantity: number, unitPrice: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = quantity;
    updatedItems[index].unitPrice = unitPrice;
    updatedItems[index].total = quantity * unitPrice;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    } else {
      toast.error('Invoice must have at least one item');
    }
  };

  const handleSave = async (status: 'draft' | 'sent' | 'paid' | 'unpaid' = 'draft') => {
    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      toast.error('Please enter a valid customer email');
      return;
    }

    const hasEmptyDescription = items.some(item => !item.description.trim());
    if (hasEmptyDescription) {
      toast.error('All items must have a description');
      return;
    }

    setIsSaving(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast.error('You must be logged in to save invoices');
        return;
      }
      
      const invoice = {
        id: existingInvoice?.id || uuidv4(),
        itinerary_id: selectedItineraryId || null,
        customer_name: customerName,
        customer_email: customerEmail,
        date,
        due_date: dueDate,
        items: JSON.stringify(items), // Convert items array to JSON string for storage
        subtotal,
        tax,
        total,
        status,
        user_id: session.session.user.id,
        updated_at: new Date().toISOString()
      };
      
      if (!existingInvoice) {
        // Add created_at only for new invoices
        Object.assign(invoice, { created_at: new Date().toISOString() });
      }
      
      let result;
      
      if (existingInvoice) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices')
          .update(invoice)
          .eq('id', invoice.id);
        
        if (error) throw error;
        
        toast.success(`Invoice updated successfully`);
        result = { success: true, operation: 'update' };
      } else {
        // Insert new invoice
        const { error } = await supabase
          .from('invoices')
          .insert(invoice);
        
        if (error) throw error;
        
        toast.success(`Invoice ${status === 'draft' ? 'saved as draft' : 'created and marked as sent'}`);
        result = { success: true, operation: 'insert' };
      }
      
      // Reset form after successful save if it's a new invoice
      if (!existingInvoice && status === 'sent') {
        resetForm();
      }
      
      return result;
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  const sendInvoice = async () => {
    setIsSending(true);
    try {
      // First save the invoice as sent
      const result = await handleSave('sent');
      
      if (result?.success) {
        // Here you would typically integrate with an email service
        // For now, we'll just simulate sending
        
        setTimeout(() => {
          toast.success(`Invoice sent to ${customerEmail}`);
          setIsSending(false);
        }, 1500);
      } else {
        setIsSending(false);
      }
      
      // In a real implementation, you'd call your email sending function or API
      // Example: await sendInvoiceEmail(invoice, customerEmail);
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setDate(new Date().toISOString().split('T')[0]);
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 14);
    setDueDate(newDueDate.toISOString().split('T')[0]);
    setItems([{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setSelectedItineraryId(null);
    setTaxRate(11);
    calculateTotals([{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-700">
        {source === 'manual' ? 'Create New Invoice' : 'Create Invoice from Itinerary'}
      </h2>

      {source === 'itinerary' && (
        <Card className="p-6 border-amber-200 bg-amber-50">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-amber-600" />
            Select Itinerary
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="itinerary">Itinerary</Label>
              <Select 
                onValueChange={(value) => loadItineraryData(value)}
                disabled={isLoadingItinerary}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an itinerary" />
                </SelectTrigger>
                <SelectContent>
                  {itineraries.map((itinerary) => (
                    <SelectItem key={itinerary.id} value={itinerary.id}>
                      {itinerary.name} - {formatRupiah(itinerary.total_price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isLoadingItinerary && (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            )}
            
            {selectedItineraryId && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Start date: {date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Number of people: {items[0]?.quantity || 1}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6 border-gray-200">
        <div className="space-y-6">
          <h3 className="text-lg font-medium mb-4">Customer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="john@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-gray-200">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Invoice Items</h3>
            <Button 
              onClick={addItem} 
              variant="outline" 
              size="sm"
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
                <div className="col-span-12 md:col-span-6">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].description = e.target.value;
                      setItems(updatedItems);
                    }}
                    rows={2}
                    required
                  />
                </div>
                
                <div className="col-span-4 md:col-span-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      updateItemTotal(index, qty, item.unitPrice);
                    }}
                    required
                  />
                </div>
                
                <div className="col-span-5 md:col-span-2">
                  <Label htmlFor={`unitPrice-${index}`}>Unit Price</Label>
                  <Input
                    id={`unitPrice-${index}`}
                    type="number"
                    min="0"
                    step="1000"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      updateItemTotal(index, item.quantity, price);
                    }}
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1 flex items-center justify-end h-10">
                  <p className="font-medium text-gray-700">{formatRupiah(item.total)}</p>
                </div>
                
                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-end space-y-2">
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatRupiah(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Tax Rate:</span>
                    <Select
                      value={taxRate.toString()}
                      onValueChange={(value) => setTaxRate(parseFloat(value))}
                    >
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue placeholder="%" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="11">11%</SelectItem>
                        <SelectItem value="22">22%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span>{formatRupiah(tax)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-amber-700">{formatRupiah(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => handleSave('draft')}
          disabled={isSaving || isSending}
          className="w-full sm:w-auto"
        >
          {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save as Draft
        </Button>
        
        <Button
          onClick={sendInvoice}
          disabled={isSaving || isSending}
          className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Create and Send
        </Button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
