/**
 * SignUpForm Component
 * 
 * Sign up form using design system components with password strength indicator.
 * Requirements: 2.1, 2.2, 2.3, 16.2
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../../design-system/components/Button/Button';
import { Input } from '../../design-system/components/Input/Input';
import { Card } from '../../design-system/components/Card/Card';

/**
 * Calculate password strength
 * Returns: 'weak', 'medium', 'strong'
 */
function calculatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length === 0) return 'weak';
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
}

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  // Calculate password strength
  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  // Password strength indicator colors
  const strengthColors = {
    weak: 'bg-error-500',
    medium: 'bg-warning-500',
    strong: 'bg-success-500',
  };

  const strengthTextColors = {
    weak: 'text-error-600 dark:text-error-400',
    medium: 'text-warning-600 dark:text-warning-400',
    strong: 'text-success-600 dark:text-success-400',
  };

  const strengthLabels = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  };

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md mx-auto">
      {/* Icon header */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Title and subtitle */}
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2">
        Join Lyfora
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8">
        Start your wellness journey today
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
        <div>
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock size={20} />}
            required
            autoComplete="new-password"
            helperText="At least 6 characters"
          />
          
          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                <div className={`h-1 flex-1 rounded-full transition-colors ${
                  passwordStrength === 'weak' ? strengthColors.weak : 'bg-neutral-200 dark:bg-neutral-700'
                }`} />
                <div className={`h-1 flex-1 rounded-full transition-colors ${
                  passwordStrength === 'medium' || passwordStrength === 'strong' ? strengthColors[passwordStrength] : 'bg-neutral-200 dark:bg-neutral-700'
                }`} />
                <div className={`h-1 flex-1 rounded-full transition-colors ${
                  passwordStrength === 'strong' ? strengthColors.strong : 'bg-neutral-200 dark:bg-neutral-700'
                }`} />
              </div>
              <p className={`text-xs font-medium ${strengthTextColors[passwordStrength]}`}>
                Password strength: {strengthLabels[passwordStrength]}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password input with design system Input component */}
        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock size={20} />}
          required
          autoComplete="new-password"
          error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
        />

        {/* Submit button with design system Button component */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* Toggle to login */}
      <p className="mt-6 text-center text-neutral-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}