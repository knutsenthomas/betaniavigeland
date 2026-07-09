import React from 'react';
import { motion } from 'framer-motion';
import CmsText from '@/components/CmsText';
import { useContent } from '@/contexts/ContentContext';

export default function About() {
  const { siteSettings } = useContent();

  const defaultLedelse = [
    {
      name: 'Glenn Gundersen',
      role: 'Leder av Interimsstyre',
      email: 'glenn@lindesnesbygg.no',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=300&h=300&q=80'
    },
    {
      name: 'Anja Cisilie Ødegård',
      role: 'Medlem av Interimsstyre',
      email: 'anjacisilie@hotmail.com',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=300&h=300&q=80'
    },
    {
      name: 'Anders Gabrielsen',
      role: 'Medlem av Eldsterådet',
      email: 'anders@betania-vigeland.no',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=300&h=300&q=80'
    },
    {
      name: 'Andreas Høiland',
      role: 'Medlem av Eldsterådet',
      email: 'andreas_az@hotmail.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300&q=80'
    },
    {
      name: 'Line-Anette H. Larsen',
      role: 'Medlem av Eldsterådet',
      email: 'line-anettelarsen@hotmail.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=300&h=300&q=80'
    },
    {
      name: 'Brita Haga Gundersen',
      role: 'Medlem av Eldsterådet',
      email: 'britahg@online.no',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=300&h=300&q=80'
    }
  ];

  const defaultAnsatte = [
    {
      name: 'Vidar Tjomsland',
      role: 'Administrasjon & Regnskap',
      email: 'post@betania-vigeland.no',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=300&h=300&q=80'
    },
    {
      name: 'Andreas Høiland',
      role: 'Leder for ungdomsarbeidet Awake',
      email: 'andreas_az@hotmail.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300&q=80'
    }
  ];

  const ledelse = siteSettings?.leadership || defaultLedelse;
  const ansatte = siteSettings?.staff || defaultAnsatte;

  const beliefs = [
    {
      title: 'Bibelen – Guds ord',
      ref: '2. Tim 3,16; Joh 17,17; Heb 4,12',
      text: 'Vi tror at Bibelen er Guds ufeilbarlige ord. Den er skrevet av mennesker inspirert av Den Hellige Ånd. Bibelen er øverste autoritet i tro, lære, etikk og moral.'
    },
    {
      title: 'Treenigheten',
      ref: 'Matt 28,19; Ef 4,4-6',
      text: 'Vi tror på den treene Gud – Far, Sønn og Den hellige Ånd.'
    },
    {
      title: 'Skapelsen',
      ref: '1. Mos 1,26-27; Sal 8; Sal 19,1-3; Sal 33,9; Jer 1,5; Rom 8,18-23; Åp 21,1-4',
      text: 'Vi tror at Gud har skapt himmel og jord, alt synlig og usynlig. Alt i skaperverket er ment godt og vakkert. Mennesket er skapt i Guds bilde og har en ukrenkelig verdi fra unnfangelse til naturlig død. Vi tror at Gud har innstiftet ekteskapet mellom kvinne og mann som den naturlige rammen for samliv. Mennesket er satt til å beskytte og bevare Guds skaperverk. Gud fortsetter å fornye sitt skaperverk, og en dag skal han nyskape hele verden.'
    },
    {
      title: 'Jesus Kristus og fellesskap med Gud',
      ref: 'Rom 10,9-10; Fil 2,5-11; Joh 1,12; Ef 2,8',
      text: 'Vi tror at Jesus Kristus er Guds Sønn og ble menneske for vår skyld. Han døde for våre synder og sto opp igjen for å gi alle mennesker mulighet til fellesskap med Gud. Dette gis oss av nåde og mottas ved tro.'
    },
    {
      title: 'Den Hellige Ånd',
      ref: 'Matt 3,11; Apg 2,1-4; Apg 1,8; 1. Kor 12,7-11; Gal 5,22; 2. Kor 3,18; Rom 12,1-2',
      text: 'Vi tror at alle Guds barn har fått Den Hellige Ånd. Alle kan erfare Åndens dåp og fylde som utruster til liv og tjeneste. Det innebærer et liv preget av de frukter og de åndelige gaver som Det nye testamentet beskriver. Vi tror at Ånden hjelper oss til å leve et liv til Guds ære, slik at vår karakter og livsførsel forandres til større likhet med Jesus Kristus.'
    },
    {
      title: 'Dåp',
      ref: 'Matt 28,18-20; Mark 16,16; Apg 10,47-48; Kol 2,12; Rom 6,4-5,1; 1. Pet 3,21',
      text: 'Vi tror at dåpen er en god samvittighets pakt med Gud og en overgivelse til å etterfølge Jesus innenfor rammen av det kristne fellesskapet. Handlingen er en bekjennelse til Jesu død og oppstandelse, noe som uttrykkes ved at den som blir døpt senkes under vann og reises opp for å leve et nytt liv. Alle som kommer til tro på Jesus Kristus, døpes i den treene Guds navn.'
    },
    {
      title: 'Menighet',
      ref: 'Mar 16,15-20; Ef 4,11-16; Apg 20,28; Apg 2,47',
      text: 'Menigheten er Jesu Kristi kropp i verden. Den fortsetter Jesu tjeneste og skal være et fellesskap som lærer og utruster Guds barn til å følge Jesus Kristus. Hovedoppdraget er å fullføre misjonsbefalingen ved å gjøre Jesus kjent, trodd, elsket og etterfulgt blant mennesker som ennå ikke tror. Alle som bekjenner Jesus som Herre, er en del av den universelle kirke. Vi tror at alle kristne også hører hjemme i en lokal menighet.'
    },
    {
      title: 'Nattverd',
      ref: 'Matt 26,26-29; 1. Kor 10,16; 1. Kor 11,23-29',
      text: 'Jesus innstiftet nattverden. I nattverden forkynner vi at Jesus døde for våre synder. Vi feirer nattverd for å ha fellesskap med Jesus og hverandre. Nattverden er åpen for alle som tror på Jesus Kristus og som ønsker å leve i fellesskap med han.'
    },
    {
      title: 'Guds rike',
      ref: 'Heb 13,8; Matt 10,8; Luk 10,9; John 14,12; Jak 5,14-16',
      text: 'Vi tror at Guds rike er kommet nær ved Jesus, slik at Guds gode plan og vilje for mennesker kan erfares allerede nå. Slik Jesus formidlet oppreisning, liv og helbredelse til mennesker, formidler vi de samme mulighetene og ber i Jesu navn om helbredelse på alle livets områder. Samtidig er ikke dette riket kommet fullendt. Det vil skje når Jesus kommer tilbake.'
    },
    {
      title: 'Det kristne håpet',
      ref: '1. Tess 4,13-17; Matt 24,14; Matt 24,36-42; 1. Tess 4,14-17; 1. Kor 15,51-52; 1. Pet 13',
      text: 'Vi tror at Jesus Kristus skal komme tilbake for å hente sine og deretter opprette det fullendte Guds rike. Vi vil formidle håpet om kroppens oppstandelse og det evige liv. Vi tror på Bibelens ord om to utganger på livet, evig liv og evig død. Bibelen er tydelig på at det er gjennom Jesus Kristus vi blir frelst. På grunn av Jesu frelsesverk, trenger ingen å gå fortapt.'
    }
  ];

  const values = [
    { 
      title: 'Fellesskap', 
      desc: 'Vi ønsker å være et sted hvor mennesker kan møte Jesus og oppleve Guds nærvær, der alle føler seg velkomne, sett og verdsatt.' 
    },
    { 
      title: 'Barn og unge', 
      desc: 'Vi har et aktivt barne- og ungdomsarbeid, og ønsker å gi barn og ungdom en god start i livet med troen, så de velger å følge Jesus hele livet.' 
    },
    { 
      title: 'Misjon', 
      desc: 'Vi brenner for å dele evangeliet om Jesus og Guds kjærlighet både lokalt og globalt.' 
    }
  ];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen pt-32 pb-section-gap-lg"
    >
      {/* Intro section */}
      <section className="max-w-container-max mx-auto px-gutter mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
              <CmsText slug="about_intro_badge" fallback="Hvem er vi?" />
            </div>
            <CmsText 
              slug="about_intro_title" 
              fallback="Pinsemenigheten Betania Vigeland" 
              as="h1" 
              className="font-headline-xl text-headline-xl text-primary leading-tight break-words font-bold" 
            />
            <CmsText 
              slug="about_intro_desc1" 
              fallback="Vi er en levende Pinsemenighet som hører til nettverket De Frie Evangeliske Forsamlinger (DFEF) i Pinsebevegelsen. Vi holder til på vakre Vigeland i Lindesnes kommune." 
              as="p" 
              className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed" 
            />
            <CmsText 
              slug="about_intro_desc2" 
              fallback="Vår visjon for menigheten er: Å MØTE, FØLGE OG DELE JESUS. Vi ønsker å være en menighet der mennesker kan møte Jesus, lære å følge han, og dele Jesus med andre. Enten du er ny i området, søker et åndelig fellesskap, eller bare er nysgjerrig, er du hjertelig velkommen til å besøke oss!" 
              as="p" 
              className="font-body-md text-on-surface-variant leading-relaxed" 
            />
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAz2zpYPGPUpe45-xennM7jaczXt1wGXVTkT3hH8Suy4qye5Ot1IKD-ObzJqBmi7EQZa1DF5qH-xTfKFFvmNnvRH7GPI5GLMqI_zLepvV6PR9xkAGBtFhoubfPfVI9Ktj69UHX2yFvkGpOoo9Fq16ZlSN_l6El8d0U3zd73pyI85WFRbF-7K2Yo4uqbf-rEGpIR-a9d0M0s5WUcxx7kLSJAOenzeY4FQ1tRgHuMNuql_sps7BFHBLWBy9qwG9caifsm7NcO6MfCgcU')` }}
                data-alt="Inni Betania Vigeland"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg border border-surface-container flex items-center gap-4">
              <span className="material-symbols-outlined text-[40px] text-secondary">diversity_1</span>
              <div>
                <CmsText slug="about_badge_focus_title" fallback="Mennesker i fokus" as="span" className="block font-bold text-primary text-lg" />
                <CmsText slug="about_badge_focus_desc" fallback="Fellesskap for alle generasjoner" as="span" className="text-on-surface-variant font-label-md text-label-md" />
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Core Values Section */}
      <section className="bg-surface-container-low py-20 border-y border-surface-container mb-20">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
            <CmsText slug="about_values_badge" fallback="Vårt Fundament" />
          </div>
          <CmsText 
            slug="about_values_title" 
            fallback="Verdier vi strekker oss etter" 
            as="h2" 
            className="font-headline-lg text-headline-lg text-primary mt-2 mb-16 font-bold" 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-surface-container shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-secondary text-[32px] mb-4 block">favorite</span>
                <CmsText slug={`about_value_title_${idx}`} fallback={v.title} as="h3" className="font-headline-md text-headline-md text-primary mb-3 font-bold" />
                <CmsText slug={`about_value_desc_${idx}`} fallback={v.desc} as="p" className="text-on-surface-variant font-body-md leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaders & Contact Section */}
      <section className="max-w-container-max mx-auto px-gutter space-y-20 mb-20">
        {/* Menighetens ledelse */}
        <div>
          <div className="text-center mb-12">
            <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
              <CmsText slug="about_lead_badge" fallback="Styring & Åndelig lederskap" />
            </div>
            <CmsText 
              slug="about_lead_title" 
              fallback="Menighetens ledelse" 
              as="h2" 
              className="font-headline-lg text-headline-lg text-primary mt-2 font-bold" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ledelse.map((lead, idx) => (
              <div key={idx} className="group bg-surface-cream border border-surface-container rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="h-64 overflow-hidden relative bg-surface-container-high/40 flex items-center justify-center text-outline">
                  {lead.image ? (
                    <div 
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${lead.image}')` }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-on-surface-variant/30">
                      <span className="material-symbols-outlined text-[64px]">person</span>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <CmsText slug={`about_leader_name_${idx}`} fallback={lead.name} as="h3" className="font-headline-md text-headline-md text-primary mb-1 font-bold" />
                  <CmsText slug={`about_leader_role_${idx}`} fallback={lead.role} as="span" className="block text-secondary font-label-md text-label-md uppercase tracking-wider mb-4" />
                  <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-label-md text-label-md truncate block justify-center">
                    <span className="material-symbols-outlined text-[18px] align-middle mr-1">mail</span>
                    <span className="align-middle text-[13px]">{lead.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ansatte */}
        <div>
          <div className="text-center mb-12">
            <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
              <CmsText slug="about_staff_badge" fallback="Daglig drift & aktiviteter" />
            </div>
            <CmsText 
              slug="about_staff_title" 
              fallback="Ansatte" 
              as="h2" 
              className="font-headline-lg text-headline-lg text-primary mt-2 font-bold" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {ansatte.map((lead, idx) => (
              <div key={idx} className="group bg-surface-cream border border-surface-container rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="h-64 overflow-hidden relative bg-surface-container-high/40 flex items-center justify-center text-outline">
                  {lead.image ? (
                    <div 
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${lead.image}')` }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-on-surface-variant/30">
                      <span className="material-symbols-outlined text-[64px]">person</span>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <CmsText slug={`about_staff_name_${idx}`} fallback={lead.name} as="h3" className="font-headline-md text-headline-md text-primary mb-1 font-bold" />
                  <CmsText slug={`about_staff_role_${idx}`} fallback={lead.role} as="span" className="block text-secondary font-label-md text-label-md uppercase tracking-wider mb-4" />
                  <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-label-md text-label-md justify-center">
                    <span className="material-symbols-outlined text-[18px] align-middle mr-1">mail</span>
                    <span className="align-middle text-[13px]">{lead.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tro & Lære Section */}
      <section className="bg-surface-container-low py-20 border-t border-surface-container">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-16">
            <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
              <CmsText slug="about_beliefs_badge" fallback="Hva vi tror" />
            </div>
            <CmsText 
              slug="about_beliefs_title" 
              fallback="Vår tro og lære" 
              as="h2" 
              className="font-headline-lg text-headline-lg text-primary mt-2 font-bold" 
            />
            <CmsText 
              slug="about_beliefs_desc" 
              fallback="Pinsemenigheten Betania Vigeland bygger på bibelsk grunn. Her kan du lese mer om vårt teologiske fundament og lærepunkter." 
              as="p" 
              className="font-body-md text-on-surface-variant max-w-2xl mx-auto mt-4 text-[15px] leading-relaxed" 
            />
          </div>

          {/* Beliefs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {beliefs.map((b, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-surface-container shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <CmsText slug={`about_belief_title_${idx}`} fallback={b.title} as="h3" className="font-headline-md text-headline-lg text-primary font-bold" />
                    <span className="material-symbols-outlined text-secondary select-none">menu_book</span>
                  </div>
                  <CmsText slug={`about_belief_text_${idx}`} fallback={b.text} as="p" className="text-on-surface-variant font-body-md leading-relaxed text-[14px]" />
                </div>
                <div className="pt-4 border-t border-surface-container flex items-center gap-2 text-secondary/80 text-[12px] font-semibold italic mt-4">
                  <span className="material-symbols-outlined text-[16px] select-none">bookmark</span>
                  <CmsText slug={`about_belief_ref_${idx}`} fallback={b.ref} as="span" />
                </div>
              </div>
            ))}
          </div>

          {/* Apostles' Creed Card */}
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-secondary/30 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed opacity-20 rounded-bl-full pointer-events-none" />
            <div className="text-center space-y-6">
              <span className="material-symbols-outlined text-secondary text-[36px] select-none">workspace_premium</span>
              <CmsText slug="about_creed_title" fallback="Den apostoliske trosbekjennelse" as="h3" className="font-headline-md text-headline-lg text-primary font-bold" />
              <CmsText slug="about_creed_intro" fallback="Vi slutter oss til den apostoliske trosbekjennelsen som felles kristent fundament:" as="p" className="font-body-md text-on-surface-variant leading-relaxed italic max-w-xl mx-auto text-[14px]" />
              <div className="border-t border-b border-surface-container py-6 text-on-surface leading-relaxed font-body-md max-w-lg mx-auto text-[14px] space-y-4">
                <CmsText slug="about_creed_p1" fallback="Jeg tror på Gud Fader, den allmektige, himmelens og jordens skaper." as="p" />
                <CmsText slug="about_creed_p2" fallback="Jeg tror på Jesus Kristus, Guds enbårne Sønn, vår Herre, som ble unnfanget ved Den Hellige Ånd, født av jomfru Maria, pint under Pontius Pilatus, korsfestet, død og begravet, fór ned til dødsriket, stod opp fra de døde tredje dag, fór opp til himmelen, sitter ved Guds, den allmektige Faders høyre hånd, skal derfra komme igjen for å dømme levende og døde." as="p" />
                <CmsText slug="about_creed_p3" fallback="Jeg tror på Den Hellige Ånd, en hellig, allmenn kirke, de helliges samfunn, syndenes forlatelse, legemets oppstandelse og det evige liv." as="p" />
              </div>
              <span className="text-[13px] font-bold text-secondary uppercase tracking-widest block select-none">Amen</span>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
