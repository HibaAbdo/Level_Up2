import { Routes, Route } from "react-router-dom";
import Login from "./LoginPage/Login";
import MyTournaments from "./MyTournamentsPage/MyTournaments";
import CreateTournament from "./CreateTournamentPage/CreateTournament";
import TournamentDashboard from "./DashBoardPage/TournamentDashboard";
import DashboardLayout from "./Components/DashboardLayout";

// Dashboard inner pages
import TournamentSettingsButton from "./DashBoardPage/DashBoardButtons/TournamentSettingsButton/SettingsButton";
import RoundsButton from "./DashBoardPage/DashBoardButtons/RoundsPage/RoundsButton";
import StandingsButton from "./DashBoardPage/DashBoardButtons/StandingsPage/StandingsButton";

// Guests home and rounds pages
import GuestsHomePage from "./HomePage/GuestsHomePage";
import RoundsHomePage from "./HomePage/RoundsHomePage";
import StandingsHomePage from "./HomePage/StandingsHomePage"; // ✅ New Import

function App() {
  return (
    <Routes>
      {/* Guests section */}
      <Route path="/" element={<GuestsHomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/rounds" element={<RoundsHomePage />} />
      <Route path="/standings" element={<StandingsHomePage />} /> {/* ✅ New Route */}

      {/* Dashboard pages */}
      <Route element={<DashboardLayout />}>
        <Route path="/mytournaments" element={<MyTournaments />} />
        <Route path="/create" element={<CreateTournament />} />
        <Route path="/tournament/:id" element={<TournamentDashboard />} />
        <Route path="/tournament/:id/settings" element={<TournamentSettingsButton />} />
        <Route path="/tournament/:id/rounds" element={<RoundsButton />} />
        <Route path="/tournament/:id/standings" element={<StandingsButton />} />
      </Route>
    </Routes>
  );
}

export default App;
