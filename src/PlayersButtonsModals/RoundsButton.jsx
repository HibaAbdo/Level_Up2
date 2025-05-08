import React from 'react';
import './RoundsPage.css';

const exampleRounds = [
  {
    roundNumber: 1,
    matches: [
      { white: 'Player 1', whitePts: 0, result: '1-0', blackPts: 0, black: 'Player 3' },
      { white: 'Player 4', whitePts: 0, result: '0-1', blackPts: 0, black: 'Player 2' },
      { white: 'Player 5', whitePts: 0, result: 'Bye', blackPts: 0, black: '' },
    ],
  },
  {
    roundNumber: 2,
    matches: [
      { white: 'Player 2', whitePts: 1, result: '1-0', blackPts: 1, black: 'Player 1' },
      { white: 'Player 3', whitePts: 0, result: '0.5-0.5', blackPts: 0.5, black: 'Player 5' },
      { white: 'Player 4', whitePts: 0, result: 'Bye', blackPts: 0, black: '' },
    ],
  }
];

function RoundsPage() {
  return (
    <div className="rounds-wrapper">
      <h1 className="rounds-title">الجولات</h1>
      {exampleRounds.map((round, idx) => (
        <div key={idx} className="round-block">
          <h2 className="round-label">Round {round.roundNumber}</h2>
          <table className="round-table">
            <thead>
              <tr>
                <th>#</th>
                <th>White Player</th>
                <th>Pts</th>
                <th>Result</th>
                <th>Pts</th>
                <th>Black Player</th>
              </tr>
            </thead>
            <tbody>
              {round.matches.map((match, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{match.white}</td>
                  <td>{match.whitePts}</td>
                  <td>{match.result}</td>
                  <td>{match.blackPts}</td>
                  <td>{match.black}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="rounds-actions">
        <button className="delete-round-btn">🗑 حذف الجولة الأخيرة</button>
        <button className="export-csv-btn">💾 حفظ كـ CSV</button>
      </div>
    </div>
  );
}

export default RoundsPage;
