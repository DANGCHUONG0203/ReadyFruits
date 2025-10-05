import React from "react";

const statusMap = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy"
};

const OrderTable = ({ orders, onView }) => (
  <table className="admin-table">
    <thead>
      <tr>
        <th>Mã đơn</th>
        <th>Tên khách hàng</th>
        <th>Email</th>
        <th>Ngày đặt</th>
        <th>Trạng thái</th>
        <th>Tổng tiền</th>
        <th>Sản phẩm</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order.order_id}>
          <td>{order.order_id}</td>
          <td>{order.customer_name}</td>
          <td>{order.customer_email}</td>
          <td>{order.order_date ? new Date(order.order_date).toLocaleString() : ""}</td>
          <td>{statusMap[order.status] || order.status}</td>
          <td>{order.total?.toLocaleString()} đ</td>
          <td>{order.items}</td>
          <td>
            <button onClick={() => onView(order)}>Xem</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrderTable;
