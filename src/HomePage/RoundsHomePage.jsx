import React from 'react';
import PageContainer from '../Components/ThePageContainers/PageContainer';
import Header from '../Components/TheHeaders/Header';
import './RoundsHomePage.css';

const pairings = [
  { board: 1, white: 'player8', black: 'player4' },
  { board: 2, white: 'player3', black: 'player2' },
  { board: 3, white: 'player5', black: 'player6' },
  { board: 4, white: 'player1', black: 'player7' },
];

const RoundsHomePage = () => {
  return (
    <>
      {/* ✅ الهيدر يغطي كامل العرض */}
      <Header showHomeButton={true} />

      <PageContainer>
        <div className="rounds-content">
          <h2 className="form-title">الجولة 1</h2>

          <div className="rounds-table-wrapper">
            <table className="table-theme">
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>الأبيض</th>
                  <th>النقاط</th>
                  <th>النتيجة</th>
                  <th>النقاط</th>
                  <th>الأسود</th>
                </tr>
              </thead>
              <tbody>
                {pairings.map((pair) => (
                  <tr key={pair.board}>
                    <td>{pair.board}</td>
                    <td>{pair.white}</td>
                    <td>0</td>
                    <td>0 - 0</td>
                    <td>0</td>
                    <td>{pair.black}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default RoundsHomePage;