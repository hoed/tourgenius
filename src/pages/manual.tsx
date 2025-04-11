
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass, Users, Calendar, Receipt, Map, FileText, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Manual = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Manual</h1>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="itineraries" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Itineraries</span>
            </TabsTrigger>
            <TabsTrigger value="tourplans" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden md:inline">Tour Plans</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden md:inline">Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Tourism Management System</CardTitle>
                <CardDescription>
                  A comprehensive tool for managing your tourism business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Tourism Management System helps you streamline your tourism business operations by providing tools to manage customers, create travel itineraries, generate invoices, and more.
                </p>
                <h3 className="text-xl font-semibold mt-4">Key Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customer management</li>
                  <li>Itinerary creation and planning</li>
                  <li>Tour plan templates</li>
                  <li>Invoice generation and tracking</li>
                  <li>Business analytics and reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Basic steps to get started with the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Sign Up/Login:</strong> Create an account or log in to access the dashboard.
                  </li>
                  <li>
                    <strong>Set Up Your Profile:</strong> Update your business details in the settings section.
                  </li>
                  <li>
                    <strong>Add Customers:</strong> Start building your customer database.
                  </li>
                  <li>
                    <strong>Create Tour Plans:</strong> Design reusable tour templates.
                  </li>
                  <li>
                    <strong>Build Itineraries:</strong> Create detailed travel plans for your customers.
                  </li>
                  <li>
                    <strong>Generate Invoices:</strong> Create and send professional invoices to your customers.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
                <CardDescription>
                  Understanding your main control center
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The dashboard provides a quick overview of your tourism business performance and access to all system features.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="dashboard-1">
                    <AccordionTrigger>Key Metrics</AccordionTrigger>
                    <AccordionContent>
                      The dashboard shows important metrics like recent sales, upcoming tours, pending invoices, and customer statistics to help you track your business performance at a glance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dashboard-2">
                    <AccordionTrigger>Navigation</AccordionTrigger>
                    <AccordionContent>
                      The sidebar menu gives you quick access to all features including customers, itineraries, tour plans, invoices, and settings.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dashboard-3">
                    <AccordionTrigger>Quick Actions</AccordionTrigger>
                    <AccordionContent>
                      The dashboard provides quick action buttons to create new itineraries, add customers, generate invoices, and more.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Managing your customer database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The customer management section allows you to add, edit, and track your customers' information and booking history.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="customers-1">
                    <AccordionTrigger>Adding New Customers</AccordionTrigger>
                    <AccordionContent>
                      Click the "Add Customer" button to open the form. Fill in the customer details including name, email, phone, and address. Save the information to add the customer to your database.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="customers-2">
                    <AccordionTrigger>Editing Customer Information</AccordionTrigger>
                    <AccordionContent>
                      To edit a customer's information, find them in the customer list and click the edit button. Update the required fields and save your changes.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="customers-3">
                    <AccordionTrigger>Customer History</AccordionTrigger>
                    <AccordionContent>
                      View a customer's booking history, previous itineraries, and invoice records by clicking on their profile. This helps you provide more personalized service.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itineraries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Itinerary Management</CardTitle>
                <CardDescription>
                  Creating and managing travel itineraries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The itinerary section allows you to create detailed travel plans with day-by-day activities, accommodations, and transportation.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="itineraries-1">
                    <AccordionTrigger>Creating New Itineraries</AccordionTrigger>
                    <AccordionContent>
                      Click "Create Itinerary" to start a new travel plan. Add basic details like name, dates, and number of people. You can build from scratch or use an existing tour plan as a template.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="itineraries-2">
                    <AccordionTrigger>Adding Daily Activities</AccordionTrigger>
                    <AccordionContent>
                      For each day, add destinations, accommodations, meals, and transportation. The system will calculate costs automatically based on your inputs.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="itineraries-3">
                    <AccordionTrigger>Assigning Tour Guides</AccordionTrigger>
                    <AccordionContent>
                      Add tour guides to your itinerary by selecting from your guide database. You can assign specific guides based on expertise, languages, and availability.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="itineraries-4">
                    <AccordionTrigger>Generating Invoices</AccordionTrigger>
                    <AccordionContent>
                      Once an itinerary is complete, you can directly generate an invoice by clicking the "Create Invoice" button. This will transfer all the relevant pricing details.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tourplans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tour Plan Management</CardTitle>
                <CardDescription>
                  Creating reusable tour templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Tour plans serve as templates that can be quickly converted into full itineraries, saving you time when creating similar trips.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="tourplans-1">
                    <AccordionTrigger>Creating Tour Plans</AccordionTrigger>
                    <AccordionContent>
                      Click "Create Tour Plan" and fill in the basic details like title, description, and price. You can also add a cover image to make it visually appealing.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tourplans-2">
                    <AccordionTrigger>Adding Itinerary Details</AccordionTrigger>
                    <AccordionContent>
                      Switch to the Itinerary Details tab to add information about start dates, number of people, and other specifics that will be used when converting to a full itinerary.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tourplans-3">
                    <AccordionTrigger>Converting to Itinerary</AccordionTrigger>
                    <AccordionContent>
                      To convert a tour plan into a full itinerary, click the "Convert to Itinerary" button on the tour plan card. This will create a new itinerary with all the details from your tour plan.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Management</CardTitle>
                <CardDescription>
                  Creating and tracking customer invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The invoice section allows you to create, manage, and track payments for your travel services.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="invoices-1">
                    <AccordionTrigger>Creating Invoices Manually</AccordionTrigger>
                    <AccordionContent>
                      Select "Manual Input" when creating a new invoice. Fill in customer details, add line items for services, specify prices, and set payment terms.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="invoices-2">
                    <AccordionTrigger>Creating Invoices from Itineraries</AccordionTrigger>
                    <AccordionContent>
                      Select "From Itinerary" to automatically generate an invoice based on an existing itinerary. The system will pull all relevant details and pricing.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="invoices-3">
                    <AccordionTrigger>Tracking Payment Status</AccordionTrigger>
                    <AccordionContent>
                      Monitor invoice status (draft, sent, paid, unpaid) and update it as payments are received. The system provides a clear overview of outstanding and completed payments.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="invoices-4">
                    <AccordionTrigger>Downloading and Printing</AccordionTrigger>
                    <AccordionContent>
                      Generate PDF versions of invoices that can be downloaded, printed, or sent directly to customers via email.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Managing your account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The settings section allows you to customize your account, update business information, and manage system preferences.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="settings-1">
                    <AccordionTrigger>Profile Management</AccordionTrigger>
                    <AccordionContent>
                      Update your personal and business information, including company name, logo, contact details, and business address.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="settings-2">
                    <AccordionTrigger>Security Settings</AccordionTrigger>
                    <AccordionContent>
                      Change your password, enable two-factor authentication, and manage login preferences to keep your account secure.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="settings-3">
                    <AccordionTrigger>Notification Preferences</AccordionTrigger>
                    <AccordionContent>
                      Customize which notifications you receive about new bookings, invoice payments, and system updates.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-amber-800">Need Additional Help?</h3>
              <p className="text-amber-700 mt-2">
                If you need further assistance or have specific questions about using the system, please contact our support team.
              </p>
              <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;
