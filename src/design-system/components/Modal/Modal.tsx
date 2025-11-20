/**
 * Modal Component
 * 
 * A modal dialog component built with Radix UI Dialog primitive.
 * Features backdrop blur, smooth animations, and full accessibility.
 * 
 * Requirements: 2.4, 7.4, 12.1, 14.1, 14.7
 */

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Optional title for the modal */
  title?: string;
  /** Size variant of the modal */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Modal content */
  children: React.ReactNode;
  /** Additional className for the content */
  className?: string;
  /** Whether to show the close button */
  showCloseButton?: boolean;
}

/**
 * Modal component with Radix Dialog
 * 
 * Features:
 * - Built on Radix UI Dialog for accessibility
 * - Backdrop blur effect (8px)
 * - Smooth enter/exit animations with Framer Motion
 * - Four size variants: sm, md, lg, full
 * - Focus trap within modal
 * - Scroll lock on body when open
 * - Close on backdrop click or Escape key
 * - Restores focus to triggering element on close
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
  showCloseButton = true,
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'max-w-md',   // 448px
    md: 'max-w-lg',   // 512px
    lg: 'max-w-2xl',  // 672px
    full: 'max-w-7xl', // 1280px
  };

  // Animation variants for backdrop
  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Animation variants for content
  const contentVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  // Mobile-specific variants (slide up from bottom)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const finalContentVariants = isMobile ? {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
  } : contentVariants;

  // Transition settings
  const transition = {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1] as const, // easeInOut
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                variants={backdropVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                aria-hidden="true"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild forceMount>
              <motion.div
                className={`
                  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                  w-full ${sizeStyles[size]} 
                  max-h-[100dvh] sm:max-h-[90vh] h-full sm:h-auto
                  bg-white dark:bg-neutral-800
                  sm:rounded-2xl shadow-xl
                  p-4 sm:p-6
                  overflow-y-auto
                  z-50
                  focus:outline-none
                  ${className}
                `}
                variants={finalContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between mb-4">
                    {title && (
                      <Dialog.Title
                        id="modal-title"
                        className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <Dialog.Close asChild>
                        <button
                          className="
                            ml-auto
                            rounded-lg
                            p-1.5
                            text-neutral-500
                            hover:text-neutral-700
                            dark:text-neutral-400
                            dark:hover:text-neutral-200
                            hover:bg-neutral-100
                            dark:hover:bg-neutral-700
                            transition-colors
                            duration-150
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary-500
                          "
                          aria-label="Close modal"
                        >
                          <X size={20} aria-hidden="true" />
                        </button>
                      </Dialog.Close>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="text-neutral-700 dark:text-neutral-300">
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

Modal.displayName = 'Modal';

export default Modal;
