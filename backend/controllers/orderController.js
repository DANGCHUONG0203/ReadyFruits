// API: /orders/stats
exports.getStats = async (req, res, next) => {
  try {
    // Tổng số đơn
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM orders');
    // Tổng doanh thu hôm nay
    const [todayRevenueRows] = await pool.query("SELECT SUM(total) as revenue, COUNT(*) as count FROM orders WHERE DATE(order_date) = CURDATE()");
    // Tổng doanh thu tháng này
    const [monthRevenueRows] = await pool.query("SELECT SUM(total) as revenue, COUNT(*) as count FROM orders WHERE YEAR(order_date) = YEAR(CURDATE()) AND MONTH(order_date) = MONTH(CURDATE())");
    res.json({
      totalOrders: totalRows[0].total,
      today: {
        revenue: todayRevenueRows[0].revenue || 0,
        count: todayRevenueRows[0].count || 0
      },
      month: {
        revenue: monthRevenueRows[0].revenue || 0,
        count: monthRevenueRows[0].count || 0
      }
    });
  } catch (err) {
    next(err);
  }
};
// backend/controllers/orderController.js
const pool = require('../config/db');
const emailService = require('../utils/emailService');

exports.createOrder = async (req, res, next) => {
  try {
    console.log('req.user:', req.user); // Log user info for debugging
    const user_id = req.user.user_id;
    const { items, shipping_address } = req.body; // items = [{ product_id, quantity, price }]
    
    // Lấy customer_id từ user_id
    const [cusRows] = await pool.query('SELECT customer_id FROM customers WHERE user_id = ?', [user_id]);
    if (!cusRows.length) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin khách hàng' });
    }
    const customer_id = cusRows[0].customer_id;

    // Tính tổng tiền
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Tạo order
    const [orderResult] = await pool.query(
      'INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)', 
      [customer_id, total, 'pending']
    );
    const orderId = orderResult.insertId;

    // Thêm order items và cập nhật stock
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      // Giảm stock sản phẩm
      await pool.query(
        'UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE product_id = ?', 
        [item.quantity, item.product_id]
      );
    }

    // Lấy thông tin chi tiết đơn hàng để gửi email
    const [orderDetails] = await pool.query(`
  SELECT o.*, u.email, u.username as customer_name, c.phone,
             GROUP_CONCAT(
               CONCAT('{"name":"', p.name, '","quantity":', oi.quantity, ',"price":', oi.price, '}')
               SEPARATOR ','
             ) as items_json
      FROM orders o 
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.order_id = ?
      GROUP BY o.order_id
    `, [orderId]);

    if (orderDetails.length > 0) {
      const order = orderDetails[0];
      const orderData = {
        order_id: orderId,
        total_amount: order.total,
        created_at: order.created_at,
        customer_name: order.customer_name,
        phone: order.phone,
        email: order.email,
        address: shipping_address,
        items: JSON.parse(`[${order.items_json}]`)
      };

      // Gửi email thông báo cho admin
      try {
        await emailService.sendNewOrderNotification(orderData);
        console.log('Admin notification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }

      // Gửi email xác nhận cho khách hàng
      try {
        await emailService.sendOrderConfirmation(orderData, order.email);
        console.log('Customer confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send customer confirmation:', emailError);
      }
    }

    res.json({ message: 'Đặt hàng thành công', order_id: orderId });
  } catch (err) { 
    next(err); 
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    
    // Lấy customer_id từ user_id
    const [cusRows] = await pool.query('SELECT customer_id FROM customers WHERE user_id = ?', [user_id]);
    if (!cusRows.length) return res.json([]);
    
    const customer_id = cusRows[0].customer_id;
    
    // Lấy orders với thông tin chi tiết
    const [orders] = await pool.query(`
      SELECT o.*, 
        GROUP_CONCAT(CONCAT(p.name, ' (x', oi.quantity, ')') SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `, [customer_id]);
    
    res.json(orders);
  } catch (err) { 
    next(err); 
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, c.name as customer_name, c.email as customer_email,
        GROUP_CONCAT(CONCAT(p.name, ' (x', oi.quantity, ')') SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `);
    res.json(rows);
  } catch (err) { 
    next(err); 
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, id]);
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (err) {
    next(err);
  }
};
