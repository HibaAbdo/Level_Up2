// src/DashBoardButtons/RoundsPage/RoundsButton.jsx
import React, { useRef, useState, useEffect } from "react";
import PageContainer from '../../../Components/PageContainers/PageContainer';
import './RoundsButton.css';

function RoundsButton({ players }) {
    // === التعديل هنا: إضافة محتوى مبدئي للـ rounds ===
    const initialRounds = [
        {
            number: 1,
            matches: [
                { id: 'match-1-1', white: 'لينا', black: 'شهد', whitePts: 0, blackPts: 0, result: '' },
                { id: 'match-1-2', white: 'ديما', black: 'غادة', whitePts: 0, blackPts: 0, result: '' },
                { id: 'match-1-3', white: 'جنان', black: 'بتول', whitePts: 0, blackPts: 0, result: '' },
                { id: 'match-1-4', white: 'هبه', black: 'براءة', whitePts: 0, blackPts: 0, result: '' },
                { id: 'match-1-5-bye', white: 'ايمان', black: 'Bye', whitePts: 0.5, blackPts: '', result: 'Bye' },
            ]
        },
        // يمكنك إضافة جولات أخرى هنا إذا أردت
        // {
        //     number: 2,
        //     matches: [
        //         { id: 'match-2-1', white: 'شهد', black: 'ديما', whitePts: 0, blackPts: 0, result: '' },
        //         // ... المزيد من المباريات للجولة 2
        //     ]
        // }
    ];

    const [rounds, setRounds] = useState(initialRounds);
    // === انتهاء التعديل ===

    const [currentRound, setCurrentRound] = useState(initialRounds.length > 0 ? 1 : null); // تعيين الجولة الأولى إذا كانت موجودة
    const [showZoom, setShowZoom] = useState(false);
    const [showAllRoundsModal, setShowAllRoundsModal] = useState(false);
    const scrollRef = useRef(null);

    // تحديث الجولة الحالية عند إضافة أو حذف جولات
    useEffect(() => {
        if (rounds.length > 0 && currentRound === null) {
            setCurrentRound(1); // تعيين الجولة الأولى إذا لم يتم تحديد أي جولة
        } else if (rounds.length === 0) {
            setCurrentRound(null); // لا توجد جولات
        } else if (currentRound > rounds.length) {
            setCurrentRound(rounds.length); // ضبط إذا كانت الجولة الحالية تتجاوز العدد الكلي
        }
    }, [rounds.length, currentRound]);

    // ✅ إنشاء مباريات الجولة
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
                    result: ""
                });
            } else {
                matches.push({
                    id: `match-${rounds.length + 1}-${i / 2 + 1}-bye`,
                    white: shuffled[i].name,
                    black: "Bye",
                    whitePts: 0.5,
                    blackPts: "",
                    result: "Bye"
                });
            }
        }
        return matches;
    };

    const handleGenerateRound = () => {
        const nextRoundNum = rounds.length + 1;
        const newRound = {
            number: nextRoundNum,
            matches: generateMatches()
        };
        setRounds([...rounds, newRound]);
        setCurrentRound(nextRoundNum);
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
            }
        }, 100);
    };

    const allResultsFilled = (round) => {
        if (!round || !round.matches) return true;
        return round.matches.every((m) => m.result !== "" || m.black === "Bye");
    };

    const handleSetResult = (roundIdx, matchId, value) => {
        // تأكد أن التعديل يتم فقط على الجولة الأخيرة المتاحة
        if (roundIdx !== rounds.length - 1) return;

        const updatedRounds = [...rounds];
        const matchIndex = updatedRounds[roundIdx].matches.findIndex(m => m.id === matchId);

        if (matchIndex === -1) return;

        const match = updatedRounds[roundIdx].matches[matchIndex];

        if (value === "" || value === "حذف") { // "حذف" لإزالة النتيجة
            match.whitePts = 0;
            match.blackPts = 0;
            match.result = "";
        } else {
            switch (value) {
                case "1-0": match.whitePts = 1; match.blackPts = 0; break;
                case "0.5-0.5": match.whitePts = 0.5; match.blackPts = 0.5; break;
                case "0-1": match.whitePts = 0; match.blackPts = 1; break;
                case "0F-0F": match.whitePts = 0; match.blackPts = 0; break; // forfeit
                case "1F-0": match.whitePts = 1; match.blackPts = 0; break; // forfeit
                case "0-1F": match.whitePts = 0; match.blackPts = 1; break; // forfeit
                default: return;
            }
            match.result = value;
        }
        setRounds(updatedRounds);
    };

    const handleDeleteLastRound = () => {
        const updated = [...rounds];
        updated.pop();
        setRounds(updated);
        setCurrentRound(updated.length > 0 ? updated.length : null);
    };

    const handleDownloadCSV = () => {
        if (!currentRound || rounds.length === 0) return;
        const round = rounds[currentRound - 1];
        if (!round) return;

        let csv = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Arabic characters
        csv += "#,اللاعب الأبيض,نقاط,النتيجة,نقاط,اللاعب الأسود\n";

        round.matches.forEach((m, i) => {
            csv += `${i + 1},"${m.white}",${m.whitePts},"${m.result}",${m.blackPts === "" ? "" : m.blackPts},"${m.black}"\n`;
        });
        const link = document.createElement("a");
        link.href = encodeURI(csv);
        link.download = `round_${currentRound}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLeftArrow = () => {
        if (currentRound !== null && currentRound > 1) {
            setCurrentRound(currentRound - 1);
        } else if (rounds.length > 0) {
            setCurrentRound(rounds.length); // Loop to last round
        }
    };

    const handleRightArrow = () => {
        if (currentRound !== null && currentRound < rounds.length) {
            setCurrentRound(currentRound + 1);
        } else if (rounds.length > 0) {
            setCurrentRound(1); // Loop to first round
        }
    };

    const RoundTable = ({ round, roundIdx }) => (
        <table className="round-table">
            <thead>
                <tr>
                    <th>الأزواج</th>
                    <th> الأبيض</th>
                    <th>النقاط</th>
                    <th>النتيجة</th>
                    <th>النقاط</th>
                    <th>الأسود</th>
                </tr>
            </thead>
            <tbody>
                {round && round.matches && round.matches.length > 0 ? round.matches.map((m, i) => (
                    <tr key={m.id || i}>
                        <td>{i + 1}</td>
                        <td>{m.white}</td>
                        <td>{m.whitePts}</td>
                        <td>
                             {m.black !== "Bye" ? ( // السماح بالتعديل لجميع الجولات باستثناء مباريات الـ Bye
                                <select value={m.result} onChange={(e) => handleSetResult(roundIdx, m.id, e.target.value)}>
                                    <option value="">تعيين النتيجة</option>
                                    <option value="1-0">0-1</option>
                                    <option value="0.5-0.5">0.5-0.5</option>
                                    <option value="0-1">1-0</option>
                                    <option value="0F-0F">0F-0F</option>
                                    <option value="1F-0">0-1F</option>
                                    <option value="0-1F">1F-0</option>
                                    <option value="حذف">حذف</option> {/* خيار لحذف النتيجة */}
                                </select>
                            ) : (
                                <span>{m.result || "-"}</span> // عرض النتيجة فقط للجولات السابقة أو لـ Bye
                            )}
                        </td>
                        <td>{m.blackPts}</td>
                        <td>{m.black}</td>
                    </tr>
                )) : (
                    <tr className="no-data-row"><td colSpan="6">لا توجد جولات حالياً. ابدأ بإنشاء جولة!</td></tr>
                )}
            </tbody>
        </table>
    );

    return (
        <PageContainer>
            <div className="rounds-page">
                <div className="header">
                    <h1 className="round-title">الجولات</h1>
                    <div />
                </div>

                <div className="top-controls">
                    <button
                        className="generate-btn"
                        onClick={handleGenerateRound}
                        // زر الجولة التالية يكون معطلاً إذا كانت الجولة الحالية غير مكتملة
                        disabled={rounds.length > 0 && !allResultsFilled(rounds[rounds.length - 1])}
                    >
                        الجولة التالية
                    </button>
                    {rounds.length > 0 && (
                        <div className="round-buttons-wrapper">
                            <button className="scroll-arrow" onClick={handleRightArrow} aria-label="الجولة السابقة">➡</button>
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
                            <button className="scroll-arrow" onClick={handleLeftArrow} aria-label="الجولة التالية">⬅</button>
                        </div>
                    )}
                </div>

                <div className="rounds-table-wrapper">
                    {currentRound !== null && rounds.length > 0 ? (
                        <RoundTable round={rounds[currentRound - 1]} roundIdx={currentRound - 1} />
                    ) : (
                        <RoundTable round={{ matches: [] }} roundIdx={-1} />
                    )}
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

                {/* Modal for Fullscreen Round Table (uses .rounds-page .modal-overlay & .modal-content for light theme) */}
                {showZoom && currentRound !== null && (
                    <div className="modal-overlay" onClick={() => setShowZoom(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>الجولة {currentRound}</h2>
                            <RoundTable round={rounds[currentRound - 1]} roundIdx={currentRound - 1} />
                            <button className="close-btn round-btn" onClick={() => setShowZoom(false)}>
                                ✖ إغلاق
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal for All Rounds (uses general-modal-overlay & general-modal-content for dark theme) */}
                {showAllRoundsModal && (
                    <div className="general-modal-overlay" onClick={() => setShowAllRoundsModal(false)}>
                        <div className="general-modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>كل الجولات</h2>
                            {rounds.length > 0 ? (
                                rounds.map((r, i) => (
                                    <div key={r.number} style={{ marginBottom: "2rem" }}>
                                        <h3>الجولة {r.number}</h3>
                                        <RoundTable round={r} roundIdx={i} />
                                    </div>
                                ))
                            ) : (
                                <p>لا توجد جولات لعرضها.</p>
                            )}
                            <button className="close-btn round-btn" onClick={() => setShowAllRoundsModal(false)}>
                                ✖ إغلاق
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}

export default RoundsButton;