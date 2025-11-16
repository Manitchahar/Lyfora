/**
 * Landing Route Component
 * 
 * Displays the landing page for unauthenticated users.
 * Requirements: 1.1, 1.2, 1.3, 1.4, 12.1, 12.2
 */

import { LandingPage } from '../components/Landing/LandingPage';
import { PageTransition } from '../components/PageTransition';

export function LandingRoute() {
  return (
    <PageTransition>
      <LandingPage />
    </PageTransition>
  );
}

export default LandingRoute;
