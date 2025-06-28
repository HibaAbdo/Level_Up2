import React, { useState } from 'react';
import Select from 'react-select';
import ModalWrapper from '../../../Components/TheModals/ModalWrapper';

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
    onAddPair(newPair);
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
     <ModalWrapper isOpen={isOpen} onClose={onClose} title="⚠️ الأزواج الممنوعة">
      <div dir="rtl">
        <p className="modal-description">هنا يمكنك تحديد اللاعبين الذين لا يُسمح لهم بالمواجهة.</p>

        <div className="table-wrapper">
          <table className="table-theme">
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
                  <td colSpan="3" className="empty-row">
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
                      <button className="btn btn-outline" onClick={() => handleRemove(idx)}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-body" style={{ marginTop: '1rem' }}>
            <Select
              options={playerOptions}
              value={player1}
              onChange={setPlayer1}
              placeholder="اختر لاعباً"
              isClearable
              classNamePrefix="select"
            />
            <Select
              options={filteredPlayer2Options}
              value={player2}
              onChange={setPlayer2}
              placeholder="اختر لاعباً آخر"
              isDisabled={!player1}
              isClearable
              classNamePrefix="select"
            />
          </div>
        )}

     <div className="modal-actions" style={{ marginTop: '2rem' }}>
          {showForm ? (
            <>
              <button
                className="btn btn-gold"
                onClick={handleAddPair}
                disabled={!player1 || !player2}
              >
                تأكيد
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                إغلاق
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-gold" onClick={() => setShowForm(true)}>
                ➕ إضافة زوج
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                إغلاق
              </button>
            </>
          )}
        </div>
      </div>
          </ModalWrapper>

  );
}

export default ForbiddenPairsModal;
