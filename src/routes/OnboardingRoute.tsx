/**
 * Onboarding Route Component
 * 
 * Displays the onboarding flow for new users.
 * Requirements: 2.1, 2.2, 6.1, 10.3, 10.4, 12.1, 12.2
 */

import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from '../components/Onboarding/OnboardingFlow';
import { PageTransition } from '../components/PageTransition';

export function OnboardingRoute() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <PageTransition>
      <OnboardingFlow onComplete={handleComplete} />
    </PageTransition>
  );
}

export default OnboardingRoute;
