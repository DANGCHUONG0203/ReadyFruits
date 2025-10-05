import api from './api';

// Order Service with comprehensive order management
class OrderService {
  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', {
        ...orderData,
        order_date: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get all orders for current user
  async getUserOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add status filter
      if (params.status) queryParams.append('status', params.status);
      
      // Add date range
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const url = `/orders/my-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        orders: response.data.orders || response.data,
        pagination: response.data.pagination || null,
        total: response.data.total || response.data.length
      };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Get single order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, {
        status,
        notes,
        updated_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  }

  // Cancel order (user or admin)
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`, {
        reason,
        cancelled_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }

  // Get order tracking information
  async getOrderTracking(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tracking for order ${orderId}:`, error);
      // Return basic status if tracking endpoint doesn't exist
      const order = await this.getOrderById(orderId);
      return {
        status: order.status,
        estimated_delivery: order.estimated_delivery,
        tracking_number: order.tracking_number,
        history: [
          {
            status: order.status,
            date: order.updated_at || order.order_date,
            description: `Order ${order.status}`
          }
        ]
      };
    }
  }

  // Admin functions - Get all orders
  async getAllOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filters
      if (params.status) queryParams.append('status', params.status);
      if (params.customerId) queryParams.append('customerId', params.customerId);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.minAmount) queryParams.append('minAmount', params.minAmount);
      if (params.maxAmount) queryParams.append('maxAmount', params.maxAmount);
      
      // Add search
      if (params.search) queryParams.append('search', params.search);
      
      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        orders: response.data.orders || response.data,
        pagination: response.data.pagination || null,
        total: response.data.total || response.data.length,
        stats: response.data.stats || null
      };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      
      const url = `/orders/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      // Return fallback stats
      return {
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        average_order_value: 0
      };
    }
  }

  // Search orders
  async searchOrders(query, params = {}) {
    try {
      const searchParams = {
        search: query,
        ...params
      };
      
      return await this.getAllOrders(searchParams);
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }

  // Get orders by status
  async getOrdersByStatus(status, params = {}) {
    try {
      const statusParams = {
        status,
        ...params
      };
      
      return await this.getAllOrders(statusParams);
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  }

  // Get recent orders
  async getRecentOrders(limit = 10) {
    try {
      const response = await api.get(`/orders/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.log('Recent orders endpoint not available, using fallback');
      // Fallback to regular orders with sorting
      const result = await this.getAllOrders({
        limit,
        sortBy: 'order_date',
        sortOrder: 'desc'
      });
      return result.orders;
    }
  }

  // Update order details (admin only)
  async updateOrder(orderId, orderData) {
    try {
      const response = await api.put(`/orders/${orderId}`, {
        ...orderData,
        updated_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      throw error;
    }
  }

  // Add tracking information
  async addTracking(orderId, trackingData) {
    try {
      const response = await api.post(`/orders/${orderId}/tracking`, trackingData);
      return response.data;
    } catch (error) {
      console.error(`Error adding tracking to order ${orderId}:`, error);
      throw error;
    }
  }

  // Process payment for order
  async processPayment(orderId, paymentData) {
    try {
      const response = await api.post(`/orders/${orderId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error(`Error processing payment for order ${orderId}:`, error);
      throw error;
    }
  }

  // Generate order invoice
  async generateInvoice(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error generating invoice for order ${orderId}:`, error);
      throw error;
    }
  }

  // Export orders
  async exportOrders(params = {}, format = 'csv') {
    try {
      const queryParams = new URLSearchParams(params);
      queryParams.append('format', format);
      
      const response = await api.get(`/orders/export?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

  // Bulk update orders (admin only)
  async bulkUpdateOrders(orderIds, updateData) {
    try {
      const response = await api.patch('/orders/bulk-update', {
        orderIds,
        updateData: {
          ...updateData,
          updated_at: new Date().toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      throw error;
    }
  }

  // Get order status options
  getOrderStatuses() {
    return [
      { value: 'pending', label: 'Pending', color: '#f59e0b' },
      { value: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
      { value: 'processing', label: 'Processing', color: '#8b5cf6' },
      { value: 'shipped', label: 'Shipped', color: '#06b6d4' },
      { value: 'delivered', label: 'Delivered', color: '#10b981' },
      { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
      { value: 'refunded', label: 'Refunded', color: '#6b7280' }
    ];
  }

  // Format order for display
  formatOrderForDisplay(order) {
    const statuses = this.getOrderStatuses();
    const statusInfo = statuses.find(s => s.value === order.status) || statuses[0];
    
    return {
      ...order,
      statusInfo,
      formattedDate: new Date(order.order_date).toLocaleDateString(),
      formattedAmount: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(order.total_amount)
    };
  }
}

// Create singleton instance
const orderService = new OrderService();

// Export individual methods for backward compatibility
export const createOrder = (orderData) => orderService.createOrder(orderData);
export const getUserOrders = (params) => orderService.getUserOrders(params);
export const getOrderById = (orderId) => orderService.getOrderById(orderId);
export const updateOrderStatus = (orderId, status, notes) => orderService.updateOrderStatus(orderId, status, notes);
export const cancelOrder = (orderId, reason) => orderService.cancelOrder(orderId, reason);
export const getOrderTracking = (orderId) => orderService.getOrderTracking(orderId);
export const getAllOrders = (params) => orderService.getAllOrders(params);
export const getOrderStats = (params) => orderService.getOrderStats(params);
export const searchOrders = (query, params) => orderService.searchOrders(query, params);
export const getOrdersByStatus = (status, params) => orderService.getOrdersByStatus(status, params);
export const getRecentOrders = (limit) => orderService.getRecentOrders(limit);
export const updateOrder = (orderId, orderData) => orderService.updateOrder(orderId, orderData);
export const processPayment = (orderId, paymentData) => orderService.processPayment(orderId, paymentData);
export const generateInvoice = (orderId) => orderService.generateInvoice(orderId);
export const exportOrders = (params, format) => orderService.exportOrders(params, format);
export const bulkUpdateOrders = (orderIds, updateData) => orderService.bulkUpdateOrders(orderIds, updateData);
export const getOrderStatuses = () => orderService.getOrderStatuses();
export const formatOrderForDisplay = (order) => orderService.formatOrderForDisplay(order);

// Export service instance
export default orderService;