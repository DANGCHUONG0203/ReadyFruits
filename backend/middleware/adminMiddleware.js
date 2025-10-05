// backend/middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền admin' });
  }
  next();
};

module.exports = adminMiddleware;
