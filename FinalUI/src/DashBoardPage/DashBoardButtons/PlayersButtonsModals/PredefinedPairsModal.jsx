import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';

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
      setShowAddForm(false);
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
   <ModalWrapper isOpen={isOpen} onClose={onClose} title="⚠️ الأزواج المحددة مسبقاً">
      <div dir="rtl">
        <p className="modal-description">هنا يمكنك تحديد اللاعبين الذين تريد إجبارهم على المواجهة.</p>

<div className="table-wrapper" style={{ marginBottom: '1.5rem' }}>          <table className="table-theme">
            <thead>
              <tr>
                <th>اللاعب ١</th>
                <th>اللاعب ٢</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {predefinedPairs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-row">
                    <div className="forbidden-empty-box" />
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                predefinedPairs.map((pair, index) => (
                  <tr key={index}>
                    <td>{pair.player1}</td>
                    <td>{pair.player2}</td>
                    <td>
                      <button className="btn btn-outline" onClick={() => handleDeletePair(index)}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <div className="modal-body">
            <Select
              key={selectKey + "-1"}
              classNamePrefix="select"
              options={playerOptions}
              value={player1}
              onChange={setPlayer1}
              placeholder="اختر اللاعب الأول"
              isClearable
            />
            <Select
              key={selectKey + "-2"}
              classNamePrefix="select"
              options={playerOptions}
              value={player2}
              onChange={setPlayer2}
              placeholder="اختر اللاعب الثاني"
              isClearable
              isDisabled={!player1}
            />
            <div className="modal-actions" style={{ marginTop: '1rem' }}>
              <button className="btn btn-gold" onClick={handleAddPair} disabled={!player1 || !player2}>
                تأكيد
              </button>
              <button className="btn btn-outline" onClick={onClose}>إغلاق</button>
            </div>
          </div>
        )}

        {!showAddForm && (
          <div className="modal-actions">
            <button className="btn btn-gold" onClick={() => setShowAddForm(true)}>➕ إضافة زوج</button>
            <button className="btn btn-outline" onClick={onClose}>إغلاق</button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

export default PredefinedPairsModal;
