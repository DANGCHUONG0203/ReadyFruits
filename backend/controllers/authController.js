// backend/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { username, password, name, email, phone, address } = req.body;
    
    // Kiểm tra username đã tồn tại chưa
    const [existsUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existsUser.length) return res.status(400).json({ message: 'Username đã tồn tại' });
    
    // Kiểm tra email đã tồn tại trong customers chưa
    const [existsCustomer] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (existsCustomer.length) return res.status(400).json({ message: 'Email đã được sử dụng' });

    const hash = await bcrypt.hash(password, 10);
    
    // Tạo user account
    const [userResult] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, 'user']);
    
    // Tạo customer profile
    await pool.query('INSERT INTO customers (user_id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)', [userResult.insertId, name, email, phone, address]);

    res.json({ message: 'Đăng ký thành công' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log('LOGIN DEBUG: input', { username, password });
    const [userRows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('LOGIN DEBUG: userRows', userRows);
    if (!userRows.length) {
      console.log('LOGIN DEBUG: Username not found');
      return res.status(400).json({ message: 'Sai tên đăng nhập' });
    }
    const user = userRows[0];
    console.log('LOGIN DEBUG: user from db', user);
    let match = false;
    if (user.password.startsWith('$2b$')) {
      // Nếu là hash bcrypt
      match = await require('bcryptjs').compare(password, user.password);
      console.log('LOGIN DEBUG: bcrypt compare', { input: password, hash: user.password, match });
    } else {
      // Nếu là plain text
      match = password === user.password;
      console.log('LOGIN DEBUG: plain compare', { input: password, db: user.password, match });
    }
    if (!match) {
      console.log('LOGIN DEBUG: Password mismatch');
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    // Lấy thông tin customer nếu có
    let customerInfo = null;
    if (user.role === 'user') {
      const [customerRows] = await pool.query('SELECT * FROM customers WHERE user_id = ?', [user.user_id]);
      customerInfo = customerRows[0] || null;
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '12h' }
    );
    
    res.json({ 
      token, 
      user: { 
        user_id: user.user_id, 
        username: user.username, 
        role: user.role,
        customer_info: customerInfo
      } 
    });
  } catch (err) {
    next(err);
  }
};
