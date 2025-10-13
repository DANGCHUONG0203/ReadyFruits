import React from 'react';
import { Link } from 'react-router-dom';
import formatPrice from '../utils/formatPrice';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Chuẩn hóa đường dẫn ảnh (nếu là đường dẫn tương đối thì thêm domain backend)
  const normalizeImageUrl = (raw) => {
    if (!raw) return '/placeholder.svg';
    let url = String(raw).trim();
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/uploads/')) {
      return (process.env.REACT_APP_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000') + url;
    }
    return url;
  };
  const imageUrl = normalizeImageUrl(product.image_url) || '/placeholder.svg';
  
  // Hiển thị trạng thái stock
  const getStockStatus = (stock) => {
    if (stock > 10) return { text: `Còn: ${stock}`, class: 'text-success' };
    if (stock > 0) return { text: `Còn: ${stock}`, class: 'text-warning' };
    return { text: 'Hết hàng', class: 'text-danger' };
  };

  const stockStatus = getStockStatus(product.stock || 0);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={imageUrl} 
          className="product-image" 
          alt={`Giỏ trái cây, hoa tươi, sản phẩm ${product.name} - FruitShop`}
          onError={(e) => {
            e.target.src = '/placeholder.svg';
          }}
        />
        {product.stock === 0 && <div className="out-of-stock-overlay">Hết hàng</div>}
      </div>
      
      <div className="product-info">
        <h5 className="product-name" title={product.name}>
          {product.name}
        </h5>
        
        <div className="product-price">
          {formatPrice(product.price)}
        </div>
        
        {product.category_name && (
          <p className="product-category">
            Loại: {product.category_name}
          </p>
        )}
        
        <p className={`product-stock ${stockStatus.class}`}>
          {stockStatus.text}
        </p>
        
        <div className="product-actions">
          <Link 
            className="btn btn-detail" 
            to={`/products/${product.product_id}`}
          >
            Chi tiết
          </Link>
          <button 
            className="btn btn-add-cart" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </div>
  );
}
