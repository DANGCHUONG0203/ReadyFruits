import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import './ProductList.css';

export default function ProductList() {
  // Sub-categories cho Giỏ trái cây
  const fruitBasketTypes = [
    { value: '', label: 'Tất cả nhóm nhỏ' },
    { value: 'vieng', label: 'Giỏ trái cây viếng' },
    { value: 'sinh-nhat', label: 'Giỏ trái cây sinh nhật' },
    { value: 'tan-gia', label: 'Giỏ trái cây tân gia' },
    { value: 'cuoi-hoi', label: 'Giỏ trái cây cưới hỏi' },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  
  // mapping từ tên sub-category sang type value
  const subCategoryNameToType = {
    'giỏ trái cây viếng': 'vieng',
    'giỏ trái cây sinh nhật': 'sinh-nhat',
    'giỏ trái cây tân gia': 'tan-gia',
    'giỏ trái cây cưới hỏi': 'cuoi-hoi',
    'kệ hoa chúc mừng': 'ke-chuc-mung',
    'kệ hoa kính viếng': 'ke-kinh-vieng',
    'bó hoa chúc mừng': 'bo-chuc-mung',
    'bó hoa kính viếng': 'bo-kinh-vieng',
  };

  // Khi searchParams thay đổi (ví dụ click từ menu), cập nhật selectedCategory và selectedType
  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';
    setSelectedCategory(urlCategory);
    const urlType = searchParams.get('type') || '';
    setSelectedType(urlType);
  }, [searchParams]);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Lấy page từ URL param (mặc định 1)
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  const {
    products,
    allProducts,
    loading,
    error,
    currentPage,
    totalPages,
    handleSearch,
    handleCategoryFilter,
    handleTypeFilter,
    handleSort,
    goToPage,
    filteredCount,
    totalCount
  } = useProducts({ initialPage: urlPage });

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
    if (selectedType) params.set('type', selectedType);
    
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, sortBy, currentPage, selectedType, setSearchParams]);

  // Apply filters when they change
  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  useEffect(() => {
    handleCategoryFilter(selectedCategory);
  }, [selectedCategory, handleCategoryFilter]);

  useEffect(() => {
    handleTypeFilter(selectedType);
  }, [selectedType, handleTypeFilter]);

  useEffect(() => {
    handleSort(sortBy, 'asc');
  }, [sortBy, handleSort]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Nếu người dùng gõ đúng tên sub-category, tự động chọn type tương ứng
    const lower = value.trim().toLowerCase();
    if (subCategoryNameToType[lower]) {
      setSelectedCategory('1'); // ví dụ: Giỏ trái cây
      setSelectedType(subCategoryNameToType[lower]);
      // cập nhật URL params
      const params = new URLSearchParams(searchParams);
      params.set('category', '1');
      params.set('type', subCategoryNameToType[lower]);
      setSearchParams(params);
    }
    goToPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // Nếu đổi danh mục, reset type về ''
    setSelectedType('');
    goToPage(1);
  };

  // Khi chọn type (sub-category), cập nhật URL params để đồng bộ với menu header
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('type', value);
    } else {
      params.delete('type');
    }
    setSearchParams(params);
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
    setSelectedType('');
    setSortBy('name');
    goToPage(1);
  };

  const hasActiveFilters = searchTerm || selectedCategory || sortBy !== 'name';

  // Lọc theo type nếu có (chỉ lọc khi có type, không hiển thị tất cả nếu type không khớp)
  let filteredProductsByType = products;
  // Nếu searchTerm trùng tên sub-category, chỉ hiển thị sản phẩm nhóm nhỏ đó
  const lowerSearch = searchTerm.trim().toLowerCase();
  if (subCategoryNameToType[lowerSearch]) {
    filteredProductsByType = products.filter(product => product.type === subCategoryNameToType[lowerSearch]);
  }

  // Tiêu đề động cho type
  const typeTitles = {
    'vieng': 'Giỏ trái cây viếng',
    'sinh-nhat': 'Giỏ trái cây sinh nhật',
    'tan-gia': 'Giỏ trái cây tân gia',
    'cuoi-hoi': 'Giỏ trái cây cưới hỏi',
    'ke-chuc-mung': 'Kệ hoa chúc mừng',
    'ke-kinh-vieng': 'Kệ hoa kính viếng',
    'bo-chuc-mung': 'Bó hoa chúc mừng',
    'bo-kinh-vieng': 'Bó hoa kính viếng',
  };
  const dynamicTitle = selectedType && typeTitles[selectedType] ? typeTitles[selectedType] : null;

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>{dynamicTitle || 'Tất cả sản phẩm'}</h1>
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
            {/* Hiện filter sub-category nếu chọn Giỏ trái cây */}
            {selectedCategory === '1' && (
              <div className="filter-group">
                <label htmlFor="type-filter">Nhóm nhỏ:</label>
                <select
                  id="type-filter"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="filter-select"
                >
                  {fruitBasketTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            )}

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
                Hiển thị <strong>{filteredProductsByType.length}</strong> 
                {totalCount > filteredProductsByType.length && ` trong ${totalCount}`} sản phẩm
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
          ) : filteredProductsByType.length === 0 ? (
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
                {(filteredProductsByType || []).map(product => (
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