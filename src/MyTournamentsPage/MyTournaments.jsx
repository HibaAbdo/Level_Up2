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
      <div className="shared-container">
        <div className="my-tournaments-container">
          <h2 className="form-title">بطولاتي</h2>
          <div className="actions">
            <button className="btn archive">فتح الأرشيف</button>
            <button className="btn create" onClick={() => navigate('/create')}>إنشاء بطولة</button>
          </div>

          <div className="table-scroll">
            <table className="tournaments-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>آخر تعديل</th>
                  <th>تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-tournaments">لا توجد بطولات محفوظة</td>
                  </tr>
                ) : (
                  tournaments.map((t, index) => (
                    <tr key={index}>
                      <td>
                        <span
                          className="tournament-name-link"
                          onClick={() => navigate(`/tournament/${t.id}?tab=rounds`)}                        >
                          {t.name}
                        </span>
                      </td>
                      <td className="date-cell">
                        <span>{t.lastModified}</span>
                      </td>
                      <td className="date-cell">
                        <span>{t.creationDate}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default MyTournaments;
