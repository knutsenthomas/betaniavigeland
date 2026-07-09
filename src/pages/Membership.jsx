import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';

export default function Membership() {
  const { siteSettings } = useContent();
  const vipps = siteSettings?.platform_links?.vipps || '106111';
  const driftskonto = siteSettings?.platform_links?.konto || '3138.07.03737';
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    servingInterest: [],
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleCheckboxChange = (area) => {
    setFormState(prev => {
      const interests = prev.servingInterest.includes(area)
        ? prev.servingInterest.filter(i => i !== area)
        : [...prev.servingInterest, area];
      return { ...prev, servingInterest: interests };
    });
  };

  const servingAreas = [
    { id: 'kids', label: 'Barne- og ungdomsarbeid (Awake, Tweens, Søndagsskole)' },
    { id: 'worship', label: 'Lovsang, musikk og teknisk (lyd/lys/bilde)' },
    { id: 'hospitality', label: 'Vertskap, kafe og praktisk tilrettelegging' },
    { id: 'admin', label: 'Administrasjon, info og sosiale medier' },
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-40 pb-20 bg-gradient-to-b from-secondary-fixed/30 to-background border-b border-surface-container/50">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary-fixed filter blur-3xl" />
          <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-secondary-fixed/50 filter blur-3xl" />
        </div>
        
        <div className="max-w-container-max mx-auto px-gutter relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="max-w-3xl space-y-6"
          >
            <span className="text-secondary font-label-md text-label-md tracking-widest uppercase">Bli en del av fellesskapet</span>
            <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">
              Medlemskap i Betania Vigeland
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Enhver gjenfødt kristen er hjertelig velkommen som medlem i menigheten vår. Vi deler troen, fellesskapet og et brennende ønske om å utgjøre en positiv forskjell for folk på Vigeland.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Medlemskategorier & Skjemaer */}
      <section className="py-20 max-w-container-max mx-auto px-gutter">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <span className="text-secondary font-label-md text-label-md tracking-widest uppercase">Valgmuligheter</span>
          <h2 className="font-headline-lg text-headline-lg text-primary">To kategorier av medlemskap</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Vi skiller mellom et fullt medlemskap med stemmerett, og et støttemedlem-alternativ for de som ønsker en mer formell juridisk tilknytning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vanlig Medlem Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-surface-container shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined text-[24px]">card_membership</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Ordinært Medlem</h3>
              <p className="text-on-surface-variant text-[15px] leading-relaxed mb-8">
                For deg som ser på Betania som ditt åndelige hjem, ønsker å delta aktivt, og vil være med å stemme og bestemme på menighetens medlemsmøter.
              </p>
            </div>
            <div className="space-y-3 pt-6 border-t border-surface-container/50">
              <a 
                href="https://www.betania-vigeland.no/_files/ugd/10b84e_1450027637504be19786ffae55012209.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="w-full justify-center bg-primary hover:bg-primary-container text-white py-3 px-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Innmelding Voksen
              </a>
              <a 
                href="https://www.betania-vigeland.no/_files/ugd/10b84e_682614e4b37040f4944dd7aa941c6b70.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="w-full justify-center border border-primary/20 hover:bg-surface-cream text-primary py-3 px-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Innmelding Barn
              </a>
            </div>
          </motion.div>

          {/* Støttemedlem Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-surface-container shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Støttemedlem</h3>
              <p className="text-on-surface-variant text-[15px] leading-relaxed mb-8">
                Regnes som tilknyttet menigheten og gir rett til sivile gjøremål som bryllup og begravelse. Har ikke stemmerett, men støtter opp under statstilskuddslisten vår.
              </p>
            </div>
            <div className="space-y-3 pt-6 border-t border-surface-container/50">
              <a 
                href="https://www.betania-vigeland.no/_files/ugd/10b84e_55ef9f8fe4b24be7b46ea19eed827645.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="w-full justify-center bg-primary hover:bg-primary-container text-white py-3 px-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Innmelding Voksen
              </a>
              <a 
                href="https://www.betania-vigeland.no/_files/ugd/10b84e_b2c641781a00432485df50e9f194ba18.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="w-full justify-center border border-primary/20 hover:bg-surface-cream text-primary py-3 px-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Innmelding Barn
              </a>
            </div>
          </motion.div>

          {/* Utmelding Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-surface-container shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-surface-cream flex items-center justify-center text-on-surface-variant border border-surface-container mb-6">
                <span className="material-symbols-outlined text-[24px]">logout</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Utmelding</h3>
              <p className="text-on-surface-variant text-[15px] leading-relaxed mb-8">
                Dersom du flytter, ønsker å endre medlemskapet ditt, eller vil melde deg ut av menigheten og statstilskuddslisten vår.
              </p>
            </div>
            <div className="pt-6 border-t border-surface-container/50">
              <a 
                href="https://www.betania-vigeland.no/_files/ugd/10b84e_120ac97ebfca4730977e34a13d4abe02.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="w-full justify-center border border-surface-container hover:bg-surface-cream text-on-surface-variant py-3 px-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Last ned utmeldingsskjema
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Retningslinjer (Guidelines) Section */}
      <section className="py-20 bg-surface-container-low border-y border-surface-container">
        <div className="max-w-container-max mx-auto px-gutter">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="max-w-2xl mb-16 space-y-3"
          >
            <span className="text-secondary font-label-md text-label-md tracking-widest uppercase">Rammeverk & Forventninger</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Retningslinjer for medlemskap</h2>
            <p className="font-body-md text-on-surface-variant">
              Å stå sammen i en lokal menighet betyr at vi deler et felles verdigrunnlag og bærer byrder og gleder sammen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Krav til medlem */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-surface-container shadow-sm space-y-6"
            >
              <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[26px]">rule</span>
                Som medlem hos oss må du:
              </h3>
              <ul className="space-y-4">
                {[
                  'Være en bekjennende kristen.',
                  'Tro Bibelens lære om den treenige Gud.',
                  'Tro Guds Ord på at Jesus, Guds sønns blod er det eneste som renser fra all synd.',
                  'Ta syn for troende dåp.',
                  'Ikke være medlem i annen menighet eller trossamfunn.',
                  'Være innskrevet i menighetens liste for statstilskudd.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-on-surface-variant font-body-md leading-relaxed text-[15px]">
                    <span className="material-symbols-outlined text-meadow-green text-[20px] mt-0.5 select-none">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Lojalitet og Hva du kan forvente */}
            <div className="space-y-8">
              {/* Forventninger */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl border border-surface-container shadow-sm space-y-4"
              >
                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[26px]">handshake</span>
                  Hva vi forventer av deg:
                </h3>
                <ul className="space-y-3">
                  {[
                    'At du viser lojalitet overfor Guds Ord og menigheten.',
                    'At du arbeider for å nå mennesker med evangeliet i liv og lære.',
                    'At du ønsker å være med på å bygge menigheten.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-[15px] leading-relaxed">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">arrow_right_alt</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Rettigheter */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl border border-surface-container shadow-sm space-y-4"
              >
                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[26px]">star</span>
                  Hva du kan forvente av menigheten:
                </h3>
                <ul className="space-y-3">
                  {[
                    'Lederskapet vil følge deg opp, veilede deg i liv og tjeneste, og søke å være en hjelp gjennom alle livets faser.',
                    'Du kan ønske deg og velges inn i tjenester i menigheten etter samtykke fra lederskapet og medlemsmøtet.',
                    'Du får mulighet til å delta i menighetsmøtet med fulle stemmerettigheter.',
                    'Du får leie våre flotte lokaler for kun 750 kr til egne enkeltarrangementer.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-[15px] leading-relaxed">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">star_rate</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Givetjeneste & Kontaktskjema */}
      <section className="py-20 max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
          
          {/* Givetjeneste Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-secondary font-label-md text-label-md tracking-widest uppercase">Bidrag & Frivillighet</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Vil du bidra til menighetens arbeid?</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Alt arbeid i Betania Vigeland finansieres av frivillige gaver fra medlemmer og støttespillere. Ditt bidrag gjør det mulig å opprettholde det aktive barne- og ungdomsarbeidet og ha åpne dører for lokalsamfunnet.
              </p>
              <p className="font-body-md text-on-surface-variant italic">
                Tips: Alle gaver til menigheten gir rett til skattefradrag. Kontakt oss i skjemaet om du ønsker å sette opp fast givertjeneste registrert med personnummer for skattefradrag.
              </p>
            </motion.div>

            {/* Account card and Vipps */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface-container-low p-8 rounded-3xl border border-surface-container space-y-6"
            >
              <h3 className="font-headline-md text-headline-md text-primary">Fast Giveravtale</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm">
                  <span className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Menighetskonto</span>
                  <span className="font-bold text-primary text-base">{driftskonto}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Vippsnummer</span>
                    <span className="font-bold text-primary text-base">{vipps}</span>
                  </div>
                  <img src="/vipps-logo.svg" alt="Vipps" className="h-6 object-contain select-none" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-white p-8 md:p-10 rounded-3xl border border-surface-container shadow-lg flex flex-col justify-center"
          >
            {isSubmitted ? (
              <div className="text-center py-16 space-y-6">
                <span className="material-symbols-outlined text-[72px] text-meadow-green animate-bounce">check_circle</span>
                <h3 className="font-headline-md text-headline-md text-primary">Takk for din henvendelse!</h3>
                <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
                  Meldingen din er sendt. En i lederskapet i Betania Vigeland vil ta kontakt med deg om kort tid for en hyggelig og uforpliktende prat.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-secondary font-label-md text-label-md border-b border-secondary hover:text-primary hover:border-primary transition-colors py-1"
                >
                  Send en ny melding
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Kontakt oss om medlemskap</h3>
                  <p className="font-body-md text-on-surface-variant text-sm">Har du spørsmål om medlemskap, dåp eller ønsker du å engasjere deg som frivillig? Send oss en melding her!</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block font-label-md text-label-md text-primary">Navn</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-container bg-surface-cream text-primary focus:outline-none focus:border-secondary transition-colors text-sm"
                      placeholder="Navn"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="block font-label-md text-label-md text-primary">Telefon</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-container bg-surface-cream text-primary focus:outline-none focus:border-secondary transition-colors text-sm"
                      placeholder="Mobilnummer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="block font-label-md text-label-md text-primary">E-post</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-container bg-surface-cream text-primary focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="E-postadresse"
                  />
                </div>

                <div className="space-y-3">
                  <span className="block font-label-md text-label-md text-primary">Hva er du interessert i? (valgfritt)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servingAreas.map((area) => (
                      <label key={area.id} className="flex items-start gap-2.5 text-[13px] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formState.servingInterest.includes(area.id)}
                          onChange={() => handleCheckboxChange(area.id)}
                          className="mt-0.5 accent-secondary"
                        />
                        <span className="text-on-surface-variant leading-snug">{area.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="block font-label-md text-label-md text-primary">Melding / Kommentarer</label>
                  <textarea
                    id="message"
                    rows="4"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-container bg-surface-cream text-primary focus:outline-none focus:border-secondary transition-colors resize-none text-sm"
                    placeholder="Skriv meldingen din her..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-on-tertiary font-label-md text-label-md py-4 rounded-xl shadow-md active:scale-[0.98] transition-all duration-200"
                >
                  Send henvendelse
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
