import React from "react";

const OrderFilter = ({ filters, onChange, onSearch }) => {
  return (
    <form className="order-filter" onSubmit={e => { e.preventDefault(); onSearch(); }}>
      <input
        type="text"
        placeholder="Tìm kiếm mã đơn, tên KH, SĐT, email..."
        value={filters.search || ""}
        onChange={e => onChange({ ...filters, search: e.target.value })}
        style={{ marginRight: 8 }}
      />
      <select
        value={filters.status || ""}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        style={{ marginRight: 8 }}
      >
        <option value="">Tất cả trạng thái</option>
        <option value="pending">Chờ xác nhận</option>
        <option value="processing">Đang xử lý</option>
        <option value="shipped">Đang giao</option>
        <option value="completed">Hoàn thành</option>
        <option value="cancelled">Đã hủy</option>
      </select>
      <input
        type="date"
        value={filters.startDate || ""}
        onChange={e => onChange({ ...filters, startDate: e.target.value })}
        style={{ marginRight: 8 }}
      />
      <input
        type="date"
        value={filters.endDate || ""}
        onChange={e => onChange({ ...filters, endDate: e.target.value })}
        style={{ marginRight: 8 }}
      />
      <button type="submit">Lọc</button>
    </form>
  );
};

export default OrderFilter;
