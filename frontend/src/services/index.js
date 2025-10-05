// Service layer exports - Modern React architecture
// All services use enhanced patterns with error handling, interceptors, and utilities

// Core API service with interceptors and error handling
export { default as api } from './api';

// Authentication service with token management and refresh
export { default as authService } from './authService';
export * from './authService';

// Product service with advanced filtering and search
export { default as productService } from './productService';
export * from './productService';

// Order service with comprehensive order management
export { default as orderService } from './orderService';
export * from './orderService';

// Category service with hierarchy support
export { default as categoryService } from './categoryService';
export * from './categoryService';

// Customer service with profile and address management
export { default as customerService } from './customerService';
export * from './customerService';

// Service factory for creating new services
export const createService = (baseURL, options = {}) => {
  const serviceApi = api.create({
    baseURL,
    ...options
  });
  
  return {
    api: serviceApi,
    get: (url, config) => serviceApi.get(url, config),
    post: (url, data, config) => serviceApi.post(url, data, config),
    put: (url, data, config) => serviceApi.put(url, data, config),
    patch: (url, data, config) => serviceApi.patch(url, data, config),
    delete: (url, config) => serviceApi.delete(url, config)
  };
};

// Service utilities
export const serviceUtils = {
  // Create query string from params
  createQueryString: (params) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    return queryParams.toString();
  },
  
  // Format error message
  formatErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
  
  // Handle file download
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  
  // Format currency
  formatCurrency: (amount, currency = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency
    }).format(amount);
  },
  
  // Format date
  formatDate: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Date(date).toLocaleDateString('vi-VN', defaultOptions);
  },
  
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Validate email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  // Validate phone
  validatePhone: (phone) => {
    const re = /^\+?[\d\s-()]+$/;
    return re.test(phone);
  },
  
  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// Service configurations
export const serviceConfig = {
  // Default pagination
  defaultPagination: {
    page: 1,
    limit: 10
  },
  
  // Default sorting
  defaultSort: {
    sortBy: 'created_at',
    sortOrder: 'desc'
  },
  
  // API endpoints
  endpoints: {
    auth: '/auth',
    products: '/products',
    orders: '/orders',
    categories: '/categories',
    customers: '/customers',
    upload: '/upload'
  },
  
  // File upload limits
  uploadLimits: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  
  // Status options
  orderStatuses: [
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
    { value: 'processing', label: 'Processing', color: '#8b5cf6' },
    { value: 'shipped', label: 'Shipped', color: '#06b6d4' },
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    { value: 'refunded', label: 'Refunded', color: '#6b7280' }
  ]
};

// Export all services as default
export default {
  api,
  authService,
  productService,
  orderService,
  categoryService,
  customerService,
  createService,
  serviceUtils,
  serviceConfig
};