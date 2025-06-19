// CreateTournament.jsx (بعد التعديل الكامل)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import PageContainer from '../components/PageContainers/PageContainer';
import Header from '../components/Headers/Header';
import './CreateTournament.css';

function CreateTournament({ mode = 'create', initialData = null, embedded = false }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'المستخدم';

  const [formData, setFormData] = useState(() =>
    initialData ? { ...initialData } : {
      name: '',
      playSystem: 'swiss',
      points: 'standard',
      byeValue: 'win',
      totalRounds: 5,
      tieBreaks: ['direct', 'buchholz1'],
      allowJoin: false,
      allowChange: false,
      dangerousChanges: false,
      disableDoubleBye: false,
      lateJoinPoints: false,
    }
  );

  const allTieBreakOptions = [
    { value: 'direct', label: 'المواجهة المباشرة' },
    { value: 'median', label: 'Buchholz' },
    { value: 'buchholz1', label: 'Buchholz Cut 1' },
    { value: 'buchholzTotal', label: 'Buchholz Cut 2' },
    { value: 'koya', label: 'Koya System' }
  ];

  const getFilteredTieBreaks = () => {
    if (formData.playSystem === 'swiss') return allTieBreakOptions;
    if (formData.playSystem === 'round-robin')
      return allTieBreakOptions.filter(opt => ['direct', 'koya'].includes(opt.value));
    return [];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'playSystem' && value === 'knockout' ? { tieBreaks: [] } : {})
    }));
  };

  const handleMultiSelect = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      tieBreaks: selectedOptions.map(opt => opt.value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tournamentId = uuidv4();
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('ar-EG')}   ${now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;

    const newTournament = { id: tournamentId, ...formData };
    const listEntry = { id: tournamentId, name: formData.name, creationDate: timestamp, lastModified: timestamp };

    localStorage.setItem(`tournament-${tournamentId}`, JSON.stringify(newTournament));
    const allTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    allTournaments.push(listEntry);
    localStorage.setItem('tournaments', JSON.stringify(allTournaments));
    navigate(`/tournament/${tournamentId}`);
  };

  const handleSaveChanges = () => {
    if (!initialData?.id) return;
    const id = initialData.id;
    const updated = { ...formData, id };
    localStorage.setItem(`tournament-${id}`, JSON.stringify(updated));

    const date = new Date();
    const updatedList = (JSON.parse(localStorage.getItem('tournaments')) || []).map(t =>
      t.id === id
        ? { ...t, name: formData.name, lastModified: `${date.toLocaleDateString('ar-EG')}   ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}` }
        : t
    );
    localStorage.setItem('tournaments', JSON.stringify(updatedList));
    alert('تم حفظ التغييرات بنجاح!');
  };

  const handleDeleteTournament = () => {
    if (!initialData?.id) return;
    if (!window.confirm('هل أنت متأكد أنك تريد حذف البطولة؟')) return;

    const id = initialData.id;
    localStorage.removeItem(`tournament-${id}`);
    const filtered = (JSON.parse(localStorage.getItem('tournaments')) || []).filter(t => t.id !== id);
    localStorage.setItem('tournaments', JSON.stringify(filtered));

    alert('تم حذف البطولة بنجاح!');
    navigate('/mytournaments');
  };

  const handleCloneTournament = () => {
    if (!initialData) return;

    const newId = uuidv4();
    const cloned = { ...initialData, id: newId, name: `${initialData.name} (نسخة)` };
    const date = new Date();
    const timestamp = `${date.toLocaleDateString('ar-EG')}   ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;

    localStorage.setItem(`tournament-${newId}`, JSON.stringify(cloned));
    const updated = JSON.parse(localStorage.getItem('tournaments')) || [];
    updated.push({ id: newId, name: cloned.name, creationDate: timestamp, lastModified: timestamp });
    localStorage.setItem('tournaments', JSON.stringify(updated));

    alert('تم إنشاء نسخة من البطولة!');
    navigate(`/tournament/${newId}`);
  };

  const content = (
    <div dir="rtl" className="create-form-wrapper">
      <h2 className="form-title">{mode === 'edit' ? 'تعديل البطولة' : 'إنشاء بطولة'}</h2>

      <form className="tournament-form" onSubmit={handleSubmit}>
        {[
          { label: 'اسم البطولة', name: 'name', type: 'text' },
          {
            label: 'نظام اللعب', name: 'playSystem', type: 'select', options: [
              { value: '', label: 'اختر نظام اللعب', disabled: true, hidden: true },
              { value: 'swiss', label: 'Swiss Dutch FIDE (JaVaFo)' },
              { value: 'round-robin', label: 'Round Robin' },
              { value: 'knockout', label: 'Knock-Out' },
            ]
          },
          {
            label: 'نقاط كل مباراة', name: 'points', type: 'select', options: [
              { value: '', label: 'اختر النقاط', disabled: true, hidden: true },
              { value: 'standard', label: '1-0, 0-1, 0.5-0.5' },
              { value: 'winOnly', label: '1-0, 0-1' },
              { value: 'Arbitrary', label: 'Arbitrary' },
            ]
          },
          {
            label: 'قيمة الـ Bye', name: 'byeValue', type: 'select', options: [
              { value: '', label: 'اختر', disabled: true, hidden: true },
              { value: 'draw', label: 'تعادل' },
              { value: 'win', label: 'فوز' },
              { value: 'zero', label: 'خسارة' },
            ]
          },
          { label: 'عدد الجولات', name: 'totalRounds', type: 'number' },
        ].map((field, index) => (
          <div key={index} className="floating-group">
            {field.type === 'select' ? (
              <>
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="floating-input"
                  required
                >
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt.value} disabled={opt.disabled} hidden={opt.hidden}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <label className="floating-label">{field.label}</label>
              </>
            ) : (
              <>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="floating-input"
                  placeholder=" "
                  required
                />
                <label className="floating-label">{field.label}</label>
              </>
            )}
          </div>
        ))}

        {formData.playSystem !== 'knockout' && (
          <div className="floating-group react-select-group">
            <label className="floating-label">كسر التعادل</label>
            <div className="tie-breaks-select">
              <Select
                isMulti
                name="tieBreaks"
                options={getFilteredTieBreaks()}
                value={getFilteredTieBreaks().filter(opt => formData.tieBreaks.includes(opt.value))}
                onChange={handleMultiSelect}
                placeholder="اختر طرق كسر التعادل"
                classNamePrefix="select"
              />
            </div>
          </div>
        )}

        <div className="form-section">
          <h3>احتساب النقاط</h3>
          <label className="form-checkbox">
            <input
              type="checkbox"
              name="disableDoubleBye"
              checked={formData.disableDoubleBye}
              onChange={handleChange}
            />
            تعطيل Byes المكررة
          </label>
        </div>

        <div className="form-actions">
          <button
            type={mode === 'create' ? 'submit' : 'button'}
            className="btn btn-gold"
            onClick={mode === 'edit' ? handleSaveChanges : undefined}
          >
            {mode === 'edit' ? 'حفظ التغييرات' : 'إنشاء البطولة'}
          </button>

          {mode === 'edit' && (
            <>
              <button type="button" className="btn btn-outline" onClick={handleDeleteTournament}>🗑 حذف البطولة</button>
              <button type="button" className="btn btn-outline" onClick={handleCloneTournament}>📋 نسخ البطولة</button>
            </>
          )}
        </div>
      </form>
    </div>
  );

  return embedded ? content : (
    <>
      <Header username={username} />
      <PageContainer>{content}</PageContainer>
    </>
  );
}

export default CreateTournament;
