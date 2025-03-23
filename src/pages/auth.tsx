import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import AuthForm from '@/components/auth/auth-form';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && initialCheckDone) {
          navigate('/dashboard');
        } else if (initialCheckDone) {
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
      setInitialCheckDone(true);
    });

    return () => subscription.unsubscribe();
  }, [navigate, initialCheckDone]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error) {
      alert('Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white p-6 shadow-md border-b border-blue-400/20">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              TourGenius
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="container mx-auto max-w-md">
          <div className="bg-blue-950 p-6 rounded-xl border border-blue-400/20 shadow-md">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">Selamat Datang di TourGenius</h1>
            
            <Button
              onClick={handleGoogleLogin}
              className="w-full mb-4 bg-white border border-blue-400/50 text-blue-900 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FcGoogle size={20} />
              Masuk dengan Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-400/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-blue-950 text-white">Atau lanjutkan dengan email</span>
              </div>
            </div>

            <AuthForm />
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-blue-900">
        <p>© {new Date().getFullYear()} TourGenius. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
};

export default Auth;