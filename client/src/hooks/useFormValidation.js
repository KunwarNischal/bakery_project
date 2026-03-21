/**
 * Hook: useFormValidation
 * Advanced form field validation with flexible rules
 * 
 * @description Validates form fields with support for multiple validation rules
 * @param {Object} validationRules - Field validation rules configuration
 * 
 * @returns {Object} { errors, validateField, validateForm, clearError, clearErrors }
 * 
 * @example
 * const { errors, validateField } = useFormValidation({
 *   email: [
 *     { required: 'Email required' },
 *     { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }
 *   ]
 * });
 */

import { useState, useCallback } from 'react';

export const useFormValidation = (validationRules = {}) => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value) => {
    const rules = validationRules[field] || [];
    let fieldError = '';

    for (const rule of rules) {
      if (rule.required && !value) {
        fieldError = rule.required;
        break;
      }
      if (rule.minLength && value && value.length < rule.minLength.value) {
        fieldError = rule.minLength.message;
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

    setErrors(prev => ({ ...prev, [field]: fieldError }));
    return !fieldError;
  }, [validationRules]);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      let fieldError = '';

      for (const rule of rules) {
        if (rule.required && !formData[field]) {
          fieldError = rule.required;
          break;
        }
        if (rule.minLength && formData[field] && formData[field].length < rule.minLength.value) {
          fieldError = rule.minLength.message;
          break;
        }
        if (rule.pattern && formData[field] && !rule.pattern.value.test(formData[field])) {
          fieldError = rule.pattern.message;
          break;
        }
        if (rule.custom && !rule.custom.validator(formData[field])) {
          fieldError = rule.custom.message;
          break;
        }
      }

      if (fieldError) {
        newErrors[field] = fieldError;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules]);

  const clearError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearErrors
  };
};
