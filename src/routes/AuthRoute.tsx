/**
 * Auth Route Component
 * 
 * Handles login and signup pages with routing-based mode switching.
 * Uses React Router Link for navigation and implements smooth transitions.
 * Requirements: 5.1, 6.1, 12.1
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/Auth/LoginForm';
import { SignUpForm } from '../components/Auth/SignUpForm';
import { AuthLayout } from '../layouts/AuthLayout';
import { PageTransition } from '../components/PageTransition';

interface AuthRouteProps {
  mode: 'login' | 'signup';
}

/**
 * Page transition variants for smooth animations
 * Requirements: 12.1
 */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number] // easeInOut cubic bezier
};

export function AuthRoute({ mode }: AuthRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      // Check if there's a redirect location from ProtectedRoute
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return (
    <PageTransition>
      <AuthLayout>
        {/* Smooth transitions between login and signup - Requirements: 12.1, 12.2, 12.5 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {mode === 'login' ? <LoginForm /> : <SignUpForm />}
          </motion.div>
        </AnimatePresence>
      </AuthLayout>
    </PageTransition>
  );
}

export default AuthRoute;
