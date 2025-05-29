import React from 'react';
import './RoundsHomePage.css';

const pairings = [
  { board: 1, white: 'player8', black: 'player4' },
  { board: 2, white: 'player3', black: 'player2' },
  { board: 3, white: 'player5', black: 'player6' },
  { board: 4, white: 'player1', black: 'player7' },
];

const RoundsHomePage = () => {
  return (
    <div className="rounds-container">
      <h2 className="round-title">الجولة 1</h2>

      <div className="table-wrapper">
        <table className="pairing-results-table">
          <thead>
            <tr>
              <th>الأزواج</th>
              <th>اللاعب الأبيض</th>
              <th>النقاط</th>
              <th>النتيجة</th>
              <th>النقاط</th>
              <th>اللاعب الأسود</th>
            </tr>
          </thead>
          <tbody>
            {pairings.map((row) => (
              <tr key={row.board}>
                <td>{row.board}</td>
                <td>{row.white}</td>
                <td>0</td>
                <td>0 - 0</td>
                <td>0</td>
                <td>{row.black}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoundsHomePage;
