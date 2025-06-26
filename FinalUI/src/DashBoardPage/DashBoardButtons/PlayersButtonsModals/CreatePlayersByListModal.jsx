import React, { useState } from 'react';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';
import './CreatePlayersByListModal.css'; // إذا بدك تعدلي ستايل إضافي

function CreatePlayersByListModal({ isOpen, onClose, onCreateMany }) {
  const [input, setInput] = useState('');

const handleSave = async () => {
  const lines = input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const newPlayers = lines.map(line => {
    const [name, rating] = line.split('،').map(part => part.trim());
    return {
      name,
      rating: Number(rating) || 0,
      email: '',
      kFactor: 20,
      extraPoints: 0,
      disabled: false,
    };
  });

  try {
    const response = await fetch('/api/players/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlayers),
    });

    if (!response.ok) throw new Error('فشل في إضافة اللاعبين');

    alert('✅ تمت إضافة جميع اللاعبين بنجاح');

    onClose();
    setInput('');
  } catch (error) {
    console.error(error);
    alert('❌ حدث خطأ أثناء إرسال اللاعبين');
  }
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
          placeholder="ضحى، 1600"
        />
        <div className="modal-actions">
          <button className="btn btn-gold" onClick={handleSave}>إنشاء</button>
          <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </ModalWrapper>
  );
  
}


export default CreatePlayersByListModal;
