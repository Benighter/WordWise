'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiBook, FiUser, FiLock, FiMail } from 'react-icons/fi';
import { RegisterFormData } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setSuccess(true);
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setRegisterError(
        error instanceof Error ? error.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
          <FiBook className="h-8 w-8 text-purple-600 dark:text-purple-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Join WordWise to expand your vocabulary</p>
      </div>
      
      <Card className="w-full max-w-md">
        {success ? (
          <div className="text-center p-6">
            <div className="mb-4 text-green-500 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Registration Successful!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your account has been created. Redirecting you to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                className="pl-10"
                icon={<FiUser className="text-gray-400" />}
              />
            </div>
            
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                className="pl-10"
                icon={<FiMail className="text-gray-400" />}
              />
            </div>
            
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                className="pl-10"
                icon={<FiLock className="text-gray-400" />}
              />
            </div>
            
            <div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                className="pl-10"
                icon={<FiLock className="text-gray-400" />}
              />
            </div>
            
            {registerError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
                {registerError}
              </div>
            )}
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="py-2.5"
              >
                Create Account
              </Button>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
} 