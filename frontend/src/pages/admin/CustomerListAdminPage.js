
import React, { useEffect, useState } from "react";
import { getAllCustomers, deleteCustomer } from "../../services/customerService";

const CustomerListAdminPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers({ page, limit: pageSize, search });
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
    } catch (err) {
      alert("Lỗi tải khách hàng!");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa khách hàng này?")) {
      setDeletingId(id);
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert("Xóa thất bại!");
      }
      setDeletingId(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(total / pageSize);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="admin-customer-page" style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#e67e22', marginBottom: 24 }}>Quản lý khách hàng</h2>
      <form onSubmit={e => { e.preventDefault(); fetchCustomers(); }} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tìm kiếm tên, email, SĐT..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6 }}>Tìm</button>
      </form>
      <div style={{ overflowX: 'auto', borderRadius: 8, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: 12 }}>ID</th>
              <th style={{ padding: 12 }}>Tên</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>SĐT</th>
              <th style={{ padding: 12 }}>Ngày tạo</th>
              <th style={{ padding: 12 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.customer_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 10 }}>{c.customer_id}</td>
                <td style={{ padding: 10, fontWeight: 500 }}>{c.name || c.username}</td>
                <td style={{ padding: 10 }}>{c.email}</td>
                <td style={{ padding: 10 }}>{c.phone}</td>
                <td style={{ padding: 10 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</td>
                <td style={{ padding: 10 }}>
                  <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500 }} onClick={() => setSelected(c)}>Xem</button>
                  <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, marginLeft: 8 }} onClick={() => handleDelete(c.customer_id)} disabled={deletingId === c.customer_id}>{deletingId === c.customer_id ? 'Đang xóa...' : 'Xóa'}</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>Không có khách hàng nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '24px 0' }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Trước</button>
        <span>Trang {page} / {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Sau</button>
      </div>
      {/* Modal chi tiết */}
      {selected && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0006', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 500, boxShadow: '0 4px 24px #0002', position: 'relative' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ color: '#e67e22', marginBottom: 16 }}>Chi tiết khách hàng #{selected.customer_id}</h3>
            <div style={{ marginBottom: 8 }}><b>Tên:</b> {selected.name || selected.username}</div>
            <div style={{ marginBottom: 8 }}><b>Email:</b> {selected.email}</div>
            <div style={{ marginBottom: 8 }}><b>SĐT:</b> {selected.phone}</div>
            <div style={{ marginBottom: 8 }}><b>Ngày tạo:</b> {selected.created_at ? new Date(selected.created_at).toLocaleDateString() : ''}</div>
            <div style={{ marginBottom: 8 }}><b>Trạng thái:</b> {selected.is_active ? 'Hoạt động' : 'Bị khóa'}</div>
            {/* Có thể bổ sung thêm các trường khác nếu cần */}
          </div>
        </div>
      )}
      {loading && <p style={{ textAlign: 'center', margin: 24 }}>Đang tải...</p>}
    </div>
  );
};

export default CustomerListAdminPage;
