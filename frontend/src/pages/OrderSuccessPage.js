import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import formatPrice from '../utils/formatPrice';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const orderData = location.state?.orderData;
  const orderId = location.state?.orderId || 'ORD' + Date.now();

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData && !location.state) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderData, location.state, navigate]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-animation">
            <div className="success-icon">✅</div>
            <div className="success-ripple"></div>
          </div>

          <div className="success-message">
            <h1>Đặt hàng thành công!</h1>
            <p className="success-subtitle">
              Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng của chúng tôi
            </p>
          </div>

          {orderData && (
            <div className="order-details">
              <div className="order-info-card">
                <h3>Thông tin đơn hàng</h3>
                
                <div className="order-summary">
                  <div className="order-row">
                    <span className="label">Mã đơn hàng:</span>
                    <span className="value">{orderId}</span>
                  </div>
                  
                  <div className="order-row">
                    <span className="label">Khách hàng:</span>
                    <span className="value">{orderData.customer_info?.full_name || user?.full_name}</span>
                  </div>
                  
                  <div className="order-row">
                    <span className="label">Số điện thoại:</span>
                    <span className="value">{orderData.customer_info?.phone}</span>
                  </div>
                  
                  <div className="order-row">
                    <span className="label">Địa chỉ giao hàng:</span>
                    <span className="value">{orderData.customer_info?.address}</span>
                  </div>
                  
                  <div className="order-row">
                    <span className="label">Phương thức thanh toán:</span>
                    <span className="value">
                      {orderData.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
                    </span>
                  </div>

                  <div className="order-divider"></div>

                  <div className="order-items">
                    <h4>Sản phẩm đã đặt ({orderData.items?.length || 0} sản phẩm)</h4>
                    {orderData.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="item-price">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-divider"></div>

                  <div className="order-total">
                    <div className="total-row">
                      <span className="total-label">Tổng cộng:</span>
                      <span className="total-value">
                        {formatPrice(orderData.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="success-timeline">
            <h3>Quy trình xử lý đơn hàng</h3>
            <div className="timeline">
              <div className="timeline-item active">
                <div className="timeline-icon">📝</div>
                <div className="timeline-content">
                  <h4>Đặt hàng thành công</h4>
                  <p>Đơn hàng của bạn đã được tiếp nhận</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-icon">📞</div>
                <div className="timeline-content">
                  <h4>Xác nhận đơn hàng</h4>
                  <p>Chúng tôi sẽ gọi xác nhận trong 30 phút</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-icon">📦</div>
                <div className="timeline-content">
                  <h4>Chuẩn bị hàng</h4>
                  <p>Đóng gói và chuẩn bị giao hàng</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-icon">🚚</div>
                <div className="timeline-content">
                  <h4>Giao hàng</h4>
                  <p>Giao hàng trong 1-2 giờ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button 
              className="primary-btn"
              onClick={handleContinueShopping}
            >
              Tiếp tục mua sắm
            </button>
            
            {user && (
              <button 
                className="secondary-btn"
                onClick={handleViewOrders}
              >
                Xem đơn hàng của tôi
              </button>
            )}
            
            <Link to="/" className="home-link">
              🏠 Về trang chủ
            </Link>
          </div>

          <div className="contact-info">
            <h4>Cần hỗ trợ?</h4>
            <p>
              Liên hệ: <strong>0123 456 789</strong> | 
              Email: <strong>support@fruitshop.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
