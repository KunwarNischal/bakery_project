/**
 * useToast Hook - Custom hook to access toast context
 *
 * This is a custom hook that provides easy access to the Toast Context throughout the application.
 * Instead of using useContext(ToastContext) everywhere, components can simply use this hook.
 *
 * Features:
 * - Access toast notifications array
 * - Add toast notifications
 * - Toast auto-dismisses after 3 seconds
 *
 * Usage:
 * const { addToast, toasts } = useToast();
 * addToast('Success!', 'success');
 *
 * Returns:
 * - toasts: Array of active toast notifications
 * - addToast(message, type): Function to add a new toast notification
 */

import { useContext } from 'react';
import { ToastContext } from '@/shared/context/toastContextValue';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined || context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
