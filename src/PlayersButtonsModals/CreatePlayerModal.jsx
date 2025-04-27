//4 add player+player details 
import React, { useState } from 'react';
import './CreatePlayerModal.css';

function CreatePlayerModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [kFactor, setKFactor] = useState(0);
  const [extraPoints, setExtraPoints] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('الاسم مطلوب');
      return;
    }

    const player = {
      id: Date.now(), // Simple unique ID
      name,
      email,
      rating: Number(rating),
      kFactor: Number(kFactor),
      extraPoints: Number(extraPoints),
      disabled,
    };

    onCreate(player);
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" dir="rtl">
        <h3>إنشاء لاعب جديد</h3>
        <form onSubmit={handleSubmit}>
          <label>
            الاسم<span className="required">*</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            البريد الإلكتروني (اختياري)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            التصنيف
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </label>

          <label>
            نقاط إضافية
            <input
              type="number"
              value={extraPoints}
              onChange={(e) => setExtraPoints(e.target.value)}
            />
          </label>

          <label>
            معامل K
            <input
              type="number"
              value={kFactor}
              onChange={(e) => setKFactor(e.target.value)}
            />
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            لاعب غير مفعل 
          </label>

          <div className="modal-actions">
          <button type="submit" className="create">
              إنشاء
            </button>
            <button type="button" className="cancel" onClick={onClose}>
              إلغاء
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePlayerModal;
