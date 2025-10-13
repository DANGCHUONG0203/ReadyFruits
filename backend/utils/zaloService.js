// backend/utils/zaloService.js
// Gửi tin nhắn về Zalo OA cho admin khi có đơn hàng mới
// Cần điền access_token và OA ID của bạn
const axios = require('axios');

const ZALO_OA_ACCESS_TOKEN = process.env.ZALO_OA_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const ADMIN_ZALO_USER_ID = process.env.ADMIN_ZALO_USER_ID || 'YOUR_ADMIN_USER_ID'; // Zalo userId (OA follower)

const zaloApi = axios.create({
  baseURL: 'https://openapi.zalo.me/v3.0',
  headers: {
    access_token: ZALO_OA_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

async function sendOrderNotificationToZalo(orderData) {
  // Soạn nội dung tin nhắn
  const message =
    `🛒 Đơn hàng mới #${orderData.order_id}\n` +
    `Khách: ${orderData.customer_name}\n` +
    `SĐT: ${orderData.phone}\n` +
    `Địa chỉ: ${orderData.address}\n` +
    `Người nhận: ${orderData.receiver_name}\n` +
    `SĐT nhận: ${orderData.receiver_phone || orderData.phone}\n` +
    `Nhận lúc: ${orderData.delivery_time}\n` +
    `Tổng: ${orderData.total_amount}đ`;

  try {
    const res = await zaloApi.post('/oa/message/push', {
      recipient: { user_id: ADMIN_ZALO_USER_ID },
      message: {
        text: message,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Zalo OA send error:', err.response?.data || err.message);
    return null;
  }
}

module.exports = { sendOrderNotificationToZalo };
