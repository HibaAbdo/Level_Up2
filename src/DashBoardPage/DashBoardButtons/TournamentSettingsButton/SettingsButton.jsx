// SettingsButton.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateTournament from '../../../CreateTournamentPage/CreateTournament';

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

 // تمرير embedded={true} حتى يتم إخفاء الهيدر والكونتينر داخل الفورم
  return <CreateTournament mode="edit" initialData={tournamentData} embedded={true} />;
}

export default SettingsButton;
