// Components/PageLayout.jsx
import React from 'react';
import './PageLayout.css';

function PageLayout({ children }) {
  return (
    <div className="page-wrapper"> {/* No scroll here */}
      {children} {/* Only the table-scroll inside children will scroll */}
    </div>
  );
}

export default PageLayout;
