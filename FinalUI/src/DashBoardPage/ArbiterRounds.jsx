import React, { useRef, useState, useEffect } from "react";
import PageContainer from "../Components/ThePageContainers/PageContainer";
import "./ArbiterRounds.css";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ViolationDetailsModal from "../Components/Violations/ViolationDetailsModal";
import ZoomModal from "../Components/RoundsModals/ZoomModal";
import AllRoundsModal from "../Components/RoundsModals/AllRoundsModal";
import Header from "../Components/TheHeaders/Header";

function ArbiterRounds() {
  const storedPlayers = JSON.parse(localStorage.getItem("tournamentPlayers")) || [];
  const [players, setPlayers] = useState(storedPlayers);
  const storedRounds = JSON.parse(localStorage.getItem("submittedRounds")) || [];
  const [rounds, setRounds] = useState(storedRounds);
  const [currentRound, setCurrentRound] = useState(1);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [currentViolationData, setCurrentViolationData] = useState(null);
  const [resultsSubmitted, setResultsSubmitted] = useState(false);
  const [playerStandings, setPlayerStandings] = useState([]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isAllRoundsModalOpen, setIsAllRoundsModalOpen] = useState(false);
  const scrollRef = useRef(null);
  const maxRounds = parseInt(localStorage.getItem("currentTotalRounds"), 10) || 0;

  const resultOptions = [
    { value: "", label: "تعيين النتيجة" },
    { value: "1-0", label: "1-0" },
    { value: "0.5-0.5", label: "0.5-0.5" },
    { value: "0-1", label: "0-1" },
    { value: "0F-0F", label: "0F-0F" },
    { value: "1F-0", label: "1F-0" },
    { value: "0-1F", label: "0-1F" },
    { value: "حذف", label: "حذف النتيجة" },
  ];

  useEffect(() => {
    if (players && players.length > 1 && rounds.length === 0) {
      const newRound = {
        number: 1,
        matches: generateMatches()
      };
      setRounds([newRound]);
      setCurrentRound(1);
    }
  }, [players]);

  const allResultsFilled = (round) => {
    return round?.matches?.every((m) => m.result !== "" || m.black === "Bye");
  };

  const generateMatches = () => {
    const activePlayers = players.filter(player => player && player.name);
    const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
    const matches = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        matches.push({
          id: `match-${rounds.length + 1}-${Math.floor(i / 2 + 1)}`,
          white: shuffled[i].name,
          black: shuffled[i + 1].name,
          result: "",
          whiteViolations: [],
          blackViolations: []
        });
      } else {
        matches.push({
          id: `match-${rounds.length + 1}-${Math.floor(i / 2 + 1)}-bye`,
          white: shuffled[i].name,
          black: "Bye",
          result: "Bye",
          whiteViolations: [],
          blackViolations: []
        });
      }
    }

    return matches;
  };

  const calculateStandings = () => {
    const pointsMap = {};
    players.forEach(p => {
      if (p.name) pointsMap[p.name] = 0;
    });

    rounds.forEach(round => {
      round.matches.forEach(match => {
        if (match.black === "Bye") {
          pointsMap[match.white] += 0.5;
        } else {
          const [w, b] = match.result.split('-');
          const whiteScore = w.includes('F') ? 0 : parseFloat(w);
          const blackScore = b.includes('F') ? 0 : parseFloat(b);
          if (!isNaN(whiteScore)) pointsMap[match.white] += whiteScore;
          if (!isNaN(blackScore)) pointsMap[match.black] += blackScore;
        }
      });
    });

    const standings = Object.entries(pointsMap).map(([name, score]) => ({ name, score }));
    standings.sort((a, b) => b.score - a.score);
    setPlayerStandings(standings);
  };

  const submitResultsToBackend = async () => {
    const tournamentId = localStorage.getItem('tournamentId');
    if (!tournamentId) return alert("معرف البطولة غير موجود");

    const lastRound = rounds[rounds.length - 1];

    const matchesPayload = lastRound.matches
      .filter(match => match.black !== "Bye")
      .map(match => {
        const [whiteScoreStr, blackScoreStr] = match.result.split("-");
        return {
          white: match.white,
          black: match.black,
          result: whiteScoreStr === "0.5" ? "=" : whiteScoreStr
        };
      });

    try {
      const response = await fetch(`http://localhost:8080/api/results/record?tournamentId=${tournamentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchesPayload)
      });

      if (!response.ok) throw new Error('فشل إرسال النتائج إلى الخادم');
      const resultText = await response.text();
      alert('✅ تم إرسال النتائج: ' + resultText);
    } catch (error) {
      alert('حدث خطأ أثناء إرسال النتائج: ' + error.message);
    }
  };

  const handleSubmitResults = () => {
    if (!allResultsFilled(rounds[rounds.length - 1])) return;
    calculateStandings();
    setResultsSubmitted(true);
    submitResultsToBackend();
  };

  const handleGenerateRound = () => {
    if (!allResultsFilled(rounds[rounds.length - 1])) return;
    const newRound = {
      number: rounds.length + 1,
      matches: generateMatches()
    };
    setRounds([...rounds, newRound]);
    setCurrentRound(rounds.length + 1);
    setResultsSubmitted(false);
  };

  const RoundTable = ({ round, roundIdx }) => {
    const calculatePastPoints = () => {
      const totals = {};
      players.forEach(p => {
        if (p.name) totals[p.name] = 0;
      });

      for (let i = 0; i < roundIdx; i++) {
        rounds[i].matches.forEach(m => {
          if (m.black === "Bye") {
            totals[m.white] += 0.5;
          } else {
            const [w, b] = m.result.split('-');
            const wp = w.includes('F') ? 0 : parseFloat(w);
            const bp = b.includes('F') ? 0 : parseFloat(b);
            if (!isNaN(wp)) totals[m.white] += wp;
            if (!isNaN(bp)) totals[m.black] += bp;
          }
        });
      }

      return totals;
    };

    const totals = calculatePastPoints();

    if (!round || !round.matches || round.matches.length === 0) {
      return <p>لا توجد مباريات</p>;
    }

    return (
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
              <td>{totals[m.white]?.toFixed(1) || 0}</td>
              <td colSpan="3">
                <div className="violation-squares-container">
                  {[0, 1, 2].map(idx => (
                    <button
                      key={idx}
                      className={`violation-square ${m.whiteViolations[idx] ? 'filled' : ''}`}
                      onClick={() => handleOpenViolationModal(m.id, 'white', idx, m.whiteViolations[idx])}
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
                      disabled={m.black === "Bye"}
                    >
                      {m.blackViolations[idx] ? `V${idx + 1}` : `+${idx + 1}`}
                    </button>
                  ))}
                </div>
              </td>
              <td>{totals[m.black]?.toFixed(1) || 0}</td>
              <td>{m.black}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleOpenViolationModal = (matchId, playerType, index, existing) => {
    setCurrentViolationData({ matchId, playerType, violationIndex: index, ...existing });
    setIsViolationModalOpen(true);
  };

  const handleSetResult = (roundIdx, matchId, value) => {
    if (resultsSubmitted) return;
    const updated = [...rounds];
    const match = updated[roundIdx].matches.find(m => m.id === matchId);
    if (!match) return;

    if (value === "" || value === "حذف") {
      match.result = "";
      match.whiteScore = 0;
      match.blackScore = 0;
    } else {
      match.result = value;
      const [whiteStr, blackStr] = value.split("-");
      const white = whiteStr.includes('F') ? 0 : parseFloat(whiteStr);
      const black = blackStr.includes('F') ? 0 : parseFloat(blackStr);
      match.whiteScore = isNaN(white) ? 0 : white;
      match.blackScore = isNaN(black) ? 0 : black;
    }

    setRounds(updated);
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

  useEffect(() => {
    localStorage.setItem('submittedRounds', JSON.stringify(rounds));
  }, [rounds]);

  return (
    <>
      <Header showHomeButton={true} />
      <PageContainer>
        <div className="rounds-page">
          <button
            className={`generate-btn ${rounds.length === maxRounds ? 'final-button' : ''}`}
            onClick={() => {
              if (rounds.length === maxRounds) {
                handleSubmitResults();
              } else {
                handleGenerateRound();
              }
            }}
            disabled={
              (rounds.length < maxRounds && !allResultsFilled(rounds[rounds.length - 1])) ||
              (rounds.length === maxRounds && (!allResultsFilled(rounds[rounds.length - 1]) || resultsSubmitted))
            }
          >
            {rounds.length === maxRounds ? "إنهاء" : "إرسال النتائج"}
          </button>

          <div className="round-buttons-wrapper">
            <button className="scroll-arrow" onClick={() => setCurrentRound(Math.max(1, currentRound - 1))}>
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

            <button className="scroll-arrow" onClick={() => setCurrentRound(Math.min(rounds.length, currentRound + 1))}>
              <LuChevronLeft size={32} color="#663d99" />
            </button>
          </div>

          <div className="rounds-table-wrapper">
            <RoundTable round={rounds[currentRound - 1]} roundIdx={currentRound - 1} />
          </div>

          <ViolationDetailsModal
            isOpen={isViolationModalOpen}
            onClose={() => setIsViolationModalOpen(false)}
            violationData={currentViolationData}
            onSave={handleSaveViolation}
            onDelete={handleDeleteViolation}
          />

          <ZoomModal
            isOpen={isZoomModalOpen}
            onClose={() => setIsZoomModalOpen(false)}
            round={rounds[currentRound - 1]}
          />

          <AllRoundsModal
            isOpen={isAllRoundsModalOpen}
            onClose={() => setIsAllRoundsModalOpen(false)}
            rounds={rounds}
          />

          <div className="rounds-actions">
            <button className="rounds-action-btn" onClick={() => setIsZoomModalOpen(true)}>🔍</button>
            <button className="rounds-action-btn" onClick={() => setIsAllRoundsModalOpen(true)}>كل الجولات</button>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export default ArbiterRounds;
