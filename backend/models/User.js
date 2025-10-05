const db = require("../config/db");

const User = {
  create: async (user) => {
    const { username, password, role } = user;
    const [result] = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );
    return result;
  },

  findByUsername: async (username) => {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0];
  },

  getAll: async () => {
    const [rows] = await db.query("SELECT user_id, username, role, created_at FROM users");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT user_id, username, role, created_at FROM users WHERE user_id = ?", [id]);
    return rows[0];
  }
};

module.exports = User;
