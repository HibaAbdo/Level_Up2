import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './LoginPage/Login';
import MyTournaments from './MyTournaments';
import CreateTournament from './CreateTournament';
import TournamentDashboard from './TournamentDashboard';
import TournamentSettings from './TournamentSettings';
import logo from './assets/logoshah.png';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mytournaments" element={<MyTournaments />} />
          <Route path="/create" element={<CreateTournament />} />
          <Route path="/tournament/:id" element={<TournamentDashboard />} />
          <Route path="/tournament/:id/settings" element={<TournamentSettings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
