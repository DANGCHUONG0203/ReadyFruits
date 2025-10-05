-- Script an toàn để tạo foreign key và index cho bảng customers
USE fruitshop;

-- Xóa foreign key cũ nếu có (để tránh lỗi duplicate)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                  WHERE TABLE_NAME = 'customers' AND CONSTRAINT_NAME = 'fk_customers_user_id');
SET @sql = IF(@fk_exists > 0, 'ALTER TABLE customers DROP FOREIGN KEY fk_customers_user_id', 'SELECT "Foreign key not exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Tạo foreign key mới
ALTER TABLE customers ADD CONSTRAINT fk_customers_user_id 
FOREIGN KEY (user_id) REFERENCES users(user_id);

-- Xóa index cũ nếu có
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                     WHERE TABLE_NAME = 'customers' AND INDEX_NAME = 'idx_customers_user_id');
SET @sql = IF(@index_exists > 0, 'DROP INDEX idx_customers_user_id ON customers', 'SELECT "Index not exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Tạo index mới
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);