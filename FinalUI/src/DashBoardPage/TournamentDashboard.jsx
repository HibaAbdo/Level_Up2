// src/TournamentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './TournamentDashboard.css';
import ArbiterPage from '../Arbiter/ArbiterPage';

import Header from '../Components/TheHeaders/Header';
import DashboardDrawer from '../Components/TheDashboardDrawers/DashboardDrawer';
import PageContainer from '../Components/ThePageContainers/PageContainer';

import RoundsPage from './DashBoardButtons/RoundsPage/RoundsButton';
import StandingsPage from './DashBoardButtons/StandingsPage/StandingsButton';
import SettingsButton from './DashBoardButtons/TournamentSettingsButton/SettingsButton';

import CreatePlayerModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayerModal';
import CreatePlayersByListModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayersByListModal';
import RandomizeConfirmationModal from './DashBoardButtons/PlayersButtonsModals/RandomizeConfirmationModal';
import SortByRatingConfirmationModal from './DashBoardButtons/PlayersButtonsModals/SortByRatingConfirmationModal';
import ForbiddenPairsModal from './DashBoardButtons/PlayersButtonsModals/ForbiddenPairsModal';
import PredefinedPairsModal from './DashBoardButtons/PlayersButtonsModals/PredefinedPairsModal';
import CheckinConfirmationModal from './DashBoardButtons/PlayersButtonsModals/CheckinConfirmationModal';
import { FaSearch } from "react-icons/fa";

import { createPlayer, createPlayersBulk } from './DashBoardButtons/PlayersButtonsModals/playerApi';

import addIcon from '../assets/Icons/add-player.png';
import listIcon from '../assets/Icons/add-players.png';
import shuffleIcon from '../assets/Icons/shuffle.png';
import ratingIcon from '../assets/Icons/sortByrating.png';
import blockIcon from '../assets/Icons/forbidden.png';
import pairIcon from '../assets/Icons/pairs.png';
import confirmIcon from '../assets/Icons/confirm.png';


function TournamentDashboard() {
  const { id } = useParams();
  const username = localStorage.getItem('username') || 'المستخدم';
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('اللاعبين');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isRandomizeConfirmOpen, setIsRandomizeConfirmOpen] = useState(false);
  const [isSortByRatingConfirmOpen, setIsSortByRatingConfirmOpen] = useState(false);
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
  const [isPredefinedModalOpen, setIsPredefinedModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isCheckinMode, setIsCheckinMode] = useState(false);

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  

  const tournamentKey = `tournament-${id}`;

 
  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

 const savePlayersToStorage = (updatedPlayers) => {
  const raw = localStorage.getItem(tournamentKey);
  const tournament = raw ? JSON.parse(raw) : {};
  const updatedTournament = { 
    ...tournament, 
    players: updatedPlayers,
    rounds: rounds    // نحتفظ بالجولات كما هي
  };
  localStorage.setItem(tournamentKey, JSON.stringify(updatedTournament));
  setPlayers(updatedPlayers);
};

const saveRoundsToStorage = (updatedRounds) => {
  const raw = localStorage.getItem(tournamentKey);
  const tournament = raw ? JSON.parse(raw) : {};
  const updatedTournament = { 
    ...tournament, 
    players: players,
    rounds: updatedRounds
  };
  localStorage.setItem(tournamentKey, JSON.stringify(updatedTournament));
  setRounds(updatedRounds);
};

  const handleCreatePlayer = async (player) => {
    const payload = {
      tournamentId: Number(id),
      name: player.name,
      rating: Number(player.rating) || 0,
      kFactor: Number(player.kFactor) || 20,
      extraPoints: Number(player.extraPoints) || 0,
      email: player.email,
    };

    if (editingPlayer) {
      payload.id = editingPlayer.id;
    }

    try {
      const saved = await createPlayer(payload);

      if (editingPlayer) {
        const updated = players.map((p) =>
          p.id === editingPlayer.id ? { ...p, ...saved } : p
        );
        savePlayersToStorage(updated);
      } else {
        savePlayersToStorage([...players, saved]);
      }
      setEditingPlayer(null);
    } catch (err) {
      console.error('Failed to save player', err);
    }
  };

  const handleCreateManyPlayers = async (newPlayers) => {
    const names = newPlayers.map(p => p.name);
    try {
      const { data: savedList } = await createPlayersBulk({
        tournamentId: Number(id),
        names,
      });
      savePlayersToStorage([...players, ...savedList]);
    } catch (err) {
      console.error('Failed to save players list', err);
    }
  };

  const handleDeletePlayer = (playerId) => {
    const updated = players.filter(p => p.id !== playerId);
    savePlayersToStorage(updated);
  };

  const handleCheckinChange = (playerId, value) => {
    const updated = players.map(p =>
      p.id === playerId ? { ...p, checkedIn: value } : p
    );
    savePlayersToStorage(updated);
  };

  const beginCheckin = () => {
    const updated = players.map((p) => ({
      ...p,
      checkedIn: p.checkedIn || false, // keep previous confirmed
    }));
    savePlayersToStorage(updated);
    setIsCheckinMode(true);
    setIsCheckinModalOpen(false);
  };

 const finalizeCheckin = () => {
  setIsCheckinMode(false);
  setIsCheckinModalOpen(false);

  const confirmed = players.filter(p => p.checkedIn !== false);

  // توليد أول جولة
  const firstRound = {
    number: 1,
    matches: generateMatches(confirmed),
  };
  const initialRounds = [firstRound];

  const raw = localStorage.getItem(tournamentKey);
  const tournament = raw ? JSON.parse(raw) : {};
  const updatedTournament = {
    ...tournament,
    rounds: initialRounds,
  };
  localStorage.setItem(tournamentKey, JSON.stringify(updatedTournament));

  setRounds(initialRounds);

  setCurrentRoundIndex(0);
  setActiveTab("الجولات");
};
// 👇 بعد finalizeCheckin
const generateMatches = (activePlayers) => {
  const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
  const matches = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        id: `match-1-${i / 2 + 1}`,
        white: shuffled[i].name,
        black: shuffled[i + 1].name,
        result: "",
        whiteViolations: [],
        blackViolations: []
      });
    } else {
      matches.push({
        id: `match-1-${i / 2 + 1}-bye`,
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



  const filteredPlayers = players.filter((player) =>
  player.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleRandomizePlayers = () => {
    const shuffled = [...players]
      .map(p => ({ ...p, sortKey: Math.random() }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ sortKey, ...p }) => p);
    savePlayersToStorage(shuffled);
  };

  const sortByRating = () => {
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    savePlayersToStorage(sorted);
  };

  const confirmedPlayers = players.filter(p => p.checkedIn !== false);
  const showToggleButton = location.pathname !== '/' && username;

  const getNextPlayerId = () => {
    const key = `tournament-${id}-nextId`;
    const current = parseInt(localStorage.getItem(key)) || 1;
    localStorage.setItem(key, current + 1);
    return current;
  };

  return (
    <>
      <Header
        username={username}
        showSidebarToggle={true}
        onSidebarToggle={toggleDrawer}
      />

      <DashboardDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showToggleButton={showToggleButton}
      />

      <PageContainer>
        {activeTab === 'اللاعبين' && (
          <>
           <div className="controls-page">
          <h1 className="form-title"> اللاعبين </h1>
              <div className="row">
                <button className="btn btn-gold" onClick={() => { setIsModalOpen(true); setEditingPlayer(null); }}>
                  <img src={addIcon} alt="" className="btn-icon" /> إنشاء لاعب جديد
                </button>
                <button className="btn btn-outline" onClick={() => setIsListModalOpen(true)}>
                  <img src={listIcon} alt="" className="btn-icon" /> إنشاء لاعبين من القائمة
                </button>
                <button className="btn btn-outline" onClick={() => setIsRandomizeConfirmOpen(true)}>
                  <img src={shuffleIcon} alt="" className="btn-icon" /> ترتيب عشوائي
                </button>
              </div>

              <div className="row">
                <button className="btn btn-outline" onClick={() => setIsSortByRatingConfirmOpen(true)}>
                  <img src={ratingIcon} alt="" className="btn-icon" /> ترتيب حسب التصنيف
                </button>
                <button className="btn btn-outline" onClick={() => setIsForbiddenModalOpen(true)}>
                  <img src={blockIcon} alt="" className="btn-icon" /> الأزواج الممنوعة
                </button>
                <button className="btn btn-outline" onClick={() => setIsPredefinedModalOpen(true)}>
                  <img src={pairIcon} alt="" className="btn-icon" /> الأزواج المحددة مسبقًا
                </button>
              </div>

              <div className="row">
                <button
                  className="btn btn-outline"
                  onClick={() => setIsCheckinModalOpen(true)}
                >
                  <img src={confirmIcon} alt="" className="btn-icon" />
                  {isCheckinMode ? "تأكيد اللّاعبين" : "بدء التّأكيد"}
                </button>
              </div>
            </div>
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
                    {isCheckinMode && (
                      <th className="checkin-col">
                        <span>تأكيد الحضور</span>
                        <input
                          type="checkbox"
                          checked={confirmedPlayers.length === players.length}
                          onChange={(e) => {
                            const updated = players.map((p) => ({
                              ...p,
                              checkedIn: e.target.checked,
                            }));
                            savePlayersToStorage(updated);
                          }}
                        />
                      </th>
                    )}
                    <th>#</th>
                    <th>المعرف</th>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>التصنيف</th>
                    <th>معامل K</th>
                    <th>نقاط إضافية</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {players.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>
                        لا توجد بيانات
                      </td>
                    </tr>
                  ) : (
filteredPlayers.map((player, index) => (                      <tr key={player.id}>
                        {isCheckinMode && (
                          <td>
                            <input
                              type="checkbox"
                              checked={player.checkedIn !== false}
                              onChange={(e) => handleCheckinChange(player.id, e.target.checked)}
                            />
                          </td>
                        )}
                        <td>{index + 1}</td>
                        <td>{player.id}</td>
                        <td>
                          <span
                            className={`editable-name ${isCheckinMode && player.checkedIn === false ? 'crossed-name' : ''}`}
                            onClick={() => {
                              setEditingPlayer(player);
                              setIsModalOpen(true);
                            }}
                          >
                            {player.name}
                          </span>
                        </td>
                        <td>{player.email || '—'}</td>
                        <td>{player.rating}</td>
                        <td>{player.kFactor}</td>
                        <td>{player.extraPoints}</td>
                       <td>
  {(!rounds.length && !player.checkedIn) ? (
    <button className="btn-remove" onClick={() => handleDeletePlayer(player.id)}>🗑</button>
  ) : (
    " "
  )}
</td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="save-section">
              
              {isCheckinMode && (
                <span className="checkin-count">
                  ✅ تم تأكيد {confirmedPlayers.length} / {players.length}
                </span>
              )}
            </div>
          </>
        )}

        {activeTab === 'الإعدادات' && <SettingsButton />}
        {activeTab === 'الجولات' && (
<RoundsPage
  players={confirmedPlayers}
  rounds={rounds}
  setRounds={setRounds}
  initialRound={currentRoundIndex}
/>
        )}
        {activeTab === 'التّرتيب' && (
          <StandingsPage players={players} rounds={rounds} />
        )}
        {activeTab === 'الحكّام' && <ArbiterPage />}
      </PageContainer>

      <CreatePlayerModal
  isOpen={isModalOpen}
  onClose={() => { setIsModalOpen(false); setEditingPlayer(null); }}
  onCreate={handleCreatePlayer}
  playerData={editingPlayer}
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
      />
      <PredefinedPairsModal
        isOpen={isPredefinedModalOpen}
        onClose={() => setIsPredefinedModalOpen(false)}
        players={players}
        tournamentId={id}
      />
      <CheckinConfirmationModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        onConfirm={isCheckinMode ? finalizeCheckin : beginCheckin}
        isActive={isCheckinMode}
      />
    </>
  );
}

export default TournamentDashboard;
