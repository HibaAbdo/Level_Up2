import React, { useEffect, useState } from 'react';
import './TournamentDashboard.css';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import CreatePlayerModal from './PlayersButtonsModals/CreatePlayerModal';
import CreatePlayersByListModal from './PlayersButtonsModals/CreatePlayersByListModal';
import RandomizeConfirmationModal from './PlayersButtonsModals/RandomizeConfirmationModal';
import SortByRatingConfirmationModal from './PlayersButtonsModals/SortByRatingConfirmationModal';
import ForbiddenPairsModal from './PlayersButtonsModals/ForbiddenPairsModal';
import PredefinedPairsModal from './PlayersButtonsModals/PredefinedPairsModal';
import logo from './assets/logoshah.png';

import settingsIcon from './assets/Icons/settingsPiece.png';
import playerIcon from './assets/Icons/player.png';
import RoundIcon from './assets/Icons/game.png';
import standingsIcon from './assets/Icons/chess-board.png';
import addIcon from './assets/Icons/add-player.png';
import listIcon from './assets/Icons/add-players.png';
import shuffleIcon from './assets/Icons/shuffle.png';
import ratingIcon from './assets/Icons/sortByrating.png';
import blockIcon from './assets/Icons/forbidden.png';
import pairIcon from './assets/Icons/pairs.png';
import confirmIcon from './assets/Icons/confirm.png';
import csvIcon from './assets/Icons/csv.png';

function TournamentDashboard() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Added useNavigate
  const [activeTab, setActiveTab] = useState('اللاعبين');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isRandomizeConfirmOpen, setIsRandomizeConfirmOpen] = useState(false);
  const [isSortByRatingConfirmOpen, setIsSortByRatingConfirmOpen] = useState(false);
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
  const [isPredefinedModalOpen, setIsPredefinedModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);

  const tournamentKey = `tournament-${id}`;
  let tournament = {};

  try {
    const raw = localStorage.getItem(tournamentKey);
    tournament = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('⚠️ Failed to parse tournament:', err);
    tournament = {};
  }

  useEffect(() => {
    const storedPlayers = Array.isArray(tournament.players) ? tournament.players : [];
    setPlayers(storedPlayers);
  }, []);

  const savePlayersToStorage = (updatedPlayers) => {
    const updatedTournament = {
      ...tournament,
      players: updatedPlayers,
    };
    localStorage.setItem(tournamentKey, JSON.stringify(updatedTournament));
    setPlayers(updatedPlayers);
  };

  const handleCreatePlayer = (newPlayer) => {
    const updatedPlayers = [...players, newPlayer];
    savePlayersToStorage(updatedPlayers);
  };

  const handleCreateManyPlayers = (newPlayers) => {
    const updated = [...players, ...newPlayers];
    savePlayersToStorage(updated);
  };

  const handleRandomizePlayers = () => {
    const shuffled = [...players]
      .map((p) => ({ ...p, sortKey: Math.random() }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ sortKey, ...p }) => p);
    savePlayersToStorage(shuffled);
  };

  const sortByRating = () => {
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    savePlayersToStorage(sorted);
  };

  const tabs = [
    { label: 'الإعدادات', icon: settingsIcon },
    { label: 'اللاعبين', icon: playerIcon },
    { label: 'الجولات', icon: RoundIcon },
    { label: 'الترتيب', icon: standingsIcon }
  ];

  return (
  <div className="shared-container">
    <div className="form-logo-wrapper">
      <img src={logo} alt="شطرنج القدس" className="form-logo" />
      </div>
    <div className="dashboard-container" dir="rtl">
      <div className="dashboard-header">
        <h2 className="dashboard-title">{tournament.name || 'بطولة جديدة'}</h2>
      </div>

      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`tab vertical-tab ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => {
              if (tab.label === 'الإعدادات') {
                navigate(`/tournament/${id}/settings`); // ✅ Navigate to Settings
              } else {
                setActiveTab(tab.label);
              }
            }}
          >
            {tab.icon && (
              <img
                src={tab.icon}
                alt=""
                className="tab-icon"
                style={{ width: '36px', height: '36px', marginBottom: '6px' }}
              />
            )}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'اللاعبين' && (
        <>
          <div className="controls">
            <div className="row">
              <button className="btn primary" onClick={() => setIsModalOpen(true)}>
                <img src={addIcon} alt="" className="btn-icon" />
                إنشاء لاعب جديد
              </button>
              <button className="btn" onClick={() => setIsListModalOpen(true)}>
                <img src={listIcon} alt="" className="btn-icon" />
                إنشاء لاعبين من القائمة
              </button>
              <button className="btn" onClick={() => setIsRandomizeConfirmOpen(true)}>
                <img src={shuffleIcon} alt="" className="btn-icon" />
                ترتيب عشوائي
              </button>
              <button className="btn" onClick={() => setIsSortByRatingConfirmOpen(true)}>
                <img src={ratingIcon} alt="" className="btn-icon" />
                ترتيب حسب التصنيف
              </button>
              <button className="btn" onClick={() => setIsForbiddenModalOpen(true)}>
                <img src={blockIcon} alt="" className="btn-icon" />
                الأزواج الممنوعة
              </button>
            </div>
            <div className="row">
              <button className="btn" onClick={() => setIsPredefinedModalOpen(true)}>
                <img src={pairIcon} alt="" className="btn-icon" />
                الأزواج المحددة مسبقًا
              </button> 

              <button className="btn">
                <img src={confirmIcon} alt="" className="btn-icon" />
                بدء التأكيد
              </button>
            </div>
          </div>

          <table className="players-table">
            <thead>
              <tr>
                <th>#</th>
                <th>المعرف</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>التصنيف</th>
                <th>معامل K</th>
                <th>نقاط إضافية</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr className="no-data">
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                players.map((player, index) => (
                  <tr key={player.id}>
                    <td>{index + 1}</td>
                    <td>{player.id}</td>
                    <td>{player.name}</td>
                    <td>{player.email || '—'}</td>
                    <td>{player.rating}</td>
                    <td>{player.kFactor}</td>
                    <td>{player.extraPoints}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="save-section">
            <button className="btn export">
              <img src={csvIcon} alt="csv" className="btn-icon" />
            </button>
          </div>

          {/* Modals */}
          <CreatePlayerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreatePlayer}
          />
          <CreatePlayersByListModal
            isOpen={isListModalOpen}
            onClose={() => setIsListModalOpen(false)}
            onCreateMany={handleCreateManyPlayers}
          />
          <RandomizeConfirmationModal
            isOpen={isRandomizeConfirmOpen}
            onClose={() => setIsRandomizeConfirmOpen(false)}
            onConfirm={() => {
              handleRandomizePlayers();
              setIsRandomizeConfirmOpen(false);
            }}
          />
          <SortByRatingConfirmationModal
            isOpen={isSortByRatingConfirmOpen}
            onClose={() => setIsSortByRatingConfirmOpen(false)}
            onConfirm={() => {
              sortByRating();
              setIsSortByRatingConfirmOpen(false);
            }}
          />
          <ForbiddenPairsModal
            isOpen={isForbiddenModalOpen}
            onClose={() => setIsForbiddenModalOpen(false)}
            players={players}
            onAddPair={(pair) => {
              console.log("Forbidden pair added:", pair);
            }}
          />
          <PredefinedPairsModal
            isOpen={isPredefinedModalOpen}
            onClose={() => setIsPredefinedModalOpen(false)}
            players={players}
            tournamentId={id}
          />
        </>
      )}
    </div>
    </div>
  );
}

export default TournamentDashboard;
