
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
import { UserCircle, Bell, Shield, LogOut, LockKeyhole } from 'lucide-react';

// Theme handling hook
const useThemeSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      root.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
  }, [isHighContrast]);

  return {
    isDarkMode,
    setIsDarkMode,
    isHighContrast,
    setIsHighContrast
  };
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const { isDarkMode, setIsDarkMode, isHighContrast, setIsHighContrast } = useThemeSettings();
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    marketingEmails: false
  });
  const [passwordError, setPasswordError] = useState('');

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

  const handlePasswordChange = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (settings.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setPasswordError('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: settings.newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      setSettings({...settings, newPassword: '', confirmPassword: ''});
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    }
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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-batik-dark/40 border border-white/10 w-full flex flex-wrap justify-start overflow-x-auto">
            <TabsTrigger value="account" className="data-[state=active]:bg-batik-gold/20">
              <UserCircle className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Account</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-batik-gold/20">
              <LockKeyhole className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-batik-gold/20">
              <Bell className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-batik-gold/20">
              <Shield className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Appearance</span>
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
                      <Input 
                        id="name" 
                        value={settings.name} 
                        onChange={(e) => setSettings({...settings, name: e.target.value})} 
                        className="bg-batik-dark/60 border-white/10" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={settings.email} 
                        readOnly 
                        disabled
                        className="bg-batik-dark/40 border-white/10 text-gray-400 cursor-not-allowed" 
                      />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
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

          <TabsContent value="security">
            <GlassCard className="bg-batik-dark/40 border border-white/5">
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-medium text-white">Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password</p>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        value={settings.newPassword} 
                        onChange={(e) => setSettings({...settings, newPassword: e.target.value})} 
                        className="bg-batik-dark/60 border-white/10" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={settings.confirmPassword} 
                        onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})} 
                        className="bg-batik-dark/60 border-white/10" 
                      />
                    </div>
                  </div>
                  {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={!settings.newPassword || !settings.confirmPassword}
                    className="bg-batik-gold text-batik-dark hover:bg-batik-gold/90"
                  >
                    Update Password
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
                    <Switch 
                      id="notifications" 
                      checked={settings.emailNotifications} 
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                    </div>
                    <Switch 
                      id="marketing" 
                      checked={settings.marketingEmails} 
                      onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})} 
                    />
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
                    <Switch 
                      id="darkMode" 
                      checked={isDarkMode} 
                      onCheckedChange={setIsDarkMode} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highContrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
                    </div>
                    <Switch 
                      id="highContrast" 
                      checked={isHighContrast} 
                      onCheckedChange={setIsHighContrast} 
                    />
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
