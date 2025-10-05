// API: /customers/stats
exports.getStats = async (req, res, next) => {
  try {
    // Tổng số khách hàng
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM customers');
    // Khách hàng mới hôm nay
    const [todayRows] = await pool.query("SELECT COUNT(*) as count FROM customers WHERE DATE(created_at) = CURDATE()");
    // Khách hàng mới trong tháng
    const [monthRows] = await pool.query("SELECT COUNT(*) as count FROM customers WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())");
    res.json({
      total: totalRows[0].total,
      today: todayRows[0].count || 0,
      month: monthRows[0].count || 0
    });
  } catch (err) {
    next(err);
  }
};
// backend/controllers/customerController.js
const pool = require('../config/db');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.username, u.role 
      FROM customers c
      LEFT JOIN users u ON c.user_id = u.user_id
      ORDER BY c.name
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT c.*, u.username, u.role 
      FROM customers c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.customer_id = ?
    `, [id]);
    
    if (!rows.length) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    
    await pool.query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?',
      [name, email, phone, address, id]
    );
    
    res.json({ message: 'Cập nhật thông tin khách hàng thành công' });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT o.*, 
        GROUP_CONCAT(CONCAT(p.name, ' (x', oi.quantity, ')') SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `, [id]);
    
    res.json(rows);
  } catch (err) {
    next(err);
  }
};