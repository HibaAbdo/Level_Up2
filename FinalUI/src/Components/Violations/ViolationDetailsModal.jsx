// src/Components/Violations/ViolationDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import './ViolationDetailsModal.css';
import ModalWrapper from '../TheModals/ModalWrapper';

const violationChoices = [
  'لا يوجد',
  'عدم الالتزام بالزي',
  'تأخر عن الجولة',
  'سلوك غير لائق',
  'أخرى'
];

function ViolationDetailsModal({ isOpen, onClose, violationData, onSave, onDelete }) {
  const [choice, setChoice] = useState('لا يوجد');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (violationData) {
      setChoice(violationData.choice || 'لا يوجد');
      setNote(violationData.note || '');
    }
  }, [violationData]);

  if (!isOpen || !violationData) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="تفاصيل المخالفة">
<div className="floating-group">
  <select
    id="violation"
    className="floating-input"
    value={choice}
    onChange={(e) => setChoice(e.target.value)}
  >
    {violationChoices.map((option, idx) => (
      <option key={idx} value={option}>{option}</option>
    ))}
  </select>
  <label htmlFor="violation" className="floating-label">اختر المخالفة</label>
</div>


      <div className="floating-group">
        <input
          id="note"
          className="floating-input"
          placeholder=" "
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <label htmlFor="note" className="floating-label">ملاحظة</label>
      </div>

      <div className="violation-buttons modal-actions">
        <button className="btn btn-violet" onClick={() => onSave({ choice, note })}>حفظ</button>
        <button className="btn btn-violet" onClick={onDelete}>حذف</button>
        <button className="btn btn-violet" onClick={onClose}>إلغاء</button>
      </div>
    </ModalWrapper>
  );
}

export default ViolationDetailsModal;
