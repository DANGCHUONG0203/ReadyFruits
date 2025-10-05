// Central export file for all utility functions
// Modern React architecture with comprehensive utility library

// Core utilities
export { default as formatPrice } from './formatPrice';
export * from './formatPrice';

export { default as dateUtils } from './dateUtils';
export * from './dateUtils';

export { default as stringUtils } from './stringUtils';
export * from './stringUtils';

export { default as arrayUtils } from './arrayUtils';
export * from './arrayUtils';

export { default as objectUtils } from './objectUtils';
export * from './objectUtils';

export { default as storageUtils } from './storageUtils';
export * from './storageUtils';

export { default as performanceUtils } from './performanceUtils';
export * from './performanceUtils';

export { default as validationUtils } from './validationUtils';
export * from './validationUtils';

// Common utility functions
export const utils = {
  // Type checking utilities
  isString: (value) => typeof value === 'string',
  isNumber: (value) => typeof value === 'number' && !isNaN(value),
  isBoolean: (value) => typeof value === 'boolean',
  isFunction: (value) => typeof value === 'function',
  isArray: (value) => Array.isArray(value),
  isObject: (value) => value !== null && typeof value === 'object' && !Array.isArray(value),
  isDate: (value) => value instanceof Date,
  isNull: (value) => value === null,
  isUndefined: (value) => value === undefined,
  isNullOrUndefined: (value) => value == null,
  isEmpty: (value) => {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  // Number utilities
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  roundTo: (value, decimals = 2) => Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals),
  percentage: (value, total) => total === 0 ? 0 : Math.round((value / total) * 100),

  // DOM utilities
  addClass: (element, className) => {
    if (element && element.classList) {
      element.classList.add(className);
    }
  },
  removeClass: (element, className) => {
    if (element && element.classList) {
      element.classList.remove(className);
    }
  },
  toggleClass: (element, className) => {
    if (element && element.classList) {
      element.classList.toggle(className);
    }
  },
  hasClass: (element, className) => {
    return element && element.classList ? element.classList.contains(className) : false;
  },

  // Event utilities
  preventDefault: (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
  },
  stopPropagation: (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
  },
  stopAll: (event) => {
    utils.preventDefault(event);
    utils.stopPropagation(event);
  },

  // URL utilities
  getQueryParams: (url = window.location.search) => {
    const params = new URLSearchParams(url);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },
  setQueryParam: (key, value, url = window.location.href) => {
    const urlObj = new URL(url);
    urlObj.searchParams.set(key, value);
    return urlObj.toString();
  },
  removeQueryParam: (key, url = window.location.href) => {
    const urlObj = new URL(url);
    urlObj.searchParams.delete(key);
    return urlObj.toString();
  },

  // Color utilities
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  adjustBrightness: (hex, percent) => {
    const rgb = utils.hexToRgb(hex);
    if (!rgb) return hex;
    
    const adjust = (color) => {
      const adjusted = Math.round(color * (100 + percent) / 100);
      return Math.min(Math.max(adjusted, 0), 255);
    };
    
    return utils.rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
  },

  // CSS utilities
  getCSSVariable: (variable) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  },
  setCSSVariable: (variable, value) => {
    document.documentElement.style.setProperty(variable, value);
  },

  // Device detection
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  isTablet: () => {
    return /iPad|Android(?=.*\bMobile\b)(?=.*\b(?:Phone|Mobile)\b)/i.test(navigator.userAgent);
  },
  isDesktop: () => {
    return !utils.isMobile() && !utils.isTablet();
  },
  getTouchSupport: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Browser utilities
  getBrowser: () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  },
  getOS: () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    
    return 'Unknown';
  },

  // Scroll utilities
  scrollToTop: (behavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior });
  },
  scrollToElement: (element, behavior = 'smooth', block = 'start') => {
    if (element && element.scrollIntoView) {
      element.scrollIntoView({ behavior, block });
    }
  },
  getScrollPosition: () => {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  },

  // Clipboard utilities
  copyToClipboard: async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Clipboard copy failed:', error);
        return false;
      }
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (error) {
        console.error('Clipboard copy failed:', error);
        document.body.removeChild(textArea);
        return false;
      }
    }
  },

  // Promise utilities
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  timeout: (promise, ms) => {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    );
    return Promise.race([promise, timeoutPromise]);
  },
  retry: async (fn, maxAttempts = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await utils.delay(delay);
      }
    }
  },

  // Error utilities
  createError: (message, code, details = {}) => {
    const error = new Error(message);
    error.code = code;
    error.details = details;
    return error;
  },
  isError: (value) => value instanceof Error,
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error && error.message) return error.message;
    return 'An unknown error occurred';
  }
};

// Environment detection
export const env = {
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test',
  getBrowserInfo: () => ({
    browser: utils.getBrowser(),
    os: utils.getOS(),
    mobile: utils.isMobile(),
    tablet: utils.isTablet(),
    desktop: utils.isDesktop(),
    touchSupport: utils.getTouchSupport()
  })
};

// Constants
export const constants = {
  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  },

  // Common regex patterns
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+84|84|0)?[0-9]{9,10}$/,
    URL: /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  },

  // File types
  FILE_TYPES: {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']
  },

  // Time constants
  TIME: {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
    YEAR: 365 * 24 * 60 * 60 * 1000
  },

  // Size constants
  SIZE: {
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024
  }
};

// Default export with all utilities
export default {
  formatPrice,
  dateUtils,
  stringUtils,
  arrayUtils,
  objectUtils,
  storageUtils,
  performanceUtils,
  validationUtils,
  utils,
  env,
  constants
};