// components/PageContainer/PageContainer.jsx
import React from 'react';
import './PageContainer.css';

const PageContainer = ({ children }) => {
  return <div className="page-container">{children}</div>;
};

export default PageContainer;