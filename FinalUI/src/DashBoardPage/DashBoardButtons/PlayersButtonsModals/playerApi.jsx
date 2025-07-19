import axios from 'axios';

const API_BASE = 'http://localhost:8081/api/players'; // غيّره لو تستخدم سيرفر خارجي

// 🟢 إرسال لاعب واحد
export const createPlayer = async (playerData) => {
  const response = await axios.post(API_BASE, playerData);
  return response.data; // يجب أن يحتوي على {id, name, rating, ...}
};

// 🟢 إرسال مجموعة لاعبين دفعة واحدة
export const createPlayersBulk = async (bulkData) => {
  const response = await axios.post(`${API_BASE}/bulk`, bulkData);
  return response.data; // مصفوفة من اللاعبين أو IDs
};

// 🔄 جلب جميع اللاعبين المرتبطين ببطولة معيّنة
export const getPlayersByTournament = (tournamentId) => {
  return axios.get(`${API_BASE}?tournamentId=${tournamentId}`);
};

// ❌ حذف لاعب حسب الـ ID
export const deletePlayer = (playerId) => {
  return axios.delete(`${API_BASE}/${playerId}`);
};

// ✅ دالة لجلب اللاعبين لواجهة المستخدم
export const fetchPlayersByTournament = async (tournamentId) => {
  const response = await axios.get(`${API_BASE}?tournamentId=${tournamentId}`);
  return response.data;
};


// ✅ تأكيد حضور مجموعة من اللاعبين
export const confirmAttendance = (playerIds) => {
  return axios.put(`${API_BASE}/attendance`, { playerIds });
};