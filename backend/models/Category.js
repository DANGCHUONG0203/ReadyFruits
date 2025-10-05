const db = require("../config/db");

const Category = {
  getAll: (callback) => {
    db.query("SELECT * FROM categories ORDER BY name", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM categories WHERE category_id = ?", [id], callback);
  },

  create: (category, callback) => {
    const { name, description } = category;
    db.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description],
      callback
    );
  },

  update: (id, category, callback) => {
    const { name, description } = category;
    db.query(
      "UPDATE categories SET name = ?, description = ? WHERE category_id = ?",
      [name, description, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM categories WHERE category_id = ?", [id], callback);
  }
};

module.exports = Category;