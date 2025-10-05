-- Thêm trường user_id vào bảng customers để liên kết với bảng users (đã có rồi)
-- ALTER TABLE customers ADD COLUMN user_id INT;  -- Đã tồn tại

-- Thêm foreign key constraint (nếu chưa có)
ALTER TABLE customers ADD CONSTRAINT fk_customers_user_id 
FOREIGN KEY (user_id) REFERENCES users(user_id);

-- Tạo index cho hiệu suất tốt hơn
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);