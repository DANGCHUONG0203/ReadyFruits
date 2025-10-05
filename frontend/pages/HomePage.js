import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import ProductCard from '../src/components/ProductCard';
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("Sản phẩm từ backend:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi API:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              🍏 FRUITSHOP
            </h1>
            <p className="hero-subtitle">
              Trái cây tươi ngon - Giao hàng tận nơi
            </p>
            <p className="hero-description">
              Chuyên cung cấp trái cây nhập khẩu và trong nước chất lượng cao, 
              tươi ngon, an toàn cho sức khỏe gia đình bạn.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                Xem sản phẩm
              </Link>
              <a href="https://zalo.me/0977045133" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                Liên hệ Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Sản phẩm nổi bật</h2>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.slice(0, 8).map(product => (
                <div key={product.product_id} className="product-card">
                  <div className="product-image">
                    <img src={product.image_url || '/images/default-fruit.jpg'} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price?.toLocaleString('vi-VN')}đ</p>
                    <Link to={`/products/${product.product_id}`} className="product-link">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="view-all">
            <Link to="/products" className="btn btn-outline">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>Giao hàng nhanh</h3>
              <p>Giao hàng trong 2-4 giờ tại nội thành</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🍎</div>
              <h3>Chất lượng cao</h3>
              <p>100% trái cây tươi ngon, được chọn lọc kỹ càng</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h3>Giá cả hợp lý</h3>
              <p>Cam kết giá tốt nhất thị trường</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📞</div>
              <h3>Hỗ trợ 24/7</h3>
              <p>Tư vấn và hỗ trợ khách hàng mọi lúc</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
