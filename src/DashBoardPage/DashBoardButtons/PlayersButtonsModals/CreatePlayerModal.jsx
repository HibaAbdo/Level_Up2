import React, { useState } from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';

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
      id: Date.now(),
      name,
      email,
      rating: Number(rating),
      kFactor: Number(kFactor),
      extraPoints: Number(extraPoints),
      disabled,
    };

    onCreate(player);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="إنشاء لاعب جديد">
      <form onSubmit={handleSubmit} className="player-form">

        <div className="floating-group">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="floating-input"
            placeholder="الاسم"
          />
          <label htmlFor="name" className="floating-label">الاسم*</label>
        </div>

        <div className="floating-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="floating-input"
            placeholder="البريد الإلكتروني"
          />
          <label htmlFor="email" className="floating-label">البريد الإلكتروني (اختياري)</label>
        </div>

        <div className="floating-group">
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="floating-input"
            placeholder="التصنيف"
          />
          <label htmlFor="rating" className="floating-label">التصنيف</label>
        </div>

        <div className="floating-group">
          <input
            type="number"
            id="extraPoints"
            value={extraPoints}
            onChange={(e) => setExtraPoints(e.target.value)}
            className="floating-input"
            placeholder="نقاط إضافية"
          />
          <label htmlFor="extraPoints" className="floating-label">نقاط إضافية</label>
        </div>

        <div className="floating-group">
          <input
            type="number"
            id="kFactor"
            value={kFactor}
            onChange={(e) => setKFactor(e.target.value)}
            className="floating-input"
            placeholder="معامل K"
          />
          <label htmlFor="kFactor" className="floating-label">معامل K</label>
        </div>

        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />
          لاعب غير مفعل
        </label>

        <div className="modal-actions">
          <button type="submit" className="btn btn-gold">إنشاء</button>
          <button type="button" className="btn btn-outline" onClick={onClose}>إلغاء</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default CreatePlayerModal;
