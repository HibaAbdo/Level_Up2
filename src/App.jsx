import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyTournaments from './MyTournaments';
import CreateTournament from './CreateTournament';
import TournamentDashboard from './TournamentDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MyTournaments />} />
      <Route path="/create" element={<CreateTournament />} />
      <Route path="/tournament/:id" element={<TournamentDashboard />} />
    </Routes>
  );
}

export default App;
