import React from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper'; // مسار المودل العام

function SortByRatingConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="⚠️ تأكيد الترتيب حسب التّصنيف">
      <div className="sort-by-rating-btn">
        <p className="modal-message">
          هل تريد بالتأكيد إعادة ترتيب اللاعبين حسب التّصنيف؟
        </p>
        <div className="modal-actions">
          <button className="btn btn-gold" onClick={onConfirm}>ترتيب</button>
          <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default SortByRatingConfirmationModal;
