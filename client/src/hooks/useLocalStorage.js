/**
 * Hook: useLocalStorage
 * Reactive localStorage hook with JSON serialization
 * 
 * @description Syncs component state with browser localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - Default value
 * @param {Object} options - Configuration
 * @param {boolean} options.sync - Sync across tabs/windows
 * 
 * @returns {Array} [value, setValue]
 * 
 * @example
 * const [user, setUser] = useLocalStorage('user', null);
 * const [cart, setCart] = useLocalStorage('cart', [], { sync: true });
 */

import { useState, useEffect } from 'react';

export const useLocalStorage = (
  key,
  initialValue,
  options = {}
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Cross-tab synchronization
  useEffect(() => {
    if (!options.sync) return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error syncing storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, options.sync]);

  return [storedValue, setValue];
};
