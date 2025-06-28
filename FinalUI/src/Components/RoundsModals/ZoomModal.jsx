import React from "react";
import ModalWrapper from "../TheModals/ModalWrapper";

function ZoomModal({ isOpen, onClose, round }) {
  if (!isOpen || !round) return null;

  return (
      <ModalWrapper isOpen={isOpen} onClose={onClose} title={`تفاصيل الجولة ${round.number}`}>
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
              {round.matches.map((match, index) => (
                <tr key={match.id}>
                  <td>{index + 1}</td>
                  <td>{match.white}</td>
                  <td>{match.black}</td>
                  <td>{match.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         <div className="modal-actions" style={{ marginTop: '1rem' }}>
          <button className="btn btn-outline" onClick={onClose}>إغلاق</button>
        </div>
    </ModalWrapper>
  );
}

export default ZoomModal;
