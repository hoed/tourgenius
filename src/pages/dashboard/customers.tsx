import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/layout';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, Search, Trash2, Edit, UserPlus, Star } from 'lucide-react';

// Mock data with ratings
const initialCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+62 812-3456-7890', rating: 4, notes: 'Repeat customer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+62 813-5678-9012', rating: 2, notes: 'Cultural tours' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '+62 857-1234-5678', rating: 5, notes: 'Vegetarian' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+62 878-9012-3456', rating: 3, notes: 'First-timer' },
  { id: 5, name: 'Michael Wilson', email: 'michael@example.com', phone: '+62 821-3456-7890', rating: 4, notes: 'Adventure' },
];

// Star Rating Component
const StarRating = ({ rating, maxRating = 5, size = 'sm' }) => {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={`${starSize} ${
            index < rating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">({rating})</span>
    </div>
  );
};

// Customer Management Component
const CustomerManagement = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 0,
    notes: ''
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    const id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    setCustomers([...customers, { ...newCustomer, id }]);
    setNewCustomer({ name: '', email: '', phone: '', rating: 0, notes: '' });
    setIsAddDialogOpen(false);
    toast.success('Customer added successfully');
  };

  const handleEditCustomer = () => {
    if (!currentCustomer.name || !currentCustomer.email || !currentCustomer.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCustomers(customers.map(customer => 
      customer.id === currentCustomer.id ? currentCustomer : customer
    ));
    setIsEditDialogOpen(false);
    toast.success('Customer updated successfully');
  };

  const handleDeleteCustomer = () => {
    setCustomers(customers.filter(customer => customer.id !== currentCustomer.id));
    setIsDeleteDialogOpen(false);
    toast.success('Customer deleted successfully');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-md">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-gradient">
            Customer Management
          </h2>
          <p className="text-gray-600 mt-1">Manage your tour customers with elegance</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-gray-900 font-semibold transform transition-all duration-300 hover:scale-105 shadow-md"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 rounded-full focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow className="border-b border-gray-200">
              {['Name', 'Email', 'Phone', 'Rating', 'Notes', 'Actions'].map((header) => (
                <TableHead key={header} className="text-amber-700 font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className="border-b border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <StarRating rating={customer.rating} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{customer.notes}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-400/10"
                      onClick={() => {
                        setCurrentCustomer(customer);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-400/10"
                      onClick={() => {
                        setCurrentCustomer(customer);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-amber-700">Add New Customer</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter the details of the new customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-700">Name*</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-gray-700">Email*</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-gray-700">Phone*</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right text-gray-700">Rating</Label>
              <Select
                value={newCustomer.rating.toString()}
                onValueChange={(value) => setNewCustomer({ ...newCustomer, rating: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3 bg-gray-50 border-gray-200 text-gray-900">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num} Stars</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right text-gray-700">Notes</Label>
              <Textarea
                id="notes"
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="border-amber-400/50 text-amber-600 hover:bg-amber-400/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCustomer}
              className="bg-amber-400 text-gray-900 hover:bg-amber-500"
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-amber-700">Edit Customer</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update the customer's information.
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right text-gray-700">Name*</Label>
                <Input
                  id="edit-name"
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                  className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right text-gray-700">Email*</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentCustomer.email}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                  className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right text-gray-700">Phone*</Label>
                <Input
                  id="edit-phone"
                  value={currentCustomer.phone}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                  className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-rating" className="text-right text-gray-700">Rating</Label>
                <Select
                  value={currentCustomer.rating.toString()}
                  onValueChange={(value) => setCurrentCustomer({ ...currentCustomer, rating: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3 bg-gray-50 border-gray-200 text-gray-900">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num} Stars</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right text-gray-700">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={currentCustomer.notes}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, notes: e.target.value })}
                  className="col-span-3 bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-amber-400/50 text-amber-600 hover:bg-amber-400/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditCustomer}
              className="bg-amber-400 text-gray-900 hover:bg-amber-500"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-amber-700">Delete Customer</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="py-4">
              <p><strong>Name:</strong> {currentCustomer.name}</p>
              <p><strong>Email:</strong> {currentCustomer.email}</p>
              <p><strong>Rating:</strong> <StarRating rating={currentCustomer.rating} size="sm" /></p>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-amber-400/50 text-amber-600 hover:bg-amber-400/10"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCustomer}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Customers Page Component
const CustomersPage = () => {
  return (
    <DashboardLayout>
      <div className="bg-batik-dark/20 p-4 rounded-lg">
        <Toaster position="top-center" richColors />
        <CustomerManagement />
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;