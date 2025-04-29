import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './LoginPage/Login.jsx';
import MyTournaments from './MyTournaments.jsx';
import CreateTournament from './CreateTournament.jsx';
import TournamentDashboard from './TournamentDashboard.jsx';
import TournamentSettings from './TournamentSettings.jsx'; // ✅ ADD THIS LINE

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />   {/* Redirect home to login */}
      <Route path="/login" element={<Login />} />
      <Route path="/mytournaments" element={<MyTournaments />} />
      <Route path="/create" element={<CreateTournament />} />
      <Route path="/tournament/:id" element={<TournamentDashboard />} />
      <Route path="/tournament/:id/settings" element={<TournamentSettings />} /> {/* ✅ New Route */}
    </Routes>
  );
}

export default App;
