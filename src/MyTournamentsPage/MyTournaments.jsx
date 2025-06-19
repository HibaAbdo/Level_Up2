import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainers/PageContainer';
import Header from '../components/Headers/Header';
import './MyTournaments.css';

function MyTournaments() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);

  // ✅ جلب اسم المستخدم من localStorage
  const username = localStorage.getItem('username') || 'المستخدم';

  useEffect(() => {
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(storedTournaments);
  }, []);

  const splitDateTime = (str) => {
    const parts = str?.split(' ') || [];
    return {
      date: parts[0] || '',
      time: parts.slice(1).join(' ') || '',
    };
  };

  return (
    <>
      <Header username={username} />
      <PageContainer>
        <div className="my-tournaments-content">
          <h2 className="form-title">بطولاتي</h2>

          <div className="header-actions-wrapper">
            <div className="actions">
              <button className="btn btn-gold" onClick={() => navigate('/create')}>
                إنشاء بطولة
              </button>
              <button className="btn btn-outline">فتح الأرشيف</button>
            </div>
          </div>

          <div className="my-tournaments-table-wrapper">
            <table className="table-theme">
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
                    <td colSpan="3" className="no-results-message">لا توجد بطولات محفوظة</td>
                  </tr>
                ) : (
                  tournaments.map((t, index) => {
                    const modified = splitDateTime(t.lastModified);
                    const created = splitDateTime(t.creationDate);

                    return (
                      <tr key={index}>
                        <td>
                          <span
                            className="tournament-name-link"
                            onClick={() => navigate(`/tournament/${t.id}?tab=rounds`)}
                          >
                            {t.name}
                          </span>
                        </td>
                        <td>
                          <div className="table-date">
                            <div className="date">{modified.date}</div>
                            <div className="time">{modified.time}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-date">
                            <div className="date">{created.date}</div>
                            <div className="time">{created.time}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export default MyTournaments;
