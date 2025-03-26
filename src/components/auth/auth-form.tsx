
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthFormHeader from './auth-form-header';
import AuthFormFields from './auth-form-fields';
import AuthFormActions from './auth-form-actions';
import { AuthFormData, signUpUser, signInUser, createAndSignInTestAccount } from './auth-utils';

interface AuthFormProps {
  initialIsSignUp?: boolean;
  onToggleMode?: () => void;
}

const AuthForm = ({ initialIsSignUp = false, onToggleMode }: AuthFormProps) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  
  // Update local state when prop changes
  useEffect(() => {
    setIsSignUp(initialIsSignUp);
  }, [initialIsSignUp]);
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
  });
  
  const [loading, setLoading] = useState(false);

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
    if (onToggleMode) {
      onToggleMode();
    } else {
      setIsSignUp(!isSignUp);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`transition-all duration-300 transform ${isSignUp ? 'translate-x-0' : 'translate-x-0'}`}>
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
      </div>
    </div>
  );
};

export default AuthForm;
