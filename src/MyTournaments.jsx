// first page with the table 
import React from 'react';
import './MyTournaments.css';
import chessBg from './assets/chess-bg.png';
import { useNavigate } from 'react-router-dom';


function MyTournaments() {
  const navigate = useNavigate();

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
            
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyTournaments;
