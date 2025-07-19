// src/pages/CreateTournament.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import PageContainer from '../Components/ThePageContainers/PageContainer';
import Header from '../Components/TheHeaders/Header';
import './CreateTournament.css';

function CreateTournament({ mode = 'create', initialData = null, embedded = false }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'المستخدم';

  // ----------------------------------
  // State: موحدين الأسماء مع الـ API
  // ----------------------------------
  const [formData, setFormData] = useState(() => ({
    name: '',
    city: 'Jerusalem',
    country: 'Israel',
    Date: '',
    organizerName: '',
    organizerFideId: '',
    playSystem: 'swiss',
    points: 'standard',
    byeValue: 'win',
    totalRounds: 5,
    numOfPlayers: '',
    tieBreaks: ['direct', 'Buchholz Cut 1', 'Buchholz'],
    allowJoin: false,
    allowChange: false,
    dangerousChanges: false,
    disableDoubleBye: false,
    lateJoinPoints: false,
    ...(initialData || {})
  }));

  const allTieBreakOptions = [
    { value: 'direct', label: 'المواجهة المباشرة' },
    { value: 'Buchholz Cut 1', label: 'Buchholz Cut 1' },
    { value: 'Buchholz', label: 'Buchholz' }
  ];

  const getFilteredTieBreaks = () => {
    if (formData.playSystem === 'swiss') return allTieBreakOptions;
    if (formData.playSystem === 'round-robin')
      return allTieBreakOptions.filter(opt => ['direct', 'Buchholz'].includes(opt.value));
    return [];
  };

  // ----------------------------------
  // Handle field changes + validations
  // ----------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validation: تاريخ لا يقل عن اليوم
    if (name === 'Date') {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        alert('خطأ في إدخال التاريخ');
        return;
      }
    }

    // Validation: عدد اللاعبين
    if (name === 'numOfPlayers') {
      if (value !== '' && !/^[1-9][0-9]*$/.test(value)) {
        alert('عدد اللاعبين يجب أن يكون رقم صحيح أكبر من صفر.');
        return;
      }
    }

    // Validation: عدد الجولات
    if (name === 'totalRounds') {
      if (!/^[1-9][0-9]*$/.test(value)) {
        alert('عدد الجولات يجب أن يكون رقم صحيح أكبر من صفر.');
        return;
      }
    }

    // Validation: نصوص (عربي أو إنجليزي)
    if (['city', 'country', 'organizerName'].includes(name)) {
      if (!/^[\u0600-\u06FFa-zA-Z ]+$/.test(value)) {
        alert('هذا الحقل يجب أن يحتوي على أحرف عربية أو إنجليزية فقط.');
        return;
      }
    }

    // Validation: FIDE ID من 8 أرقام
    if (name === 'organizerFideId') {
      if (!/^[0-9]{8}$/.test(value)) {
        alert('الرقم الدولي للمنظم يجب أن يكون 8 أرقام.');
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      tieBreaks: selectedOptions.map(opt => opt.value),
    }));
  };

  // ----------------------------------
  // Create new tournament
  // ----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          city: formData.city,
          country: formData.country,
          startDate: formData.Date,
          endDate: formData.Date,
          rounds: formData.totalRounds,
          numPlayers: formData.numOfPlayers,
          type: 'Individual Swiss Dutch',
          byeValue:
            formData.byeValue === 'win'
              ? 1
              : formData.byeValue === 'draw'
              ? 0.5
              : 0,
          tieBreakers: formData.tieBreaks,
          organizerName: formData.organizerName,
          organizerFideId: formData.organizerFideId
        })
      });

      if (!response.ok) throw new Error('Failed to create tournament');

      const created = await response.json(); // يحتوي على الـ id والبيانات المحفوظة
      const tournamentId = created.id;

      // حفظ سريع في localStorage لصفحة My Tournaments
      const now = new Date();
      const stamp = `${now.toLocaleDateString('ar-EG')} ${now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
      const list = JSON.parse(localStorage.getItem('tournaments')) || [];
      list.push({
        id: tournamentId,
        name: formData.name,
        creationDate: stamp,
        lastModified: stamp
      });
      localStorage.setItem('tournaments', JSON.stringify(list));

      navigate(`/tournament/${tournamentId}`);
    } catch (err) {
      console.error('Error creating tournament:', err);
      alert('فشل في إنشاء البطولة. حاول مرة أخرى.');
    }
  };

  // ----------------------------------
  // Update existing tournament
  // ----------------------------------
const handleSaveChanges = async () => {
  if (!initialData?.id) return;
  try {
    const res = await fetch(`http://localhost:8081/api/tournaments/${initialData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        city: formData.city,
        country: formData.country,
        startDate: formData.Date,
        endDate: formData.Date,
        rounds: formData.totalRounds,
        numPlayers: formData.numOfPlayers,
        type: 'Individual Swiss Dutch',
        byeValue:
          formData.byeValue === 'win'   ? 1
        : formData.byeValue === 'draw'  ? 0.5
        : 0,
        tieBreakers: formData.tieBreaks,
        organizerName: formData.organizerName,
        organizerFideId: Number(formData.organizerFideId)
      })
    });
    if (!res.ok) throw new Error();
    alert('تم حفظ التغييرات بنجاح!');
  } catch {
    alert('فشل في حفظ التغييرات.');
  }
};

  // ----------------------------------
  // حذف البطولة من localStorage فقط
  // ----------------------------------
  const handleDeleteTournament = () => {
    if (!initialData?.id) return;
    if (!window.confirm('هل أنت متأكد أنك تريد حذف البطولة؟')) return;

    const id = initialData.id;
    const filtered = (JSON.parse(localStorage.getItem('tournaments')) || []).filter(
      t => t.id !== id
    );
    localStorage.setItem('tournaments', JSON.stringify(filtered));

    alert('تم حذف البطولة بنجاح!');
    navigate('/mytournaments');
  };

  // ----------------------------------
  // استنساخ البطولة في localStorage فقط
  // ----------------------------------
  const handleCloneTournament = () => {
    if (!initialData) return;

    const newId = uuidv4();
    const cloned = { ...initialData, id: newId, name: `${initialData.name} (نسخة)` };
    const now = new Date();
    const stamp = `${now.toLocaleDateString('ar-EG')} ${now.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;

    const list = JSON.parse(localStorage.getItem('tournaments')) || [];
    list.push({ id: newId, name: cloned.name, creationDate: stamp, lastModified: stamp });
    localStorage.setItem('tournaments', JSON.stringify(list));

    alert('تم إنشاء نسخة من البطولة!');
    navigate(`/tournament/${newId}`);
  };

  // ----------------------------------
  // JSX
  // ----------------------------------
  const content = (
    <div dir="rtl" className="create-form-wrapper">
      <h2 className="form-title">
        {mode === 'edit' ? 'تعديل البطولة' : 'إنشاء بطولة'}
      </h2>
      <form className="tournament-form" onSubmit={mode === 'create' ? handleSubmit : e => e.preventDefault()}>
        {[
          { label: 'اسم البطولة', name: 'name', type: 'text' },
          { label: 'المدينة', name: 'city', type: 'text' },
          { label: 'الدولة', name: 'country', type: 'text' },
          { label: 'تاريخ البطولة', name: 'Date', type: 'date' },
          { label: 'اسم المنظّم', name: 'organizerName', type: 'text' },
          { label: 'الرقم الدولي للمنظّم', name: 'organizerFideId', type: 'text' },
          {
            label: 'نظام اللعب', name: 'playSystem', type: 'select', options: [
              { value: 'swiss', label: 'Swiss Dutch FIDE (JaVaFo)' },
              { value: 'round-robin', label: 'Round Robin' },
              { value: 'knockout', label: 'Knock-Out' }
            ]
          },
          {
            label: 'نقاط كل مباراة', name: 'points', type: 'select', options: [
              { value: 'standard', label: '1-0, 0-1, 0.5-0.5' },
              { value: 'winOnly', label: '1-0, 0-1' },
              { value: 'Arbitrary', label: 'Arbitrary' }
            ]
          },
          {
            label: 'قيمة الـ Bye', name: 'byeValue', type: 'select', options: [
              { value: '', label: 'اختر', disabled: true, hidden: true },
              { value: 'draw', label: 'تعادل' },
              { value: 'win', label: 'فوز' },
              { value: 'zero', label: 'خسارة' }
            ]
          },
          { label: 'عدد الجولات', name: 'totalRounds', type: 'number' },
          { label: 'عدد اللاعبين', name: 'numOfPlayers', type: 'number' }
        ].map((field, idx) => (
          <div key={idx} className="floating-group">
            {field.type === 'select' ? (
              <>
                <select
                  name={field.name}
                  value={formData[field.name] ?? ''}
                  onChange={handleChange}
                  className="floating-input"
                  required
                >
                  {field.options.map((opt, i) => (
                    <option
                      key={i}
                      value={opt.value}
                      disabled={opt.disabled}
                      hidden={opt.hidden}
                    >
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
                  value={formData[field.name] ?? ''}
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
                value={getFilteredTieBreaks().filter(opt =>
                  formData.tieBreaks.includes(opt.value)
                )}
                onChange={handleMultiSelect}
                placeholder="اختر طرق كسر التعادل"
                classNamePrefix="select"
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type={mode === 'create' ? 'submit' : 'button'}
            className="btn btn-gold"
            onClick={mode === 'edit' ? handleSaveChanges : undefined}
          >
            {mode === 'edit' ? 'حفظ التغييرات' : 'إنشاء البطولة'}
          </button>
          {mode === 'edit' && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleDeleteTournament}
            >
              حذف البطولة
            </button>
          )}
        </div>
      </form>
    </div>
  );

  return embedded ? (
    content
  ) : (
    <>
      <Header username={username} />
      <PageContainer>{content}</PageContainer>
    </>
  );
}

export default CreateTournament;
