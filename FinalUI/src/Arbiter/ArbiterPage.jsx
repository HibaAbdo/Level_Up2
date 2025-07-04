import React, { useState } from 'react';
import './ArbiterPage.css';
import PageContainer from '../Components/ThePageContainers/PageContainer';
import ModalWrapper from '../Components/TheModals/ModalWrapper';
import addPlayerIcon from '../assets/Icons/add-player.png';

function ArbiterPage() {
  const [arbiters, setArbiters] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [usernameOnly, setUsernameOnly] = useState('');

  const handleFullInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUsername = () => {
    if (!usernameOnly.trim()) {
      alert('يرجى إدخال اسم المستخدم');
      return;
    }
    setArbiters((prev) => [...prev, { name: '—', username: usernameOnly.trim(), password: '—' }]);
    setUsernameOnly('');
    setIsAddModalOpen(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const { name, username, password } = formData;
    if (!name.trim() || !username.trim() || !password.trim()) {
      alert('يرجى تعبئة جميع الحقول');
      return;
    }
    setArbiters((prev) => [...prev, formData]);
    setFormData({ name: '', username: '', password: '' });
    setIsCreateModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({ name: '', username: '', password: '' });
    setUsernameOnly('');
    setIsAddModalOpen(false);
    setIsCreateModalOpen(false);
  };

  const handleDeleteArbiter = (index) => {
    const updated = [...arbiters];
    updated.splice(index, 1);
    setArbiters(updated);
  };

  return (
    <PageContainer>
      <div className="arbiter-page">
        <h2 className="form-title">الحكام</h2>

        <div className="arbiter-buttons">
          <button className="dashboard-action-button" onClick={() => setIsAddModalOpen(true)}>
            <img src={addPlayerIcon} alt="icon" className="dashboard-icon" />
            إضافة حكم
          </button>
          <button className="dashboard-action-button" onClick={() => setIsCreateModalOpen(true)}>
            <img src={addPlayerIcon} alt="icon" className="dashboard-icon" />
            إنشاء حكم جديد
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-theme">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>اسم المستخدم</th>
                <th>كلمة المرور</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {arbiters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-arbiters-message">
                    لم يتم إضافة أي حكام بعد
                  </td>
                </tr>
              ) : (
                arbiters.map((arbiter, index) => (
                  <tr key={index}>
                    <td>{arbiter.name}</td>
                    <td>{arbiter.username}</td>
                    <td>{arbiter.password}</td>
                    <td>
                      <button
                        className="delete-emoji-btn"
                        onClick={() => handleDeleteArbiter(index)}
                        title="حذف الحكم"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ مودال إنشاء حكم جديد */}
        <ModalWrapper isOpen={isCreateModalOpen} onClose={handleCancel} title="إنشاء حكم جديد">
          <form onSubmit={handleCreate}>
            <div className="floating-group">
              <input
                type="text"
                name="name"
                className="floating-input"
                placeholder="الاسم الكامل"
                value={formData.name}
                onChange={handleFullInputChange}
                required
              />
              <label className="floating-label">الاسم الكامل</label>
            </div>
            <div className="floating-group">
              <input
                type="text"
                name="username"
                className="floating-input"
                placeholder="اسم المستخدم"
                value={formData.username}
                onChange={handleFullInputChange}
                required
              />
              <label className="floating-label">اسم المستخدم</label>
            </div>
            <div className="floating-group">
              <input
                type="text"
                name="password"
                className="floating-input"
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={handleFullInputChange}
                required
              />
              <label className="floating-label">كلمة المرور</label>
            </div>
            <div className="modal-actions">
              <button type="submit" className="btn">إنشاء</button>
              <button type="button" className="btn cancel-btn" onClick={handleCancel}>إلغاء</button>
            </div>
          </form>
        </ModalWrapper>

        {/* ✅ مودال إضافة حكم باسم المستخدم فقط */}
        <ModalWrapper isOpen={isAddModalOpen} onClose={handleCancel} title="إضافة حكم">
          <div>
            <div className="floating-group">
              <input
                type="text"
                className="floating-input"
                placeholder="اسم المستخدم"
                value={usernameOnly}
                onChange={(e) => setUsernameOnly(e.target.value)}
                required
              />
              <label className="floating-label">اسم المستخدم</label>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={handleAddUsername}>إضافة</button>
              <button type="button" className="btn cancel-btn" onClick={handleCancel}>إلغاء</button>
            </div>
          </div>
        </ModalWrapper>
      </div>
    </PageContainer>
  );
}

export default ArbiterPage;
