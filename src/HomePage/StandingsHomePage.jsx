import React, { useState } from 'react';
import './StandingsHomePage.css';

const players = [
  { pos: 1, name: 'سميرة', points: 2.5, rating: 0, newRating: 0, r1: '+BYE3', r2: '+B4', r3: '=W2', de: 0, buc1: 2.5, buct: 3.5 },
  { pos: 2, name: 'محمد', points: 1.5, rating: 0, newRating: 0, r1: '-W4', r2: '+B3', r3: '=B1', de: 0, buc1: 3.5, buct: 4.5 },
  { pos: 3, name: 'هبة', points: 1, rating: 0, newRating: 0, r1: '-BYE1', r2: '-W2', r3: '+B4', de: 1, buc1: 3.5, buct: 4.5 },
  { pos: 4, name: 'ضحى', points: 1, rating: 0, newRating: 0, r1: '+B2', r2: '-W1', r3: '-W3', de: 0, buc1: 3.5, buct: 5 },
  { pos: 5, name: 'Player 5', points: 1, rating: 0, newRating: 0, r1: '+W6', r2: '-B1', r3: '=W3', de: 0, buc1: 2, buct: 3 },
  { pos: 6, name: 'Player 6', points: 0.5, rating: 0, newRating: 0, r1: '-B5', r2: '=W7', r3: '-B2', de: 0, buc1: 1, buct: 2 },
  { pos: 7, name: 'Player 7', points: 1, rating: 0, newRating: 0, r1: '=B8', r2: '=B6', r3: '+W1', de: 0, buc1: 3, buct: 3.5 },
  { pos: 8, name: 'Player 8', points: 1.5, rating: 0, newRating: 0, r1: '=W7', r2: '+B5', r3: '-B6', de: 0, buc1: 2.5, buct: 3.5 },
  { pos: 9, name: 'Player 9', points: 0.5, rating: 0, newRating: 0, r1: '-B5', r2: '=W7', r3: '-B2', de: 0, buc1: 1, buct: 2 },
  { pos: 10, name: 'Player 10', points: 1, rating: 0, newRating: 0, r1: '=B8', r2: '=B6', r3: '+W1', de: 0, buc1: 3, buct: 3.5 },
  { pos: 11, name: 'Player 11', points: 1.5, rating: 0, newRating: 0, r1: '=W7', r2: '+B5', r3: '-B6', de: 0, buc1: 2.5, buct: 3.5 },
];

// optional: normalize Arabic/English input
const normalize = (str) => str.trim().replace(/\s+/g, '').toLowerCase();

const StandingsHomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = searchTerm
    ? players.filter(player =>
        normalize(player.name).includes(normalize(searchTerm))
      )
    : players;

  return (
    <div className="standings-home-container">
      {/* Search Bar */}
      <div className="standings-search-wrapper">
        <input
          type="text"
          className="standings-search-input"
          placeholder="ابحث عن لاعب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table or No Results Message */}
      {filteredPlayers.length > 0 ? (
        <div className="standings-table-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th>الترتيب</th>
                <th>اللاعب</th>
                <th>النقاط</th>
                <th>التصنيف</th>
                <th>التصنيف الجديد</th>
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
                  <td>{p.rating}</td>
                  <td>{p.newRating}</td>
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
        <div className="no-results-message">
          <p>لا يوجد لاعب بهذا الاسم</p>
        </div>
      )}
    </div>
  );
};

export default StandingsHomePage;
