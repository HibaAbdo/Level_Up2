import React, { useEffect, useState } from "react";
import "../../TournamentDashboard.css";
import "./StandingsButton.css";
import { FaSearch } from "react-icons/fa";
import ModalWrapper from "../../../Components/TheModals/ModalWrapper";

function StandingsButton({ players, rounds }) {
  const [rankingData, setRankingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    const playerScores = {};
    players.forEach((p) => {
      playerScores[p.name] = {
        name: p.name,
        points: 0,
        rating: p.rating,
        newRating: p.rating,
        pos: 0,
        de: "",
        buc1: "",
        bucT: ""
      };
    });

    rounds.forEach((round) => {
      round.matches.forEach((match) => {
        if (match.result === "Bye") {
          playerScores[match.white].points += 0.5;
        } else {
          playerScores[match.white].points += match.whitePts;
          playerScores[match.black].points += match.blackPts;
        }
      });
    });

    const sorted = Object.values(playerScores).sort((a, b) => b.points - a.points);
    sorted.forEach((p, index) => (p.pos = index + 1));
    setRankingData(sorted);
  }, [players, rounds]);

  const filteredData = rankingData.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    if (rankingData.length === 0) return;
    let csv = "الترتيب,الاسم,النقاط,التصنيف,التصنيف الجديد,DE,Buc1,BucT\n";
    rankingData.forEach((row) => {
      csv += `${row.pos},${row.name},${row.points.toFixed(1)},${row.rating},${row.newRating},${row.de},${row.buc1},${row.bucT}\n`;
    });
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = "standings.csv";
    link.click();
  };

  return (
    <div className="standings-page">
      <h1 className="form-title">التّرتيب</h1>

      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="ابحث عن لاعب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="table-wrapper">
        <table className="table-theme">
          <thead>
            <tr>
              <th>الترتيب</th>
              <th>الاسم</th>
              <th>النقاط</th>
              <th>التصنيف</th>
              <th>التصنيف الجديد</th>
              <th>DE</th>
              <th>Buc1</th>
              <th>BucT</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results-message">
                  لا توجد نتائج مطابقة
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.pos}</td>
                  <td>{row.name}</td>
                  <td>{row.points.toFixed(1)}</td>
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

      <div className="rounds-actions">
        <button className="btn btn-outline" onClick={() => setShowZoom(true)}>
          🔍
        </button>
        <button className="btn btn-gold" onClick={handleDownloadCSV}>
          تحميل CSV
        </button>
      </div>

      <ModalWrapper
        isOpen={showZoom}
        onClose={() => setShowZoom(false)}
        title="الترتيب الكامل"
      >
        <div className="zoom-standings">
          <table className="table-theme">
            <thead>
              <tr>
                <th>الترتيب</th>
                <th>الاسم</th>
                <th>النقاط</th>
                <th>التصنيف</th>
                <th>التصنيف الجديد</th>
                <th>DE</th>
                <th>Buc1</th>
                <th>BucT</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.pos}</td>
                  <td>{row.name}</td>
                  <td>{row.points.toFixed(1)}</td>
                  <td>{row.rating}</td>
                  <td>{row.newRating}</td>
                  <td>{row.de}</td>
                  <td>{row.buc1}</td>
                  <td>{row.bucT}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setShowZoom(false)}>
              ✖ إغلاق
            </button>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}

export default StandingsButton;
