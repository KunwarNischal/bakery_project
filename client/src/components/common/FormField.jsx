import React from 'react';
import PropTypes from 'prop-types';

/**
 * FormField Component
 * Reusable form input with integrated error display, label, and validation styling
 * 
 * @componentn
 * @param {Object} props - Component props
 * @param {string} props.label - Field label text
 * @param {string} props.name - Input field name
 * @param {string} props.type - Input type (text, email, password, textarea, select)
 * @param {string} props.value - Current field value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.touched] - Whether field has been touched
 * @param {string} [props.placeholder] - Placeholder text
 * @param {Array} [props.options] - Options for select type
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.required] - Mark as required in label
 * @param {string} [props.helpText] - Help text below field
 * 
 * @example
 * <FormField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   value={form.values.email}
 *   onChange={form.handleChange}
 *   onBlur={form.handleBlur}
 *   error={form.errors.email}
 *   touched={form.touched.email}
 *   placeholder="your@email.com"
 *   required
 * />
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  options = [],
  className = '',
  required = false,
  helpText,
  disabled = false,
  ...rest
}) => {
  const showError = error && touched;
  const baseInputClasses = `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all ${
    showError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-200 focus:border-light-brown focus:ring-light-brown/20'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-bold text-dark-brown mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClasses}
          rows="4"
          {...rest}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={baseInputClasses}
          {...rest}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map(option => (
            <option key={option._id || option.value} value={option._id || option.value}>
              {option.name || option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClasses}
          {...rest}
        />
      )}

      {showError && (
        <p className="text-red-500 text-xs font-semibold mt-1 flex items-center">
          ⚠ {error}
        </p>
      )}

      {helpText && !showError && (
        <p className="text-gray-500 text-xs mt-1">{helpText}</p>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'tel',
    'date',
    'textarea',
    'select'
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      value: PropTypes.string,
      name: PropTypes.string,
      label: PropTypes.string
    })
  ),
  className: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  disabled: PropTypes.bool
};

export default FormField;
