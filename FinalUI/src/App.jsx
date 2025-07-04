// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import GuestsHomePage from './HomePage/GuestsHomePage';
import RoundsHomePage from './HomePage/RoundsHomePage';
import StandingsHomePage from './HomePage/StandingsHomePage';
import Login from './LoginPage/Login';
import MyTournaments from './MyTournamentsPage/MyTournaments';
import CreateTournament from './CreateTournamentPage/CreateTournament';
import TournamentDashboard from './DashBoardPage/TournamentDashboard';
import ArchivedTournaments from './ArchivedTournamentsPage/ArchivedTournaments';
import ArbiterRounds from './DashBoardPage/ArbiterRounds';
import RoundsButton from './DashBoardPage/DashBoardButtons/RoundsPage/RoundsButton';

const App = () => {
  return (
    <Routes>
      {/* ⬇️ هذه الصفحة تظهر أولاً */}
      <Route path="/" element={<Login />} />

      {/* ✅ الدخول كضيف */}
      <Route path="/guests-home" element={<GuestsHomePage />} />
      <Route path="/rounds" element={<RoundsHomePage />} />
      <Route path="/standings" element={<StandingsHomePage />} />

      {/* ✅ بعد تسجيل الدخول */}
      <Route path="/mytournaments" element={<MyTournaments />} />
      <Route path="/create" element={<CreateTournament />} />
      <Route path="/tournament/:id" element={<TournamentDashboard />} />

      {/* ✅ صفحات إضافية */}
      <Route path="/archive" element={<ArchivedTournaments />} />
      <Route path="/rounds-dashboard" element={<RoundsButton />} />
      <Route path="/arbiter-rounds" element={<ArbiterRounds />} />
    </Routes>
  );
};

export default App;
