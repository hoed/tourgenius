
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import GlassCard from '@/components/ui/glass-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserCircle, Bell, Shield, LogOut } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    emailNotifications: true,
    marketingEmails: false,
    darkMode: true,
    highContrast: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('Session expired. Please login again.');
          navigate('/auth');
          return;
        }

        setUserData(session.user);
        setSettings(prev => ({
          ...prev,
          name: session.user.email?.split('@')[0] || '',
          email: session.user.email || ''
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      toast.success('Logged out successfully!');
      navigate('/auth'); // Redirect to auth page
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-10 w-64 bg-gray-300 rounded-md mb-6"></div>
          <div className="h-8 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-64 w-full bg-gray-100 rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-batik-dark/40 border border-white/10">
            <TabsTrigger value="account" className="data-[state=active]:bg-batik-gold/20">
              <UserCircle className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-batik-gold/20">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-batik-gold/20">
              <Shield className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <GlassCard className="bg-batik-dark/40 border border-white/5">
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-medium text-white">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Update your account details</p>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} className="bg-batik-dark/60 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={settings.email} readOnly className="bg-batik-dark/60 border-white/10" />
                    </div>
                  </div>
                  <Button onClick={handleSaveSettings} className="bg-batik-gold text-batik-dark hover:bg-batik-gold/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="mt-6 bg-batik-dark/40 border border-white/5">
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-medium text-white">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account or log out</p>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Log out of your account</h4>
                    <p className="text-sm text-muted-foreground">Sign out from the current session</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="notifications">
            <GlassCard className="bg-batik-dark/40 border border-white/5">
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your email notification preferences</p>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
                    </div>
                    <Switch id="notifications" checked={settings.emailNotifications} onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                    </div>
                    <Switch id="marketing" checked={settings.marketingEmails} onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})} />
                  </div>
                  <Button onClick={handleSaveSettings} className="bg-batik-gold text-batik-dark hover:bg-batik-gold/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="appearance">
            <GlassCard className="bg-batik-dark/40 border border-white/5">
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-medium text-white">Appearance</h3>
                  <p className="text-sm text-muted-foreground">Customize how TourGenius looks for you</p>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                    </div>
                    <Switch id="darkMode" checked={settings.darkMode} onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highContrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
                    </div>
                    <Switch id="highContrast" checked={settings.highContrast} onCheckedChange={(checked) => setSettings({...settings, highContrast: checked})} />
                  </div>
                  <Button onClick={handleSaveSettings} className="bg-batik-gold text-batik-dark hover:bg-batik-gold/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
