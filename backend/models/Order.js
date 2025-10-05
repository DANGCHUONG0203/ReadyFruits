const db = require("../config/db");

const Order = {
  create: (order, callback) => {
    const { customer_id, total, status } = order;
    db.query(
      "INSERT INTO orders (customer_id, total, status, order_date) VALUES (?, ?, ?, NOW())",
      [customer_id, total, status || 'pending'],
      callback
    );
  },

  getAll: (callback) => {
    db.query(`
      SELECT o.*, c.name as customer_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC
    `, callback);
  },

  getById: (id, callback) => {
    db.query(`
      SELECT o.*, c.name as customer_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.order_id = ?
    `, [id], callback);
  },

  getByCustomer: (customerId, callback) => {
    db.query(`
      SELECT o.*, 
        GROUP_CONCAT(CONCAT(p.name, ' x', oi.quantity) SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `, [customerId], callback);
  },

  updateStatus: (id, status, callback) => {
    db.query(
      "UPDATE orders SET status = ? WHERE order_id = ?",
      [status, id],
      callback
    );
  }
};

module.exports = Order;
