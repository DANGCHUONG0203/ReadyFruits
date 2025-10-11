-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: fruitshop
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Trái cây nhập khẩu','Trái cây nhập khẩu từ Mỹ, Úc, New Zealand – giòn ngọt, đa dạng giống.',NULL),(2,'Giỏ trái ','Nho đen/xanh từ Mỹ, Hàn Quốc – không hạt, vị ngọt thanh.',NULL),(3,'Hoa tươi','Cherry đỏ tươi từ Mỹ, Chile – giàu chất chống oxy hóa.',NULL),(4,'Khác','Kiwi xanh/vàng từ New Zealand, Úc – giàu vitamin C.',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_customers_user_id` (`user_id`),
  KEY `idx_customers_email` (`email`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `customers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_customers_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'Nguyen Van A','customer1@example.com','0901234567','123 Le Loi, Q1'),(3,22,'chương','dangvanchuong2004@gmail.com','0977045133','32 đường 22 phường phước long b thành phố thủ đức'),(13,24,'ngôn','dvanngon2009@gmail.com','0982275538','32 đường 22 phường phước long b thành phố thủ đức'),(14,26,'anh','n22dccn012@student.ptithcm.edu.vn','0982275538','Tùng Lộc , Can Lộc '),(15,27,'Nguyen van anhiu','a@gmail.com','0977045133 ','Tùng Lộc , Can Lộc ');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (18,6,9,1,120000.00),(19,7,9,1,120000.00),(20,8,9,1,120000.00),(21,9,9,1,120000.00),(22,10,10,2,150000.00),(23,11,10,2,150000.00),(24,12,10,2,150000.00),(25,13,10,2,150000.00),(26,14,10,2,150000.00),(27,15,9,1,120000.00),(28,16,9,1,120000.00),(29,17,11,1,90000.00),(30,18,11,1,90000.00),(31,19,9,3,120000.00),(32,20,9,3,120000.00),(33,21,9,1,120000.00),(34,22,9,1,120000.00),(35,23,9,2,120000.00),(36,24,9,2,120000.00),(37,25,9,1,120000.00),(38,26,9,1,120000.00),(39,27,7,1,50000.00),(40,28,7,1,50000.00),(41,29,7,1,50000.00),(42,30,7,1,50000.00),(43,31,24,1,1.00),(44,32,24,1,1.00),(45,33,24,1,1.00),(46,34,24,1,1.00),(47,35,24,1,1.00),(48,36,24,1,1.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `idx_orders_customer` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2025-09-14 04:13:01',170000.00,'pending'),(2,1,'2025-09-14 04:13:44',170000.00,'pending'),(6,3,'2025-10-01 09:54:38',120000.00,'pending'),(7,3,'2025-10-01 09:54:45',120000.00,'pending'),(8,3,'2025-10-01 09:54:52',120000.00,'pending'),(9,3,'2025-10-01 09:55:03',120000.00,'pending'),(10,3,'2025-10-01 12:44:26',300000.00,'pending'),(11,3,'2025-10-01 12:44:41',300000.00,'pending'),(12,3,'2025-10-01 12:48:43',300000.00,'pending'),(13,3,'2025-10-01 12:52:39',300000.00,'pending'),(14,3,'2025-10-01 12:52:41',300000.00,'pending'),(15,3,'2025-10-01 12:58:59',120000.00,'pending'),(16,3,'2025-10-01 12:59:01',120000.00,'pending'),(17,3,'2025-10-01 13:02:22',90000.00,'pending'),(18,3,'2025-10-01 13:02:23',90000.00,'pending'),(19,3,'2025-10-01 13:06:57',360000.00,'pending'),(20,3,'2025-10-01 13:07:00',360000.00,'pending'),(21,3,'2025-10-01 13:17:17',120000.00,'pending'),(22,3,'2025-10-01 13:17:19',120000.00,'pending'),(23,3,'2025-10-01 13:35:05',240000.00,'pending'),(24,3,'2025-10-01 13:35:08',240000.00,'pending'),(25,3,'2025-10-01 13:45:28',120000.00,'pending'),(26,3,'2025-10-01 13:45:33',120000.00,'pending'),(27,13,'2025-10-05 04:09:16',50000.00,'pending'),(28,13,'2025-10-05 04:09:22',50000.00,'pending'),(29,14,'2025-10-05 11:14:33',50000.00,'pending'),(30,14,'2025-10-05 11:14:40',50000.00,'pending'),(31,15,'2025-10-06 03:34:43',1.00,'pending'),(32,15,'2025-10-06 03:34:48',1.00,'pending'),(33,15,'2025-10-06 03:55:21',1.00,'pending'),(34,15,'2025-10-06 03:55:26',1.00,'pending'),(35,15,'2025-10-06 04:42:06',1.00,'pending'),(36,15,'2025-10-06 04:42:12',1.00,'pending');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(50) NOT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'2025-09-14 04:18:32',170000.00,'Cash on Delivery');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_supplier` (`supplier_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (5,1,1,'Táo Mỹ',50000.00,1000,NULL,'/images/Hoatuoi1.jpg','2025-09-14 04:07:06',NULL),(6,1,2,'Nho Hàn Quốc',120000.00,1000,NULL,'/images/Hoatuoi2.jpg','2025-09-14 04:07:06',NULL),(7,1,1,'Táo Mỹ',50000.00,9996,NULL,'/images/Hoatuoi3.jpg','2025-09-14 04:20:02',NULL),(8,1,2,'Nho Hàn Quốc',120000.00,1000,NULL,'/images/Hoatuoi4.jpg','2025-09-14 04:20:02',NULL),(9,1,1,'Táo Mỹ',120000.00,30,'Táo Mỹ nhập khẩu tươi ngon','/images/Hoatuoi5.jpg','2025-09-14 15:47:48',NULL),(10,1,2,'Nho Úc',150000.00,20,'Nho Úc giòn ngọt','/images/Hoatuoi6.jpg','2025-09-14 15:47:48',NULL),(11,2,1,'Cam Ai Cập',90000.00,98,'Cam Ai Cập mọng nước','/images/Hoatuoi7.jpg','2025-09-14 15:47:48',NULL),(22,1,1,'Hoa tươi',25000.00,100,NULL,'/images/Hoatuoi8.jpg','2025-09-14 04:07:06',NULL),(23,3,1,'Hoa tươi2',25000.00,100,NULL,'/images/Hoatuoi8.jpg','2025-09-14 04:07:06',NULL),(24,1,1,'chuong',1.00,94,NULL,'/images/Hoatuoi8.jpg','2025-10-05 13:02:52',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'USA Fruit Co.','John Doe','001-123-4567','123 Apple St, CA'),(2,'Aus Fresh','Jane Smith','61-234-5678','456 Orange Rd, Sydney');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'customer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin_user','dangvanchuong2004@gmail.com','123456','admin','2025-09-14 02:57:17',NULL),(2,'admin1','admin1@example.com','e4abae53cc1cebe5fe89ea93882c699a5e71ab0bbf42a83b7d833975b61c4a41','admin','2025-09-14 04:08:39',NULL),(3,'customer1','customer1@example.com','edca4e87e91f87476591d792c2ac6a4861ae0b2086716e21751d67bf049f3d81','customer','2025-09-14 04:08:39',NULL),(4,'customer2','customer2@example.com','260c24329f809b9569ef6b4319a3667cdcd0c9daffb3770347b9b8da2e72f8be','customer','2025-09-14 04:08:39',NULL),(9,'12',NULL,'$2b$10$OC8CAv1KdE4U.zTA9CYFAuFyyu5UEABmi07VVIJkgX4hSIhO5WLUe','customer','2025-09-17 12:02:39',NULL),(10,'123',NULL,'$2b$10$6IcSRJOHSY/jSVFEfLOHY.dbTYa.JIApzNkBBWl76Njnn42bTsd5i','customer','2025-09-17 12:02:47',NULL),(11,'dangvanchuong',NULL,'$2b$10$tK/LVLDLI5MsfXAYh9EJl./dNGYQcuuopunlSk1ceGAE3SuRV.Cy.','customer','2025-09-17 12:02:55',NULL),(12,'dangvanchuong@gmail.com',NULL,'$2b$10$Fdb6BsuXo0T9SQsBkBd2eOmtsBhYwrFyg7OP6Cn/1Cg.esmrJ7Koa','customer','2025-09-17 12:03:03',NULL),(13,'dangvanchuong123@gmail.com',NULL,'$2b$10$iWpH.9ocw4pPqi6SGpuk4.4cMCh7elKXW477sfDFSNp2eLB9cDZWS','customer','2025-09-17 12:03:11',NULL),(14,'12345',NULL,'$2b$10$PUwhm58iTuoCqmlHrC75HOycxLH1ioqLvkT7x9t0A8gtpekqCLnRW','customer','2025-09-17 12:03:52',NULL),(15,'anh1@gmail.com ',NULL,'$2b$10$gbHRlrIXwW7IppBrkvPEMe5bfioo9neFUnX3kSWnTgR4wOOFsT.yC','customer','2025-09-17 12:04:13',NULL),(16,'Em1@gmail.com ',NULL,'$2b$10$svFhqdNxLBysZ5LwYTvmd.YlXLNWKRq6osz4DM5znHMMyVOpB1CuG','customer','2025-09-17 12:04:30',NULL),(17,'anh@gmail.com',NULL,'$2b$10$Bx1IUo3q/K.g5o5Y1p25O.JehSbR92pBBJCnbOnJu4kYiZR7vbkRq','customer','2025-09-17 12:06:27',NULL),(18,'ddd@gmail.com',NULL,'$2b$10$BWhgGuNxhR0c0C7sOGDwm.Xy632DiGVs2UfkeWYGlUHrx3YaM.76K','user','2025-09-26 14:00:37',NULL),(19,'xxx',NULL,'$2b$10$.cb637rAYuIsprDAym6SJOIy5tpXM6aolVlVBulWz9idtyxhkuagS','user','2025-09-30 06:41:04',NULL),(20,'dangvanchuong2004@gmail.com ',NULL,'$2b$10$mEIJy8.9x40dMLm/ZxG5vuzJcPLY4/ZsUwLwLX4//FVjyDLOSqF0O','user','2025-09-30 17:14:02',NULL),(21,'anh',NULL,'$2b$10$KiqCuU9mCaKOz//9E.R27uImQgTM5lDS1OsIu5N3OsovG9U3jdl7G','user','2025-09-30 17:22:12',NULL),(22,'chuong',NULL,'$2b$10$GKruaS1qR58OkPdKRoZoNuKwLZcePltlTzl8kfrjQsddazOTOFfhC','user','2025-10-01 09:08:36',NULL),(23,'hi',NULL,'$2b$10$Y4aTL527zDguGuNEWav2feS29AkJ3PXuC.rD4TtaXhc1gKcWAajm6','user','2025-10-01 15:32:33',NULL),(24,'ngôn',NULL,'$2b$10$kTeSyCZIfC7ll9HWk88yReIYd6RmkbezMKelo.B4lqHrlxZeZdTB6','user','2025-10-05 03:50:55',NULL),(25,'hihihi',NULL,'$2b$10$G2XfmiEcvsnw.NWAJCzouOSs2QVvT2dOIKh6acc12bsDhhTvGR.nK','user','2025-10-05 11:08:26',NULL),(26,'a',NULL,'$2b$10$3CjqspspbPguwkrOlpNhq.HM978kfQmN.R/pPwTTrUHdt3is3mnUq','user','2025-10-05 11:13:58',NULL),(27,'anhiu',NULL,'$2b$10$hOyn36/WQP6NPot8IdDis.MKpzKCpUZq8P/gb6BetT.JeNeNJ3z/6','user','2025-10-06 03:32:21',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-06 22:36:01
