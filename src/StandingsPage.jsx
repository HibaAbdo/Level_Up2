import React, { useState } from "react";
import "./StandingsPage.css";
import logo from "./assets/logoshah.png";

function StandingsPage() {
  const [rankingData, setRankingData] = useState([]);
  const [showZoom, setShowZoom] = useState(false);

  const handleDownloadCSV = () => {
    if (rankingData.length === 0) return;
    let csv = "الترتيب,الاسم,النقاط,التصنيف,التصنيف الجديد,DE,Buc1,BucT\n";
    rankingData.forEach((row) => {
      csv += `${row.pos},${row.name},${row.points},${row.rating},${row.newRating},${row.de},${row.buc1},${row.bucT}\n`;
    });
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = "standings.csv";
    link.click();
  };

  return (
    <div className="ranking-page">
      <div className="header">
        <img src={logo} alt="شطرنج القدس" className="form-logo" />
        <h1 className="ranking-title">الترتيب</h1>
        <div />
      </div>

      <div className="ranking-table-wrapper">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>الترتيب</th>
              <th>الاسم</th>
              <th>النقاط</th>
              <th>التصنيف</th>
              <th>التصنيف الجديد</th>
              <th>DE</th>
              <th>Buc1</th>
              <th>المجموع BucT</th>
            </tr>
          </thead>
          <tbody>
            {rankingData.length === 0 ? (
              <tr className="no-data-row">
                <td colSpan="8">لا توجد بيانات</td>
              </tr>
            ) : (
              rankingData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.pos}</td>
                  <td>{row.name}</td>
                  <td>{row.points}</td>
                  <td>{row.rating}</td>
                  <td>{row.newRating}</td>
                  <td>{row.de}</td>
                  <td>{row.buc1}</td>
                  <td>{row.bucT}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ranking-actions">
        <button className="csv-btn" onClick={handleDownloadCSV}>💾 حفظ كـ CSV</button>
        <button className="fullscreen-btn" onClick={() => setShowZoom(true)}>🔍</button>
      </div>

      {showZoom && (
        <div className="modal-overlay" onClick={() => setShowZoom(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="zoom-title">الترتيب الكامل</h2>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>الترتيب</th>
                  <th>الاسم</th>
                  <th>النقاط</th>
                  <th>التصنيف</th>
                  <th>التصنيف الجديد</th>
                  <th>DE</th>
                  <th>Buc1</th>
                  <th>المجموع BucT</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.pos}</td>
                    <td>{row.name}</td>
                    <td>{row.points}</td>
                    <td>{row.rating}</td>
                    <td>{row.newRating}</td>
                    <td>{row.de}</td>
                    <td>{row.buc1}</td>
                    <td>{row.bucT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="close-btn round-btn" onClick={() => setShowZoom(false)}>✖ إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StandingsPage;
