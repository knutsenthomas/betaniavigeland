import React from 'react';
import { motion } from 'framer-motion';
import CmsText from '@/components/CmsText';

export default function KidsYouth() {
  const activities = [
    {
      title: 'Søndagsskolen',
      age: '3 - 12 år',
      time: 'Parallelt med søndagsmøter kl. 11:00',
      description: 'Her samles barna til lek, sang, kreative aktiviteter og spennende bibelhistorier formidlet på barnas premisser. Barn under 3 år må ha med en voksen.',
      icon: 'child_care',
      accent: 'border-meadow-green'
    },
    {
      title: 'Tweens Vigeland',
      age: '5. - 7. klasse',
      time: 'Annenhver tirsdag kl. 18:30 - 20:00',
      description: 'Et gøyalt samarbeid mellom Betania og Bedehuset på Vigeland. Vi møtes til spill, lek, gøye konkurranser og en kort andakt.',
      icon: 'diversity_2',
      accent: 'border-secondary'
    },
    {
      title: 'Awake',
      age: '8. klasse og opp',
      time: 'Fredager kl. 20:00 - 23:00',
      description: 'Menighetens felles ungdoms- og tenåringsarbeid. Dette er en super arena med kiosk, bordtennis, spill, andakt og et trygt og inkluderende miljø.',
      icon: 'sports_esports',
      accent: 'border-primary'
    }
  ];

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="bg-background min-h-screen pt-32 pb-section-gap-lg"
    >
      {/* Hero section */}
      <section className="max-w-container-max mx-auto px-gutter mb-16">
        <motion.div variants={itemVariants} className="max-w-3xl">
          <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
            <CmsText slug="kidsyouth_hero_badge" fallback="For barna og de unge" />
          </div>
          <CmsText 
            slug="kidsyouth_hero_title" 
            fallback="Trygge og morsomme arenaer for neste generasjon" 
            as="h1" 
            className="font-headline-xl text-headline-xl text-primary mt-2 mb-6 leading-tight font-bold" 
          />
          <CmsText 
            slug="kidsyouth_hero_desc" 
            fallback="Vi ønsker at barn og ungdom i Vigeland skal ha et sted å gå der de blir sett, anerkjent og inkludert. Gjennom lek, fellesskap og formidling ønsker vi å gi dem et solid fundament for livet." 
            as="p" 
            className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed" 
          />
        </motion.div>
      </section>

      {/* Activities Grid */}
      <section className="max-w-container-max mx-auto px-gutter mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activities.map((act) => (
            <motion.div
              key={act.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={`bg-surface-cream rounded-2xl p-8 border-t-8 ${act.accent} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-5">
                  <span className="material-symbols-outlined text-[28px]">{act.icon}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
                    {act.age}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary leading-tight">{act.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{act.time}</span>
                </div>
                <p className="text-on-surface-variant font-body-md leading-relaxed">{act.description}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-surface-container">
                <button className="text-secondary font-label-md text-label-md hover:text-primary transition-colors flex items-center gap-2">
                  Kontakt leder for mer info 
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety & Mentors Section */}
      <section className="bg-surface-container-low py-16 border-y border-surface-container">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-6">
              <CmsText 
                slug="kidsyouth_safety_title" 
                fallback="Trygge ledere og fokus på sikkerhet" 
                as="h2" 
                className="font-headline-lg text-headline-lg text-primary font-bold" 
              />
              <CmsText 
                slug="kidsyouth_safety_desc" 
                fallback="Alle våre barne- og ungdomsarbeidere har levert godkjent politiattest, og vi jobber aktivt for at alle ledere skal være gode og trygge rollemodeller. Vi arrangerer jevnlig ledersamlinger med fokus på grensesetting, inkludering og trygg formidling." 
                as="p" 
                className="font-body-md text-on-surface-variant leading-relaxed" 
              />
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-meadow-green">verified_user</span>
                  <span className="font-label-md">
                    <CmsText slug="kidsyouth_safety_badge1" fallback="Politiattest påkrevet" />
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-meadow-green">health_and_safety</span>
                  <span className="font-label-md">
                    <CmsText slug="kidsyouth_safety_badge2" fallback="Førstehjelpskursing" />
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-surface-cream p-8 rounded-2xl shadow-sm border border-surface-container">
              <CmsText 
                slug="kidsyouth_contact_title" 
                fallback="Har du spørsmål?" 
                as="h3" 
                className="font-headline-md text-headline-md text-primary mb-4 font-bold" 
              />
              <CmsText 
                slug="kidsyouth_contact_desc" 
                fallback="Lurer du på noe om aktivitetene, eller ønsker du å melde på barnet ditt? Ta gjerne kontakt med oss." 
                as="p" 
                className="font-body-md text-on-surface-variant mb-6" 
              />
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Ditt navn</label>
                  <input type="text" className="w-full bg-background border border-surface-container-high rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">E-postadresse</label>
                  <input type="email" className="w-full bg-background border border-surface-container-high rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Melding</label>
                  <textarea rows="3" className="w-full bg-background border border-surface-container-high rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all active:scale-98">
                  Send melding
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
