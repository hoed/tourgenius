import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/index";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard/index";
import ItineraryPage from "./pages/dashboard/itinerary";
import InvoicesPage from "./pages/dashboard/invoices";
import CustomersPage from "./pages/dashboard/customers";
import TourPlansPage from "./pages/dashboard/tour-plans";
import SettingsPage from "./pages/dashboard/settings";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Testimonials from "./pages/Testimonials";
import Pricing from "./pages/Pricing";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Manual from "./pages/manual";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-24 min-h-screen">
      {children}
    </div>
  );
};

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
        setIsAuthenticated(!!session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/features" element={<PageWrapper><Features /></PageWrapper>} />
          <Route path="/testimonials" element={<PageWrapper><Testimonials /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
          <Route path="/help-center" element={<PageWrapper><HelpCenter /></PageWrapper>} />
          <Route path="/contact-us" element={<PageWrapper><ContactUs /></PageWrapper>} />
          <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="/terms-of-service" element={<PageWrapper><TermsOfService /></PageWrapper>} />
          <Route path="/cookie-policy" element={<PageWrapper><CookiePolicy /></PageWrapper>} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/itinerary" 
            element={
              <ProtectedRoute>
                <ItineraryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/tour-plans" 
            element={
              <ProtectedRoute>
                <TourPlansPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/invoices" 
            element={
              <ProtectedRoute>
                <InvoicesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/customers" 
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manual" 
            element={
              <ProtectedRoute>
                <Manual />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
