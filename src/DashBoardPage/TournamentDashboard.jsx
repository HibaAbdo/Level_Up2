// src/TournamentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Keep useLocation for toggle button logic
import './TournamentDashboard.css'; // Assuming this is your main dashboard CSS

import Header from '../components/Headers/Header';
// Corrected DashboardDrawer import path (singular 'DashboardDrawer')
import DashboardDrawer from '../Components/DashboardDrawers/DashboardDrawer'; 
import PageContainer from '../Components/PageContainers/PageContainer'; // Added PageContainer

// Dashboard Buttons components
import RoundsPage from "./DashBoardButtons/RoundsPage/RoundsButton";
import StandingsPage from "./DashBoardButtons/StandingsPage/StandingsButton";
import SettingsButton from "./DashBoardButtons/TournamentSettingsButton/SettingsButton";

// Player Modals components
import CreatePlayerModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayerModal';
import CreatePlayersByListModal from './DashBoardButtons/PlayersButtonsModals/CreatePlayersByListModal';
import RandomizeConfirmationModal from './DashBoardButtons/PlayersButtonsModals/RandomizeConfirmationModal';
import SortByRatingConfirmationModal from './DashBoardButtons/PlayersButtonsModals/SortByRatingConfirmationModal';
import ForbiddenPairsModal from './DashBoardButtons/PlayersButtonsModals/ForbiddenPairsModal';
import PredefinedPairsModal from './DashBoardButtons/PlayersButtonsModals/PredefinedPairsModal';

// Icons
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
  const location = useLocation(); // Keep useLocation for conditional toggle button

  // State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isRandomizeConfirmOpen, setIsRandomizeConfirmOpen] = useState(false);
  const [isSortByRatingConfirmOpen, setIsSortByRatingConfirmOpen] = useState(false);
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
  const [isPredefinedModalOpen, setIsPredefinedModalOpen] = useState(false);

  // Tournament data states
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  // ⭐ CORRECTED: Use backticks (`) for template literals for tournamentKey
  const tournamentKey = `tournament-${id}`;
  let tournament = {};

  try {
    const raw = localStorage.getItem(tournamentKey);
    tournament = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('⚠️ Failed to parse tournament:', err); // Arabic message changed to English for consistency with console.error
    tournament = {};
  }

  // Load players from local storage on component mount
  useEffect(() => {
    // Ensure tournament.players is an array before setting state
    const storedPlayers = Array.isArray(tournament.players) ? tournament.players : [];
    setPlayers(storedPlayers);
  }, [id, tournament.players]); // Add tournament.players to dependency array if it can change

  // Helper to toggle the drawer state
  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  // Helper to save players to localStorage and update state
  const savePlayersToStorage = (updatedPlayers) => {
    const updatedTournament = { ...tournament, players: updatedPlayers };
    localStorage.setItem(tournamentKey, JSON.stringify(updatedTournament));
    setPlayers(updatedPlayers);
  };

  // Player handlers
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
      .map(({ sortKey, ...p }) => p); // Remove sortKey after shuffling
    savePlayersToStorage(shuffled);
  };

  const sortByRating = () => {
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    savePlayersToStorage(sorted);
  };

  // Condition for showing the toggle button:
  // Visible if user is logged in AND NOT on the guest home page.
  // The button itself will hide/show based on `!isOpen` condition inside DashboardDrawer.
  const showToggleButton = location.pathname !== '/' && username;

  return (
    <>
      {/* Header component: Now explicitly managing sidebar toggle via props */}
      <Header
        username={username}
        showSidebarToggle={true} // Set to true to show the toggle button in the Header
        onSidebarToggle={toggleDrawer} // Pass the toggle function to the Header
      />

      {/* Dashboard Drawer component */}
      <DashboardDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer} // Use toggleDrawer to close the drawer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showToggleButton={showToggleButton} // Pass visibility prop to the drawer
      />

      {/* Main dashboard content wrapped in PageContainer */}
      <PageContainer> {/* ⭐ NEW: PageContainer wrapper */}
        {/* Render content based on activeTab */}
        {activeTab === 'اللاعبين' && (
          <>
            {/* Control buttons for players tab */}
            <div className="controls">
              <div className="row">
                {/* ⭐ UPDATED BUTTON CLASS: btn-gold */}
                <button className="btn btn-gold" onClick={() => setIsModalOpen(true)}>
                  <img src={addIcon} alt="" className="btn-icon" />
                  إنشاء لاعب جديد
                </button>
                {/* ⭐ UPDATED BUTTON CLASS: btn-outline */}
                <button className="btn btn-outline" onClick={() => setIsListModalOpen(true)}>
                  <img src={listIcon} alt="" className="btn-icon" />
                  إنشاء لاعبين من القائمة
                </button>
                {/* ⭐ UPDATED BUTTON CLASS: btn-outline */}
                <button className="btn btn-outline" onClick={() => setIsRandomizeConfirmOpen(true)}>
                  <img src={shuffleIcon} alt="" className="btn-icon" />
                  ترتيب عشوائي
                </button>
                {/* ⭐ UPDATED BUTTON CLASS: btn-outline */}
                <button className="btn btn-outline" onClick={() => setIsSortByRatingConfirmOpen(true)}>
                  <img src={ratingIcon} alt="" className="btn-icon" />
                  ترتيب حسب التصنيف
                </button>
                {/* ⭐ UPDATED BUTTON CLASS: btn-outline */}
                <button className="btn btn-outline" onClick={() => setIsForbiddenModalOpen(true)}>
                  <img src={blockIcon} alt="" className="btn-icon" />
                  الأزواج الممنوعة
                </button>
              </div>
              <div className="row">
                {/* ⭐ UPDATED BUTTON CLASS: btn-outline */}
                <button className="btn btn-outline" onClick={() => setIsPredefinedModalOpen(true)}>
                  <img src={pairIcon} alt="" className="btn-icon" />
                  الأزواج المحددة مسبقًا
                </button>
                {/* ⭐ UPDATED BUTTON CLASS: btn-outline */}
                <button className="btn btn-outline">
                  <img src={confirmIcon} alt="" className="btn-icon" />
                  بدء التأكيد
                </button>
              </div>
            </div>

            {/* Players Table */}
            {/* ⭐ NEW: table-wrapper for responsiveness and ⭐ UPDATED TABLE CLASS: table-theme */}
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

            {/* Save/Export section */}
            <div className="save-section">
              {/* ⭐ UPDATED BUTTON CLASS: btn-outline AND ADDED TEXT */}
              <button className="btn btn-outline">
                <img src={csvIcon} alt="csv" className="btn-icon" />
                تصدير CSV
              </button>
            </div>
          </>
        )}

        {/* Conditional rendering for other tabs */}
        {activeTab === 'My Tournaments' && <div>Tournament List/Management would go here</div>} {/* Placeholder for the new tab */}
        {activeTab === 'الإعدادات' && <SettingsButton />}
        {activeTab === 'الجولات' && <RoundsPage players={players} rounds={rounds} setRounds={setRounds} />}
        {activeTab === 'الترتيب' && <StandingsPage players={players} rounds={rounds} />}

      </PageContainer>

      {/* Modals are outside PageContainer as they typically overlay the whole page */}
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