import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../services/productService';
import './HomePage.css';

export default function HomePage() {
  // Hiển thị lưới sản phẩm nổi bật
  const renderProductsGrid = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h3>Đang tải sản phẩm...</h3>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="error-state">
          <div className="empty-icon">⚠️</div>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (!products.length) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🍎</div>
          <h3>Chưa có sản phẩm nổi bật</h3>
          <p>Hệ thống đang cập nhật các sản phẩm mới. Vui lòng quay lại sau!</p>
        </div>
      );
    }
    return (
      <div className="homepage-products-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedProducts(8);
      setProducts(data);
    } catch (err) {
      console.error('Error loading featured products:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            
            
            

            <Link to="/products" className="hero-cta">
              🛒 Mua sắm ngay
            </Link>
          </div>
          
          <div className="hero-image">
            <div className="hero-emoji"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="homepage-section-title">Sản Phẩm Nổi Bật</h2>
            
          </div>
          
          {renderProductsGrid()}
          
          {!loading && !error && products.length > 0 && (
            <div className="section-footer">
              <Link to="/products" className="view-all-btn">
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
