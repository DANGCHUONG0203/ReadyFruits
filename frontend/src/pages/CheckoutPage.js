import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import formatPrice from '../utils/formatPrice';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, clearCart, getCartTotal } = useContext(CartContext);
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    district: '',
    notes: '',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Tỉnh/Thành phố là bắt buộc';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'Quận/Huyện là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        customer_info: {
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: `${formData.address}, ${formData.district}, ${formData.city}`,
          notes: formData.notes
        },
        payment_method: formData.paymentMethod,
        total_amount: getCartTotal()
      };

      const response = await api.post('/orders', orderData);
      
      // New payment API logic
      const paymentResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          })),
          shipping_address: `${formData.address}, ${formData.district}, ${formData.city}`
        })
      });

      const data = await paymentResponse.json();
      if (paymentResponse.ok) {
        showSuccess('Thanh toán thành công!');
        clearCart();
        navigate('/order-success');
      } else {
        showError(data.message || 'Có lỗi xảy ra');
      }

    } catch (error) {
      console.error('Order error:', error);
      showError(
        error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại!',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Thanh toán đơn hàng</h1>
          <p>Vui lòng kiểm tra thông tin và hoàn tất đặt hàng</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmitOrder}>
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">👤</span>
                  Thông tin khách hàng
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Họ và tên *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.fullName ? 'error' : ''}`}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Nhập địa chỉ email"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">🏠</span>
                  Địa chỉ giao hàng
                </h3>

                <div className="form-group">
                  <label htmlFor="address">Địa chỉ cụ thể *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`form-input ${errors.address ? 'error' : ''}`}
                    placeholder="Số nhà, tên đường"
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="district">Quận/Huyện *</label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`form-input ${errors.district ? 'error' : ''}`}
                      placeholder="Nhập quận/huyện"
                    />
                    {errors.district && <span className="error-message">{errors.district}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">Tỉnh/Thành phố *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-input ${errors.city ? 'error' : ''}`}
                      placeholder="Nhập tỉnh/thành phố"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Ghi chú (tùy chọn)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">💳</span>
                  Phương thức thanh toán
                </h3>

                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">💰</span>
                      <div>
                        <strong>Thanh toán khi nhận hàng (COD)</strong>
                        <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                      </div>
                    </span>
                  </label>

                  <label className="payment-option disabled">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      disabled
                    />
                    <span className="payment-label">
                      <span className="payment-icon">🏦</span>
                      <div>
                        <strong>Chuyển khoản ngân hàng</strong>
                        <p>Sẽ có sớm (đang phát triển)</p>
                      </div>
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate('/cart')}
                >
                  ← Quay lại giỏ hàng
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    `Đặt hàng - ${formatPrice(getCartTotal())}`
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="order-summary">
            <div className="summary-card">
              <h3>Đơn hàng của bạn</h3>

              <div className="order-items">
                {cart.map(item => (
                  <div key={item.product_id} className="order-item">
                    <div className="item-info">
                      <img 
                        src={item.image || `/api/placeholder/50/50`} 
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Tạm tính ({cart.length} sản phẩm)</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>

                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span className="free">Miễn phí</span>
                </div>

                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
