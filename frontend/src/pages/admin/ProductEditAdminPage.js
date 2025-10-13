import React, { useEffect, useState, useRef } from 'react';
import { getProductById, createProduct, updateProduct } from '../../services/productService';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductAdmin.css';

const ProductEditAdminPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  // Các nhóm nhỏ (sub-category/type) cho sản phẩm
  const fruitBasketTypes = [
    { value: '', label: 'Không chọn nhóm nhỏ' },
    // Giỏ trái cây
    { value: 'vieng', label: 'Giỏ trái cây viếng' },
    { value: 'sinh-nhat', label: 'Giỏ trái cây sinh nhật' },
    { value: 'tan-gia', label: 'Giỏ trái cây tân gia' },
    { value: 'cuoi-hoi', label: 'Giỏ trái cây cưới hỏi' },
    // Kệ hoa
    { value: 'ke-chuc-mung', label: 'Kệ hoa chúc mừng' },
    { value: 'ke-kinh-vieng', label: 'Kệ hoa kính viếng' },
    // Bó hoa
    { value: 'bo-chuc-mung', label: 'Bó hoa chúc mừng' },
    { value: 'bo-kinh-vieng', label: 'Bó hoa kính viếng' },
  ];
  const [form, setForm] = useState({
    name: '',
    price: '',
    category_id: '',
    type: '', // thêm trường type (sub-category)
    supplier_id: '1', // mặc định 1
    stock: '100', // mặc định 100
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getProductById(id)
        .then((data) => {
          setForm({
            name: data.name || '',
            price: data.price || '',
            category_id: data.category_id || '',
            type: data.type || '',
            supplier_id: data.supplier_id ? String(data.supplier_id) : '1',
            stock: data.stock ? String(data.stock) : '100',
            description: data.description || '',
            image_url: data.image_url || data.image || ''
          });
          setPreview(data.image_url || data.image || '');
        })
        .catch(() => alert('Không tìm thấy sản phẩm!'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Hiển thị preview ngay
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      // Upload file lên backend
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setForm((f) => ({ ...f, image_url: res.data.imageUrl }));
      } catch (err) {
        alert('Upload ảnh thất bại!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Đảm bảo các trường số là số, không phải chuỗi rỗng
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      category_id: Number(form.category_id) || 1,
      type: form.type || '',
      supplier_id: Number(form.supplier_id) || 1,
      stock: Number(form.stock) || 0,
      image_url: form.image_url,
      description: form.description
    };
    try {
      if (isEdit) {
        await updateProduct(id, payload);
        alert('Cập nhật thành công!');
      } else {
        await createProduct(payload);
        alert('Thêm thành công!');
      }
      navigate('/admin/products');
    } catch (err) {
      alert('Lưu thất bại!');
    }
    setLoading(false);
  };
  return (
    <div>
      <form className="admin-product-form" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px #0001' }}>
        <h2 style={{ color: '#e67e22', marginBottom: 24 }}>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
        <div className="form-group">
          <label>Tên sản phẩm:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Giá:</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required min={0} />
        </div>
        <div className="form-group">
          <label>Danh mục ID:</label>
          <input type="number" name="category_id" value={form.category_id} onChange={handleChange} required min={1} />
        </div>
        {/* Nhóm nhỏ (sub-category/type) */}
        <div className="form-group">
          <label>Nhóm nhỏ (sub-category):</label>
          <select name="type" value={form.type} onChange={handleChange} className="filter-select">
            {fruitBasketTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Nhà cung cấp ID:</label>
          <input type="number" name="supplier_id" value={form.supplier_id} onChange={handleChange} required min={1} />
        </div>
        <div className="form-group">
          <label>Số lượng (stock):</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} required min={0} />
        </div>
        <div className="form-group">
          <label>Mô tả:</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
        </div>
        <div className="form-group">
          <label>Ảnh sản phẩm:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
          {preview && <img src={preview} alt="preview" style={{ width: 120, marginTop: 8, borderRadius: 8 }} />}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" className="admin-btn" style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
          <button type="button" className="admin-btn" style={{ background: '#f59e42', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }} onClick={() => navigate('/admin/products')}>Quay lại</button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditAdminPage;
