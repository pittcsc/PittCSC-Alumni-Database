import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/alumni');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
      await registerUser(data.email, data.password, fullName);
      // Redirect will happen automatically via useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pittDarkNavy via-pittDeepNavy to-pittNavy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFB81C' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-pittGold rounded-full">
              <GraduationCap className="h-10 w-10 text-pittDarkNavy" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-white">
            Join the Network
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Connect with PittCSC alumni worldwide
          </p>
        </div>

        {/* Register Form */}
        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* First Name and Last Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-pittDarkNavy mb-2">
                  First Name
                </label>
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  autoComplete="given-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent transition-colors"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-pittDarkNavy mb-2">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  autoComplete="family-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent transition-colors"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Pitt Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pittDarkNavy mb-2">
                Pitt Email
              </label>
              <input
                {...register('email', {
                  required: 'Pitt email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@pitt\.edu$/i,
                    message: 'Must be a valid Pitt email address (@pitt.edu)'
                  }
                })}
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent transition-colors"
                placeholder="Enter your Pitt email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-pittDarkNavy mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-pittDarkNavy mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={isSubmitting}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-pittNavy hover:text-pittDeepNavy transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;