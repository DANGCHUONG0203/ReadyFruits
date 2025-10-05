import api from './api';

// Customer Service with comprehensive customer management
class CustomerService {
  // Get all customers (admin only)
  async getAllCustomers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add search
      if (params.search) queryParams.append('search', params.search);
      
      // Add filters
      if (params.status) queryParams.append('status', params.status);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      
      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const url = `/customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        customers: response.data.customers || response.data,
        pagination: response.data.pagination || null,
        total: response.data.total || response.data.length
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get single customer by ID
  async getCustomerById(customerId) {
    try {
      const response = await api.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  }

  // Get current customer profile
  async getProfile() {
    try {
      const response = await api.get('/customers/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw error;
    }
  }

  // Update customer profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/customers/profile', {
        ...profileData,
        updated_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating customer profile:', error);
      throw error;
    }
  }

  // Search customers
  async searchCustomers(query, params = {}) {
    try {
      const searchParams = {
        search: query,
        ...params
      };
      
      return await this.getAllCustomers(searchParams);
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  // Create new customer (admin only)
  async createCustomer(customerData) {
    try {
      const response = await api.post('/customers', {
        ...customerData,
        created_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Update customer (admin only)
  async updateCustomer(customerId, customerData) {
    try {
      const response = await api.put(`/customers/${customerId}`, {
        ...customerData,
        updated_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${customerId}:`, error);
      throw error;
    }
  }

  // Delete customer (admin only)
  async deleteCustomer(customerId) {
    try {
      const response = await api.delete(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer ${customerId}:`, error);
      throw error;
    }
  }

  // Get customer orders
  async getCustomerOrders(customerId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const url = `/customers/${customerId}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        orders: response.data.orders || response.data,
        pagination: response.data.pagination || null,
        total: response.data.total || response.data.length
      };
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      throw error;
    }
  }

  // Get customer statistics
  async getCustomerStats(customerId) {
    try {
      const response = await api.get(`/customers/${customerId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for customer ${customerId}:`, error);
      // Return fallback stats
      return {
        total_orders: 0,
        total_spent: 0,
        average_order_value: 0,
        last_order_date: null,
        favorite_category: null
      };
    }
  }

  // Get all customers statistics (admin only)
  async getAllCustomersStats(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      
      const url = `/customers/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      // Return fallback stats
      return {
        total_customers: 0,
        active_customers: 0,
        new_customers_this_month: 0,
        total_revenue: 0,
        average_customer_value: 0
      };
    }
  }

  // Customer addresses management
  async getCustomerAddresses(customerId = 'me') {
    try {
      const endpoint = customerId === 'me' ? '/customers/profile/addresses' : `/customers/${customerId}/addresses`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer addresses:', error);
      throw error;
    }
  }

  async addCustomerAddress(addressData, customerId = 'me') {
    try {
      const endpoint = customerId === 'me' ? '/customers/profile/addresses' : `/customers/${customerId}/addresses`;
      const response = await api.post(endpoint, {
        ...addressData,
        created_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error adding customer address:', error);
      throw error;
    }
  }

  async updateCustomerAddress(addressId, addressData, customerId = 'me') {
    try {
      const endpoint = customerId === 'me' 
        ? `/customers/profile/addresses/${addressId}` 
        : `/customers/${customerId}/addresses/${addressId}`;
      
      const response = await api.put(endpoint, {
        ...addressData,
        updated_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating address ${addressId}:`, error);
      throw error;
    }
  }

  async deleteCustomerAddress(addressId, customerId = 'me') {
    try {
      const endpoint = customerId === 'me' 
        ? `/customers/profile/addresses/${addressId}` 
        : `/customers/${customerId}/addresses/${addressId}`;
      
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error deleting address ${addressId}:`, error);
      throw error;
    }
  }

  async setDefaultAddress(addressId, customerId = 'me') {
    try {
      const endpoint = customerId === 'me' 
        ? `/customers/profile/addresses/${addressId}/default` 
        : `/customers/${customerId}/addresses/${addressId}/default`;
      
      const response = await api.patch(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error setting default address ${addressId}:`, error);
      throw error;
    }
  }

  // Customer preferences
  async getCustomerPreferences(customerId = 'me') {
    try {
      const endpoint = customerId === 'me' ? '/customers/profile/preferences' : `/customers/${customerId}/preferences`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer preferences:', error);
      return {
        email_notifications: true,
        sms_notifications: false,
        marketing_emails: true,
        newsletter: true
      };
    }
  }

  async updateCustomerPreferences(preferences, customerId = 'me') {
    try {
      const endpoint = customerId === 'me' ? '/customers/profile/preferences' : `/customers/${customerId}/preferences`;
      const response = await api.put(endpoint, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating customer preferences:', error);
      throw error;
    }
  }

  // Customer avatar/profile picture
  async uploadCustomerAvatar(imageFile, onUploadProgress, customerId = 'me') {
    try {
      const formData = new FormData();
      formData.append('avatar', imageFile);
      
      const endpoint = customerId === 'me' ? '/customers/profile/avatar' : `/customers/${customerId}/avatar`;
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading customer avatar:', error);
      throw error;
    }
  }

  // Bulk operations (admin only)
  async bulkUpdateCustomers(updates) {
    try {
      const response = await api.patch('/customers/bulk-update', { updates });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating customers:', error);
      throw error;
    }
  }

  async bulkDeleteCustomers(customerIds) {
    try {
      const response = await api.delete('/customers/bulk-delete', {
        data: { ids: customerIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting customers:', error);
      throw error;
    }
  }

  // Export customers
  async exportCustomers(params = {}, format = 'csv') {
    try {
      const queryParams = new URLSearchParams(params);
      queryParams.append('format', format);
      
      const response = await api.get(`/customers/export?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  }

  // Customer loyalty/points system
  async getCustomerPoints(customerId = 'me') {
    try {
      const endpoint = customerId === 'me' ? '/customers/profile/points' : `/customers/${customerId}/points`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer points:', error);
      return { points: 0, tier: 'Bronze' };
    }
  }

  async getPointsHistory(customerId = 'me', params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const endpoint = customerId === 'me' 
        ? `/customers/profile/points/history?${queryParams.toString()}`
        : `/customers/${customerId}/points/history?${queryParams.toString()}`;
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching points history:', error);
      return [];
    }
  }

  // Utility methods
  formatCustomerForDisplay(customer) {
    return {
      ...customer,
      full_name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
      formattedJoinDate: new Date(customer.created_at).toLocaleDateString(),
      statusText: customer.is_active ? 'Active' : 'Inactive',
      statusColor: customer.is_active ? '#10b981' : '#ef4444'
    };
  }

  validateCustomerData(customerData) {
    const errors = [];
    
    if (!customerData.first_name || customerData.first_name.trim().length < 1) {
      errors.push('First name is required');
    }
    
    if (!customerData.last_name || customerData.last_name.trim().length < 1) {
      errors.push('Last name is required');
    }
    
    if (!customerData.email || !/\S+@\S+\.\S+/.test(customerData.email)) {
      errors.push('Valid email is required');
    }
    
    if (customerData.phone && !/^\+?[\d\s-()]+$/.test(customerData.phone)) {
      errors.push('Invalid phone number format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateAddressData(addressData) {
    const errors = [];
    
    if (!addressData.address_line_1 || addressData.address_line_1.trim().length < 5) {
      errors.push('Address line 1 must be at least 5 characters long');
    }
    
    if (!addressData.city || addressData.city.trim().length < 2) {
      errors.push('City is required');
    }
    
    if (!addressData.postal_code || addressData.postal_code.trim().length < 3) {
      errors.push('Postal code is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create singleton instance
const customerService = new CustomerService();

// Export individual methods for backward compatibility
export const getAllCustomers = (params) => customerService.getAllCustomers(params);
export const getCustomerById = (id) => customerService.getCustomerById(id);
export const getProfile = () => customerService.getProfile();
export const updateProfile = (data) => customerService.updateProfile(data);
export const searchCustomers = (query, params) => customerService.searchCustomers(query, params);
export const createCustomer = (data) => customerService.createCustomer(data);
export const updateCustomer = (id, data) => customerService.updateCustomer(id, data);
export const deleteCustomer = (id) => customerService.deleteCustomer(id);
export const getCustomerOrders = (id, params) => customerService.getCustomerOrders(id, params);
export const getCustomerStats = (id) => customerService.getCustomerStats(id);
export const getAllCustomersStats = (params) => customerService.getAllCustomersStats(params);
export const getCustomerAddresses = (id) => customerService.getCustomerAddresses(id);
export const addCustomerAddress = (data, id) => customerService.addCustomerAddress(data, id);
export const updateCustomerAddress = (addressId, data, customerId) => customerService.updateCustomerAddress(addressId, data, customerId);
export const deleteCustomerAddress = (addressId, customerId) => customerService.deleteCustomerAddress(addressId, customerId);
export const setDefaultAddress = (addressId, customerId) => customerService.setDefaultAddress(addressId, customerId);
export const getCustomerPreferences = (id) => customerService.getCustomerPreferences(id);
export const updateCustomerPreferences = (preferences, id) => customerService.updateCustomerPreferences(preferences, id);
export const uploadCustomerAvatar = (file, onProgress, id) => customerService.uploadCustomerAvatar(file, onProgress, id);
export const bulkUpdateCustomers = (updates) => customerService.bulkUpdateCustomers(updates);
export const bulkDeleteCustomers = (ids) => customerService.bulkDeleteCustomers(ids);
export const exportCustomers = (params, format) => customerService.exportCustomers(params, format);
export const getCustomerPoints = (id) => customerService.getCustomerPoints(id);
export const getPointsHistory = (id, params) => customerService.getPointsHistory(id, params);
export const formatCustomerForDisplay = (customer) => customerService.formatCustomerForDisplay(customer);
export const validateCustomerData = (data) => customerService.validateCustomerData(data);
export const validateAddressData = (data) => customerService.validateAddressData(data);

// Export service instance
export default customerService;