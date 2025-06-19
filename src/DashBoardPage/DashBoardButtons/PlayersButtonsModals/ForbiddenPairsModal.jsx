import React, { useState } from 'react';
import Select from 'react-select';
import './ForbiddenPairsModal.css';

function ForbiddenPairsModal({ isOpen, onClose, players, onAddPair }) {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [forbiddenPairs, setForbiddenPairs] = useState([]);

  if (!isOpen) return null;

  const playerOptions = players.map((p) => ({ value: p.id, label: p.name }));

  const filteredPlayer2Options = playerOptions.filter(opt => opt.value !== player1?.value);

  const handleAddPair = () => {
    if (!player1 || !player2) return;

    const newPair = { player1, player2 };
    const updated = [...forbiddenPairs, newPair];
    setForbiddenPairs(updated);
    onAddPair(newPair); // Optional callback
    setPlayer1(null);
    setPlayer2(null);
    setShowForm(false);
  };

  const handleRemove = (index) => {
    const updated = [...forbiddenPairs];
    updated.splice(index, 1);
    setForbiddenPairs(updated);
  };

  return (
    <div className="forbidden-overlay">
      <div className="forbidden-modal" dir="rtl">
        <h2 className="forbidden-title">⚠️ الأزواج الممنوعة</h2>
        <p className="forbidden-message">هنا يمكنك تحديد اللاعبين الذين لا يُسمح لهم بالمواجهة.</p>

        <table className="forbidden-table">
          <thead>
            <tr>
              <th>اللاعب ١</th>
              <th>اللاعب ٢</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {forbiddenPairs.length === 0 ? (
              <tr>
                <td colSpan="3" className="forbidden-empty">
                  <div className="forbidden-empty-box" />
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              forbiddenPairs.map((pair, idx) => (
                <tr key={idx}>
                  <td>{pair.player1.label}</td>
                  <td>{pair.player2.label}</td>
                  <td>
                    <button onClick={() => handleRemove(idx)}>❌</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showForm && (
          <div className="forbidden-form">
            <label>اللاعب الأول:</label>
            <Select
              options={playerOptions}
              value={player1}
              onChange={setPlayer1}
              placeholder="اختر لاعباً"
              isClearable
            />
            <label style={{ marginTop: '1rem' }}>اللاعب الثاني:</label>
            <Select
              options={filteredPlayer2Options}
              value={player2}
              onChange={setPlayer2}
              placeholder="اختر لاعباً آخر"
              isDisabled={!player1}
              isClearable
            />
            <button className="forbidden-btn confirm" onClick={handleAddPair} disabled={!player1 || !player2}>
              تأكيد
            </button>
          </div>
        )}

        <div className="forbidden-buttons">
          {!showForm && (
            <button className="forbidden-btn add" onClick={() => setShowForm(true)}>
              إضافة زوج
            </button>
          )}
          <button className="forbidden-btn cancel" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForbiddenPairsModal;
