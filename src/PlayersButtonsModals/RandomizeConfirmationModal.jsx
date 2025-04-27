import React from 'react';

function RandomizeConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" dir="rtl">
        <h3>⚠️ تأكيد ترتيب عشوائي</h3>
        <p>هل تريد بالتأكيد إعادة ترتيب اللاعبين بشكل عشوائي؟</p>
        <div className="modal-actions">
        <button className="create" onClick={onConfirm}>ترتيب</button>
          <button className="cancel" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default RandomizeConfirmationModal;
