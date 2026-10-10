import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Clock, 
  Edit3, 
  Layers
} from 'lucide-react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function OutfitCalendar({ 
  calendarPlans, 
  savedOutfits, 
  wardrobe, 
  onSavePlan, 
  onDeletePlan,
  onNavigateToStudio
}) {
  // We can default to current date
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateKey(today));
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // Modal state when editing a day's outfit
  const [modalOutfitId, setModalOutfitId] = useState('');
  const [modalNote, setModalNote] = useState('');

  // Helper format YYYY-MM-DD with local time
  function formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Helper to resolve an outfit by its ID
  const getOutfit = (id) => savedOutfits.find(o => o.id === id);
  // Helper to resolve an item by its ID
  const getItem = (id) => wardrobe.find(i => i.id === id);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDateStr(formatDateKey(now));
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      days.push({
        dayNumber: dayNum,
        dateKey: formatDateKey(prevDate),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      days.push({
        dayNumber: d,
        dateKey: formatDateKey(date),
        isCurrentMonth: true
      });
    }

    // Next month padding to fill grid to multiple of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const nextDate = new Date(currentYear, currentMonth + 1, j);
      days.push({
        dayNumber: j,
        dateKey: formatDateKey(nextDate),
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Click on a calendar day
  const handleDayClick = (dateKey) => {
    setSelectedDateStr(dateKey);
    const existing = calendarPlans[dateKey];
    if (existing) {
      setModalOutfitId(existing.outfitId);
      setModalNote(existing.note || '');
    } else {
      setModalOutfitId(savedOutfits.length > 0 ? savedOutfits[0].id : '');
      setModalNote('');
    }
    setIsDayModalOpen(true);
  };

  // Save plan for date
  const handleSaveModalPlan = (e) => {
    e.preventDefault();
    if (!modalOutfitId) {
      alert('Please select an outfit to schedule!');
      return;
    }
    onSavePlan(selectedDateStr, {
      outfitId: modalOutfitId,
      note: modalNote.trim()
    });
    setIsDayModalOpen(false);
  };

  // Remove plan
  const handleRemoveModalPlan = () => {
    onDeletePlan(selectedDateStr);
    setIsDayModalOpen(false);
  };

  // Upcoming scheduled outfits summary
  const upcomingList = useMemo(() => {
    const entries = Object.entries(calendarPlans)
      .filter(([dateKey]) => dateKey >= formatDateKey(today))
      .sort(([a], [b]) => a.localeCompare(b));
    return entries.slice(0, 5);
  }, [calendarPlans]);

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateStr) return '';
    const [y, m, d] = selectedDateStr.split('-');
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, [selectedDateStr]);

  const todayStr = formatDateKey(today);

  return (
    <div className="calendar-section">
      {/* Top Banner */}
      <div className="calendar-hero">
        <div className="hero-text-content">
          <span className="hero-subhead">STYLE AGENDA & PLANNER</span>
          <h2 className="serif-font hero-title">Outfit Calendar</h2>
          <p className="hero-description">
            Schedule your looks for upcoming classes, dates, presentations, and weekend parties. Say goodbye to morning outfit stress.
          </p>
        </div>

        <div className="calendar-hero-controls">
          <button className="btn btn-secondary" onClick={jumpToToday}>
            Today
          </button>
          <div className="month-switcher">
            <button className="btn-icon" onClick={prevMonth} title="Previous Month">
              <ChevronLeft size={18} />
            </button>
            <h3 className="serif-font current-month-label">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <button className="btn-icon" onClick={nextMonth} title="Next Month">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-layout-wrapper">
        {/* Main Calendar Grid */}
        <div className="calendar-card">
          {/* Day of Week Headers */}
          <div className="calendar-week-header">
            {DAYS_OF_WEEK.map((day, idx) => (
              <div key={idx} className="week-day-cell">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="calendar-days-grid">
            {calendarDays.map((dayObj, idx) => {
              const isToday = dayObj.dateKey === todayStr;
              const plan = calendarPlans[dayObj.dateKey];
              const plannedOutfit = plan ? getOutfit(plan.outfitId) : null;

              return (
                <div
                  key={idx}
                  className={`calendar-day-cell ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''} ${plan ? 'has-plan' : ''}`}
                  onClick={() => handleDayClick(dayObj.dateKey)}
                >
                  <div className="day-cell-top">
                    <span className={`day-number ${isToday ? 'today-badge' : ''}`}>
                      {dayObj.dayNumber}
                    </span>
                    {isToday && <span className="today-label">TODAY</span>}
                  </div>

                  {plannedOutfit ? (
                    <div className="planned-outfit-preview">
                      <div className="plan-badge-row">
                        <span className={`badge-occasion plan-occ-tag ${plannedOutfit.occasion}`}>
                          {plannedOutfit.occasion}
                        </span>
                      </div>
                      <span className="plan-outfit-name" title={plannedOutfit.name}>
                        {plannedOutfit.name}
                      </span>
                      {plan.note && (
                        <span className="plan-note-snippet" title={plan.note}>
                          📝 {plan.note}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="empty-day-hover-cue">
                      <Plus size={14} />
                      <span>Plan look</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming Looks */}
        <div className="calendar-sidebar">
          <div className="sidebar-card">
            <h3 className="serif-font sidebar-title">Upcoming Schedule</h3>
            <p className="sidebar-subtitle">Your planned outfits for the days ahead.</p>

            {upcomingList.length > 0 ? (
              <div className="upcoming-list">
                {upcomingList.map(([dateKey, plan]) => {
                  const outfit = getOutfit(plan.outfitId);
                  if (!outfit) return null;
                  const [y, m, d] = dateKey.split('-');
                  const dateLabel = new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short'
                  });

                  return (
                    <div 
                      key={dateKey} 
                      className="upcoming-item-card"
                      onClick={() => handleDayClick(dateKey)}
                    >
                      <div className="upcoming-date-pill">
                        <CalendarIcon size={13} />
                        <span>{dateLabel}</span>
                      </div>
                      <div className="upcoming-details">
                        <h5 className="upcoming-outfit-name">{outfit.name}</h5>
                        <span className={`badge-occasion ${outfit.occasion}`}>
                          {outfit.occasion}
                        </span>
                        {plan.note && (
                          <p className="upcoming-note">{plan.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-upcoming-box">
                <p>No outfits scheduled yet for upcoming days.</p>
                <p className="empty-hint">Click any day on the calendar to plan what to wear!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Day Plan Modal */}
      {isDayModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDayModalOpen(false)}>
          <div className="modal-content calendar-plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-sparkle">📅</span>
                <h3 className="serif-font modal-title">
                  Plan for {selectedDateFormatted}
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setIsDayModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSaveModalPlan}>
              <div className="modal-body">
                {savedOutfits.length === 0 ? (
                  <div className="no-outfits-prompt">
                    <p>You haven't created or saved any outfits yet.</p>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => {
                        setIsDayModalOpen(false);
                        onNavigateToStudio();
                      }}
                    >
                      <Layers size={16} /> Go to Outfit Studio
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Outfit Selector */}
                    <div className="form-group">
                      <label className="form-label">Select Outfit to Wear</label>
                      <div className="calendar-outfit-picker-list">
                        {savedOutfits.map(outfit => {
                          const isSelected = modalOutfitId === outfit.id;
                          return (
                            <div
                              key={outfit.id}
                              className={`calendar-picker-outfit-card ${isSelected ? 'active' : ''}`}
                              onClick={() => setModalOutfitId(outfit.id)}
                            >
                              <div className="card-radio-indicator">
                                {isSelected ? <Check size={14} /> : null}
                              </div>
                              <div className="card-outfit-info">
                                <h4 className="picker-outfit-title">{outfit.name}</h4>
                                <span className={`badge-occasion ${outfit.occasion}`}>
                                  {outfit.occasion}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preview of chosen outfit */}
                    {modalOutfitId && (
                      <div className="selected-outfit-preview-box">
                        <span className="box-label">Included Pieces:</span>
                        <div className="box-pieces-row">
                          {(() => {
                            const chosen = getOutfit(modalOutfitId);
                            if (!chosen) return null;
                            const pieces = [
                              chosen.items?.top && getItem(chosen.items.top),
                              chosen.items?.bottom && getItem(chosen.items.bottom),
                              chosen.items?.dress && getItem(chosen.items.dress),
                              chosen.items?.shoes && getItem(chosen.items.shoes),
                              chosen.items?.accessory && getItem(chosen.items.accessory)
                            ].filter(Boolean);

                            return pieces.map((p, i) => (
                              <div key={i} className="mini-piece-chip">
                                <img src={p.image} alt={p.name} className="mini-piece-img" />
                                <span>{p.name}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Day Note / Event */}
                    <div className="form-group">
                      <label className="form-label">Occasion / Event Note</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Morning 9am Chemistry Exam, Sunset Dinner..."
                        value={modalNote}
                        onChange={(e) => setModalNote(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                {calendarPlans[selectedDateStr] && (
                  <button
                    type="button"
                    className="btn btn-secondary delete-plan-btn"
                    onClick={handleRemoveModalPlan}
                  >
                    <Trash2 size={15} /> Remove from Calendar
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDayModalOpen(false)}
                >
                  Cancel
                </button>
                {savedOutfits.length > 0 && (
                  <button type="submit" className="btn btn-primary">
                    <Sparkles size={16} /> Save Plan
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
