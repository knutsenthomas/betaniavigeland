import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { Link } from 'react-router-dom';

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

const MONTH_NAMES = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

const CATEGORY_COLORS = {
  'Gudstjeneste': {
    bg: 'bg-[#1B4965]/10',
    text: 'text-[#1B4965]',
    dot: 'bg-[#1B4965]',
    border: 'border-[#1B4965]/20'
  },
  'Ungdom': {
    bg: 'bg-[#d17d39]/10',
    text: 'text-[#d17d39]',
    dot: 'bg-[#d17d39]',
    border: 'border-[#d17d39]/20'
  },
  'Barn': {
    bg: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200'
  },
  'Annet': {
    bg: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
    border: 'border-slate-200'
  }
};

export default function CalendarMonth() {
  const { events } = useContent();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activePopupEvent, setActivePopupEvent] = useState(null);
  const [calendarAlert, setCalendarAlert] = useState(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Handle escape key to close popup modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePopupEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Generate calendar grid data
  const gridCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday is 6

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // Previous month padding cells
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      cells.push({
        date: prevDate,
        dayNum,
        isCurrentMonth: false,
        key: `prev-${dayNum}`
      });
    }

    // Current month cells
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      cells.push({
        date,
        dayNum: i,
        isCurrentMonth: true,
        key: `curr-${i}`
      });
    }

    // Next month padding cells to fill the grid
    const totalCells = cells.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      cells.push({
        date: nextDate,
        dayNum: i,
        isCurrentMonth: false,
        key: `next-${i}`
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // 2. Filter events occurring in the current grid cells
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(event => {
      if (!event.startDate) return;
      const dateKey = event.startDate.split('T')[0]; // Format: YYYY-MM-DD
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(event);
    });
    return map;
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
  };

  // Helper to format date keys
  const getDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Check if a cell date is "today"
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Selected date key for active highlight
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : null;

  // Selected day's events
  const selectedDayEvents = selectedDateKey ? (eventsByDate[selectedDateKey] || []) : [];

  // All events in the current month to show below calendar if no day is selected
  const currentMonthEvents = useMemo(() => {
    return events.filter(event => {
      if (!event.startDate) return false;
      const date = new Date(event.startDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [events, currentMonth, currentYear]);

  const handleAddToCalendar = (eventTitle) => {
    setCalendarAlert(`"${eventTitle}" ble lagt til i kalenderen din!`);
    setTimeout(() => setCalendarAlert(null), 3000);
  };

  return (
    <main className="pt-32 pb-section-gap-lg bg-background min-h-screen relative">
      {/* Toast Alert for calendar action */}
      <AnimatePresence>
        {calendarAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-4 rounded-xl shadow-2xl z-[110] flex items-center gap-3 border border-primary-container"
          >
            <span className="material-symbols-outlined text-secondary-container">check_circle</span>
            <span className="font-label-md text-label-md">{calendarAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Modal for Event Details */}
      <AnimatePresence>
        {activePopupEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with fade-in and blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePopupEvent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card with scale-up entry */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white border border-surface-container rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full flex flex-col relative z-10 max-h-[90vh]"
            >
              {/* Event Image Banner */}
              {activePopupEvent.image && (
                <div 
                  className="h-52 w-full relative bg-cover bg-center shrink-0 border-b border-surface-container"
                  style={{ backgroundImage: `url('${activePopupEvent.image}')` }}
                >
                  {/* Floating Close Button */}
                  <button
                    onClick={() => setActivePopupEvent(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white text-primary rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-105 active:scale-95 transition-all shadow-md focus:outline-none"
                    aria-label="Lukk"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              )}

              {/* Event details */}
              <div className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1">
                {/* Close button if no image is present */}
                {!activePopupEvent.image && (
                  <button
                    onClick={() => setActivePopupEvent(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-surface-container hover:bg-surface-container-high text-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none"
                    aria-label="Lukk"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    (CATEGORY_COLORS[activePopupEvent.category] || CATEGORY_COLORS['Annet']).bg
                  } ${
                    (CATEGORY_COLORS[activePopupEvent.category] || CATEGORY_COLORS['Annet']).text || 'text-slate-800'
                  } border ${
                    (CATEGORY_COLORS[activePopupEvent.category] || CATEGORY_COLORS['Annet']).border || 'border-slate-200'
                  }`}>
                    {activePopupEvent.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] translate-y-[-0.5px]">calendar_today</span>
                    <span>{activePopupEvent.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider border-l border-surface-container-highest pl-3">
                    <span className="material-symbols-outlined text-[16px] translate-y-[-0.5px]">schedule</span>
                    <span>{activePopupEvent.time}</span>
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-headline font-bold text-primary leading-snug">
                  {activePopupEvent.title}
                </h2>

                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {activePopupEvent.description || 'Ingen ytterligere beskrivelse tilgjengelig.'}
                </p>
                
                {/* Actions */}
                <div className="pt-2">
                  <button
                    onClick={() => setActivePopupEvent(null)}
                    className="w-full py-3.5 bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] flex items-center justify-center"
                  >
                    Lukk
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-container-max mx-auto px-gutter">
        
        {/* Header Branding */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link 
              to="/hva-skjer"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors mb-3 group"
            >
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
              Tilbake til aktiviteter
            </Link>
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Månedsoversikt</h1>
          </div>
          
          {/* Calendar Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Calendar Month Navigation Control */}
            <div className="flex items-center gap-3 bg-surface-cream border border-surface-container rounded-2xl p-1.5">
              <button 
                onClick={handlePrevMonth}
                className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-container rounded-xl transition-colors active:scale-95"
                aria-label="Forrige måned"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="font-label-md text-label-md font-bold text-primary min-w-[140px] text-center uppercase tracking-wider">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <button 
                onClick={handleNextMonth}
                className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-container rounded-xl transition-colors active:scale-95"
                aria-label="Neste måned"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* View Switcher Toggle */}
            <div className="flex items-center bg-surface-cream border border-surface-container rounded-2xl p-1 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">calendar_view_month</span>
                <span className="hidden sm:inline">Kalender</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] ${
                  viewMode === 'list'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                <span className="hidden sm:inline">Oversikt</span>
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <>
            {/* Calendar Card Grid Container */}
            <div className="bg-white border border-surface-container rounded-3xl p-4 md:p-6 shadow-sm mb-12 animate-fadeIn">
              
              {/* Grid Layout Headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEKDAYS.map((day) => (
                  <div 
                    key={day} 
                    className="font-bold text-xs uppercase tracking-widest py-3 text-on-surface-variant/60"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {gridCells.map((cell) => {
                  const dateKey = getDateKey(cell.date);
                  const dayEvents = eventsByDate[dateKey] || [];
                  const cellIsToday = isToday(cell.date);
                  const cellIsSelected = selectedDateKey === dateKey;

                  return (
                    <button
                      key={cell.key}
                      onClick={() => {
                        if (cellIsSelected) {
                          setSelectedDate(null); // Toggle off
                        } else {
                          setSelectedDate(cell.date);
                        }
                      }}
                      className={`min-h-[75px] md:min-h-[110px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all group relative ${
                        cell.isCurrentMonth
                          ? 'bg-surface-cream/30 hover:bg-surface-cream/70 border-surface-container/60'
                          : 'bg-surface-cream/10 border-transparent opacity-40 hover:opacity-75'
                      } ${cellIsToday ? 'ring-2 ring-primary ring-offset-2' : ''} ${
                        cellIsSelected ? 'bg-secondary/10 border-secondary/50 hover:bg-secondary/10 shadow-sm' : ''
                      }`}
                    >
                      {/* Day Number */}
                      <div className="flex justify-between items-start w-full">
                        <span className={`text-xs md:text-sm font-bold rounded-lg w-6 h-6 flex items-center justify-center transition-colors ${
                          cellIsToday
                            ? 'bg-primary text-white font-bold'
                            : cellIsSelected 
                              ? 'bg-secondary text-white font-bold'
                              : 'text-primary'
                        }`}>
                          {cell.dayNum}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="md:hidden flex gap-0.5 mt-1">
                            {dayEvents.slice(0, 3).map((evt, idx) => {
                              const theme = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Annet'];
                              return (
                                <span 
                                  key={idx} 
                                  className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}
                                />
                              );
                            })}
                          </span>
                        )}
                      </div>

                      {/* Desktop Event Badges */}
                      <div className="hidden md:flex flex-col gap-1.5 w-full mt-2 overflow-hidden flex-1 justify-end">
                        {dayEvents.slice(0, 2).map((evt) => {
                          const theme = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Annet'];
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid selecting cell date
                                setActivePopupEvent(evt);
                              }}
                              className={`text-[10px] font-label-md font-bold px-2 py-1 rounded-lg border truncate w-full flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-transform ${theme.bg} ${theme.text || 'text-slate-800'} ${theme.border || 'border-slate-200'}`}
                              title={`${evt.time} - ${evt.title}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dot}`} />
                              <span className="truncate">{evt.title}</span>
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] font-bold text-on-surface-variant/60 pl-2">
                            + {dayEvents.length - 2} flere
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Events Title & Section below Grid */}
            <section className="w-full">
              <div className="border-b border-surface-container pb-4 mb-8 flex justify-between items-end">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {selectedDate 
                    ? `Aktiviteter ${selectedDate.getDate()}. ${MONTH_NAMES[selectedDate.getMonth()]}`
                    : `Aktiviteter i ${MONTH_NAMES[currentMonth]}`
                  }
                </h2>
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="text-xs font-bold uppercase tracking-wider text-secondary hover:underline underline-offset-4"
                  >
                    Vis alle i måneden
                  </button>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {selectedDate ? (
                  selectedDayEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDayEvents.map((evt, idx) => (
                        <EventCardDetail 
                          key={evt.id || idx} 
                          event={evt} 
                          onClick={() => setActivePopupEvent(evt)}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-surface-cream/30 border border-dashed border-surface-container rounded-3xl p-12 text-center text-on-surface-variant/60"
                    >
                      <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-3 select-none">event_busy</span>
                      <p className="font-body-md text-sm font-semibold">Ingen registrerte aktiviteter denne dagen.</p>
                    </motion.div>
                  )
                ) : (
                  currentMonthEvents.length > 0 ? (
                    <div className="space-y-4">
                      {currentMonthEvents.map((evt, idx) => (
                        <EventCardDetail 
                          key={evt.id || idx} 
                          event={evt} 
                          onClick={() => setActivePopupEvent(evt)}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-surface-cream/30 border border-dashed border-surface-container rounded-3xl p-12 text-center text-on-surface-variant/60"
                    >
                      <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-3 select-none">event_busy</span>
                      <p className="font-body-md text-sm font-semibold">Ingen registrerte aktiviteter for denne måneden.</p>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </section>
          </>
        ) : (
          /* List / Overview (Agenda) View Mode */
          <div className="bg-white border border-surface-container rounded-3xl p-6 md:p-8 shadow-sm mb-12 w-full animate-fadeIn">
            {currentMonthEvents.length > 0 ? (
              <div className="divide-y divide-surface-container/60">
                {currentMonthEvents.map((evt, idx) => {
                  const theme = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Annet'];
                  const dateObj = new Date(evt.startDate);
                  const dayName = dateObj.toLocaleDateString('no-NO', { weekday: 'long' });
                  const niceDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                  
                  return (
                    <div 
                      key={evt.id || idx} 
                      onClick={() => setActivePopupEvent(evt)}
                      className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-6 md:items-start group cursor-pointer"
                    >
                      {/* Left Date Column */}
                      <div className="w-24 shrink-0 flex flex-col">
                        <span className="text-3xl font-headline font-bold text-primary group-hover:text-secondary transition-colors leading-none">
                          {dateObj.getDate()}
                        </span>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant/70 mt-1.5">
                          {MONTH_NAMES[dateObj.getMonth()].slice(0, 3)}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/40 mt-0.5">
                          {niceDayName}
                        </span>
                      </div>
                      
                      {/* Right Content Column */}
                      <div className="flex-1 flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${theme.bg} ${theme.text || 'text-slate-800'} border ${theme.border || 'border-slate-200'}`}>
                              {evt.category}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-secondary uppercase tracking-wider">
                              <span className="material-symbols-outlined text-[14px] translate-y-[-0.5px]">schedule</span>
                              <span>{evt.time}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">{evt.title}</h3>
                          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-2xl">{evt.description}</p>
                        </div>
                        
                        {/* Event Image Preview */}
                        {evt.image && (
                          <div 
                            className="w-28 h-20 bg-cover bg-center rounded-2xl shrink-0 overflow-hidden shadow-sm self-start sm:self-auto border border-surface-container"
                            style={{ backgroundImage: `url('${evt.image}')` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-on-surface-variant/60">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-3 select-none">event_busy</span>
                <p className="font-body-md text-sm font-semibold">Ingen registrerte aktiviteter for denne måneden.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

/* Detail Card helper component */
function EventCardDetail({ event, onClick }) {
  const theme = CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Annet'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="bg-surface-cream border border-surface-container rounded-3xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 hover:shadow-md transition-all duration-300 cursor-pointer hover:border-primary/20 active:scale-[0.99]"
    >
      {/* Category Accent and Image snippet */}
      {event.image && (
        <div className="w-full sm:w-28 h-20 bg-cover bg-center rounded-2xl shrink-0 overflow-hidden border border-surface-container" style={{ backgroundImage: `url('${event.image}')` }} />
      )}
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${theme.bg} ${theme.text || 'text-slate-800'} border ${theme.border || 'border-slate-200'}`}>
              {event.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-secondary uppercase tracking-wider ml-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{event.time}</span>
            </div>
          </div>
          
          <h3 className="font-headline-sm text-base md:text-lg font-bold text-primary mb-1.5 group-hover:text-secondary">{event.title}</h3>
          <p className="text-[13px] text-on-surface-variant leading-relaxed line-clamp-2">{event.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
