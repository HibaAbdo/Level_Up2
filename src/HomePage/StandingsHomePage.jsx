import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import PageContainer from '../components/PageContainers/PageContainer';
import Header from '../components/Headers/Header';
import './StandingsHomePage.css';

const players = [
  { pos: 1, name: 'سميرة', points: 2.5, r1: '+BYE3', r2: '+B4', r3: '=W2', de: 0, buc1: 2.5, buct: 3.5 },
  { pos: 2, name: 'محمد', points: 1.5, r1: '-W4', r2: '+B3', r3: '=B1', de: 0, buc1: 3.5, buct: 4.5 },
  { pos: 3, name: 'هبة', points: 1, r1: '-BYE1', r2: '-W2', r3: '+B4', de: 1, buc1: 3.5, buct: 4.5 },
  { pos: 4, name: 'ضحى', points: 1, r1: '+B2', r2: '-W1', r3: '-W3', de: 0, buc1: 3.5, buct: 5 },
  { pos: 5, name: 'Player 5', points: 1, r1: '+W6', r2: '-B1', r3: '=W3', de: 0, buc1: 2, buct: 3 },
];

const normalize = (str) => str.trim().replace(/\s+/g, '').toLowerCase();

const StandingsHomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(player =>
    normalize(player.name).includes(normalize(searchTerm))
  );

 return (
    <>
      {/* ✅ الهيدر يغطي كامل العرض */}
      <Header showHomeButton={true} />

      <PageContainer>

      <div className="standings-content">
        {/* 🔍 حقل البحث */}
        <div className="standings-search-wrapper">
          <input
            type="text"
            className="standings-search-input"
            placeholder="ابحث عن لاعب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="standings-search-icon" />
        </div>

        {/* 📋 جدول النتائج أو رسالة فارغة */}
        {filteredPlayers.length > 0 ? (
          <div className="standings-table-wrapper">
            <table className="table-theme">
              <thead>
                <tr>
                  <th>الترتيب</th>
                  <th>اللاعب</th>
                  <th>النقاط</th>
                  <th>الجولة ١</th>
                  <th>الجولة ٢</th>
                  <th>الجولة ٣</th>
                  <th>DE</th>
                  <th>Buc1</th>
                  <th>BucT</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((p, i) => (
                  <tr key={i}>
                    <td>{p.pos}</td>
                    <td>{p.name}</td>
                    <td><strong>{p.points}</strong></td>
                    <td>{p.r1}</td>
                    <td>{p.r2}</td>
                    <td>{p.r3}</td>
                    <td>{p.de}</td>
                    <td>{p.buc1}</td>
                    <td>{p.buct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-results-message">لا يوجد لاعب بهذا الاسم</div>
        )}
      </div>
    </PageContainer>
        </>
  );
};

export default StandingsHomePage;
