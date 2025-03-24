
import React from 'react';

interface AuthFormHeaderProps {
  isSignUp: boolean;
}

const AuthFormHeader = ({ isSignUp }: AuthFormHeaderProps) => {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-white">
        {isSignUp ? 'Create an Account' : 'Sign In to Your Account'}
      </h2>
      <p className="mt-2 text-blue-200">
        {isSignUp 
          ? 'Join TourGenius to start planning your dream trips' 
          : 'Welcome back! Please enter your credentials'}
      </p>
    </div>
  );
};

export default AuthFormHeader;
