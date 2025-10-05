import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import './ProductList.css';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    products,
    allProducts,
    loading,
    error,
    currentPage,
    totalPages,
    handleSearch,
    handleCategoryFilter,
    handleSort,
    goToPage,
    filteredCount,
    totalCount
  } = useProducts();

  // Get categories - temporary mock data
  const categories = [
    { category_id: 1, name: 'Giỏ trái cây' },
    { category_id: 2, name: 'Hoa tươi' },
    { category_id: 3, name: 'Trái cây nhập khẩu' },
  ];

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'name') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, sortBy, currentPage, setSearchParams]);

  // Apply filters when they change
  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  useEffect(() => {
    handleCategoryFilter(selectedCategory);
  }, [selectedCategory, handleCategoryFilter]);

  useEffect(() => {
    handleSort(sortBy, 'asc');
  }, [sortBy, handleSort]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    goToPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    goToPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    goToPage(1);
  };

  const handlePageChange = (page) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('name');
    goToPage(1);
  };

  const hasActiveFilters = searchTerm || selectedCategory || sortBy !== 'name';

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Tất cả sản phẩm</h1>
          <p className="page-subtitle">
            Khám phá bộ sưu tập trái cây tươi ngon, chất lượng cao
          </p>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="category-filter">Danh mục:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả danh mục</option>
                {(categories || []).map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-filter">Sắp xếp:</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={handleSortChange}
                className="filter-select"
              >
                <option value="name">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
                <option value="price">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="clear-filters-btn"
                title="Xóa tất cả bộ lọc"
              >
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <div className="results-count">
            {loading ? (
              'Đang tải...'
            ) : (
              <>
                Hiển thị <strong>{products.length}</strong> 
                {totalCount > products.length && ` trong ${totalCount}`} sản phẩm
                {hasActiveFilters && (
                  <span className="filter-indicator">
                    {searchTerm && ` với từ khóa "${searchTerm}"`}
                    {selectedCategory && categories.find(c => c.category_id.toString() === selectedCategory) && 
                      ` trong danh mục "${categories.find(c => c.category_id.toString() === selectedCategory).name}"`
                    }
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-grid">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="product-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-price"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Có lỗi xảy ra</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Thử lại
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>
                {hasActiveFilters 
                  ? 'Không tìm thấy sản phẩm phù hợp' 
                  : 'Chưa có sản phẩm nào'
                }
              </h3>
              <p>
                {hasActiveFilters
                  ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : 'Cửa hàng đang cập nhật sản phẩm mới'
                }
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="products-grid">
                {(products || []).map(product => (
                  <ProductCard 
                    key={product.product_id} 
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showInfo={true}
                    totalItems={filteredCount}
                    itemsPerPage={12}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
