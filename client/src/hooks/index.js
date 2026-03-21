/**
 * Custom Hooks - Central Export
 * 
 * Usage: import { useCart, useFetchData, useFormManager } from '@/hooks';
 */

export { useCart } from './useCart';
export { useFetchData } from './useFetchData';
export { useAuthCheck } from './useAuthCheck';
export { useSearchAndFilter } from './useSearchAndFilter';
export { useLocalStorage } from './useLocalStorage';
export { useApiCall } from './useApiCall';

// Unified form management hook (replaces useForm + useFormValidation)
export { useFormManager } from './useFormManager';

// Backward compatibility aliases
// useForm -> useFormManager
export { useFormManager as useForm };
// useFormValidation -> useFormManager  
export { useFormManager as useFormValidation };
