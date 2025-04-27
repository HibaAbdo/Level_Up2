import React from 'react';
import './SortByRatingConfirmationModal.css';

function SortByRatingConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" dir="rtl">
        <h3>⚠️ تأكيد ترتيب حسب التصنيف</h3>
        <p>هل تريد بالتأكيد ترتيب اللاعبين حسب التصنيف؟</p>
        <div className="modal-actions">
        <button className="create" onClick={onConfirm}>ترتيب</button>
          <button className="cancel" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default SortByRatingConfirmationModal;
