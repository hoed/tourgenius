
import React from 'react';

interface AuthFormHeaderProps {
  isSignUp: boolean;
}

const AuthFormHeader = ({ isSignUp }: AuthFormHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-white">
        {isSignUp ? 'Create an Account' : 'Welcome Back'}
      </h2>
      <p className="text-blue-200 mt-1">
        {isSignUp 
          ? 'Sign up to manage your tour business' 
          : 'Sign in to your TourGenius account'}
      </p>
    </div>
  );
};

export default AuthFormHeader;
