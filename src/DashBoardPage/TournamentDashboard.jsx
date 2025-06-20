// src/TournamentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './TournamentDashboard.css';

import Header from '../Components/TheHeaders/Header';
import DashboardDrawer from '../Components/DashboardDrawers/DashboardDrawer';
import PageContainer from '../Components/ThePageContainers/PageContainer';

import RoundsPage from "./DashBoardButtons/RoundsPage/RoundsButton";
import StandingsPage from "./DashBoardButtons/StandingsPage/StandingsButton";
import SettingsButton from "./DashBoardButtons/TournamentSettingsButton/SettingsButton";

import CreatePlayerModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayerModal';
import CreatePlayersByListModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayersByListModal';
import RandomizeConfirmationModal from './DashBoardButtons/PlayersButtonsModals/RandomizeConfirmationModal';
import SortByRatingConfirmationModal from './DashBoardButtons/PlayersButtonsModals/SortByRatingConfirmationModal';
import ForbiddenPairsModal from './DashBoardButtons/PlayersButtonsModals/ForbiddenPairsModal';
import PredefinedPairsModal from './DashBoardButtons/PlayersButtonsModals/PredefinedPairsModal';

import addIcon from '../assets/Icons/add-player.png';
import listIcon from '../assets/Icons/add-players.png';
import shuffleIcon from '../assets/Icons/shuffle.png';
import ratingIcon from '../assets/Icons/sortByrating.png';
import blockIcon from '../assets/Icons/forbidden.png';
import pairIcon from '../assets/Icons/pairs.png';
import confirmIcon from '../assets/Icons/confirm.png';
import csvIcon from '../assets/Icons/csv.png';

function TournamentDashboard() {
  const { id } = useParams();
  const username = localStorage.getItem('username') || 'المستخدم';
  const [activeTab, setActiveTab] = useState('اللاعبين');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isRandomizeConfirmOpen, setIsRandomizeConfirmOpen] = useState(false);
  const [isSortByRatingConfirmOpen, setIsSortByRatingConfirmOpen] = useState(false);
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
  const [isPredefinedModalOpen, setIsPredefinedModalOpen] = useState(false);

  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  const tournamentKey = `tournament-${id}`;
  let tournament = {};

  try {
    const raw = localStorage.getItem(tournamentKey);
    tournament = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('⚠️ Failed to parse tournament:', err);
  }

  useEffect(() => {
    const storedPlayers = Array.isArray(tournament.players) ? tournament.players : [];
    setPlayers(storedPlayers);
  }, [id, tournament.players]);

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  const savePlayersToStorage = (updatedPlayers) => {
    const updatedTournament = { ...tournament, players: updatedPlayers };
    localStorage.setItem(tournamentKey, JSON.stringify(updatedTournament));
    setPlayers(updatedPlayers);
  };

  const handleCreatePlayer = (newPlayer) => {
    savePlayersToStorage([...players, newPlayer]);
  };

  const handleCreateManyPlayers = (newPlayers) => {
    savePlayersToStorage([...players, ...newPlayers]);
  };

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

  const showToggleButton = location.pathname !== '/' && username;

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
            <div className="controls">
              {/* Row 1 */}
              <div className="row">
                <button className="btn btn-gold" onClick={() => setIsModalOpen(true)}>
                  <img src={addIcon} alt="" className="btn-icon" />
                  إنشاء لاعب جديد
                </button>
                <button className="btn btn-outline" onClick={() => setIsListModalOpen(true)}>
                  <img src={listIcon} alt="" className="btn-icon" />
                  إنشاء لاعبين من القائمة
                </button>
                <button className="btn btn-outline" onClick={() => setIsRandomizeConfirmOpen(true)}>
                  <img src={shuffleIcon} alt="" className="btn-icon" />
                  ترتيب عشوائي
                </button>
              </div>

              {/* Row 2 */}
              <div className="row">
                <button className="btn btn-outline" onClick={() => setIsSortByRatingConfirmOpen(true)}>
                  <img src={ratingIcon} alt="" className="btn-icon" />
                  ترتيب حسب التصنيف
                </button>
                <button className="btn btn-outline" onClick={() => setIsForbiddenModalOpen(true)}>
                  <img src={blockIcon} alt="" className="btn-icon" />
                  الأزواج الممنوعة
                </button>
                <button className="btn btn-outline" onClick={() => setIsPredefinedModalOpen(true)}>
                  <img src={pairIcon} alt="" className="btn-icon" />
                  الأزواج المحددة مسبقًا
                </button>
              </div>

              {/* Row 3 */}
              <div className="row">
                <button className="btn btn-outline">
                  <img src={confirmIcon} alt="" className="btn-icon" />
                  بدء التأكيد
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table-theme">
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
                    <tr>
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
            </div>

            <div className="save-section">
              <button className="btn btn-outline">
                <img src={csvIcon} alt="csv" className="btn-icon" />
                تصدير CSV
              </button>
            </div>
          </>
        )}

        {activeTab === 'الإعدادات' && <SettingsButton />}
        {activeTab === 'الجولات' && (
          <RoundsPage players={players} rounds={rounds} setRounds={setRounds} />
        )}
        {activeTab === 'الترتيب' && (
          <StandingsPage players={players} rounds={rounds} />
        )}
      </PageContainer>

      {/* Modals */}
      <CreatePlayerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreatePlayer} />
      <CreatePlayersByListModal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} onCreateMany={handleCreateManyPlayers} />
      <RandomizeConfirmationModal isOpen={isRandomizeConfirmOpen} onClose={() => setIsRandomizeConfirmOpen(false)} onConfirm={() => {
        handleRandomizePlayers();
        setIsRandomizeConfirmOpen(false);
      }} />
      <SortByRatingConfirmationModal isOpen={isSortByRatingConfirmOpen} onClose={() => setIsSortByRatingConfirmOpen(false)} onConfirm={() => {
        sortByRating();
        setIsSortByRatingConfirmOpen(false);
      }} />
      <ForbiddenPairsModal isOpen={isForbiddenModalOpen} onClose={() => setIsForbiddenModalOpen(false)} players={players} />
      <PredefinedPairsModal isOpen={isPredefinedModalOpen} onClose={() => setIsPredefinedModalOpen(false)} players={players} tournamentId={id} />
    </>
  );
}

export default TournamentDashboard;
