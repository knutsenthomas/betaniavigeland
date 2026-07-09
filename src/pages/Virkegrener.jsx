import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Virkegrener() {
  const [filter, setFilter] = useState('alle');

  const categories = [
    { id: 'alle', label: 'Alle' },
    { id: 'moter', label: 'Møter & Voksne' },
    { id: 'barn', label: 'Barn' },
    { id: 'ungdom', label: 'Ungdom' }
  ];

  const getCount = (categoryId) => {
    if (categoryId === 'alle') return branches.length;
    return branches.filter(b => b.category === categoryId).length;
  };

  const branches = [
    {
      id: 1,
      title: 'Søndagsmøter / Gudstjenester',
      category: 'moter',
      time: 'Søndager kl. 11:00 eller 18:00 (annenhver uke)',
      description: 'Søndagsmøtene er våre hovedmøter der hele menighetsfamilien samles på tvers av generasjoner. Vi har formiddagsmøter kl. 11.00 (med søndagsskole) og kveldsmøter kl. 18.00 henholdsvis annenhver søndag. Se kalenderen for møtetider.',
      icon: 'church',
      image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?fit=crop&w=600&h=400&q=80'
    },
    {
      id: 2,
      title: 'Onsdagsmøter (Bønn & Bibel)',
      category: 'moter',
      time: 'Onsdager kl. 19:30',
      description: 'På onsdager samles vi til bønn, lovsang og vitnemøter der vi deler erfaringer fra troslivet. Noen onsdager har vi også undervisning og bibeltimer. Disse samlingene starter normalt kl. 19.30 (kl. 19.00 ved undervisning, følg med i programmet).',
      icon: 'diversity_1',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fit=crop&w=600&h=400&q=80'
    },
    {
      id: 3,
      title: 'Vi leser Bibelen',
      category: 'moter',
      time: 'Mandager kl. 17:30 - 19:00',
      description: 'Hver mandag møtes vi i koselige, uformelle rammer på Betania for å lese Bibelen sammen kapittel for kapittel, dele tanker, og oppmuntre hverandre i troshverdagen.',
      icon: 'menu_book',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?fit=crop&w=600&h=400&q=80'
    },
    {
      id: 4,
      title: 'Søndagsskole',
      category: 'barn',
      time: 'Søndager kl. 11:00 (under formiddagsmøtet)',
      description: 'Et gøyalt og lærerikt tilbud for barna under søndagens formiddagsmøte. Vi har sang, lek, aktiviteter og spennende bibelfortellinger tilpasset barna. Barn under 3 år er velkommen i følge med en voksen.',
      facebook: 'https://www.facebook.com/profile.php?id=100076499912100',
      icon: 'child_care',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=600&h=400&q=80'
    },
    {
      id: 5,
      title: 'Tweens Vigeland',
      category: 'barn',
      time: 'Annenhver tirsdag kl. 18:30 - 20:00',
      description: 'Et populært samarbeidstiltak mellom Betania og Bedehuset på Vigeland for alle i 5. til 7. klasse. Vi fyller kvelden med morsomme leker, lagkonkurranser, kiosk, sosialt fellesskap og en kort andakt.',
      facebook: 'https://www.facebook.com/p/Tweens-Vigeland-61568678837708/',
      icon: 'sports_esports',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?fit=crop&w=600&h=400&q=80'
    },
    {
      id: 6,
      title: 'Awake',
      category: 'ungdom',
      time: 'Fredager kl. 20:00',
      description: 'Menighetens samlingspunkt for tenåringer og ungdom fra 8. klasse og oppover. Fredagskveldene på Awake byr på god stemning, kiosk med mat og drikke, spill (biljard, bordtennis), andakt og et trygt fellesskap.',
      facebook: 'https://www.facebook.com/Awakevigeland',
      icon: 'local_cafe',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?fit=crop&w=600&h=400&q=80'
    },
    {
      id: 7,
      title: 'Tentro (Konfirmasjon)',
      category: 'ungdom',
      time: 'Etter avtalt opplegg',
      description: 'Tentro er vårt frikirkelige konfirmasjonstilbud. Det er åpent for alle 9.-klassinger uavhengig av medlemskap eller dåp. Opplegget er et samarbeid mellom åtte frimenigheter i Lindesnes kommune, og fokuserer på kristen tro knyttet til tenåringers hverdag.',
      icon: 'school',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?fit=crop&w=600&h=400&q=80'
    },
    {
      id: 8,
      title: 'GuttogJente.no',
      category: 'ungdom',
      time: 'Nettressurs (Tilgjengelig døgnet rundt)',
      description: 'Et kristent nettsted som tilbyr unge mennesker sunn veiledning og svar på spørsmål knyttet til kjønn, kropp, følelser, sex og samliv. Siden inneholder svar på over 1000 innsendte spørsmål.',
      link: 'https://www.guttogjente.no',
      linkLabel: 'Besøk GuttogJente.no',
      icon: 'open_in_new',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=600&h=400&q=80'
    }
  ];

  const filteredBranches = filter === 'alle' 
    ? branches 
    : branches.filter(b => b.category === filter);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen pt-32 pb-section-gap-lg"
    >
      {/* Title Header */}
      <section className="max-w-container-max mx-auto px-gutter mb-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-secondary font-label-md text-label-md tracking-widest uppercase">Hva vi gjør</span>
          <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">
            Våre virkegrener
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Vi har et variert tilbud av samlinger og aktiviteter for folk i alle aldre. Alle våre samlinger og grupper er åpne for alle som ønsker å delta!
          </p>
        </div>
      </section>

      {/* Filter Switcher */}
      <section className="max-w-container-max mx-auto px-gutter mb-12">
        <div className="flex flex-wrap gap-3 border-b border-surface-container pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                filter === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white hover:bg-surface-cream text-on-surface-variant border border-surface-container'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                filter === cat.id 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {getCount(cat.id)}
              </span>
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
            {filteredBranches.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.05 } }
                }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-surface-container transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="h-48 overflow-hidden relative border-b border-surface-container">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-primary/90 text-white flex items-center justify-center backdrop-blur-sm shadow-md">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-secondary block">
                        {item.category === 'moter' ? 'Møter & Voksne' : item.category === 'barn' ? 'Barn' : 'Ungdom'}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-primary mt-1">{item.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span className="font-semibold">{item.time}</span>
                    </div>

                    <p className="text-on-surface-variant font-body-md leading-relaxed text-[14px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Link (Conditional Facebook or External Link) */}
                {(item.facebook || item.link) && (
                  <div className="p-5 bg-surface-cream/50 border-t border-surface-container">
                    <a 
                      href={item.facebook || item.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-secondary hover:text-primary transition-colors text-[13px] font-bold flex items-center gap-1.5"
                    >
                      {item.linkLabel || 'Følg på Facebook'}
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Discontinued note */}
      <section className="max-w-container-max mx-auto px-gutter mt-16">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container flex items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-[24px]">info</span>
          <p className="text-sm font-body-md">
            Merk: <strong>Klubb 3-10</strong> (som tidligere ble arrangert på torsdager) blir nedlagt fra og med høsten 2026.
          </p>
        </div>
      </section>

      {/* Interactive Bottom CTA Section */}
      <section className="max-w-container-max mx-auto px-gutter mt-20">
        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-primary/20 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <h3 className="font-headline-lg text-headline-lg font-bold text-white">Lurer du på noe eller vil du bli med?</h3>
            <p className="font-body-md text-white/80 leading-relaxed text-sm">
              Uansett om du ønsker å delta på samlingene våre, har spørsmål om arbeidet vårt, eller ønsker å engasjere deg som frivillig medarbeider – er dørene våre alltid åpne. Vi gleder oss til å bli kjent med deg!
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
            <a
              href="mailto:post@betania-vigeland.no"
              className="bg-secondary hover:bg-secondary-container text-white px-8 py-3 rounded-full font-label-md text-sm text-center transition-all active:scale-95 shadow-sm hover:shadow"
            >
              Ta kontakt med oss
            </a>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
