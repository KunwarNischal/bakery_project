/**
 * Toast Context - Global state management for notifications
 *
 * This context provides toast notification functionality across the entire application:
 * - Manages toast notifications array
 * - Handles toast creation and auto-removal after duration
 * - Provides addToast function for triggering notifications
 * - Separate from CartContext - single responsibility principle
 */

import React, { useState } from 'react';
import { ToastContext } from './toastContextValue';

export const ToastProvider = ({ children }) => {
  // Array to store active toast notifications
  const [toasts, setToasts] = useState([]);

  /**
   * Add a toast notification that auto-dismisses after 3 seconds
   * @param {string} message - The notification message to display
   * @param {string} type - Type of notification: 'success', 'error', 'info', or 'warning'
   */
  const addToast = (message, type = 'success') => {
    // Generate unique ID for each toast
    const id = Date.now();
    // Add new toast to list
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-remove toast after 3 seconds
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Context value object with all toast-related state and functions
  const value = {
    // Array of active toast notifications
    toasts,
    // Function to show notification
    addToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Re-export ToastContext for backward compatibility
export { ToastContext };
