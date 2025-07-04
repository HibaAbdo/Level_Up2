// src/components/Headers/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logoshah.png';
import shahIcon from '../../assets/Icons/shah2rangeIcon.png';
import homeIcon from '../../assets/Icons/home.png';
import logoutIcon from '../../assets/LogoutIcon/logout (2).png';
import loginIcon from '../../assets/LoginIcons/loginIcon.png';
import './Header.css';

const Header = ({
  showHomeButton = false,
  showLoginButton = false,
  username = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ تحديد إذا كنت في صفحة زائر (ضيف)
  const guestPaths = ['/', '/standings', '/rounds', '/guests-home'];
  const isGuestPage = guestPaths.includes(location.pathname);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="header-container">
      <div className="logo-with-text">
        <img src={logo} alt="Logo" className="dashboard-logo" />

        {isGuestPage ? (
          <a
            className="logo-text-link"
            href="https://www.shah2range.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={shahIcon} alt="شطرنج القدس" className="logo-small-icon" />
            <span className="logo-text">شطرنج القدس</span>
          </a>
        ) : (
          <div
            className="logo-text-link"
            onClick={() => navigate('/mytournaments')}
            style={{ cursor: 'pointer' }}
          >
            <span className="logo-text">بطولاتي</span>
          </div>
        )}
      </div>

      <div className="header-left">
        {username && (
          <>
            <span className="username">{username}</span>
            <button className="signout-btn" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
              تسجيل الخروج
            </button>
          </>
        )}

        {!username && showHomeButton && (
          <button className="header-button" onClick={() => navigate('/guests-home')}>
            <img src={homeIcon} alt="Home Icon" className="login-icon" />
            الصفحة الرئيسية
          </button>
        )}

        {!username && showLoginButton && (
          <button className="header-button" onClick={() => navigate('/')}>
            <img src={loginIcon} alt="Login Icon" className="login-icon" />
            تسجيل الدخول
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;