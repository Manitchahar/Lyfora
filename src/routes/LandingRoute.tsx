/**
 * Landing Route Component
 * 
 * Displays the landing page for unauthenticated users.
 * Requirements: 1.1, 1.2, 1.3, 1.4, 12.1, 12.2
 */

import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../components/Landing/LandingPage';
import { PageTransition } from '../components/PageTransition';

export function LandingRoute() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <PageTransition>
      <LandingPage onGetStarted={handleGetStarted} />
    </PageTransition>
  );
}

export default LandingRoute;
