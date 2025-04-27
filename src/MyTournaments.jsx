// first page with the table 
import React, { useEffect, useState } from 'react';
import './MyTournaments.css';
import chessBg from './assets/chess-bg.png';
import { useNavigate } from 'react-router-dom';

function MyTournaments() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);

  const backgroundStyle = {
    backgroundImage: `url(${chessBg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '80%',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    opacity: 0.07,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    pointerEvents: 'none',
  };

  useEffect(() => {
    // Load tournaments from localStorage when the page loads
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(storedTournaments);
  }, []);

  return (
    <div className="page-wrapper">
      <div style={backgroundStyle} />

      <div className="page">
        <h2>بطولاتي</h2>

        <div className="actions">
          <button className="btn archive">فتح الأرشيف</button>
          <button className="btn create" onClick={() => navigate('/create')}>
            إنشاء بطولة
          </button>
        </div>

        <div className="table-container">
          <table className="tournaments-table">
            <thead>
              <tr>
                <th className="col-name">الاسم</th>
                <th className="col-modified">آخر تعديل</th>
                <th className="col-created">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-tournaments">
                    لا توجد بطولات محفوظة
                  </td>
                </tr>
              ) : (
                tournaments.map((tournament, index) => (
                  <tr key={index}>
                    <td className="col-name">{tournament.name}</td>
                    <td className="col-modified">{tournament.lastModified}</td>
                    <td className="col-created">{tournament.creationDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyTournaments;
