// frontend/src/index.js - Version mới, đã optimize
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";    // ✅ Đúng CSS import

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);