import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { to: '/admin',           label: 'Dashboard',    icon: '📊', end: true },
  { to: '/admin/blogs',     label: 'Blog Posts',   icon: '📝' },
  { to: '/admin/contacts',  label: 'Messages',     icon: '📬' },
  { to: '/admin/newsletter',label: 'Newsletter',   icon: '📧' },
  { to: '/admin/seo',       label: 'SEO Manager',  icon: '🔍' },
  { to: '/admin/adsense',   label: 'AdSense',      icon: '💰' },
  { to: '/admin/settings',  label: 'Settings',     icon: '⚙️' },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-logo">
            <span>🌿</span>
            <span>Admin Panel</span>
          </div>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="admin-user">
          <div className="admin-user__avatar">{admin?.name?.[0] || 'A'}</div>
          <div>
            <div className="admin-user__name">{admin?.name}</div>
            <div className="admin-user__role">Administrator</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav__item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav__item">
            <span className="admin-nav__icon">🌐</span>
            <span>View Website</span>
          </a>
          <button onClick={handleLogout} className="admin-nav__item logout-btn">
            <span className="admin-nav__icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__burger" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="admin-topbar__title">Tflixs Admin</div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
