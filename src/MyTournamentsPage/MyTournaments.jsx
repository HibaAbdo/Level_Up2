import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../Components/PageLayout';
import './MyTournaments.css';

function MyTournaments() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(storedTournaments);
  }, []);

  return (
    <PageLayout>
      <div className="my-tournaments-container">
        {/* ✅ Header Group: Title + Buttons aligned together */}
        <div className="header-group">
          <h2 className="form-title">بطولاتي</h2>
          <div className="actions">
            <button className="btn archive">فتح الأرشيف</button>
            <button className="btn create" onClick={() => navigate('/create')}>
              إنشاء بطولة
            </button>
          </div>
        </div>

        {/* ✅ Tournament Table */}
        <div className="table-scroll">
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
    </PageLayout>
  );
}

export default MyTournaments;
