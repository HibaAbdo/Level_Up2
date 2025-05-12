import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateTournament from '../../../CreateTournamentPage/CreateTournament'; // ✅ corrected relative path

function SettingsButton() {
  const { id } = useParams();
  const [tournamentData, setTournamentData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(`tournament-${id}`);
    if (data) {
      setTournamentData(JSON.parse(data));
    }
  }, [id]);

  if (!tournamentData) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <CreateTournament mode="edit" initialData={tournamentData} />
  );
}

export default SettingsButton;
