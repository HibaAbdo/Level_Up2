// src/Layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';
import logo from '../assets/logoshah.png';

function DashboardLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'مستخدم';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-right">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <span className="dashboard-title">بطولاتي</span>
        </div>

        <div className="header-left">
          <span className="username">{username}</span>
          <button className="signout-btn" onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <Outlet /> {/* ✅ Renders the matched child route */}
      </main>
    </div>
  );
}

export default DashboardLayout;
