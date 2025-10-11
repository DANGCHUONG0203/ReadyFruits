-- Thêm trường số điện thoại người nhận vào bảng orders
ALTER TABLE orders ADD COLUMN receiver_phone VARCHAR(20) DEFAULT NULL;
-- Add new columns to orders table for full delivery info
ALTER TABLE orders 
  ADD COLUMN receiver_name VARCHAR(100) DEFAULT NULL,
  ADD COLUMN delivery_time DATETIME DEFAULT NULL,
  ADD COLUMN shipping_address VARCHAR(255) DEFAULT NULL;

-- You can run this SQL in MySQL Workbench or phpMyAdmin
-- After running, restart your backend server!