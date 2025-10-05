// backend/routes/customerRoute.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


// Admin routes
router.get('/stats', authMiddleware, adminMiddleware, customerController.getStats); // Thêm route thống kê
router.get('/', authMiddleware, adminMiddleware, customerController.getAllCustomers);
router.get('/:id', authMiddleware, adminMiddleware, customerController.getCustomerById);
router.put('/:id', authMiddleware, adminMiddleware, customerController.updateCustomer);
router.get('/:id/orders', authMiddleware, adminMiddleware, customerController.getCustomerOrders);

module.exports = router;