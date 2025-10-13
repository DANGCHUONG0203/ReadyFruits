import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { CartContext } from '../context/CartContext';
import './Header.css';
import logo from '../assets/LOGO.png';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;
  const getTotalItems = () => cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo-brand">
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <img src={logo} alt="FruitShop Logo" className="logo-img" />
            <span className="logo-text">
              Oanh Fruits & Flowers
            </span>
          </Link>
        </div>
        {/* Phone */}
        <div className="header-phone">
          <span className="phone-icon">☎️</span>
          <a href="https://zalo.me/0979347931" target="_blank" rel="noopener noreferrer" className="phone-number">0979347931</a>
        </div>
        {/* Mobile Menu Button */}
        <button className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        {/* Navigation */}
        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}> 
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>Trang chủ</Link>
            <div className="nav-link nav-dropdown">
              <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`} onClick={closeMenu} style={{paddingRight: 24}}>
                Sản phẩm <span style={{fontSize: '0.9em', marginLeft: 4}}>▼</span>
              </Link>
              <div className="dropdown-menu">
                <Link to="/products" className="dropdown-item" onClick={closeMenu}>Tất cả danh mục</Link>
                <div className="dropdown-item nav-submenu">
                  <Link to="/products?category=1" className="submenu-parent-link" onClick={closeMenu} tabIndex={-1} style={{display:'block',width:'100%',height:'100%',color:'inherit',textDecoration:'none'}}>
                    Giỏ trái cây <span style={{fontSize: '0.9em', marginLeft: 4}}>▶</span>
                  </Link>
                  <div className="submenu-menu">
                    <Link to="/products?category=1&type=vieng" className="submenu-item" onClick={closeMenu}>Giỏ trái cây viếng</Link>
                    <Link to="/products?category=1&type=sinh-nhat" className="submenu-item" onClick={closeMenu}>Giỏ trái cây sinh nhật</Link>
                    <Link to="/products?category=1&type=tan-gia" className="submenu-item" onClick={closeMenu}>Giỏ trái cây tân gia</Link>
                    <Link to="/products?category=1&type=cuoi-hoi" className="submenu-item" onClick={closeMenu}>Giỏ trái cây cưới hỏi</Link>
                  </div>
                </div>
                <div className="dropdown-item nav-submenu">
                  <Link to="/products?category=2" className="submenu-parent-link" onClick={closeMenu} tabIndex={-1} style={{display:'block',width:'100%',height:'100%',color:'inherit',textDecoration:'none'}}>
                    Hoa tươi <span style={{fontSize: '0.9em', marginLeft: 4}}>▶</span>
                  </Link>
                  <div className="submenu-menu">
                    <Link to="/products?category=2&type=ke-chuc-mung" className="submenu-item" onClick={closeMenu}>Kệ hoa chúc mừng</Link>
                    <Link to="/products?category=2&type=ke-kinh-vieng" className="submenu-item" onClick={closeMenu}>Kệ hoa kính viếng</Link>
                    <Link to="/products?category=2&type=bo-chuc-mung" className="submenu-item" onClick={closeMenu}>Bó hoa chúc mừng</Link>
                    <Link to="/products?category=2&type=bo-kinh-vieng" className="submenu-item" onClick={closeMenu}>Bó hoa kính viếng</Link>
                  </div>
                </div>
                <Link to="/products?category=3" className="dropdown-item" onClick={closeMenu} style={{width:'100%',display:'block'}}>Trái cây nhập khẩu</Link>
              </div>
            </div>
            {user && user.role === 'admin' && (
              <Link to="/admin/products" className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`} onClick={closeMenu}>Quản lý sản phẩm</Link>
            )}
            <form className="header-search" onSubmit={e => {
              e.preventDefault();
              if (search.trim()) {
                navigate(`/products?search=${encodeURIComponent(search)}`);
                setIsMenuOpen(false);
              }
            }}>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm sản phẩm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="search-btn" aria-label="Tìm kiếm">
                <span role="img" aria-label="search">🔍</span>
              </button>
            </form>
          </div>
          <div className="auth-section">
            {!user && (
              <div className="auth-links">
                <Link to="/cart" className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`} onClick={closeMenu}>
                  <span className="cart-icon">🛒</span>
                  <span>Giỏ hàng</span>
                  {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
                </Link>
                <Link to="/login" className={`auth-link login-link ${isActive('/login') ? 'active' : ''}`} onClick={closeMenu}>Đăng nhập</Link>
                <Link to="/register" className={`auth-link register-link ${isActive('/register') ? 'active' : ''}`} onClick={closeMenu}>Đăng ký</Link>
              </div>
            )}
            {user && (
              <>
                <Link to="/cart" className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`} onClick={closeMenu}>
                  <span className="cart-icon">🛒</span>
                  <span>Giỏ hàng</span>
                  {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
                </Link>
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-avatar">👤</span>
                    <span className="username">{user.username}</span>
                    {user.role === 'admin' && <span className="admin-badge">Admin</span>}
                  </div>
                  <button className="logout-btn" onClick={handleLogout} aria-label="Đăng xuất">Đăng xuất</button>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
