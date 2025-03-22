
import React from 'react';

interface AuthFormHeaderProps {
  isSignUp: boolean;
}

const AuthFormHeader = ({ isSignUp }: AuthFormHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        {isSignUp ? 'Create an Account' : 'Welcome Back'}
      </h2>
      <p className="text-gray-400 mt-2">
        {isSignUp
          ? 'Sign up to start planning amazing tours'
          : 'Log in to access your dashboard'}
      </p>
    </div>
  );
};

export default AuthFormHeader;
