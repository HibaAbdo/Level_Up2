import React from "react";
import logo from "./assets/logoshah.png";
import "./SharedLayout.css";

function SharedLayout({ children }) {
  return (
    <div className="shared-container">
      <div className="form-logo-wrapper">
        <img src={logo} alt="شطرنج القدس" className="form-logo" />
      </div>
      {children}
    </div>
  );
}

export default SharedLayout;
