import React from 'react';
import { useNavigate } from 'react-router-dom';
import posterIcon from '../assets/Icons/poster.png';
import gameIcon from '../assets/Icons/game (1).png';
import PageContainer from '../Components/ThePageContainers/PageContainer';
import Header from '../Components/TheHeaders/Header';
import './GuestsHomePage.css';

const GuestsHomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate('/');
  const handleRounds = () => navigate('/rounds');
  const handleStandings = () => navigate('/standings');

  return (
    <>
      {/* ✅ استخدمنا الهيدر العام */}
      <Header showLoginButton={true} />

      <PageContainer>
        <div className="guests-home-container">
          {/* ✅ فقط محتوى الصفحة بدون هيدر مكرر */}
          <main className="guests-main-content">
            <section className="guests-main-buttons">
              <button className="guests-action-button" onClick={handleRounds}>
                <img src={gameIcon} alt="Rounds Icon" className="guests-action-icon" />
                <span className="guests-button-label">الجولات</span>
              </button>

              <button className="guests-action-button" onClick={handleStandings}>
                <img src={posterIcon} alt="Standings Icon" className="guests-action-icon" />
                <span className="guests-button-label">الترتيب</span>
              </button>
            </section>
          </main>
        </div>
      </PageContainer>
    </>
  );
};

export default GuestsHomePage;