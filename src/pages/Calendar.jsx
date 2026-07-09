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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Hva skjer på Betania</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Velkommen til vårt fellesskap. Her finner du oversikt over alle kommende aktiviteter, gudstjenester og samlinger for alle aldre.
          </p>
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
                  className="group bg-white p-4 rounded-xl border border-surface-container flex items-center justify-between hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <span className="block font-bold text-primary text-sm group-hover:text-secondary transition-colors">{link.label}</span>
                    <span className="text-xs text-on-surface-variant">{link.sublabel}</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">open_in_new</span>
                </a>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Filters Section */}
      <section className="max-w-container-max mx-auto px-gutter mb-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 py-6 border-y border-surface-container"
        >
          <span className="font-label-md text-label-md uppercase tracking-widest text-outline">Filtrer:</span>
          {filters.map((filter) => {
            const isActive = selectedFilter === filter.name;
            return (
              <button
                key={filter.name}
                onClick={() => setSelectedFilter(filter.name)}
                className={`px-6 py-2 rounded-full border-2 font-label-md text-label-md transition-all active:scale-95 ${
                  isActive 
                    ? 'border-secondary bg-secondary text-white shadow-sm' 
                    : filter.colorClass
                }`}
              >
                {filter.name}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* Calendar Bento Grid */}
      <section className="max-w-container-max mx-auto px-gutter">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                layout
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="calendar-card group bg-surface-cream rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-surface-container"
              >
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center event-image transition-transform duration-700" 
                    style={{ backgroundImage: `url('${event.image}')` }}
                    data-alt={event.title}
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow-md flex flex-col items-center min-w-[50px]">
                    <span className="font-bold text-secondary text-lg leading-none">{event.day}</span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">{event.month.slice(0, 3)}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary/95 text-white px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="text-label-md font-label-md">{event.time}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-3">{event.title}</h3>
                  <p className="text-on-surface-variant text-body-md mb-6 flex-1">{event.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-container">
                    <button className="flex items-center gap-2 text-secondary font-label-md text-label-md hover:underline decoration-2 underline-offset-4 active:scale-95 transition-transform">
                      Les mer
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <button 
                      onClick={() => handleAddToCalendar(event.title)}
                      className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-secondary active:scale-90 transition-all" 
                      title="Legg i kalender"
                    >
                      <span className="material-symbols-outlined">calendar_add_on</span>
                    </button>
                  </div>
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
      <section className="mt-16 flex justify-center">
        <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95">
          Se flere aktiviteter
        </button>
      </section>
    </main>
  );
}
