import React from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';
function CheckinConfirmationModal({ isOpen, onClose, onConfirm, isActive }) {
  const title = isActive ? "تأكيد اللاعبين" : "بدء التأكيد";
 const message = isActive
  ? "هل انت متأكد من تأكيد اللاعبين والانتقال إلى الجولات؟"
  : "هل أنت متأكد أنك تريد بدء وضع التأكيد؟";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <div className="modal-actions">
         <button onClick={onConfirm} className="btn btn-gold">
          تأكيد
        </button>
        <button onClick={onClose} className="btn btn-outline">
          إلغاء
        </button>
      </div>
    </ModalWrapper>
  );
}
export default CheckinConfirmationModal;