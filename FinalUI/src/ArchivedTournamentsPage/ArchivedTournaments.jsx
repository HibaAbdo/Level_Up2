import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/TheHeaders/Header';
import PageContainer from '../Components/ThePageContainers/PageContainer';
import './ArchivedTournaments.css';

function ArchivedTournaments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'المستخدم';
  const [archivedTournaments, setArchivedTournaments] = useState([]);

  useEffect(() => {
    const archived = JSON.parse(localStorage.getItem('archivedTournaments')) || [];
    setArchivedTournaments(archived);
  }, []);

  const splitDateTime = (str) => {
    const parts = str?.split(' ') || [];
    return {
      date: parts[0] || '',
      time: parts.slice(1).join(' ') || '',
    };
  };

  const restoreTournament = (id) => {
    const remaining = archivedTournaments.filter(t => t.id !== id);
    const toRestore = archivedTournaments.find(t => t.id === id);
    const active = JSON.parse(localStorage.getItem('tournaments')) || [];

    if (toRestore) {
      active.push(toRestore);
      localStorage.setItem('tournaments', JSON.stringify(active));
      localStorage.setItem('archivedTournaments', JSON.stringify(remaining));
      setArchivedTournaments(remaining);
    }
  };

  return (
    <>
      <Header username={username} />
      <PageContainer>
        <div className="archived-page">
          <h2 className="form-title">البطولات المؤرشفة</h2>
          <div className="archived-buttons">
            <button className="btn btn-gold" onClick={() => navigate('/create')}>
              إنشاء بطولة جديدة
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/mytournaments')}>
              العودة إلى البطولات
            </button>
          </div>

          {archivedTournaments.length === 0 ? (
            <p className="no-archived">🚧 لا توجد بطولات مؤرشفة بعد</p>
          ) : (
            <div className="my-tournaments-table-wrapper">
              <table className="table-theme">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>آخر تعديل</th>
                    <th>تاريخ الإنشاء</th>
                    <th>استرجاع</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedTournaments.map((t, index) => {
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
                          <button className="non-archive-icon-btn" onClick={() => restoreTournament(t.id)}>
                            ♻️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}

export default ArchivedTournaments;
