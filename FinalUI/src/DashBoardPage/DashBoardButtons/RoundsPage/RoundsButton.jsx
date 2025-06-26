// src/DashBoardButtons/RoundsPage/RoundsButton.jsx
import React, { useRef, useState } from "react";
import PageContainer from '../../../Components/ThePageContainers/PageContainer';
import './RoundsButton.css';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ViolationDetailsModal from '../../../Components/Violations/ViolationDetailsModal';

function RoundsButton({ players, formData }) {
  const resultOptions = [
    { value: "", label: "تعيين النتيجة" },
    { value: "1-0", label: "١ - ٠" },
    { value: "0.5-0.5", label: "تعادل ٠.٥ - ٠.٥" },
    { value: "0-1", label: "٠ - ١" },
    { value: "0F-0F", label: "٠F - ٠F" },
    { value: "1F-0", label: "١F - ٠" },
    { value: "0-1F", label: "0-1F" },
    { value: "حذف", label: " حذف النتيجة" },
  ];

  const initialRounds = [
    {
      number: 1,
      matches: [
        { id: 'match-1-1', white: 'player1', black: 'player5', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
        { id: 'match-1-2', white: 'player3', black: 'player2', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
        { id: 'match-1-3', white: 'player6', black: 'player9', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
        { id: 'match-1-4', white: 'player8', black: 'player7', whitePts: 0, blackPts: 0, result: '', whiteViolations: [], blackViolations: [] },
      ]
    }
  ];

  const [rounds, setRounds] = useState(initialRounds);
  const [currentRound, setCurrentRound] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [showAllRoundsModal, setShowAllRoundsModal] = useState(false);
  const scrollRef = useRef(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [currentViolationData, setCurrentViolationData] = useState(null);

  const handleRightArrow = () => {
    if (currentRound < rounds.length) {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleLeftArrow = () => {
    if (currentRound > 1) {
      setCurrentRound(currentRound - 1);
    }
  };

  const allResultsFilled = (round) => {
    return round.matches.every((m) => m.result !== "" || m.black === "Bye");
  };

  const generateMatches = () => {
    const activePlayers = players.filter(player => player && player.name);
    const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
    const matches = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        matches.push({
          id: `match-${rounds.length + 1}-${i / 2 + 1}`,
          white: shuffled[i].name,
          black: shuffled[i + 1].name,
          whitePts: 0,
          blackPts: 0,
          result: "",
          whiteViolations: [],
          blackViolations: []
        });
      } else {
        matches.push({
          id: `match-${rounds.length + 1}-${i / 2 + 1}-bye`,
          white: shuffled[i].name,
          black: "Bye",
          whitePts: 0.5,
          blackPts: "",
          result: "Bye",
          whiteViolations: [],
          blackViolations: []
        });
      }
    }

    return matches;
  };

const handleGenerateRound = async () => {
  if (!allResultsFilled(rounds[rounds.length - 1])) return;

  const payload = {
    tournament: formData,
    players: players
  };

  try {
    const response = await fetch('/api/tournaments/full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('فشل في إرسال إعدادات البطولة واللاعبين');

    alert('✅ تم إرسال إعدادات البطولة واللاعبين بنجاح');

    // الآن: أنشئ الجولة التالية
    const newRound = {
      number: rounds.length + 1,
      matches: generateMatches()
    };

    setRounds([...rounds, newRound]);
    setCurrentRound(rounds.length + 1);
    setTimeout(() => scrollRef.current?.scrollTo({
      left: scrollRef.current.scrollWidth,
      behavior: 'smooth'
    }), 100);

  } catch (error) {
    console.error(error);
    alert('❌ خطأ أثناء إرسال البطولة واللاعبين');
  }
};


  const handleSetResult = (roundIdx, matchId, value) => {
    const updated = [...rounds];
    const match = updated[roundIdx].matches.find(m => m.id === matchId);
    if (!match) return;

    if (value === "" || value === "حذف") {
      match.whitePts = 0;
      match.blackPts = 0;
      match.result = "";
    } else {
      switch (value) {
        case "1-0": match.whitePts = 1; match.blackPts = 0; break;
        case "0.5-0.5": match.whitePts = 0.5; match.blackPts = 0.5; break;
        case "0-1": match.whitePts = 0; match.blackPts = 1; break;
        case "0F-0F": match.whitePts = 0; match.blackPts = 0; break;
        case "1F-0": match.whitePts = 1; match.blackPts = 0; break;
        case "0-1F": match.whitePts = 0; match.blackPts = 1; break;
        default: break;
      }
      match.result = value;
    }

    setRounds(updated);
  };

  const handleOpenViolationModal = (matchId, playerType, index, existing) => {
    if (currentRound !== rounds.length) return;
    setCurrentViolationData({ matchId, playerType, violationIndex: index, ...existing });
    setIsViolationModalOpen(true);
  };

  const handleSaveViolation = (data) => {
    const { matchId, playerType, violationIndex } = currentViolationData;
    const updated = [...rounds];
    const match = updated[currentRound - 1].matches.find(m => m.id === matchId);
    const arr = playerType === 'white' ? match.whiteViolations : match.blackViolations;
    if (violationIndex !== undefined) arr[violationIndex] = data;
    else if (arr.length < 3) arr.push(data);
    setRounds(updated);
    setIsViolationModalOpen(false);
  };

  const handleDeleteViolation = () => {
    const { matchId, playerType, violationIndex } = currentViolationData;
    const updated = [...rounds];
    const match = updated[currentRound - 1].matches.find(m => m.id === matchId);
    const arr = playerType === 'white' ? match.whiteViolations : match.blackViolations;
    if (violationIndex !== undefined) arr.splice(violationIndex, 1);
    setRounds(updated);
    setIsViolationModalOpen(false);
  };

  const handleDownloadCSV = () => {
    const rows = [["Round", "#", "White", "WhitePts", "Result", "BlackPts", "Black"]];
    rounds.forEach((r) => {
      r.matches.forEach((m, i) => {
        rows.push([
          r.number, i + 1, m.white, m.whitePts, m.result, m.blackPts, m.black
        ]);
      });
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "tournament_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteLastRound = () => {
    if (rounds.length > 1) {
      const updated = [...rounds];
      updated.pop();
      setRounds(updated);
      setCurrentRound(updated.length);
    }
  };

  const RoundTable = ({ round, roundIdx }) => (
    <table className="round-table">
      <thead>
        <tr>
          <th>#</th>
          <th>الأبيض</th>
          <th>نقاط</th>
          <th colSpan="3">مخالفات الأبيض</th>
          <th>النتيجة</th>
          <th colSpan="3">مخالفات الأسود</th>
          <th>نقاط</th>
          <th>الأسود</th>
        </tr>
      </thead>
      <tbody>
        {round.matches.map((m, i) => (
          <tr key={m.id}>
            <td>{i + 1}</td>
            <td>{m.white}</td>
            <td>{m.whitePts}</td>
            <td colSpan="3">
              <div className="violation-squares-container">
                {[0, 1, 2].map(idx => (
                  <button
                    key={idx}
                    className={`violation-square ${m.whiteViolations[idx] ? 'filled' : ''}`}
                    onClick={() => handleOpenViolationModal(m.id, 'white', idx, m.whiteViolations[idx])}
                    disabled={roundIdx !== rounds.length - 1}
                  >
                    {m.whiteViolations[idx] ? `V${idx + 1}` : `+${idx + 1}`}
                  </button>
                ))}
              </div>
            </td>
            <td>
              {m.black !== "Bye" ? (
                <select
                  value={m.result}
                  onChange={(e) => handleSetResult(roundIdx, m.id, e.target.value)}
                  disabled={roundIdx !== rounds.length - 1}
                >
                  {resultOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <span>{m.result}</span>
              )}
            </td>
            <td colSpan="3">
              <div className="violation-squares-container">
                {[0, 1, 2].map(idx => (
                  <button
                    key={idx}
                    className={`violation-square ${m.blackViolations[idx] ? 'filled' : ''}`}
                    onClick={() => handleOpenViolationModal(m.id, 'black', idx, m.blackViolations[idx])}
                    disabled={roundIdx !== rounds.length - 1 || m.black === "Bye"}
                  >
                    {m.blackViolations[idx] ? `V${idx + 1}` : `+${idx + 1}`}
                  </button>
                ))}
              </div>
            </td>
            <td>{m.blackPts}</td>
            <td>{m.black}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <PageContainer>
      <div className="rounds-page">
        <h1 className="round-title">الجولات</h1>

        <button
          className="generate-btn"
          onClick={handleGenerateRound}
          disabled={!allResultsFilled(rounds[rounds.length - 1])}
          title={!allResultsFilled(rounds[rounds.length - 1]) ? "يجب تعبئة نتائج جميع المباريات أولاً" : ""}
        >
          الجولة التالية
        </button>

        <div className="round-buttons-wrapper">
          <button className="scroll-arrow" onClick={handleRightArrow}>
            <LuChevronRight size={32} color="#663d99" />
          </button>

          <div className="round-buttons-scroll" ref={scrollRef}>
            {rounds.map((r) => (
              <button
                key={r.number}
                className={r.number === currentRound ? "round-btn active" : "round-btn"}
                onClick={() => setCurrentRound(r.number)}
              >
                {r.number}
              </button>
            ))}
          </div>

          <button className="scroll-arrow" onClick={handleLeftArrow}>
            <LuChevronLeft size={32} color="#663d99" />
          </button>
        </div>

        <div className="rounds-table-wrapper">
          <RoundTable round={rounds[currentRound - 1]} roundIdx={currentRound - 1} />
        </div>

        <div className="action-bar">
          {currentRound && rounds.length > 0 && (
            <button className="fullscreen-btn" onClick={() => setShowZoom(true)}>
              🔍
            </button>
          )}
          {rounds.length > 0 && (
            <button className="all-rounds-btn" onClick={() => setShowAllRoundsModal(true)}>
              كل الجولات
            </button>
          )}
          {currentRound && rounds.length > 0 && (
            <button className="csv-btn" onClick={handleDownloadCSV}>
              💾 حفظ كـ CSV
            </button>
          )}
          {rounds.length > 0 && (
            <button className="delete-btn" onClick={handleDeleteLastRound}>
              حذف الجولة الأخيرة
            </button>
          )}
        </div>

        <ViolationDetailsModal
          isOpen={isViolationModalOpen}
          onClose={() => setIsViolationModalOpen(false)}
          violationData={currentViolationData}
          onSave={handleSaveViolation}
          onDelete={handleDeleteViolation}
        />
      </div>
    </PageContainer>
  );
}

export default RoundsButton;
