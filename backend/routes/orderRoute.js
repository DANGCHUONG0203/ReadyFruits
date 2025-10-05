// backend/routes/orderRoute.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');


router.get('/stats', auth, admin, orderController.getStats); // Thêm route thống kê
router.post('/', auth, orderController.createOrder);
router.get('/my', auth, orderController.getUserOrders);
router.get('/', auth, admin, orderController.getAllOrders);
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);

module.exports = router;
