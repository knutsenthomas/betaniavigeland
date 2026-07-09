import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gave() {
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text.replace(/\./g, '')); // Copy clean number without spaces/dots
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText('');
    }, 2000);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen pt-32 pb-24"
    >
      {/* Toast Notification for copying */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-primary text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-primary/10"
          >
            <span className="material-symbols-outlined text-secondary select-none">check_circle</span>
            <span className="font-label-md text-sm">{copiedText} kopiert til utklippstavlen!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-gutter mb-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-secondary font-bold uppercase tracking-wider text-xs px-3.5 py-1.5 rounded-full bg-secondary/10 inline-block">
            Givertjeneste
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary leading-tight font-bold">
            Gi en gave til Betania Vigeland
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed text-base">
            Vi er utrolig takknemlige for hver eneste gave som blir betrodd oss. Alt arbeid i Betania drives og finansieres av frivillige gaver fra medlemmer og støttespillere. Ditt bidrag gjør det mulig å drive et aktivt arbeid for barn, unge og voksne i lokalsamfunnet vårt.
          </p>
        </div>
      </section>

      {/* Giving Channels Grid */}
      <section className="max-w-container-max mx-auto px-gutter mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* VIPPS CARD */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 border border-surface-container shadow-sm flex flex-col justify-between h-full relative overflow-hidden"
          >
            <div className="space-y-6">
              {/* Header Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#ff5b24]/10 flex items-center justify-center text-[#ff5b24]">
                <span className="material-symbols-outlined text-[32px] select-none">smartphone</span>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Vipps</h3>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
                  Den enkleste måten å gi en enkeltgave eller gi kollekt under møtene våre. Søk opp menigheten eller skriv inn nummeret direkte.
                </p>
              </div>

              {/* Number display */}
              <div className="bg-surface-cream/50 rounded-2xl p-4 border border-surface-container/60 text-center">
                <span className="text-xs text-on-surface-variant block font-semibold mb-1">VIPPS-NUMMER</span>
                <span className="font-headline-md text-2xl font-black text-primary tracking-wide">106111</span>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleCopy('106111', 'Vippsnummer')}
                className="w-full bg-[#ff5b24] text-white py-3 rounded-full font-label-md text-sm flex items-center justify-center gap-2 hover:bg-[#e04f1f] transition-colors active:scale-98 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] select-none">content_copy</span>
                Kopier vippsnummer
              </button>
            </div>
          </motion.div>

          {/* DRIFTSKONTO CARD */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 border border-surface-container shadow-sm flex flex-col justify-between h-full relative overflow-hidden"
          >
            <div className="space-y-6">
              {/* Header Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#1B4965]/10 flex items-center justify-center text-[#1B4965]">
                <span className="material-symbols-outlined text-[32px] select-none">account_balance</span>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Driftskonto</h3>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
                  Brukes til faste månedlige bidrag (tiende), overføringer via nettbank og ordinære driftsgaver til menigheten.
                </p>
              </div>

              {/* Number display */}
              <div className="bg-surface-cream/50 rounded-2xl p-4 border border-surface-container/60 text-center">
                <span className="text-xs text-on-surface-variant block font-semibold mb-1">KONTONUMMER</span>
                <span className="font-headline-md text-xl font-bold text-primary tracking-wide">3138.07.03737</span>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleCopy('3138.07.03737', 'Driftskontonummer')}
                className="w-full bg-primary text-white py-3 rounded-full font-label-md text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors active:scale-98 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] select-none">content_copy</span>
                Kopier kontonummer
              </button>
            </div>
          </motion.div>

          {/* BYGGKONTO CARD */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 border border-surface-container shadow-sm flex flex-col justify-between h-full relative overflow-hidden"
          >
            <div className="space-y-6">
              {/* Header Icon */}
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[32px] select-none">home_work</span>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Byggkonto</h3>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
                  Brukes spesifikt til vedlikehold, oppgraderinger, oppussing og nedbetaling av lån på menighetsbygget vårt.
                </p>
              </div>

              {/* Number display */}
              <div className="bg-surface-cream/50 rounded-2xl p-4 border border-surface-container/60 text-center">
                <span className="text-xs text-on-surface-variant block font-semibold mb-1">KONTONUMMER BYGG</span>
                <span className="font-headline-md text-xl font-bold text-primary tracking-wide">3138.10.97393</span>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleCopy('3138.10.97393', 'Byggkontonummer')}
                className="w-full bg-secondary text-white py-3 rounded-full font-label-md text-sm flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors active:scale-98 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] select-none">content_copy</span>
                Kopier byggkonto
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Tax deduction & Fast Givertjeneste Info */}
      <section className="max-w-container-max mx-auto px-gutter">
        <div className="bg-surface-cream rounded-3xl p-8 md:p-12 border border-surface-container flex flex-col lg:flex-row gap-12 items-stretch shadow-sm">
          
          {/* Fast Givertjeneste info */}
          <div className="flex-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-headline-lg text-headline-lg text-primary font-bold">Fast givetjeneste</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                Ved å opprette et fast månedlig bidrag i nettbanken din hjelper du oss med å ha forutsigbarhet i økonomien. Dette gjør planlegging av barne- og ungdomsaktiviteter, misjonsprosjekter og lokalt arbeid mye enklere og tryggere.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary select-none text-[18px] mt-0.5">check</span>
                  <span>Opprettes som en fast månedlig betaling i egen nettbank.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary select-none text-[18px] mt-0.5">check</span>
                  <span>Valgfritt beløp og trekkdato.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary select-none text-[18px] mt-0.5">check</span>
                  <span>Kan avsluttes eller endres når som helst direkte i nettbanken.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-surface-container-high" />

          {/* Skattefradrag info */}
          <div className="flex-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-headline-lg text-headline-lg text-primary font-bold">Skattefradrag for gaver</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                Betania Vigeland er registrert hos Skatteetaten, og alle gaver gitt til menigheten gir rett til skattefradrag i tråd med gjeldende regler.
              </p>
              <div className="bg-white/60 border border-surface-container rounded-2xl p-5 space-y-3">
                <p className="text-xs text-on-surface-variant font-semibold">REGLER FOR SKATTEFRADRAG</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Du får fradrag på skatten for gaver mellom 500 kr og 25 000 kr per år. For at gaven skal rapporteres til Skatteetaten og utløse fradrag, må vi ha registrert fødselsnummeret ditt (11 siffer) i våre systemer.
                </p>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Ta kontakt med menighetens kasserer på epost <a href="mailto:post@betania-vigeland.no" className="text-secondary font-bold hover:underline">post@betania-vigeland.no</a> dersom du ønsker å registrere fødselsnummeret ditt for skattefradrag eller har spørsmål vedrørende gaver.
              </p>
            </div>
          </div>

        </div>
      </section>
    </motion.main>
  );
}
