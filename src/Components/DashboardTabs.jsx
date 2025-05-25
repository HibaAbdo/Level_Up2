// Components/DashboardTabs.jsx
import React from 'react';
import settingsIcon from '../assets/Icons/settingsPiece.png';
import playerIcon from '../assets/Icons/player.png';
import roundIcon from '../assets/Icons/game.png';
import standingsIcon from '../assets/Icons/chess-board.png';

const tabs = [
  { label: 'الإعدادات', icon: settingsIcon },
  { label: 'اللاعبين', icon: playerIcon },
  { label: 'الجولات', icon: roundIcon },
  { label: 'الترتيب', icon: standingsIcon },
];

function DashboardTabs({ active, setActive }) {
  return (
    <div className="dashboard-tabs">
      {tabs.map(tab => (
        <button
          key={tab.label}
          className={`tab vertical-tab ${active === tab.label ? 'active' : ''}`}
          onClick={() => setActive(tab.label)}
        >
          <img src={tab.icon} alt="" className="tab-icon" />
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default DashboardTabs;
