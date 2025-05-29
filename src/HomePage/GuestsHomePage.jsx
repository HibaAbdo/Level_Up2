import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoshah.png';
import './GuestsHomePage.css';
import shahIcon from '../assets/Icons/shah2rangeIcon.png';
import loginIcon from '../assets/Icons/login (1).png';
import posterIcon from '../assets/Icons/poster.png';
import gameIcon from '../assets/Icons/game (1).png';

const GuestsHomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleRounds = () => navigate('/rounds');
  const handleStandings = () => navigate('/standings');

  return (
    <div className="guests-home-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-right-group">
          <div className="logo-with-text">
            <img src={logo} alt="Logo" className="dashboard-logo" />
            <a
              className="logo-text-link"
              href="https://www.shah2range.com/?fbclid=..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={shahIcon} alt="شطرنج القدس أيقونة" className="logo-small-icon" />
              <span className="logo-text">شطرنج القدس</span>
            </a>
          </div>
        </div>

        <button className="login-button" onClick={handleLogin}>
          <img src={loginIcon} alt="Login Icon" className="login-icon" />
          <span>تسجيل الدخول</span>
        </button>
      </header>

      {/* Main Buttons Section */}
      <main className="guests-home-content">
        <section className="main-buttons">
          <button className="big-action-button rounds-button" onClick={handleRounds}>
            <img src={gameIcon} alt="Rounds Icon" className="action-icon" />
            <span className="button-label">الجولات</span>
          </button>

          <button className="big-action-button" onClick={handleStandings}>
            <img src={posterIcon} alt="Standings Icon" className="action-icon" />
            <span className="button-label">الترتيب</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default GuestsHomePage;
