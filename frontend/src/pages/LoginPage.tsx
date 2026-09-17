import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const PITT_EMAIL = /^[A-Z0-9._%+-]+@pitt\.edu$/i;

type Mode = 'otp' | 'password';
type OtpStep = 'email' | 'code';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, requestOtp, loginWithOtp, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();

  const [mode, setMode] = useState<Mode>('otp');
  const [otpStep, setOtpStep] = useState<OtpStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/alumni');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const resetErrors = () => {
    setLocalError(null);
    clearError();
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    if (!PITT_EMAIL.test(email)) {
      setLocalError('Please enter a valid Pitt email (@pitt.edu).');
      return;
    }
    try {
      const res = await requestOtp(email);
      setDevCode(res.dev_code ?? null);
      setOtpStep('code');
      setTimeout(() => codeInputRef.current?.focus(), 50);
    } catch {
      /* handled in store */
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    if (code.length !== 6) {
      setLocalError('Enter the 6-digit code from your email.');
      return;
    }
    try {
      await loginWithOtp(email, code);
    } catch {
      /* handled in store */
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    if (!PITT_EMAIL.test(email)) {
      setLocalError('Please enter a valid Pitt email (@pitt.edu).');
      return;
    }
    try {
      await login(email, password);
    } catch {
      /* handled in store */
    }
  };

  const shownError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pittDarkNavy via-pittDeepNavy to-pittNavy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFB81C' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-pittGold rounded-full">
              <GraduationCap className="h-10 w-10 text-pittDarkNavy" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to the Pitt CSC Alumni Network
          </p>
        </div>

        <Card className="mt-8">
          {shownError && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{shownError}</p>
            </div>
          )}

          {/* ---------- OTP MODE ---------- */}
          {mode === 'otp' && otpStep === 'email' && (
            <form className="space-y-6" onSubmit={handleRequestOtp}>
              <div>
                <label className="block text-sm font-medium text-pittDarkNavy mb-2">Pitt Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent transition-colors"
                  placeholder="you@pitt.edu"
                />
              </div>
              <Button type="submit" fullWidth isLoading={isLoading}>
                <Mail className="h-4 w-4 mr-2" />
                {isLoading ? 'Sending code...' : 'Email me a login code'}
              </Button>
              <p className="text-center text-xs text-gray-500">
                No password needed — we'll email you a 6-digit code.
              </p>
            </form>
          )}

          {mode === 'otp' && otpStep === 'code' && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <button
                type="button"
                onClick={() => {
                  setOtpStep('email');
                  setCode('');
                  resetErrors();
                }}
                className="flex items-center text-sm text-gray-500 hover:text-pittNavy"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Use a different email
              </button>
              <div>
                <label className="block text-sm font-medium text-pittDarkNavy mb-2">
                  Enter the code sent to <span className="font-semibold">{email}</span>
                </label>
                <input
                  ref={codeInputRef}
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-3 text-center text-2xl tracking-[0.5em] font-semibold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent"
                  placeholder="000000"
                />
                {devCode && (
                  <p className="mt-2 text-center text-xs text-gray-400">
                    Dev mode — your code is <span className="font-mono font-semibold">{devCode}</span>
                  </p>
                )}
              </div>
              <Button type="submit" fullWidth isLoading={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & sign in'}
              </Button>
              <button
                type="button"
                onClick={handleRequestOtp}
                className="w-full text-center text-sm text-pittNavy hover:text-pittDeepNavy"
              >
                Resend code
              </button>
            </form>
          )}

          {/* ---------- PASSWORD MODE ---------- */}
          {mode === 'password' && (
            <form className="space-y-6" onSubmit={handlePasswordLogin}>
              <div>
                <label className="block text-sm font-medium text-pittDarkNavy mb-2">Pitt Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pittGold focus:border-transparent transition-colors"
                  placeholder="you@pitt.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pittDarkNavy mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
              <Button type="submit" fullWidth isLoading={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          )}

          {/* Mode toggle */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            {mode === 'otp' ? (
              <button
                onClick={() => {
                  setMode('password');
                  resetErrors();
                }}
                className="text-sm font-medium text-pittNavy hover:text-pittDeepNavy transition-colors"
              >
                Sign in with a password instead
              </button>
            ) : (
              <button
                onClick={() => {
                  setMode('otp');
                  setOtpStep('email');
                  resetErrors();
                }}
                className="text-sm font-medium text-pittNavy hover:text-pittDeepNavy transition-colors"
              >
                Sign in with an email code instead
              </button>
            )}
            <p className="mt-4 text-sm text-gray-600">
              New here?{' '}
              <Link to="/register" className="font-medium text-pittNavy hover:text-pittDeepNavy">
                Create an account
              </Link>
            </p>
          </div>
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
