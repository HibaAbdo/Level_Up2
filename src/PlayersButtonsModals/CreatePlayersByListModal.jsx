//5 
import React, { useState } from 'react';
import './CreatePlayersByListModal.css';

function CreatePlayersByListModal({ isOpen, onClose, onCreateMany }) {
  const [input, setInput] = useState('');

  const handleSave = () => {
    const lines = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newPlayers = lines.map(line => {
      const [name, rating] = line.split(',').map(part => part.trim());
      return {
        id: Date.now() + Math.random(), // unique-ish
        name,
        rating: Number(rating) || 0,
        email: '',
        kFactor: 20,
        extraPoints: 0,
        disabled: false,
      };
    });

    onCreateMany(newPlayers);
    onClose();
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" dir="rtl">
        <h3>إنشاء لاعبين من القائمة</h3>
        <textarea
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="modal-actions">
        <button className="create" onClick={handleSave}>حفظ</button>
          <button className="cancel" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default CreatePlayersByListModal;
