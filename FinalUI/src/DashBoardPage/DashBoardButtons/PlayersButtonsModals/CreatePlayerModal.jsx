import React, { useState, useEffect } from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';

function CreatePlayerModal({ isOpen, onClose, onCreate, playerData }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [kFactor, setKFactor] = useState(null);
  const [extraPoints, setExtraPoints] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (playerData) {
        // تعديل لاعب
        setName(playerData.name || '');
        setEmail(playerData.email || '');
        setRating(playerData.rating || 1200);
        setKFactor(playerData.kFactor );
        setExtraPoints(playerData.extraPoints || 0);
      } else {
        // إنشاء لاعب جديد
        setName('');
        setEmail('');
        setRating(0);
        setKFactor(null);
        setExtraPoints(0);
      }
    }
  }, [isOpen, playerData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('الاسم مطلوب');
      return;
    }

    const player = {
      name,
      email,
      rating: Number(rating),
      kFactor: Number(kFactor),
      extraPoints: Number(extraPoints),
    };

    onCreate(player); // إرسال اللاعب للـ parent لحفظه في DB
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={playerData ? "تعديل لاعب" : "إنشاء لاعب جديد"}>
      <form onSubmit={handleSubmit} className="player-form">
        <div className="floating-group">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="floating-input"
            placeholder=" "
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
            placeholder=" "
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
            placeholder=" "
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
            placeholder=" "
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
            placeholder=" "
          />
          <label htmlFor="kFactor" className="floating-label">معامل K</label>
        </div>

        <div className="modal-actions">
          <button type="submit" className="btn btn-gold">{playerData ? "حفظ التعديلات" : "إنشاء"}</button>
          <button type="button" className="btn btn-outline" onClick={onClose}>إلغاء</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default CreatePlayerModal;
