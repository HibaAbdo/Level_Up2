import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../Components/ThePageContainers/PageContainer';
import Header from 'src/components/Headers/Header.jsx';
import './MyTournaments.css';

function MyTournaments() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);

  const username = localStorage.getItem('username') || 'المستخدم';

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/tournaments/my');
        if (!response.ok) throw new Error('فشل في تحميل البطولات');
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error(error);
        alert('❌ خطأ أثناء تحميل البطولات من السيرفر');
      }
    };

    fetchTournaments();
  }, []);

  const splitDateTime = (str) => {
    const parts = str?.split(' ') || [];
    return {
      date: parts[0] || '',
      time: parts.slice(1).join(' ') || '',
    };
  };

  const archiveTournament = (id) => {
    // لو عندك أرشفة في الباكند ممكن تعمل طلب DELETE أو PUT هنا
    alert(`📦 تم أرشفة البطولة ذات المعرف ${id} (تعديل حسب منطق الباكند)`);
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
              <button className="btn btn-outline" onClick={() => navigate('/archive')}>
                فتح الأرشيف
              </button>
            </div>
          </div>

          <div className="my-tournaments-table-wrapper">
            <table className="table-theme">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>آخر تعديل</th>
                  <th>تاريخ الإنشاء</th>
                  <th>أرشفة</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-results-message">لا توجد بطولات محفوظة</td>
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
                        <td>
                          <button
                            className="archive-icon-btn"
                            onClick={() => archiveTournament(t.id)}
                            title="أرشفة"
                          >
                            📦
                          </button>
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
