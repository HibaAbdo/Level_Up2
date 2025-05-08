import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './PredefinedPairsModal.css';

function PredefinedPairsModal({ isOpen, onClose, players, tournamentId }) {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [predefinedPairs, setPredefinedPairs] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedData = JSON.parse(localStorage.getItem(`tournament-${tournamentId}`));
      if (storedData && storedData.predefinedPairs) {
        setPredefinedPairs(storedData.predefinedPairs);
      }
      setShowAddForm(false); // Reset form hidden every time modal opens
    }
  }, [isOpen, tournamentId]);

  const handleAddPair = () => {
    if (player1 && player2 && player1.value !== player2.value) {
      const alreadyExists = predefinedPairs.some(pair =>
        (pair.player1 === player1.label && pair.player2 === player2.label) ||
        (pair.player1 === player2.label && pair.player2 === player1.label)
      );

      if (alreadyExists) {
        alert('هذا الزوج موجود بالفعل.');
        return;
      }

      const newPair = { player1: player1.label, player2: player2.label };
      const updatedPairs = [...predefinedPairs, newPair];
      setPredefinedPairs(updatedPairs);

      const storedData = JSON.parse(localStorage.getItem(`tournament-${tournamentId}`)) || {};
      storedData.predefinedPairs = updatedPairs;
      localStorage.setItem(`tournament-${tournamentId}`, JSON.stringify(storedData));

      setPlayer1(null);
      setPlayer2(null);
      setSelectKey(prev => prev + 1);
      setShowAddForm(false);
    }
  };

  const handleDeletePair = (index) => {
    const updatedPairs = predefinedPairs.filter((_, i) => i !== index);
    setPredefinedPairs(updatedPairs);

    const storedData = JSON.parse(localStorage.getItem(`tournament-${tournamentId}`)) || {};
    storedData.predefinedPairs = updatedPairs;
    localStorage.setItem(`tournament-${tournamentId}`, JSON.stringify(storedData));
  };

  if (!isOpen) return null;

  const playerOptions = players.map(player => ({
    value: player.id,
    label: player.name,
  }));

  return (
    <div className="predefined-overlay">
      <div className="predefined-modal">
        <h2 className="predefined-title">
          ⚠️ الأزواج المحددة مسبقاً
        </h2>
        <p className="predefined-message">
          هنا يمكنك تحديد اللاعبين الذين تريد إجبارهم على المواجهة.
        </p>

        <div className="predefined-table">
          <table>
            <thead>
              <tr>
                <th>اللاعب ١</th>
                <th>اللاعب ٢</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {predefinedPairs.length === 0 ? (
                <tr className="predefined-empty">
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#cbd5e1' }}>
                    <div className="predefined-empty-box"></div>
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                predefinedPairs.map((pair, index) => (
                  <tr key={index}>
                    <td>{pair.player1}</td>
                    <td>{pair.player2}</td>
                    <td>
                      <button
                        className="predefined-btn cancel"
                        onClick={() => handleDeletePair(index)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <div className="predefined-form">
            <label>اللاعب ١</label>
            <Select
              key={selectKey + "-1"}
              classNamePrefix="select"
              options={playerOptions}
              value={player1}
              onChange={setPlayer1}
              placeholder="اختر اللاعب الأول"
            />

            <label>اللاعب ٢</label>
            <Select
              key={selectKey + "-2"}
              classNamePrefix="select"
              options={playerOptions}
              value={player2}
              onChange={setPlayer2}
              placeholder="اختر اللاعب الثاني"
            />

            <button
              className="predefined-btn confirm"
              onClick={handleAddPair}
              disabled={!player1 || !player2 || player1.value === player2.value}
            >
              تأكيد
            </button>
          </div>
        )}

        <div className="predefined-buttons">
          {showAddForm ? null : (
            <>
              <button className="predefined-btn add" onClick={() => setShowAddForm(true)}>
                إضافة زوج
              </button>
              <button className="predefined-btn cancel" onClick={onClose}>
                إغلاق
              </button>
            </>
          )}
          {showAddForm && (
            <button className="predefined-btn cancel" onClick={onClose}>
              إغلاق
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredefinedPairsModal;
