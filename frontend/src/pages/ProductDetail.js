import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { getProductById } from '../services/productService';

import ProductDetailView from './ProductDetailView';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useContext(CartContext);
  const { showSuccess, showError, showWarning } = useNotification();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      showWarning('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    if (product.stock <= 0) {
      showError('Sản phẩm đã hết hàng');
      return;
    }

    if (quantity > product.stock) {
      showError('Số lượng vượt quá tồn kho');
      return;
    }

    addToCart(product, quantity);
    showSuccess(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };


  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-error">
        <h2>Có lỗi xảy ra</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Không tìm thấy sản phẩm</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={product}
      quantity={quantity}
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      handleQuantityChange={handleQuantityChange}
      handleAddToCart={handleAddToCart}
      navigate={navigate}
    />
  );
}