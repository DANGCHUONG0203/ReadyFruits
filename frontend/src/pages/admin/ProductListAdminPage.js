
import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../../services/productService';
import { useNavigate } from 'react-router-dom';
import './ProductAdmin.css';

const ProductListAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts({ page, limit: pageSize });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      alert('Lỗi tải sản phẩm!');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      setDeletingId(id);
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert('Xóa thất bại!');
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
    <div className="admin-product-page" style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#e67e22', marginBottom: 24 }}>Quản lý sản phẩm</h2>
      <button className="admin-btn" style={{ marginBottom: 16, background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }} onClick={() => navigate('/admin/products/new')}>+ Thêm sản phẩm</button>
      <div style={{ overflowX: 'auto', borderRadius: 8, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: 12 }}>ID</th>
              <th style={{ padding: 12 }}>Ảnh</th>
              <th style={{ padding: 12 }}>Tên</th>
              <th style={{ padding: 12 }}>Giá</th>
              <th style={{ padding: 12 }}>Danh mục</th>
              <th style={{ padding: 12 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.product_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 10 }}>{p.product_id}</td>
                <td style={{ padding: 10 }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#fafafa' }} />
                  ) : (
                    <span style={{ color: '#aaa', fontStyle: 'italic' }}>[No Image]</span>
                  )}
                </td>
                <td style={{ padding: 10, fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: 10, color: '#e67e22', fontWeight: 600 }}>{Number(p.price).toLocaleString('vi-VN')} đ</td>
                <td style={{ padding: 10 }}>{p.category_name || p.category_id}</td>
                <td style={{ padding: 10 }}>
                  <button className="admin-btn" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500 }} onClick={() => navigate(`/admin/products/${p.product_id}/edit`)}>Sửa</button>
                  <button className="admin-btn admin-btn-danger" style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, marginLeft: 8 }} onClick={() => handleDelete(p.product_id)} disabled={deletingId === p.product_id}>{deletingId === p.product_id ? 'Đang xóa...' : 'Xóa'}</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>Không có sản phẩm nào</td></tr>
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
      {loading && <p style={{ textAlign: 'center', margin: 24 }}>Đang tải...</p>}
    </div>
  );
};

export default ProductListAdminPage;
