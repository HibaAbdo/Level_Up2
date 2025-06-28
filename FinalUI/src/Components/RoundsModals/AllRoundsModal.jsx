import React from "react";
import ModalWrapper from "../TheModals/ModalWrapper";

function AllRoundsModal({ isOpen, onClose, rounds }) {
  if (!isOpen || !rounds) return null;

  return (
     <ModalWrapper isOpen={isOpen} onClose={onClose} title="كل الجولات">
        {rounds.map((round) => (
          <div key={round.number}>
            <h3>الجولة {round.number}</h3>
            <div className="table-wrapper">
              <table className="table-theme">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الأبيض</th>
                    <th>الأسود</th>
                    <th>النتيجة</th>
                  </tr>
                </thead>
                <tbody>
                  {round.matches.map((match, i) => (
                    <tr key={match.id}>
                      <td>{i + 1}</td>
                      <td>{match.white}</td>
                      <td>{match.black}</td>
                      <td>{match.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      <div className="modal-actions" style={{ marginTop: '1rem' }}>
          <button className="btn btn-outline" onClick={onClose}>إغلاق</button>
        </div>
    </ModalWrapper>
  );
}

export default AllRoundsModal;
