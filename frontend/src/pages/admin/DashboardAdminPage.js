
import React, { useEffect, useState } from "react";
import { getOrderStats } from '../../services/orderService';
import { getProductStats } from '../../services/productService';
import { getAllCustomersStats } from '../../services/customerService';

const DashboardAdminPage = () => {
  const [orderStats, setOrderStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [orders, products, customers] = await Promise.all([
          getOrderStats(),
          getProductStats(),
          getAllCustomersStats()
        ]);
        setOrderStats(orders);
        setProductStats(products);
        setCustomerStats(customers);
      } catch (err) {
        // eslint-disable-next-line
        console.error('Lỗi lấy dữ liệu dashboard:', err);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard Quản trị</h2>
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div className="dashboard-box">
          <div><b>Tổng số đơn hôm nay:</b> {loading ? '...' : orderStats?.today?.count ?? 0}</div>
          <div><b>Tổng số đơn tháng:</b> {loading ? '...' : orderStats?.month?.count ?? 0}</div>
        </div>
        <div className="dashboard-box">
          <div><b>Doanh thu hôm nay:</b> {loading ? '...' : (orderStats?.today?.revenue ?? 0).toLocaleString('vi-VN')}₫</div>
          <div><b>Doanh thu tháng:</b> {loading ? '...' : (orderStats?.month?.revenue ?? 0).toLocaleString('vi-VN')}₫</div>
        </div>
        <div className="dashboard-box">
          <div><b>Khách hàng mới hôm nay:</b> {loading ? '...' : customerStats?.today ?? 0}</div>
          <div><b>Khách hàng mới tháng:</b> {loading ? '...' : customerStats?.month ?? 0}</div>
        </div>
        <div className="dashboard-box">
          <div><b>Sản phẩm sắp hết hàng:</b> {loading ? '...' : productStats?.lowStock ?? 0}</div>
          <div><b>Tổng sản phẩm:</b> {loading ? '...' : productStats?.total ?? 0}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div className="dashboard-chart">[Biểu đồ doanh thu]</div>
        <div className="dashboard-notify">[Thông báo mới]</div>
      </div>
    </div>
  );
};

export default DashboardAdminPage;
