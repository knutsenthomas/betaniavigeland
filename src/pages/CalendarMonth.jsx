import React, { useState, useMemo } from 'react';
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

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 1. Generate calendar grid data
  const gridCells = useMemo(() => {
    // First day of current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // Get day index (0 = Monday, 6 = Sunday)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday is 6

    // Total days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Total days in previous month
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

    // Next month padding cells to fill the grid (normally 42 cells total for 6 rows)
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

  return (
    <main className="pt-32 pb-section-gap-lg bg-background min-h-screen">
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
          
          {/* Calendar Month Navigation Control */}
          <div className="flex items-center gap-3 bg-surface-cream border border-surface-container rounded-2xl p-1.5 self-start md:self-auto">
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
        </div>

        {/* Calendar Card Container */}
        <div className="bg-white border border-surface-container rounded-3xl p-4 md:p-6 shadow-sm mb-12">
          
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

                  {/* Desktop Event Badges (Horizontal overflow prevents clipping) */}
                  <div className="hidden md:flex flex-col gap-1.5 w-full mt-2 overflow-hidden flex-1 justify-end">
                    {dayEvents.slice(0, 2).map((evt) => {
                      const theme = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Annet'];
                      return (
                        <div
                          key={evt.id}
                          className={`text-[10px] font-label-md font-bold px-2 py-1 rounded-lg border truncate w-full flex items-center gap-1.5 ${theme.bg} ${theme.text || 'text-slate-800'} ${theme.border || 'border-slate-200'}`}
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
        <section className="max-w-3xl mx-auto">
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
            {/* 1. Show Selected Day Events */}
            {selectedDate ? (
              selectedDayEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDayEvents.map((evt, idx) => (
                    <EventCardDetail key={evt.id || idx} event={evt} />
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
              /* 2. Show Month Events */
              currentMonthEvents.length > 0 ? (
                <div className="space-y-4">
                  {currentMonthEvents.map((evt, idx) => (
                    <EventCardDetail key={evt.id || idx} event={evt} />
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
      </div>
    </main>
  );
}

/* Detail Card helper component */
function EventCardDetail({ event }) {
  const theme = CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Annet'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-surface-cream border border-surface-container rounded-3xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow"
    >
      {/* Category Accent and Image snippet */}
      <div className="w-full sm:w-28 h-20 bg-cover bg-center rounded-2xl shrink-0 overflow-hidden" style={{ backgroundImage: `url('${event.image}')` }} />
      
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
          
          <h3 className="font-headline-sm text-base md:text-lg font-bold text-primary mb-1.5">{event.title}</h3>
          <p className="text-[13px] text-on-surface-variant leading-relaxed line-clamp-2">{event.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
