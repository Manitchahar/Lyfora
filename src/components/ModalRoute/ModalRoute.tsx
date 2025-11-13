/**
 * ModalRoute Component
 * 
 * A wrapper component for routes that should be displayed as modals.
 * Preserves the underlying page and integrates with browser history.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, ModalProps } from '../../design-system/components/Modal/Modal';

export interface ModalRouteProps extends Omit<ModalProps, 'isOpen' | 'onClose'> {
  /** Modal content */
  children: React.ReactNode;
}

/**
 * ModalRoute wrapper component
 * 
 * Features:
 * - Automatically opens when route is active
 * - Closes modal by navigating back (navigate(-1))
 * - Preserves underlying page using location state
 * - Restores focus to triggering element on close
 * - Adds history entry for browser back button support
 * 
 * Usage:
 * ```tsx
 * <Route 
 *   path="personas/:id" 
 *   element={
 *     <ModalRoute title="Persona Chat">
 *       <PersonaChatContent />
 *     </ModalRoute>
 *   } 
 * />
 * ```
 * 
 * To open a modal route:
 * ```tsx
 * navigate('/dashboard/personas/123', { 
 *   state: { backgroundLocation: location } 
 * });
 * ```
 */
export const ModalRoute: React.FC<ModalRouteProps> = ({
  children,
  ...modalProps
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const triggeringElementRef = useRef<HTMLElement | null>(null);

  /**
   * Store reference to the element that had focus when modal opened
   * Requirements: 7.4 - Restore focus to triggering element on modal close
   */
  useEffect(() => {
    // Check if there's a stored trigger element ID in sessionStorage
    const triggerElementId = sessionStorage.getItem('modal-trigger-element-id');
    
    if (triggerElementId) {
      // Find the element by ID
      const triggerElement = document.getElementById(triggerElementId);
      if (triggerElement) {
        triggeringElementRef.current = triggerElement as HTMLElement;
      }
      // Clean up the stored ID
      sessionStorage.removeItem('modal-trigger-element-id');
    } else {
      // Fallback: Store the currently focused element when modal opens
      triggeringElementRef.current = document.activeElement as HTMLElement;
    }

    return () => {
      // Restore focus when modal closes
      if (triggeringElementRef.current && typeof triggeringElementRef.current.focus === 'function') {
        // Use setTimeout to ensure the element is back in the DOM and modal is closed
        setTimeout(() => {
          triggeringElementRef.current?.focus();
        }, 100);
      }
    };
  }, []);

  /**
   * Handle modal close by navigating back
   * Requirements: 7.2 - Browser back button closes modal
   * Requirements: 7.4 - Connect modal onClose to navigate(-1)
   */
  const handleClose = () => {
    navigate(-1);
  };

  // Check if this is a modal route (has backgroundLocation in state)
  const state = location.state as { backgroundLocation?: Location } | null;
  const isModalRoute = !!state?.backgroundLocation;

  return (
    <Modal
      isOpen={isModalRoute}
      onClose={handleClose}
      {...modalProps}
    >
      {children}
    </Modal>
  );
};

ModalRoute.displayName = 'ModalRoute';

export default ModalRoute;
