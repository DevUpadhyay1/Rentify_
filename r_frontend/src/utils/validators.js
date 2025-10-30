/**
 * Validate email
 * @param {string} email - Email address
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!re.test(email)) {
    return 'Invalid email address';
  }
  
  return true;
};

/**
 * Validate password
 * @param {string} password - Password
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return true;
};

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 10) {
    return 'Phone number must be 10 digits';
  }
  
  return true;
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  
  return true;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value || value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  return true;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  
  return true;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateUrl = (url) => {
  if (!url) return 'URL is required';
  
  try {
    new URL(url);
    return true;
  } catch {
    return 'Invalid URL';
  }
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateRange = (value, min, max) => {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return 'Must be a valid number';
  }
  
  if (num < min || num > max) {
    return `Must be between ${min} and ${max}`;
  }
  
  return true;
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return 'File is required';
  
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  
  if (file.size > maxSize) {
    return `File size must not exceed ${maxSizeMB}MB`;
  }
  
  return true;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']) => {
  if (!file) return 'File is required';
  
  if (!allowedTypes.includes(file.type)) {
    return `File type must be ${allowedTypes.join(', ')}`;
  }
  
  return true;
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateUrl,
  validateRange,
  validateFileSize,
  validateFileType,
};