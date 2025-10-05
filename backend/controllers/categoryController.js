// backend/controllers/categoryController.js
const pool = require('../config/db');

exports.getAllCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM categories WHERE category_id = ?', [id]);
    
    if (!rows.length) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({ 
      message: 'Tạo danh mục thành công', 
      category_id: result.insertId 
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }
    await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE category_id = ?',
      [name, description, id]
    );
    res.json({ message: 'Cập nhật danh mục thành công' });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra xem có sản phẩm nào đang sử dụng category này không
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
    
    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa danh mục vì còn sản phẩm đang sử dụng' 
      });
    }
    
    await pool.query('DELETE FROM categories WHERE category_id = ?', [id]);
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (err) {
    next(err);
  }
};