import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CmsText from '@/components/CmsText';

export default function Rental() {
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    room: 'Storsalen',
    notes: ''
  });

  const rooms = [
    {
      title: 'Storsalen',
      capacity: 'Inntil 150 personer',
      price: 'kr. 3 000,- per dag',
      description: 'Lyst og moderne lokale med scene, topp moderne lydanlegg, prosjektor og trådløse mikrofoner. Ideelt for konfirmasjoner, større familieselskaper, minnesamvær eller seminarer.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?fit=crop&w=500&h=350&q=80',
      specs: ['Lydanlegg med mikrofoner', 'Prosjektor og lerret', 'Fleksibel bordoppstilling', 'Teleslynge']
    },
    {
      title: 'Kaféen / Lillesalen',
      capacity: 'Inntil 60 personer',
      price: 'kr. 1 500,- per dag',
      description: 'Et koseligere og mer intimt lokale i direkte tilknytning til kjøkkenet. Perfekt til mindre bursdager, foreningsmøter eller dåpsfester.',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?fit=crop&w=500&h=350&q=80',
      specs: ['Direkte tilgang til kjøkken', 'Sofagrupper og kafébord', 'Tv-skjerm til fremvisning', 'Godt med dagslys']
    },
    {
      title: 'Storkjøkkenet',
      capacity: 'Fullt utstyrt',
      price: 'Inkludert ved leie av saler',
      description: 'Moderne storkjøkken med industrioppvaskmaskin, kaffetraktere, stekeovner og komplett servise til 120 personer. Her har du alt du trenger for å tilberede og servere mat til gjestene dine.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?fit=crop&w=500&h=350&q=80',
      specs: ['Industrioppvaskmaskin', 'Store kaffetraktere', 'Kjølerom', 'Fullt dekketøy og bestikk']
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen pt-32 pb-section-gap-lg"
    >
      {/* Hero Header */}
      <section className="max-w-container-max mx-auto px-gutter mb-16">
        <div className="max-w-3xl">
          <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
            <CmsText slug="rental_hero_badge" fallback="Lokaler til leie" />
          </div>
          <CmsText 
            slug="rental_hero_title" 
            fallback="Lyse og moderne lokaler til livets store merkedager" 
            as="h1" 
            className="font-headline-xl text-headline-xl text-primary mt-2 mb-6 leading-tight font-bold" 
          />
          <CmsText 
            slug="rental_hero_desc" 
            fallback="Betania Vigeland har flotte, funksjonelle og universelt utformede lokaler som leies ut til private arrangementer, selskaper, møter og samlinger." 
            as="p" 
            className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed" 
          />
        </div>
      </section>

      {/* Rooms Overview */}
      <section className="max-w-container-max mx-auto px-gutter mb-20 space-y-16">
        {rooms.map((room, idx) => (
          <div key={room.title} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-surface-cream rounded-3xl overflow-hidden border border-surface-container shadow-sm p-6 lg:p-10">
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md">
                <div 
                  className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-500" 
                  style={{ backgroundImage: `url('${room.image}')` }}
                />
              </div>
            </div>
            <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div>
                <span className="text-secondary font-label-md text-label-md uppercase tracking-wider">{room.capacity}</span>
                <h3 className="font-headline-lg text-headline-lg text-primary mt-1">{room.title}</h3>
                <span className="block font-bold text-primary text-lg mt-2">{room.price}</span>
              </div>
              <p className="text-on-surface-variant font-body-md leading-relaxed">{room.description}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-surface-container">
                {room.specs.map(spec => (
                  <div key={spec} className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Rules and Booking inquiry */}
      <section className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Rules / Terms */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <CmsText 
                slug="rental_rules_title" 
                fallback="Regler og retningslinjer" 
                as="h2" 
                className="font-headline-lg text-headline-lg text-primary font-bold" 
              />
              <CmsText 
                slug="rental_rules_desc" 
                fallback="Vi ønsker at leieforholdet skal fungere knirkefritt. Siden dette er et menighetshus, har vi noen viktige kjøreregler for utleie:" 
                as="p" 
                className="font-body-md text-on-surface-variant leading-relaxed mt-2" 
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-[24px]">block</span>
                <div>
                  <CmsText slug="rental_rule1_title" fallback="Alkoholfritt arrangement" as="h4" className="font-bold text-primary text-md" />
                  <CmsText slug="rental_rule1_desc" fallback="Det er ikke tillatt å servere eller nyte alkohol eller andre rusmidler på huset eller uteområdet." as="p" className="text-on-surface-variant font-body-md mt-1" />
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-[24px]">cleaning_services</span>
                <div>
                  <CmsText slug="rental_rule2_title" fallback="Vask og rydding" as="h4" className="font-bold text-primary text-md" />
                  <CmsText slug="rental_rule2_desc" fallback="Leietaker er selv ansvarlig for oppvask, rydding av stoler og søppeltømming. Vask av gulv er inkludert i leieprisen." as="p" className="text-on-surface-variant font-body-md mt-1" />
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-[24px]">access_time</span>
                <div>
                  <CmsText slug="rental_rule3_title" fallback="Tidsfrister" as="h4" className="font-bold text-primary text-md" />
                  <CmsText slug="rental_rule3_desc" fallback="Leietaker disponerer lokalet fra kl. 08:00 på leiedagen, og må være ferdig ryddet og slukket senest kl. 23:00." as="p" className="text-on-surface-variant font-body-md mt-1" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-low border border-surface-container rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-primary text-md flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">contact_phone</span>
                Utleieansvarlig
              </h4>
              <p className="text-on-surface-variant font-body-md">For spørsmål om leie og tilgjengelighet, ta kontakt med:</p>
              <div className="space-y-1 font-body-md">
                <p className="font-bold text-primary text-lg">Jan Tore Tellefsen</p>
                <p className="text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">phone</span>
                  Mobil: <a href="tel:97055786" className="text-secondary hover:underline">97055786</a>
                </p>
                <p className="text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  E-post: <a href="mailto:jant_tellefsen@live.no" className="text-secondary hover:underline">jant_tellefsen@live.no</a>
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-cream border border-surface-container rounded-3xl p-8 lg:p-12 shadow-sm">
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Send leieforespørsel</h3>
              <p className="font-body-md text-on-surface-variant mb-8">
                Fyll ut skjemaet under, så kontakter vi deg for å bekrefte tilgjengelighet og avtale detaljer.
              </p>
              
              <AnimatePresence mode="wait">
                {inquirySent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-meadow-green/10 border border-meadow-green/30 p-8 rounded-2xl text-center space-y-4"
                  >
                    <span className="material-symbols-outlined text-[64px] text-meadow-green">check_circle</span>
                    <h4 className="font-headline-md text-headline-md text-primary">Takk for din forespørsel!</h4>
                    <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                      Vi har mottatt leieforespørselen din og vil sjekke kalenderen vår. Vi svarer deg normalt i løpet av 24-48 timer på e-post.
                    </p>
                    <button 
                      onClick={() => setInquirySent(false)}
                      className="mt-6 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:bg-primary-container transition-all"
                    >
                      Send en ny forespørsel
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Ditt navn *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-background border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">E-postadresse *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-background border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Telefonnummer *</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-background border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Ønsket dato *</label>
                        <input 
                          type="date" 
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-background border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Velg lokale *</label>
                      <select 
                        value={formData.room}
                        onChange={(e) => setFormData({...formData, room: e.target.value})}
                        className="w-full bg-background border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                      >
                        <option>Storsalen</option>
                        <option>Kaféen / Lillesalen</option>
                        <option>Både Storsalen og Kaféen</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Tilleggsinformasjon</label>
                      <textarea 
                        rows="4" 
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Skriv gjerne litt om hva slags arrangement du planlegger..."
                        className="w-full bg-background border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                      />
                    </div>
                    <button type="submit" className="w-full bg-secondary text-on-tertiary py-4 rounded-xl font-label-md text-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-all shadow-md active:scale-98">
                      Send forespørsel
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
