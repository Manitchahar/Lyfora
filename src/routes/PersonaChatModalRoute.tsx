/**
 * PersonaChatModalRoute Component
 * 
 * Modal route wrapper for PersonaChat component.
 * Integrates PersonaChat with the modal routing pattern.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ModalRoute } from '../components/ModalRoute/ModalRoute';
import PersonaChat from '../components/Personas/PersonaChat';
import { PERSONAS } from '../lib/personas';

/**
 * PersonaChat modal route
 * 
 * Displays the PersonaChat component in a modal overlay.
 * The modal can be closed via:
 * - Browser back button
 * - Escape key
 * - Clicking outside the modal
 * - Close button in the modal
 * 
 * Requirements:
 * - 7.1: Modal routes add history entry
 * - 7.2: Browser back button closes modal
 * - 7.3: Preserve underlying page state
 * - 7.4: Restore focus to triggering element
 * - 7.5: Support deep linking to modal routes
 */
export function PersonaChatModalRoute() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find the persona by ID
  const persona = PERSONAS.find(p => p.id === id);

  // Check if this is a modal route (has backgroundLocation in state)
  const state = location.state as { backgroundLocation?: Location } | null;
  const isModalRoute = !!state?.backgroundLocation;

  /**
   * Handle deep linking - Requirement 7.5
   * If user navigates directly to this route (no backgroundLocation),
   * redirect to dashboard and open as modal
   */
  useEffect(() => {
    if (!isModalRoute && persona) {
      // Redirect to dashboard with modal state
      navigate('/dashboard', { replace: true });
      // Then open the modal
      setTimeout(() => {
        navigate(`/dashboard/personas/${id}`, {
          state: { backgroundLocation: { pathname: '/dashboard' } }
        });
      }, 0);
    }
  }, [isModalRoute, persona, id, navigate]);

  // If persona not found, show error message
  if (!persona) {
    return (
      <ModalRoute title="Persona Not Found" size="md">
        <div className="text-center py-8">
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            The requested persona could not be found.
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Persona ID: <strong>{id}</strong>
          </p>
        </div>
      </ModalRoute>
    );
  }

  // Don't render anything if we're redirecting for deep link
  if (!isModalRoute) {
    return null;
  }

  return (
    <ModalRoute title="" size="lg" showCloseButton={true}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-3xl">
          <PersonaChat persona={persona} />
        </div>
      </div>
    </ModalRoute>
  );
}

export default PersonaChatModalRoute;
