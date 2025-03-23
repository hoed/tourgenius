import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthFormActionsProps {
  isSignUp: boolean;
  loading: boolean;
  toggleAuthMode: () => void;
}

const AuthFormActions = ({ isSignUp, loading, toggleAuthMode }: AuthFormActionsProps) => {
  return (
    <>
      <Button 
        type="submit" 
        className="w-full bg-blue-900 text-white hover:bg-blue-800 font-semibold" 
        disabled={loading}
      >
        {loading ? 'Memproses...' : isSignUp ? 'Buat Akun' : 'Masuk'}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-blue">
          {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="ml-1 text-blue-300 hover:underline focus:outline-none"
          >
            {isSignUp ? 'Masuk' : 'Daftar'}
          </button>
        </p>
      </div>
    </>
  );
};

export default AuthFormActions;