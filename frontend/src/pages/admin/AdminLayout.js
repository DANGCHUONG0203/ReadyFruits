import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const menu = [
  { path: "/admin", label: "Dashboard", icon: "📊" },
  { path: "/admin/products", label: "Quản lý sản phẩm", icon: "📦" },
  { path: "/admin/orders", label: "Quản lý đơn hàng", icon: "📝" },
  { path: "/admin/customers", label: "Quản lý khách hàng", icon: "👤" },
];

const AdminLayout = () => {
  const location = useLocation();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin</h2>
        <nav>
          <ul>
            {menu.map((item) => (
              <li key={item.path} className={location.pathname.startsWith(item.path) ? "active" : ""}>
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
