import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import GlassCard from '../ui/glass-card';
import AuthFormHeader from './auth-form-header';
import AuthFormFields from './auth-form-fields';
import AuthFormActions from './auth-form-actions';
import { AuthFormData, signUpUser, signInUser, createAndSignInTestAccount } from './auth-utils';

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.search.includes('signup=true'));
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        await signUpUser(formData);
      } else {
        await signInUser(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleTestAccount = async () => {
    setLoading(true);
    try {
      await createAndSignInTestAccount();
      navigate('/dashboard');
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto bg-blue-950 backdrop-blur-xl border border-blue-400/20">
      <AuthFormHeader isSignUp={isSignUp} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthFormFields
          formData={formData}
          handleChange={handleChange}
          isSignUp={isSignUp}
          loading={loading}
        />

        <AuthFormActions 
          isSignUp={isSignUp} 
          loading={loading} 
          toggleAuthMode={toggleAuthMode} 
        />
      </form>
    </GlassCard>
  );
};

export default AuthForm;