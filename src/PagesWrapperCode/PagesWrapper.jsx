import React from 'react';
import './PagesWrapper.css';
import logo from '../assets/logoshah.png';

const PagesWrapper = ({ children }) => {
  return (
    <div className="page-wrapper">
      <div className="page-background" />
      <div className="wrapper-logo">
        <img src={logo} alt="شطرنج القدس" />
      </div>
      <div className="wrapper-content">
        {children}
      </div>
    </div>
  );
};

export default PagesWrapper;
