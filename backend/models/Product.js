const db = require("../config/db");

const Product = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT p.*, c.name as category_name, s.name as supplier_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.category_id 
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY p.created_at DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT p.*, c.name as category_name, s.name as supplier_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.category_id 
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      WHERE p.product_id = ?
    `, [id]);
    return rows[0];
  },

  create: async (product) => {
    const { name, price, category_id, supplier_id, stock, description } = product;
    const [result] = await db.query(
      "INSERT INTO products (name, price, category_id, supplier_id, stock, description) VALUES (?, ?, ?, ?, ?, ?)",
      [name, price, category_id, supplier_id, stock, description]
    );
    return result;
  },

  update: async (id, product) => {
    const { name, price, category_id, supplier_id, stock, description } = product;
    const [result] = await db.query(
      "UPDATE products SET name = ?, price = ?, category_id = ?, supplier_id = ?, stock = ?, description = ? WHERE product_id = ?",
      [name, price, category_id, supplier_id, stock, description, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM products WHERE product_id = ?", [id]);
    return result;
  }
};

module.exports = Product;
