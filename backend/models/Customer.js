const db = require("../config/db");

const Customer = {
  getAll: (callback) => {
    db.query("SELECT * FROM customers ORDER BY name", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM customers WHERE customer_id = ?", [id], callback);
  },

  getByEmail: (email, callback) => {
    db.query("SELECT * FROM customers WHERE email = ?", [email], callback);
  },

  create: (customer, callback) => {
    const { name, email, phone, address } = customer;
    db.query(
      "INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)",
      [name, email, phone, address],
      callback
    );
  },

  update: (id, customer, callback) => {
    const { name, email, phone, address } = customer;
    db.query(
      "UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?",
      [name, email, phone, address, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM customers WHERE customer_id = ?", [id], callback);
  }
};

module.exports = Customer;