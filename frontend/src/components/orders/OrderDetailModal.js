import React from "react";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Chi tiết đơn hàng #{order.order_id}</h3>
        <p><b>Khách hàng:</b> {order.customer_name}</p>
        <p><b>Email:</b> {order.customer_email}</p>
        <p><b>Ngày đặt:</b> {order.order_date ? new Date(order.order_date).toLocaleString() : ""}</p>
        <p><b>Trạng thái:</b> {order.status}</p>
        <p><b>Tổng tiền:</b> {order.total?.toLocaleString()} đ</p>
        <p><b>Sản phẩm:</b> {order.items}</p>
        {/* Thêm các thông tin chi tiết khác nếu cần */}
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default OrderDetailModal;
