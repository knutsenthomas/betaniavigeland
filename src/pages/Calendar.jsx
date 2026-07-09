import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import CmsText from '@/components/CmsText';

export default function Calendar() {
  const { events, siteSettings } = useContent();
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [calendarAlert, setCalendarAlert] = useState(null);

  const filters = [
    { name: 'Alle', colorClass: 'hover:border-secondary border-surface-container-highest text-on-surface-variant' },
    { name: 'Barn', colorClass: 'hover:border-secondary border-surface-container-highest text-on-surface-variant' },
    { name: 'Ungdom', colorClass: 'hover:border-primary border-surface-container-highest text-on-surface-variant' },
    { name: 'Gudstjeneste', colorClass: 'hover:border-secondary border-surface-container-highest text-on-surface-variant' },
    { name: 'Annet', colorClass: 'hover:border-wood-bark border-surface-container-highest text-on-surface-variant' }
  ];

  // Normalized matching logic
  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'Alle') return true;
    if (selectedFilter === 'Barn') return event.category.toLowerCase().includes('barn');
    return event.category.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleAddToCalendar = (eventTitle) => {
    setCalendarAlert(`"${eventTitle}" ble lagt til i kalenderen din!`);
    setTimeout(() => setCalendarAlert(null), 3000);
  };

  const handleOpenMonthlyProgram = () => {
    const { url, file_data, filename } = siteSettings?.monthly_program || {};
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (file_data) {
      try {
        const parts = file_data.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        
        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (err) {
        console.error("Klarte ikke åpne PDF:", err);
        const link = document.createElement('a');
        link.href = file_data;
        link.download = filename || 'manedsprogram.pdf';
        link.click();
      }
    }
  };

  return (
    <main className="pt-32 pb-section-gap-lg bg-background min-h-screen">
      {/* Toast Alert for calendar action */}
      <AnimatePresence>
        {calendarAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-primary-container"
          >
            <span className="material-symbols-outlined text-secondary-container">check_circle</span>
            <span className="font-label-md text-label-md">{calendarAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-gutter mb-section-gap-sm">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="text-secondary font-label-md text-label-md tracking-widest uppercase mb-2">
            <CmsText slug="calendar_badge" fallback="Hva skjer" />
          </div>
          <CmsText 
            slug="calendar_title" 
            fallback="Kalender" 
            as="h1" 
            className="font-headline-lg text-headline-lg text-primary font-bold" 
          />
          {siteSettings?.monthly_program?.enabled && (
            <div className="mt-6 flex flex-wrap gap-4">
              {siteSettings.monthly_program.url && (
                <a 
                  href={siteSettings.monthly_program.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-container text-white px-5 py-3 rounded-xl font-label-md text-xs shadow-md transition-all duration-200 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">link</span>
                  <span>Månedsprogram (Lenke)</span>
                </a>
              )}
              {siteSettings.monthly_program.file_data && (
                <a 
                  href={siteSettings.monthly_program.file_data} 
                  download={siteSettings.monthly_program.filename || 'manedsprogram.pdf'}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-[#153a51] text-white px-5 py-3 rounded-xl font-label-md text-xs shadow-md transition-all duration-200 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Last ned program (PDF)</span>
                </a>
              )}
            </div>
          )}
        </motion.div>
      </section>

      {/* Summer Break / Eksterne arrangementer Notice Section */}
      {siteSettings.show_summer_banner && (
        <section className="max-w-container-max mx-auto px-gutter mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-surface-container-low p-6 md:p-8 rounded-3xl border border-surface-container flex flex-col lg:flex-row gap-8 lg:gap-12 justify-between items-start"
          >
            {/* Main Info */}
            <div className="space-y-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-secondary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] animate-pulse">info</span>
                <CmsText slug="summer_banner_badge" fallback="Sommerferie-info" />
              </div>
              <CmsText 
                slug="summer_banner_title" 
                fallback="Sommerferie i menigheten" 
                as="h2" 
                className="font-headline-md text-headline-md text-primary font-bold" 
              />
              <CmsText 
                slug="summer_banner_text1" 
                fallback="Vi har ingen ordinære arrangementer i Betania Vigeland gjennom fellesferien. Første søndagsmøte etter sommerferien er søndag 16. august kl. 18:00. Vi ønsker alle en kjempefin sommer! ☀️" 
                as="p" 
                className="font-body-md text-on-surface-variant leading-relaxed" 
              />
              <CmsText 
                slug="summer_banner_text2" 
                fallback="Gjennom hele sommeren oppfordrer vi til å støtte opp under møtene og fellesskapet på Solstrand Camping." 
                as="p" 
                className="font-body-md text-on-surface-variant leading-relaxed" 
              />
            </div>

            {/* Links / Grid */}
            <div className="w-full lg:max-w-md space-y-4 border-t lg:border-t-0 border-surface-container-highest pt-8 lg:pt-0">
              <h3 className="font-bold text-primary text-xs uppercase tracking-widest">Anbefalte sommerstevner:</h3>
              
              {(siteSettings.summer_banner?.links || []).map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex justify-between items-center p-4 bg-white hover:bg-primary/5 border border-surface-container rounded-2xl transition-all duration-300 active:scale-[0.99] shadow-sm"
                >
                  <div className="space-y-0.5">
                    <span className="font-label-md text-xs font-bold text-primary group-hover:text-secondary transition-colors">{link.label}</span>
                    <span className="block text-[11px] text-on-surface-variant">{link.sublabel}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300">arrow_forward</span>
                </a>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Filter Section */}
      <section className="max-w-container-max mx-auto px-gutter mb-8">
        <div className="flex flex-wrap gap-2.5">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setSelectedFilter(filter.name)}
              className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.97] ${
                selectedFilter === filter.name
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : `bg-white ${filter.colorClass}`
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </section>

      {/* Grid List */}
      <section className="max-w-container-max mx-auto px-gutter">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {(filteredEvents || []).map((evt, idx) => (
              <motion.div
                layout
                key={evt.id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-surface-cream border border-surface-container rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                {/* Event Image */}
                <div className="h-48 overflow-hidden relative shrink-0">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${evt.image}')` }}
                  />
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {evt.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 text-secondary font-label-md text-label-md uppercase tracking-wider mb-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1 border-l border-surface-container-highest pl-3">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-3 line-clamp-1 group-hover:text-secondary transition-colors shrink-0">
                    {evt.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body-md text-on-surface-variant leading-relaxed line-clamp-3 mb-6 flex-1">
                    {evt.description}
                  </p>

                  {/* Button */}
                  <button 
                    onClick={() => handleAddToCalendar(evt.title)}
                    className="w-full py-3 bg-surface-container hover:bg-primary hover:text-white text-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Legg til i kalender</span>
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Featured Quote Card - only visible when "Alle" filter is selected */}
            {selectedFilter === 'Alle' && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="lg:col-span-3 bg-primary text-white rounded-xl p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-sm min-h-[300px]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="w-12 h-1 bg-secondary-container mb-8" />
                <blockquote className="font-quote text-quote max-w-xl mb-8 italic">
                  "For jeg vet hvilke tanker jeg har med dere, sier Herren, fredstanker og ikke ulykkestanker. Jeg vil gi dere fremtid og håp."
                </blockquote>
                <cite className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed-dim not-italic">— Jeremia 29:11</cite>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Load More Section */}
      {siteSettings?.monthly_program?.enabled && (
        <section className="mt-16 flex justify-center">
          <button 
            onClick={handleOpenMonthlyProgram}
            className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span>Se flere aktiviteter</span>
          </button>
        </section>
      )}
    </main>
  );
}
