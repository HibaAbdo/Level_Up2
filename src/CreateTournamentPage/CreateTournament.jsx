import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import './CreateTournament.css';
import logo from '../assets/logoshah.png';

function CreateTournament({ mode = 'create', initialData = null }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() =>
    initialData ? { ...initialData } : {
      name: '',
      playSystem: '',
      points: '',
      byeValue: '',
      totalRounds: 5,
      tieBreaks: [],
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
  
    const newTournament = {
      id: tournamentId,
      ...formData,
    };
  
    const listEntry = {
      id: tournamentId,
      name: formData.name,
      creationDate: timestamp,
      lastModified: timestamp,
    };
  
    localStorage.setItem(`tournament-${tournamentId}`, JSON.stringify(newTournament));
  
    const allTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    allTournaments.push(listEntry);
    localStorage.setItem('tournaments', JSON.stringify(allTournaments));
  
    // ✅ Navigate to the tournament dashboard
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
    const cloned = {
      ...initialData,
      id: newId,
      name: `${initialData.name} (نسخة)`,
    };

    const date = new Date();
    const timestamp = `${date.toLocaleDateString('ar-EG')}   ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;

    localStorage.setItem(`tournament-${newId}`, JSON.stringify(cloned));
    const updated = JSON.parse(localStorage.getItem('tournaments')) || [];
    updated.push({ id: newId, name: cloned.name, creationDate: timestamp, lastModified: timestamp });
    localStorage.setItem('tournaments', JSON.stringify(updated));

    alert('تم إنشاء نسخة من البطولة!');
    navigate(`/tournament/${newId}`);
  };

  return (
    <div className="create-container" dir="rtl">
      <div className="form-logo-wrapper">
        <img src={logo} alt="شطرنج القدس" className="form-logo" />
      </div>

      <h2 className="form-title">{mode === 'edit' ? 'تعديل البطولة' : 'إنشاء بطولة'}</h2>

      <form className="tournament-form" onSubmit={handleSubmit}>
        {/* Floating Inputs */}
        <div className="floating-group">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder=" " required className="floating-input" />
          <label className="floating-label">اسم البطولة</label>
        </div>

        <div className="floating-group">
          <select name="playSystem" value={formData.playSystem} onChange={handleChange} required className="floating-input">
            <option value="" disabled hidden>اختر نظام اللعب</option>
            <option value="swiss">Swiss Dutch FIDE (JaVaFo)</option>
            <option value="round-robin">Round Robin</option>
            <option value="knockout">Knock-Out</option>
          </select>
          <label className="floating-label">نظام اللعب</label>
        </div>

        <div className="floating-group">
          <select name="points" value={formData.points} onChange={handleChange} required className="floating-input">
            <option value="" disabled hidden>اختر النقاط</option>
            <option value="standard">1-0, 0-1, 0.5-0.5</option>
            <option value="winOnly">1-0, 0-1</option>
            <option value="Arbitrary">Arbitrary</option>
          </select>
          <label className="floating-label">نقاط كل مباراة</label>
        </div>

        <div className="floating-group">
          <select name="byeValue" value={formData.byeValue} onChange={handleChange} required className="floating-input">
            <option value="" disabled hidden>اختر</option>
            <option value="draw">تعادل</option>
            <option value="win">فوز</option>
            <option value="zero">خسارة</option>
          </select>
          <label className="floating-label">قيمة الـ Bye</label>
        </div>

        <div className="floating-group">
          <input type="number" name="totalRounds" min="1" value={formData.totalRounds} onChange={handleChange} placeholder=" " required className="floating-input" />
          <label className="floating-label">عدد الجولات</label>
        </div>

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
          <h3>تعديلات</h3>
          <label className="form-checkbox">
            <input type="checkbox" name="allowJoin" checked={formData.allowJoin} onChange={handleChange} />
            السماح للاعبين بالانضمام
          </label>
          <label className="form-checkbox">
            <input type="checkbox" name="allowChange" checked={formData.allowChange} onChange={handleChange} />
            السماح بتغيير النتائج
          </label>
          <label className="form-checkbox">
            <input type="checkbox" name="dangerousChanges" checked={formData.dangerousChanges} onChange={handleChange} />
            السماح بتغييرات خطيرة
          </label>
        </div>

        <div className="form-section">
          <h3>احتساب النقاط</h3>
          <label className="form-checkbox">
            <input type="checkbox" name="disableDoubleBye" checked={formData.disableDoubleBye} onChange={handleChange} />
            تعطيل Byes المكررة
          </label>
          <label className="form-checkbox">
            <input type="checkbox" name="lateJoinPoints" checked={formData.lateJoinPoints} onChange={handleChange} />
            احتساب نقاط للمنضمين المتأخرين
          </label>
        </div>

        <div className="form-actions">
          <button type={mode === 'create' ? 'submit' : 'button'} className="form-submit" onClick={mode === 'edit' ? handleSaveChanges : undefined}>
            {mode === 'edit' ? 'حفظ التغييرات' : 'إنشاء البطولة'}
          </button>

          {mode === 'edit' && (
            <>
              <button type="button" className="delete-button" onClick={handleDeleteTournament}>حذف البطولة</button>
              <button type="button" className="clone-button" onClick={handleCloneTournament}>نسخ البطولة</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateTournament;
