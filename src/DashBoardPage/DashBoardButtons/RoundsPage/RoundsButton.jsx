// src/DashBoardPage/DashBoardButtons/RoundsButton/RoundsButton.jsx
import React, { useRef, useState } from "react";
import "../../TournamentDashboard.css";
import logo from "../../../assets/logoshah.png";
import './RoundsButton.css';

function RoundsButton() {
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [showZoom, setShowZoom] = useState(false);
  const [showAllRoundsModal, setShowAllRoundsModal] = useState(false);
  const scrollRef = useRef(null);

  const handleGenerateRound = () => {
    const nextRoundNum = rounds.length + 1;
    const newRound = {
      number: nextRoundNum,
      matches: [
        { white: "اللاعب 1", black: "اللاعب 3", whitePts: 0, blackPts: 0, result: "" },
        { white: "اللاعب 4", black: "اللاعب 2", whitePts: 0, blackPts: 0, result: "" },
        { white: "اللاعب 5", black: "Bye", whitePts: 0.5, blackPts: "", result: "Bye" }
      ]
    };
    setRounds([...rounds, newRound]);
    setCurrentRound(nextRoundNum);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    }, 100);
  };

  const allResultsFilled = (round) => round.matches.every((m) => m.result !== "");

  const handleSetResult = (roundIdx, matchIdx, value) => {
    if (roundIdx !== rounds.length - 1) return;
    const updatedRounds = [...rounds];
    const match = updatedRounds[roundIdx].matches[matchIdx];
    switch (value) {
      case "1-0": match.whitePts = 0; match.blackPts = 1; break;
      case "0.5-0.5": match.whitePts = 0.5; match.blackPts = 0.5; break;
      case "0-1": match.whitePts = 1; match.blackPts = 0; break;
      case "0F-0F": match.whitePts = 0; match.blackPts = 0; break;
      case "1F-0": match.whitePts = 0; match.blackPts = 1; break;
      case "0-1F": match.whitePts = 1; match.blackPts = 0; break;
      case "": match.whitePts = 0; match.blackPts = 0; match.result = ""; setRounds(updatedRounds); return;
      default: return;
    }
    match.result = value;
    setRounds(updatedRounds);
  };

  const handleDeleteLastRound = () => {
    const updated = [...rounds];
    updated.pop();
    setRounds(updated);
    setCurrentRound(updated.length || null);
  };

  const handleDownloadCSV = () => {
    if (!currentRound) return;
    const round = rounds[currentRound - 1];
    let csv = "data:text/csv;charset=utf-8,#,اللاعب الأبيض,نقاط,النتيجة,نقاط,اللاعب الأسود\n";
    round.matches.forEach((m, i) => {
      csv += `${i + 1},${m.white},${m.whitePts},${m.result},${m.blackPts},${m.black}\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `round_${currentRound}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLeftArrow = () => {
    if (currentRound < rounds.length) setCurrentRound(currentRound + 1);
    else if (rounds.length) setCurrentRound(1);
  };

  const handleRightArrow = () => {
    if (currentRound > 1) setCurrentRound(currentRound - 1);
  };

  const RoundTable = ({ round, roundIdx }) => (
    <table className="round-table">
      <thead>
        <tr>
          <th>الأزواج</th>
          <th>اللاعب الأبيض</th>
          <th>النقاط</th>
          <th>النتيجة</th>
          <th>النقاط</th>
          <th>اللاعب الأسود</th>
        </tr>
      </thead>
      <tbody>
        {round.matches.length ? round.matches.map((m, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{m.white}</td>
            <td>{m.whitePts}</td>
            <td>
              {roundIdx === rounds.length - 1 && m.result !== "Bye" ? (
                <select value={m.result} onChange={(e) => handleSetResult(roundIdx, i, e.target.value)}>
                  <option value="">تعيين النتيجة</option>
                  <option value="1-0">1-0</option>
                  <option value="0.5-0.5">0.5-0.5</option>
                  <option value="0-1">0-1</option>
                  <option value="0F-0F">0F-0F</option>
                  <option value="1F-0">1F-0</option>
                  <option value="0-1F">0-1F</option>
                  <option value="">حذف</option>
                </select>
              ) : <span>{m.result || "-"}</span>}
            </td>
            <td>{m.blackPts}</td>
            <td>{m.black}</td>
          </tr>
        )) : (
          <tr className="no-data-row"><td colSpan="6">لا توجد بيانات</td></tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="rounds-page">
      <div className="header">
        <img src={logo} alt="شطرنج القدس" className="form-logo" />
        <h1 className="round-title">الجولات</h1>
        <div />
      </div>

      <div className="top-controls">
        <button className="generate-btn" onClick={handleGenerateRound}
          disabled={rounds.length > 0 && !allResultsFilled(rounds[rounds.length - 1])}>
          الجولة التالية
        </button>
        {rounds.length > 0 && (
          <div className="round-buttons-wrapper">
            <button className="scroll-arrow" onClick={handleRightArrow}>➡</button>
            <div className="round-buttons-scroll" ref={scrollRef}>
              {rounds.map((r) => (
                <button key={r.number} className={r.number === currentRound ? "round-btn active" : "round-btn"} onClick={() => setCurrentRound(r.number)}>
                  {r.number}
                </button>
              ))}
            </div>
            <button className="scroll-arrow" onClick={handleLeftArrow}>⬅</button>
          </div>
        )}
      </div>

      <div className="rounds-table-wrapper">
        {rounds.length === 0
          ? <RoundTable round={{ matches: [] }} roundIdx={-1} />
          : <RoundTable round={rounds[currentRound - 1]} roundIdx={currentRound - 1} />}
      </div>

      <div className="action-bar">
        {currentRound && <button className="fullscreen-btn" onClick={() => setShowZoom(true)}>🔍</button>}
        {rounds.length > 0 && (
          <button className="all-rounds-btn" onClick={() => setShowAllRoundsModal(true)}>كل الجولات</button>
        )}
        <button className="csv-btn" onClick={handleDownloadCSV}>💾 حفظ كـ CSV</button>
        <button className="delete-btn" onClick={handleDeleteLastRound}>حذف الجولة الأخيرة</button>
      </div>

      {showZoom && (
        <div className="modal-overlay" onClick={() => setShowZoom(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>الجولة {currentRound}</h2>
            <RoundTable round={rounds[currentRound - 1]} roundIdx={currentRound - 1} />
            <button className="close-btn round-btn" onClick={() => setShowZoom(false)}>✖ إغلاق</button>
          </div>
        </div>
      )}

      {showAllRoundsModal && (
        <div className="modal-overlay" onClick={() => setShowAllRoundsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ textAlign: "right", color: "#facc15" }}>كل الجولات</h2>
            {rounds.map((r, i) => (
              <div key={r.number}>
                <h3 style={{ textAlign: "center", color: "white" }}>الجولة {r.number}</h3>
                <RoundTable round={r} roundIdx={i} />
              </div>
            ))}
            <button className="close-btn round-btn" onClick={() => setShowAllRoundsModal(false)}>✖ إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoundsButton;
