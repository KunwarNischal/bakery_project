/**
 * Hook: useFormManager
 * Unified form state management with flexible validation
 * 
 * @description Manages form state, values, errors, touched fields, and validation
 * Supports both simple validation functions and advanced rule-based validation
 * 
 * @param {Object} config - Configuration object
 * @param {Object} config.initialValues - Initial form values
 * @param {Function} config.onSubmit - Submission handler
 * @param {Object} config.validations - Validation config (can be functions or rule objects)
 * 
 * @returns {Object} Complete form state and handlers
 * 
 * @example
 * // Simple validation with functions
 * const form = useFormManager({
 *   initialValues: { email: '' },
 *   validations: {
 *     email: (val) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Invalid email' : ''
 *   },
 *   onSubmit: (values) => { ... }
 * });
 * 
 * @example
 * // Advanced validation with rules
 * const form = useFormManager({
 *   initialValues: { password: '' },
 *   validations: {
 *     password: [
 *       { required: 'Password required' },
 *       { minLength: { value: 8, message: 'Min 8 chars' } },
 *       { pattern: { value: /[A-Z]/, message: 'Need uppercase' } }
 *     ]
 *   },
 *   onSubmit: (values) => { ... }
 * });
 */

import { useState, useCallback } from 'react';

export const useFormManager = ({ 
  initialValues = {}, 
  onSubmit, 
  validations = {} 
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   * Supports both function validators and rule-based validators
   */
  const validateField = useCallback((field, value) => {
    const validation = validations[field];
    if (!validation) return true;

    let fieldError = '';

    // Handle function-based validation (simple)
    if (typeof validation === 'function') {
      fieldError = validation(value) || '';
    }
    // Handle rule-based validation (advanced)
    else if (Array.isArray(validation)) {
      for (const rule of validation) {
        if (rule.required && !value) {
          fieldError = rule.required;
          break;
        }
        if (rule.minLength && value && value.length < rule.minLength.value) {
          fieldError = rule.minLength.message;
          break;
        }
        if (rule.maxLength && value && value.length > rule.maxLength.value) {
          fieldError = rule.maxLength.message;
          break;
        }
        if (rule.pattern && value && !rule.pattern.value.test(value)) {
          fieldError = rule.pattern.message;
          break;
        }
        if (rule.custom && !rule.custom.validator(value)) {
          fieldError = rule.custom.message;
          break;
        }
      }
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
    
    return !fieldError;
  }, [validations]);

  /**
   * Validate entire form
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(field => {
      const validation = validations[field];
      let fieldError = '';

      // Handle function-based validation
      if (typeof validation === 'function') {
        fieldError = validation(values[field]) || '';
      }
      // Handle rule-based validation
      else if (Array.isArray(validation)) {
        for (const rule of validation) {
          if (rule.required && !values[field]) {
            fieldError = rule.required;
            break;
          }
          if (rule.minLength && values[field] && values[field].length < rule.minLength.value) {
            fieldError = rule.minLength.message;
            break;
          }
          if (rule.maxLength && values[field] && values[field].length > rule.maxLength.value) {
            fieldError = rule.maxLength.message;
            break;
          }
          if (rule.pattern && values[field] && !rule.pattern.value.test(values[field])) {
            fieldError = rule.pattern.message;
            break;
          }
          if (rule.custom && !rule.custom.validator(values[field])) {
            fieldError = rule.custom.message;
            break;
          }
        }
      }

      if (fieldError) {
        newErrors[field] = fieldError;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validations]);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: fieldValue }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      validateField(name, fieldValue);
    }
  }, [touched, validateField]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Set a specific field value
   */
  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Set error for a specific field
   */
  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Mark a field as touched
   */
  const setFieldTouched = useCallback((field, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    
    // Field methods
    setFieldValue,
    setFieldError,
    setFieldTouched,
    clearError,
    clearErrors,
    
    // Validation methods
    validateField,
    validateForm
  };
};
