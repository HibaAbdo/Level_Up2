import React from 'react';
import './SortByRatingButton.css';
import ratingIcon from '../assets/Icons/sortByrating.png';

const SortByRatingButton = ({ onSort }) => {
  return (
    <button className="sort-by-rating-btn" onClick={onSort}>
      ترتيب حسب التصنيف
      <img src={ratingIcon} alt="تصنيف" className="sort-icon" />
    </button>
  );
};

export default SortByRatingButton;
