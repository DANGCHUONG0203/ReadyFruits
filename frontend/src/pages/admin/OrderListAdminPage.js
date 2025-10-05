
import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";

const statusColors = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#06b6d4",
  completed: "#10b981",
  cancelled: "#ef4444"
};

const statusOptions = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" }
];

const OrderListAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, filters]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders({ ...filters, page, limit: pageSize });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Lỗi tải đơn hàng!");
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    }
    setUpdatingId(null);
  };

  // Pagination
  const totalPages = Math.ceil(total / pageSize);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="admin-order-page" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h2 style={{ color: "#e67e22", marginBottom: 24 }}>Quản lý đơn hàng</h2>
      <form className="order-filter" onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          name="search"
          placeholder="Tìm kiếm mã đơn, tên KH, SĐT, email..."
          value={filters.search || ""}
          onChange={handleFilterChange}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <select
          name="status"
          value={filters.status || ""}
          onChange={handleFilterChange}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="">Tất cả trạng thái</option>
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleFilterChange}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleFilterChange}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button type="submit" style={{ padding: "8px 16px", background: "#e67e22", color: "#fff", border: "none", borderRadius: 6 }}>Lọc</button>
      </form>

      <div style={{ overflowX: "auto", borderRadius: 8, boxShadow: "0 2px 8px #0001", background: "#fff" }}>
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={{ padding: 12 }}>Mã đơn</th>
              <th style={{ padding: 12 }}>Khách hàng</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Ngày đặt</th>
              <th style={{ padding: 12 }}>Trạng thái</th>
              <th style={{ padding: 12 }}>Tổng tiền</th>
              <th style={{ padding: 12 }}>Sản phẩm</th>
              <th style={{ padding: 12 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: 10 }}>{order.order_id}</td>
                <td style={{ padding: 10 }}>{order.customer_name}</td>
                <td style={{ padding: 10 }}>{order.customer_email}</td>
                <td style={{ padding: 10 }}>{order.order_date ? new Date(order.order_date).toLocaleString() : ""}</td>
                <td style={{ padding: 10 }}>
                  <select
                    value={order.status}
                    disabled={updatingId === order.order_id}
                    style={{
                      background: statusColors[order.status] || "#eee",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontWeight: 600
                    }}
                    onChange={e => handleStatusChange(order.order_id, e.target.value)}
                  >
                    {statusOptions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: 10 }}>{order.total?.toLocaleString()} đ</td>
                <td style={{ padding: 10 }}>{order.items}</td>
                <td style={{ padding: 10 }}>
                  <button
                    style={{ padding: "6px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6 }}
                    onClick={() => handleViewOrder(order)}
                  >Xem</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 24 }}>Không có đơn hàng nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, margin: "24px 0" }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff" }}>Trước</button>
        <span>Trang {page} / {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff" }}>Sau</button>
      </div>

      {/* Modal chi tiết */}
      {selectedOrder && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0006", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 500, boxShadow: "0 4px 24px #0002", position: "relative" }}>
            <button onClick={handleCloseModal} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: 22, color: "#888", cursor: "pointer" }}>&times;</button>
            <h3 style={{ color: "#e67e22", marginBottom: 16 }}>Chi tiết đơn #{selectedOrder.order_id}</h3>
            <div style={{ marginBottom: 8 }}><b>Khách hàng:</b> {selectedOrder.customer_name}</div>
            <div style={{ marginBottom: 8 }}><b>Email:</b> {selectedOrder.customer_email}</div>
            <div style={{ marginBottom: 8 }}><b>Ngày đặt:</b> {selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleString() : ""}</div>
            <div style={{ marginBottom: 8 }}><b>Trạng thái:</b> {statusOptions.find(s => s.value === selectedOrder.status)?.label || selectedOrder.status}</div>
            <div style={{ marginBottom: 8 }}><b>Tổng tiền:</b> {selectedOrder.total?.toLocaleString()} đ</div>
            <div style={{ marginBottom: 8 }}><b>Sản phẩm:</b> {selectedOrder.items}</div>
          </div>
        </div>
      )}

      {loading && <p style={{ textAlign: "center", margin: 24 }}>Đang tải...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </div>
  );
};

export default OrderListAdminPage;
