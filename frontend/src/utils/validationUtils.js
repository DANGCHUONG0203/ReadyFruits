// Form validation utilities
export const validators = {
  // Basic validators
  required: (value, message = 'This field is required') => {
    const isValid = value !== null && value !== undefined && value !== '';
    return { isValid, message: isValid ? '' : message };
  },

  minLength: (min, message) => (value) => {
    const strValue = String(value || '');
    const isValid = strValue.length >= min;
    return {
      isValid,
      message: isValid ? '' : message || `Must be at least ${min} characters`
    };
  },

  maxLength: (max, message) => (value) => {
    const strValue = String(value || '');
    const isValid = strValue.length <= max;
    return {
      isValid,
      message: isValid ? '' : message || `Must be no more than ${max} characters`
    };
  },

  min: (minVal, message) => (value) => {
    const numValue = Number(value);
    const isValid = !isNaN(numValue) && numValue >= minVal;
    return {
      isValid,
      message: isValid ? '' : message || `Must be at least ${minVal}`
    };
  },

  max: (maxVal, message) => (value) => {
    const numValue = Number(value);
    const isValid = !isNaN(numValue) && numValue <= maxVal;
    return {
      isValid,
      message: isValid ? '' : message || `Must be no more than ${maxVal}`
    };
  },

  pattern: (regex, message) => (value) => {
    const strValue = String(value || '');
    const isValid = regex.test(strValue);
    return {
      isValid,
      message: isValid ? '' : message || 'Invalid format'
    };
  },

  // Email validator
  email: (value, message = 'Please enter a valid email address') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = !value || emailRegex.test(String(value));
    return { isValid, message: isValid ? '' : message };
  },

  // Phone validator (Vietnamese format)
  phone: (value, message = 'Please enter a valid phone number') => {
    const phoneRegex = /^(\+84|84|0)?[0-9]{9,10}$/;
    const cleanPhone = String(value || '').replace(/[\s\-\(\)]/g, '');
    const isValid = !value || phoneRegex.test(cleanPhone);
    return { isValid, message: isValid ? '' : message };
  },

  // URL validator
  url: (value, message = 'Please enter a valid URL') => {
    if (!value) return { isValid: true, message: '' };
    
    try {
      new URL(value);
      return { isValid: true, message: '' };
    } catch {
      return { isValid: false, message };
    }
  },

  // Number validator
  number: (value, message = 'Please enter a valid number') => {
    const isValid = !value || !isNaN(Number(value));
    return { isValid, message: isValid ? '' : message };
  },

  // Integer validator
  integer: (value, message = 'Please enter a valid integer') => {
    const numValue = Number(value);
    const isValid = !value || (Number.isInteger(numValue) && numValue >= 0);
    return { isValid, message: isValid ? '' : message };
  },

  // Password strength validator
  password: (value, options = {}) => {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true
    } = options;

    if (!value) {
      return { isValid: false, message: 'Password is required' };
    }

    const errors = [];
    
    if (value.length < minLength) {
      errors.push(`at least ${minLength} characters`);
    }
    
    if (requireUppercase && !/[A-Z]/.test(value)) {
      errors.push('one uppercase letter');
    }
    
    if (requireLowercase && !/[a-z]/.test(value)) {
      errors.push('one lowercase letter');
    }
    
    if (requireNumbers && !/\d/.test(value)) {
      errors.push('one number');
    }
    
    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('one special character');
    }

    const isValid = errors.length === 0;
    const message = isValid ? '' : `Password must contain ${errors.join(', ')}`;
    
    return { isValid, message };
  },

  // Confirm password validator
  confirmPassword: (confirmValue, originalValue, message = 'Passwords do not match') => {
    const isValid = confirmValue === originalValue;
    return { isValid, message: isValid ? '' : message };
  },

  // Date validator
  date: (value, message = 'Please enter a valid date') => {
    if (!value) return { isValid: true, message: '' };
    
    const date = new Date(value);
    const isValid = !isNaN(date.getTime());
    return { isValid, message: isValid ? '' : message };
  },

  // Date range validator
  dateAfter: (afterDate, message) => (value) => {
    if (!value || !afterDate) return { isValid: true, message: '' };
    
    const valueDate = new Date(value);
    const afterDateTime = new Date(afterDate);
    const isValid = valueDate > afterDateTime;
    
    return {
      isValid,
      message: isValid ? '' : message || `Date must be after ${afterDate}`
    };
  },

  dateBefore: (beforeDate, message) => (value) => {
    if (!value || !beforeDate) return { isValid: true, message: '' };
    
    const valueDate = new Date(value);
    const beforeDateTime = new Date(beforeDate);
    const isValid = valueDate < beforeDateTime;
    
    return {
      isValid,
      message: isValid ? '' : message || `Date must be before ${beforeDate}`
    };
  },

  // File validator
  file: (options = {}) => (files) => {
    const {
      required = false,
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = [],
      maxFiles = 1
    } = options;

    if (!files || files.length === 0) {
      return {
        isValid: !required,
        message: required ? 'Please select a file' : ''
      };
    }

    if (files.length > maxFiles) {
      return {
        isValid: false,
        message: `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`
      };
    }

    for (const file of files) {
      if (file.size > maxSize) {
        return {
          isValid: false,
          message: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
        };
      }

      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return {
          isValid: false,
          message: `File type must be one of: ${allowedTypes.join(', ')}`
        };
      }
    }

    return { isValid: true, message: '' };
  },

  // Custom validator
  custom: (validatorFunc, message = 'Invalid value') => (value) => {
    const isValid = validatorFunc(value);
    return { isValid, message: isValid ? '' : message };
  }
};

// Form validation class
export class FormValidator {
  constructor(rules = {}) {
    this.rules = rules;
    this.errors = {};
  }

  // Add validation rules
  addRule(field, validators) {
    this.rules[field] = Array.isArray(validators) ? validators : [validators];
    return this;
  }

  // Remove validation rule
  removeRule(field) {
    delete this.rules[field];
    delete this.errors[field];
    return this;
  }

  // Validate single field
  validateField(field, value) {
    const fieldRules = this.rules[field];
    if (!fieldRules) return { isValid: true, message: '' };

    for (const rule of fieldRules) {
      const result = typeof rule === 'function' ? rule(value) : rule;
      
      if (!result.isValid) {
        this.errors[field] = result.message;
        return result;
      }
    }

    delete this.errors[field];
    return { isValid: true, message: '' };
  }

  // Validate all fields
  validate(data) {
    const results = {};
    let isFormValid = true;

    // Validate each field with rules
    for (const field of Object.keys(this.rules)) {
      const result = this.validateField(field, data[field]);
      results[field] = result;
      
      if (!result.isValid) {
        isFormValid = false;
      }
    }

    return {
      isValid: isFormValid,
      errors: this.errors,
      results
    };
  }

  // Get errors
  getErrors() {
    return this.errors;
  }

  // Get error for specific field
  getError(field) {
    return this.errors[field] || '';
  }

  // Check if field has error
  hasError(field) {
    return Boolean(this.errors[field]);
  }

  // Clear all errors
  clearErrors() {
    this.errors = {};
    return this;
  }

  // Clear error for specific field
  clearError(field) {
    delete this.errors[field];
    return this;
  }

  // Check if form is valid
  isValid() {
    return Object.keys(this.errors).length === 0;
  }
}

// Validation schema builder
export class ValidationSchema {
  constructor() {
    this.schema = {};
  }

  field(name) {
    this.currentField = name;
    this.schema[name] = [];
    return this;
  }

  required(message) {
    if (this.currentField) {
      this.schema[this.currentField].push(validators.required(undefined, message));
    }
    return this;
  }

  minLength(length, message) {
    if (this.currentField) {
      this.schema[this.currentField].push(validators.minLength(length, message));
    }
    return this;
  }

  maxLength(length, message) {
    if (this.currentField) {
      this.schema[this.currentField].push(validators.maxLength(length, message));
    }
    return this;
  }

  email(message) {
    if (this.currentField) {
      this.schema[this.currentField].push(validators.email(undefined, message));
    }
    return this;
  }

  phone(message) {
    if (this.currentField) {
      this.schema[this.currentField].push(validators.phone(undefined, message));
    }
    return this;
  }

  pattern(regex, message) {
    if (this.currentField) {
      this.schema[this.currentField].push(validators.pattern(regex, message));
    }
    return this;
  }

  custom(validatorFunc, message) {
    if (this.currentField) {
      this.schema[this.currentField].push(validators.custom(validatorFunc, message));
    }
    return this;
  }

  build() {
    return new FormValidator(this.schema);
  }
}

// Form utilities
export const formUtils = {
  // Extract form data
  extractFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes, multiple selects)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  },

  // Reset form
  resetForm(form) {
    if (form && typeof form.reset === 'function') {
      form.reset();
    }
  },

  // Serialize form to JSON
  serializeForm(form) {
    return JSON.stringify(this.extractFormData(form));
  },

  // Populate form with data
  populateForm(form, data) {
    if (!form || !data) return;
    
    for (const [key, value] of Object.entries(data)) {
      const element = form.querySelector(`[name="${key}"]`);
      
      if (element) {
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = Boolean(value);
        } else {
          element.value = value || '';
        }
      }
    }
  },

  // Get changed fields
  getChangedFields(originalData, currentData) {
    const changed = {};
    
    for (const [key, value] of Object.entries(currentData)) {
      if (originalData[key] !== value) {
        changed[key] = {
          from: originalData[key],
          to: value
        };
      }
    }
    
    return changed;
  },

  // Format validation errors for display
  formatErrors(errors) {
    return Object.entries(errors).map(([field, message]) => ({
      field,
      message
    }));
  }
};

// Export all utilities
export default {
  validators,
  FormValidator,
  ValidationSchema,
  formUtils
};