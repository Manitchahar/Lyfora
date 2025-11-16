/**
 * LoginForm Component
 * 
 * Login form using design system components.
 * Requirements: 2.1, 2.2, 2.3, 15.1, 15.4, 16.1, 16.2
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../../design-system/components/Button/Button';
import { Input } from '../../design-system/components/Input/Input';
import { Card } from '../../design-system/components/Card/Card';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md mx-auto">
      {/* Icon header */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
          <LogIn className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Title and subtitle */}
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2">
        Welcome Back
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8">
        Sign in to continue your wellness journey
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error display with design system styling */}
        {error && (
          <div 
            className="p-4 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 rounded-lg text-error-700 dark:text-error-300 text-sm flex items-start gap-2"
            role="alert"
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Email input with design system Input component */}
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={<Mail size={20} />}
          required
          autoComplete="email"
        />

        {/* Password input with design system Input component */}
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock size={20} />}
          required
          autoComplete="current-password"
        />

        {/* Submit button with design system Button component */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Toggle to signup */}
      <p className="mt-6 text-center text-neutral-600 dark:text-neutral-400">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}