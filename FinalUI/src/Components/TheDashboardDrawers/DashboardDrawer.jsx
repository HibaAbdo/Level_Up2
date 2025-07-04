// src/Components/DashboardDrawer/DashboardDrawer.jsx
import React from 'react';
import './DashboardDrawer.css';
// Ensure this path is correct for your toggle icon
import toggleMenuIcon from '../../assets/Icons/left-arrow (3).png'; // ⭐ Using your specified path


const tabs = ['الإعدادات', 'اللاعبين', 'الحكّام', 'الجولات', 'التّرتيب'];


const DashboardDrawer = ({ isOpen, onClose, activeTab, setActiveTab, showToggleButton }) => {
  return (
    <>
      {/* The overlay/backdrop - shows only when menu is open */}
      {isOpen && <div className="drawer-backdrop" onClick={onClose}></div>}

      {/* The actual sliding drawer content */}
      <aside className={`drawer ${isOpen ? 'open' : ''}`}>
        {/* Small black 'X' close button at the top-left of the drawer */}
        <button className="drawer-close-x-btn" onClick={onClose}>
          &times; {/* HTML entity for a multiplication sign 'x' */}
        </button>

        <ul className="drawer-tabs">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? 'active-tab' : ''}
              onClick={() => {
                setActiveTab(tab);
                onClose(); // Close the drawer when a tab is clicked
              }}
            >
              {tab}
            </li>
          ))}
        </ul>
      </aside>

      {/* The semi-circular toggle button - shows only when menu is closed */}
      {showToggleButton && !isOpen && (
        <button className="dashboard-drawer-toggle-arrow-btn" onClick={onClose}>
          <img
            src={toggleMenuIcon}
            alt="Toggle Menu"
            className="toggle-icon" // The rotation logic for this icon isn't needed here if it only shows when closed
          />
        </button>
      )}
    </>
  );
};

export default DashboardDrawer;