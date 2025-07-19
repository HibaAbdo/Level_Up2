import React, { useState } from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';
import './CreatePlayersByListModal.css'; // إذا بدك تعدلي ستايل إضافي

function CreatePlayersByListModal({ isOpen, onClose, onCreateMany }) {
  const [input, setInput] = useState('');

  const handleSave = () => {
    const lines = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newPlayers = lines.map(line => {
      let [name, rating] = line.includes(',') 
        ? line.split(',').map(part => part.trim()) // إذا استخدم فاصلة انجليزية
        : line.split('،').map(part => part.trim()); // إذا استخدم فاصلة عربية    
          return {
        id: Date.now() + Math.random(),
        name: name || 'بدون اسم',
        rating: Number(rating) || 0,
        email: '',
        kFactor: 20,
        extraPoints: 0,
      };
    });

    onCreateMany(newPlayers);
    onClose();
    setInput('');
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="إنشاء لاعبين من قائمة">
      <div className="players-list-modal">
        <textarea
          id="players-input"
          rows={6}
          className="floating-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
placeholder="ضحى، 1600  |  Duha, 1600"        />
        <div className="modal-actions">
          <button className="btn btn-gold" onClick={handleSave}>إنشاء</button>
          <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default CreatePlayersByListModal;
