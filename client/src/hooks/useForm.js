/**
 * Hook: useForm
 * Comprehensive form state management with validation
 * 
 * @description Manages form state, errors, validation, and submission
 * @param {Object} config - Configuration object
 * @param {Object} config.initialValues - Initial form values
 * @param {Function} config.onSubmit - Submission handler
 * @param {Object} config.validations - Field validation functions
 * 
 * @returns {Object} Form state and handlers
 * 
 * @example
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   validations: {
 *     email: (val) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) 
 *       ? 'Invalid email' : ''
 *   },
 *   onSubmit: async (values) => { ... }
 * });
 */

import { useState, useCallback } from 'react';

export const useForm = ({ 
  initialValues, 
  onSubmit, 
  validations = {} 
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field, value) => {
    if (validations[field]) {
      const error = validations[field](value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
      return !error;
    }
    return true;
  }, [validations]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(validations).forEach(field => {
      const error = validations[field](values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validations]);

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

  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateForm,
    validateField
  };
};
