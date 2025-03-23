import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface AuthFormFieldsProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignUp: boolean;
  loading: boolean;
}

const AuthFormFields = ({ 
  formData, 
  handleChange, 
  isSignUp, 
  loading 
}: AuthFormFieldsProps) => {
  return (
    <>
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Nama Lengkap</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama Anda"
            required={isSignUp}
            disabled={loading}
            className="w-full bg-blue border-blue-400/50 text-black placeholder:text-gray-500"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Masukkan email Anda"
          required
          disabled={loading}
          className="w-full bg-white border-blue-400/50 text-black placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-white">Kata Sandi</Label>
          {!isSignUp && (
            <a href="#" className="text-sm text-blue-300 hover:underline">
              Lupa kata sandi?
            </a>
          )}
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Masukkan kata sandi Anda"
          required
          disabled={loading}
          className="w-full bg-white border-blue-400/50 text-black placeholder:text-gray-500"
        />
      </div>
    </>
  );
};

export default AuthFormFields;