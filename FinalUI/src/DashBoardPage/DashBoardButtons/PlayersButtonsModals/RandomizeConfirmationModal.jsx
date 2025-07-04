import React from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper'; // مسار المودل العام
import './RandomizeConfirmationModal.css'; // لو احتجت تعديلات إضافية

function RandomizeConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="⚠️ تأكيد الترتيب العشوائي">
      <div className="randomize-modal-body">
        <p className="modal-message">
          هل تريد بالتأكيد إعادة ترتيب اللاعبين بشكل عشوائي؟
        </p>
        <div className="modal-actions">
          <button className="btn btn-gold" onClick={onConfirm}>ترتيب</button>
          <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default RandomizeConfirmationModal;
