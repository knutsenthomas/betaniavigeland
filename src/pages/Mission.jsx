import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import CmsText from '@/components/CmsText';

export default function Mission() {
  const { siteSettings } = useContent();
  const vipps = siteSettings?.platform_links?.vipps || '106111';
  const driftskonto = siteSettings?.platform_links?.konto || '3138.07.03737';
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const projects = [
    {
      title: 'Sett og Hørt',
      subtitle: 'Tverrkirkelig evangelisk arbeid i Norge',
      description: 'Sett og Hørt er en evangelisk misjonsorganisasjon som ble etablert høsten 2023 med en tydelig visjon: å forkynne evangeliet klart og enkelt, slik at mennesker i Norge kan få møte Jesus og bli utrustet til tjeneste.',
      details: 'Organisasjonen ble stiftet av Hanne og Svein-Kåre Dahl, og med i styret har de Anders Gabrielsen (styreleder) og Rune Juliusen. Grunnleggerne har sitt utgangspunkt i Betania Vigeland, men har med seg engasjerte medarbeidere på tvers av ulike trossamfunn for å bygge et tverrkirkelig nettverk i Norge.',
      link: 'https://www.settoghort.no',
      buttonText: 'Besøk nettside',
      image: '/sett-og-hort-logo.jpg',
      icon: 'campaign',
      flags: ['/flag-norway.png']
    },
    {
      title: 'Høiland Misjon',
      subtitle: 'Hjelpearbeid i Ukraina, Abkhazia og Etiopia',
      description: 'Høiland Misjon driver et omfattende humanitært og evangelisk hjelpearbeid internasjonalt. De retter spesielt søkelyset mot sårbare grupper og lokalsamfunn som trenger støtte i krevende livssituasjoner.',
      details: 'Organisasjonen ble startet av Ellen Mari og Ordin Høiland, og de står fremdeles i spissen for dette viktige arbeidet. Gjennom trofast støtte bidrar Betania Vigeland til matutdeling, nødhjelp og åndelig omsorg i disse områdene.',
      link: 'https://www.facebook.com/profile.php?id=100064428532809',
      buttonText: 'Følg på Facebook',
      image: '/hoiland-logo.jpg',
      icon: 'public',
      flags: ['/flag-ukraine.png', '/flag-abkhazia.png', '/flag-ethiopia.png']
    }
  ];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-40 pb-20 bg-gradient-to-b from-primary-fixed/30 to-background border-b border-surface-container/50">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-fixed filter blur-3xl" />
          <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-primary-fixed/50 filter blur-3xl" />
        </div>
        
        <div className="max-w-container-max mx-auto px-gutter relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="max-w-3xl space-y-6"
          >
            <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
              <CmsText slug="mission_hero_badge" fallback="Spredning av evangeliet" />
            </div>
            <CmsText 
              slug="mission_hero_title" 
              fallback="Vårt misjonsengasjement" 
              as="h1" 
              className="font-headline-xl text-headline-xl text-primary leading-tight font-bold" 
            />
            <CmsText 
              slug="mission_hero_desc" 
              fallback="Det er et stort misjonsengasjement i Betania Vigeland. Vi ønsker å være med på å bringe det gode budskapet om Jesus både nasjonalt og internasjonalt. Menigheten støtter to misjonsprosjekter fast med et månedlig beløp." 
              as="p" 
              className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed" 
            />
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 max-w-container-max mx-auto px-gutter">
        <div className="space-y-20">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Image Block */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
                <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg border border-surface-container bg-[#f5f3f0] p-8 group flex items-center justify-center">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="max-w-full max-h-full object-contain rounded-2xl group-hover:scale-[1.03] transition-transform duration-750"
                  />
                </div>
              </div>

              {/* Text Block */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[22px]">{project.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-headline-lg text-headline-lg text-primary">{project.title}</h2>
                      {project.title === 'Sett og Hørt' && project.flags && (
                        <img 
                          src={project.flags[0]} 
                          alt="Norge" 
                          className="h-5 object-contain rounded border border-surface-container shadow-sm select-none"
                        />
                      )}
                    </div>
                    <span className="text-secondary font-label-md text-xs uppercase tracking-wider block mt-0.5">{project.subtitle}</span>
                  </div>
                </div>

                <p className="font-body-lg text-on-surface leading-relaxed">
                  {project.description}
                </p>

                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  {project.details}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3.5 rounded-xl font-label-md text-label-md shadow-sm active:scale-[0.98] transition-all"
                  >
                    {project.buttonText}
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>

                  {project.title === 'Høiland Misjon' && project.flags && (
                    <div className="flex gap-3 items-center">
                      {project.flags.map((flag, fIdx) => (
                        <img 
                          key={fIdx}
                          src={flag} 
                          alt="Misjonsland flagg" 
                          className="h-7 object-contain rounded border border-surface-container shadow-sm select-none"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Give support banner */}
      <section className="bg-surface-container-low py-20 border-t border-surface-container">
        <div className="max-w-4xl mx-auto px-gutter text-center space-y-6">
          <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
            <CmsText slug="mission_support_badge" fallback="Gi en gave" />
          </div>
          <CmsText 
            slug="mission_support_title" 
            fallback="Vil du være med å støtte arbeidet?" 
            as="h2" 
            className="font-headline-lg text-headline-lg text-primary font-bold" 
          />
          <CmsText 
            slug="mission_support_desc" 
            fallback="Gjennom menighetens misjonskasse kan du være med å velsigne og bidra til at Sett og Hørt og Høiland Misjon når enda lenger ut med evangeliet. Merk gaven med &quot;Misjon&quot;." 
            as="p" 
            className="font-body-md text-on-surface-variant leading-relaxed max-w-2xl mx-auto" 
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <div className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm min-w-[200px]">
              <span className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Menighetskonto</span>
              <span className="font-bold text-primary text-base">{driftskonto}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between min-w-[200px] gap-4">
              <div className="text-left">
                <span className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Vippsnummer</span>
                <span className="font-bold text-primary text-base">{vipps}</span>
              </div>
              <img src="/vipps-logo.svg" alt="Vipps" className="h-6 object-contain select-none" />
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
