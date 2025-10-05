import api from './api';

// Category Service with comprehensive category management
class CategoryService {
  // Get all categories
  async getAllCategories(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add search
      if (params.search) queryParams.append('search', params.search);
      
      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Add active filter
      if (params.active !== undefined) queryParams.append('active', params.active);
      
      const url = `/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        categories: response.data.categories || response.data,
        pagination: response.data.pagination || null,
        total: response.data.total || response.data.length
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get active categories only
  async getActiveCategories() {
    try {
      const result = await this.getAllCategories({ active: true });
      return result.categories;
    } catch (error) {
      console.error('Error fetching active categories:', error);
      throw error;
    }
  }

  // Get single category by ID
  async getCategoryById(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  }

  // Get category with products
  async getCategoryWithProducts(categoryId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add product pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add product sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const url = `/categories/${categoryId}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId} with products:`, error);
      throw error;
    }
  }

  // Search categories
  async searchCategories(query, params = {}) {
    try {
      const searchParams = {
        search: query,
        ...params
      };
      
      return await this.getAllCategories(searchParams);
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }

  // Create new category (admin only)
  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', {
        ...categoryData,
        created_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update category (admin only)
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await api.put(`/categories/${categoryId}`, {
        ...categoryData,
        updated_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${categoryId}:`, error);
      throw error;
    }
  }

  // Delete category (admin only)
  async deleteCategory(categoryId) {
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${categoryId}:`, error);
      throw error;
    }
  }

  // Toggle category active status
  async toggleCategoryStatus(categoryId) {
    try {
      const response = await api.patch(`/categories/${categoryId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling category ${categoryId} status:`, error);
      throw error;
    }
  }

  // Upload category image
  async uploadCategoryImage(categoryId, imageFile, onUploadProgress) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`/categories/${categoryId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress,
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for category ${categoryId}:`, error);
      throw error;
    }
  }

  // Get category statistics
  async getCategoryStats() {
    try {
      const response = await api.get('/categories/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      // Return fallback stats
      return {
        total: 0,
        active: 0,
        inactive: 0,
        with_products: 0,
        empty: 0
      };
    }
  }

  // Get categories with product counts
  async getCategoriesWithCounts() {
    try {
      const response = await api.get('/categories/with-counts');
      return response.data;
    } catch (error) {
      console.log('Categories with counts endpoint not available, using fallback');
      // Fallback to regular categories
      const result = await this.getAllCategories();
      return result.categories.map(category => ({
        ...category,
        product_count: 0 // Placeholder count
      }));
    }
  }

  // Reorder categories
  async reorderCategories(categoryOrders) {
    try {
      const response = await api.patch('/categories/reorder', { orders: categoryOrders });
      return response.data;
    } catch (error) {
      console.error('Error reordering categories:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateCategories(updates) {
    try {
      const response = await api.patch('/categories/bulk-update', { updates });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating categories:', error);
      throw error;
    }
  }

  async bulkDeleteCategories(categoryIds) {
    try {
      const response = await api.delete('/categories/bulk-delete', { 
        data: { ids: categoryIds } 
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
      throw error;
    }
  }

  // Export categories
  async exportCategories(format = 'csv') {
    try {
      const response = await api.get(`/categories/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting categories:', error);
      throw error;
    }
  }

  // Import categories
  async importCategories(file, onUploadProgress) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/categories/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error importing categories:', error);
      throw error;
    }
  }

  // Category hierarchy operations (if supporting nested categories)
  async getCategoryTree() {
    try {
      const response = await api.get('/categories/tree');
      return response.data;
    } catch (error) {
      console.log('Category tree endpoint not available, using flat structure');
      // Fallback to flat categories
      const result = await this.getAllCategories();
      return result.categories;
    }
  }

  async getCategoryPath(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}/path`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId} path:`, error);
      // Return just the category itself
      const category = await this.getCategoryById(categoryId);
      return [category];
    }
  }

  // Utility methods
  formatCategoryForDisplay(category) {
    return {
      ...category,
      formattedCreatedDate: new Date(category.created_at).toLocaleDateString(),
      statusText: category.is_active ? 'Active' : 'Inactive',
      statusColor: category.is_active ? '#10b981' : '#ef4444'
    };
  }

  // Validate category data
  validateCategoryData(categoryData) {
    const errors = [];
    
    if (!categoryData.category_name || categoryData.category_name.trim().length < 2) {
      errors.push('Category name must be at least 2 characters long');
    }
    
    if (categoryData.category_name && categoryData.category_name.length > 100) {
      errors.push('Category name must not exceed 100 characters');
    }
    
    if (categoryData.description && categoryData.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate category slug
  generateSlug(categoryName) {
    return categoryName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}

// Create singleton instance
const categoryService = new CategoryService();

// Export individual methods for backward compatibility
export const getAllCategories = (params) => categoryService.getAllCategories(params);
export const getActiveCategories = () => categoryService.getActiveCategories();
export const getCategoryById = (id) => categoryService.getCategoryById(id);
export const getCategoryWithProducts = (id, params) => categoryService.getCategoryWithProducts(id, params);
export const searchCategories = (query, params) => categoryService.searchCategories(query, params);
export const createCategory = (data) => categoryService.createCategory(data);
export const updateCategory = (id, data) => categoryService.updateCategory(id, data);
export const deleteCategory = (id) => categoryService.deleteCategory(id);
export const toggleCategoryStatus = (id) => categoryService.toggleCategoryStatus(id);
export const uploadCategoryImage = (id, file, onProgress) => categoryService.uploadCategoryImage(id, file, onProgress);
export const getCategoryStats = () => categoryService.getCategoryStats();
export const getCategoriesWithCounts = () => categoryService.getCategoriesWithCounts();
export const reorderCategories = (orders) => categoryService.reorderCategories(orders);
export const bulkUpdateCategories = (updates) => categoryService.bulkUpdateCategories(updates);
export const bulkDeleteCategories = (ids) => categoryService.bulkDeleteCategories(ids);
export const exportCategories = (format) => categoryService.exportCategories(format);
export const importCategories = (file, onProgress) => categoryService.importCategories(file, onProgress);
export const getCategoryTree = () => categoryService.getCategoryTree();
export const getCategoryPath = (id) => categoryService.getCategoryPath(id);
export const formatCategoryForDisplay = (category) => categoryService.formatCategoryForDisplay(category);
export const validateCategoryData = (data) => categoryService.validateCategoryData(data);
export const generateSlug = (name) => categoryService.generateSlug(name);

// Export service instance
export default categoryService;