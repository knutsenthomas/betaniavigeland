import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
  const { user, logout } = useAuth();
  const { 
    cmsContent, 
    siteSettings, 
    updateSiteSettings, 
    isAdminEditing, 
    setIsAdminEditing,
    events
  } = useContent();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('oversikt');

  // Redirection guard
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Local state copy of site settings for form edits
  const [localSettings, setLocalSettings] = useState(null);

  // Sync local state when siteSettings load
  React.useEffect(() => {
    if (siteSettings) {
      const copy = JSON.parse(JSON.stringify(siteSettings));
      if (!copy.leadership) {
        copy.leadership = [
          { name: "Glenn Gundersen", role: "Leder av Interimsstyre", email: "glenn@lindesnesbygg.no", image: "" },
          { name: "Anja Cisilie Ødegård", role: "Medlem av Interimsstyre", email: "anjacisilie@hotmail.com", image: "" },
          { name: "Anders Gabrielsen", role: "Medlem av Eldsterådet", email: "anders@betania-vigeland.no", image: "" },
          { name: "Andreas Høiland", role: "Medlem av Eldsterådet", email: "andreas_az@hotmail.com", image: "" },
          { name: "Line-Anette H. Larsen", role: "Medlem av Eldsterådet", email: "line-anettelarsen@hotmail.com", image: "" },
          { name: "Brita Haga Gundersen", role: "Medlem av Eldsterådet", email: "britahg@online.no", image: "" }
        ];
      }
      if (!copy.staff) {
        copy.staff = [
          { name: "Vidar Tjomsland", role: "Administrasjon & Regnskap", email: "post@betania-vigeland.no", image: "" },
          { name: "Andreas Høiland", role: "Leder for ungdomsarbeidet Awake", email: "andreas_az@hotmail.com", image: "" }
        ];
      }
      if (!copy.rental_contact) {
        copy.rental_contact = {
          name: "Jan Tore Tellefsen",
          phone: "97055786",
          email: "jant_tellefsen@live.no"
        };
      }
      if (!copy.monthly_program) {
        copy.monthly_program = {
          enabled: false,
          url: "",
          filename: "",
          file_data: ""
        };
      }
      setLocalSettings(copy);
    }
  }, [siteSettings]);

  // Save settings helper
  const [saveStatus, setSaveStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSave = async (updated) => {
    const settingsToSave = updated || localSettings;
    setSaveStatus('lagrer');
    setErrorMessage('');
    try {
      await updateSiteSettings(settingsToSave);
      setSaveStatus('suksess');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('feil');
      setErrorMessage(e.message || 'Ukjent feil');
      setTimeout(() => setSaveStatus(''), 6000);
    }
  };

  // Google Calendar test sync state
  const [syncTestLoading, setSyncTestLoading] = useState(false);
  const [syncTestResult, setSyncTestResult] = useState(null);

  const handleTestCalendarSync = async () => {
    if (!localSettings) return;
    const { calendar_id, api_key } = localSettings.calendar_sync;
    
    if (!calendar_id || !api_key) {
      setSyncTestResult({
        success: false,
        error: 'Du må fylle inn både Kalender-ID og API-nøkkel før du kan teste.'
      });
      return;
    }

    setSyncTestLoading(true);
    setSyncTestResult(null);

    try {
      const timeMin = new Date().toISOString();
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}/events?key=${encodeURIComponent(api_key)}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=5`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || `Google Calendar API status ${res.status}`);
      }

      const items = data.items || [];
      setSyncTestResult({
        success: true,
        eventsFound: items.length,
        preview: items.map(item => ({
          title: item.summary,
          start: item.start.dateTime || item.start.date,
          location: item.location || 'Ikke oppgitt'
        }))
      });
    } catch (err) {
      setSyncTestResult({
        success: false,
        error: err.message || 'Klarte ikke koble til Google Calendar API.'
      });
    } finally {
      setSyncTestLoading(false);
    }
  };

  const compressAndSetImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed jpeg
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  if (!user || !localSettings) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Sidebar Menu Items
  const menuItems = [
    { id: 'oversikt', label: 'Oversikt', icon: 'dashboard' },
    { id: 'sommerinfo', label: 'Sommerferie-info', icon: 'wb_sunny' },
    { id: 'okonomi', label: 'Økonomi & Vipps', icon: 'payments' },
    { id: 'lenker', label: 'Sosiale Medier & Info', icon: 'link' },
    { id: 'mennesker', label: 'Ledelse & Kontakt', icon: 'groups' },
    { id: 'kalender', label: 'Google Kalender', icon: 'calendar_month' },
    { id: 'visuell-cms', label: 'Visuell CMS', icon: 'design_services' },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex font-sans text-on-surface">
      {/* 1. Left Vertical Sidebar Menu (Fixed position, full height) */}
      <aside className="w-64 h-screen bg-primary text-white flex flex-col justify-between fixed top-0 left-0 z-30 shadow-lg border-r border-white/5">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <img 
              src="/logo-icon.png?v=2" 
              alt="Betania Vigeland Logo" 
              className="w-8 h-8 object-contain shrink-0" 
            />
            <div>
              <h1 className="font-bold text-base tracking-wide leading-tight">Betania Vigeland</h1>
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Kontrollpanel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSyncTestResult(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-[0.98] ${
                    isActive 
                      ? 'bg-secondary text-white shadow-md' 
                      : 'text-white/75 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-white/75 hover:bg-white/5 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">public</span>
            <span>Gå til nettsted</span>
          </button>
          
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-white/75 hover:bg-white/5 hover:text-white transition-all border border-white/10 hover:border-white/20"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Logg ut</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper (Shifted right by sidebar width) */}
      <main className="pl-64 flex-1 min-h-screen flex flex-col relative">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-surface-container px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <h2 className="font-headline-md text-headline-sm text-primary capitalize font-bold">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full border border-surface-container">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Innlogget som <strong>{user?.name}</strong></span>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="p-8 md:p-10 flex-1 w-full max-w-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 w-full"
            >
              
              {/* === OVERSIKT PANEL === */}
              {activeTab === 'oversikt' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-surface-container p-6 shadow-sm">
                    <h3 className="font-headline-sm text-title-lg text-primary mb-2 font-bold">Velkommen til administrasjonssiden!</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Her har du full oversikt over menighetens nettside. Du kan bruke menyen til venstre for å slå av/på sommerbanneret, oppdatere Vipps- og bankkontonummer, legge inn sosiale lenker, eller synkronisere arrangementer direkte fra Google Kalender.
                    </p>
                  </div>

                  {/* Status Grid (KPI Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Database status */}
                    <div className="bg-white p-5 rounded-2xl border border-surface-container flex items-start gap-4 shadow-sm">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <span className="material-symbols-outlined text-[24px]">database</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Database</span>
                        <h4 className="font-bold text-sm text-primary">Vercel Postgres</h4>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Tilkoblet
                        </span>
                      </div>
                    </div>

                    {/* Sommerferie status */}
                    <div className="bg-white p-5 rounded-2xl border border-surface-container flex items-start gap-4 shadow-sm">
                      <div className={`p-3 rounded-xl ${localSettings.show_summer_banner ? 'bg-amber-50 text-amber-600' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[24px]">wb_sunny</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Sommerferie-banner</span>
                        <h4 className="font-bold text-sm text-primary">Konferanse & Info</h4>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          localSettings.show_summer_banner 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                          {localSettings.show_summer_banner ? 'Aktivt' : 'Deaktivert'}
                        </span>
                      </div>
                    </div>

                    {/* Google Calendar status */}
                    <div className="bg-white p-5 rounded-2xl border border-surface-container flex items-start gap-4 shadow-sm">
                      <div className={`p-3 rounded-xl ${localSettings.calendar_sync.enabled ? 'bg-blue-50 text-blue-600' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Google Kalender-synk</span>
                        <h4 className="font-bold text-sm text-primary">Automatisk oppdatering</h4>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          localSettings.calendar_sync.enabled 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                          {localSettings.calendar_sync.enabled ? 'Aktiv' : 'Deaktivert'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Instructions Card */}
                  <div className="bg-white rounded-3xl border border-surface-container p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Slik bruker du Visuell CMS-redigering:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-on-surface-variant leading-relaxed">
                      <div className="space-y-2">
                        <div className="h-6 w-6 rounded-full bg-secondary text-white font-bold flex items-center justify-center">1</div>
                        <p>Gå til <strong>«Visuell CMS»</strong>-fanen eller klikk <strong>«Gå til nettsted»</strong> nederst i menyen.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 w-6 rounded-full bg-secondary text-white font-bold flex items-center justify-center">2</div>
                        <p>Klikk på den flytende <strong>«CMS Editor»</strong>-knappen nederst til høyre og trykk <strong>«Rediger»</strong>.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 w-6 rounded-full bg-secondary text-white font-bold flex items-center justify-center">3</div>
                        <p>Klikk direkte på en tekst med stiplet ramme for å endre den. Klikk utenfor for å lagre endringen live!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === SOMMERINFO PANEL === */}
              {activeTab === 'sommerinfo' && (
                <div className="space-y-6">
                  {/* Status Toggle */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Vis banner på nettsiden</h4>
                      <p className="text-xs text-on-surface-variant mt-1">Slå av eller på sommerferieboksen på kalender-siden.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={localSettings.show_summer_banner}
                        onChange={(e) => {
                          const updated = { ...localSettings, show_summer_banner: e.target.checked };
                          setLocalSettings(updated);
                          handleSave(updated);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-surface-container after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  {localSettings.show_summer_banner && (
                    <>
                      {/* Banner text edit fields */}
                      <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
                        <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-4">Tekstinnhold i banneret</h4>
                        
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Badge-merkelapp</label>
                          <input
                            type="text"
                            value={localSettings.summer_banner.badge}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              summer_banner: { ...localSettings.summer_banner, badge: e.target.value }
                            })}
                            className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Hovedoverskrift</label>
                          <input
                            type="text"
                            value={localSettings.summer_banner.title}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              summer_banner: { ...localSettings.summer_banner, title: e.target.value }
                            })}
                            className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Paragraf 1 (Hovedinfo)</label>
                          <textarea
                            rows={3}
                            value={localSettings.summer_banner.text1}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              summer_banner: { ...localSettings.summer_banner, text1: e.target.value }
                            })}
                            className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm leading-relaxed"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Paragraf 2 (Oppfordring)</label>
                          <textarea
                            rows={2}
                            value={localSettings.summer_banner.text2}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              summer_banner: { ...localSettings.summer_banner, text2: e.target.value }
                            })}
                            className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Banner recommended conventions link manager */}
                      <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-surface-container pb-4">
                          <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Anbefalte sommerstevner & linker</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const links = [...localSettings.summer_banner.links, { label: 'Nytt Stevne', sublabel: 'Se program', url: 'https://' }];
                              setLocalSettings({
                                ...localSettings,
                                summer_banner: { ...localSettings.summer_banner, links }
                              });
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#153a51] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            <span>Legg til</span>
                          </button>
                        </div>

                        <div className="space-y-6">
                          {localSettings.summer_banner.links.map((link, idx) => (
                            <div key={idx} className="p-4 bg-surface-container-low border border-surface-container rounded-2xl relative space-y-3">
                              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const links = localSettings.summer_banner.links.filter((_, i) => i !== idx);
                                    setLocalSettings({
                                      ...localSettings,
                                      summer_banner: { ...localSettings.summer_banner, links }
                                    });
                                  }}
                                  className="p-1.5 text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                                  title="Fjern lenke"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </div>

                              <span className="inline-block text-[10px] font-bold text-secondary uppercase tracking-widest">Link #{idx + 1}</span>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase text-on-surface-variant">Overskrift / Tittel</label>
                                  <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => {
                                      const links = [...localSettings.summer_banner.links];
                                      links[idx].label = e.target.value;
                                      setLocalSettings({
                                        ...localSettings,
                                        summer_banner: { ...localSettings.summer_banner, links }
                                      });
                                    }}
                                    className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase text-on-surface-variant">Undertittel / Beskrivelse</label>
                                  <input
                                    type="text"
                                    value={link.sublabel}
                                    onChange={(e) => {
                                      const links = [...localSettings.summer_banner.links];
                                      links[idx].sublabel = e.target.value;
                                      setLocalSettings({
                                        ...localSettings,
                                        summer_banner: { ...localSettings.summer_banner, links }
                                      });
                                    }}
                                    className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-on-surface-variant">Ekstern Nettadresse (URL)</label>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => {
                                    const links = [...localSettings.summer_banner.links];
                                    links[idx].url = e.target.value;
                                    setLocalSettings({
                                      ...localSettings,
                                      summer_banner: { ...localSettings.summer_banner, links }
                                    });
                                  }}
                                  className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Save button panel */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      className="px-6 py-3.5 bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Lagre endringer</span>
                    </button>
                    {saveStatus === 'lagrer' && <span className="text-xs text-on-surface-variant animate-pulse">Lagrer til database...</span>}
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Endringer lagret!</span>}
                    {saveStatus === 'feil' && <span className="text-xs text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> Feil ved lagring: {errorMessage}</span>}
                  </div>
                </div>
              )}

              {/* === ØKONOMI PANEL === */}
              {activeTab === 'okonomi' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
                    <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-4">Gaveinnbetaling og Økonomi</h4>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Vipps-nummer</label>
                      <input
                        type="text"
                        value={localSettings.platform_links.vipps}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          platform_links: { ...localSettings.platform_links, vipps: e.target.value }
                        })}
                        className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Bankkontonummer</label>
                      <input
                        type="text"
                        value={localSettings.platform_links.konto}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          platform_links: { ...localSettings.platform_links, konto: e.target.value }
                        })}
                        className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      className="px-6 py-3.5 bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Lagre endringer</span>
                    </button>
                    {saveStatus === 'lagrer' && <span className="text-xs text-on-surface-variant animate-pulse">Lagrer...</span>}
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Lagret!</span>}
                    {saveStatus === 'feil' && <span className="text-xs text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> Feil ved lagring: {errorMessage}</span>}
                  </div>
                </div>
              )}

              {/* === LENKER PANEL === */}
              {activeTab === 'lenker' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
                    <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-4">Sosiale Medier & Podcast Lenker</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Facebook Side</label>
                        <input
                          type="text"
                          value={localSettings.platform_links.facebook}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, facebook: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Instagram Profil</label>
                        <input
                          type="text"
                          value={localSettings.platform_links.instagram}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, instagram: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">YouTube Kanal</label>
                        <input
                          type="text"
                          value={localSettings.platform_links.youtube}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, youtube: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Spotify Podcast</label>
                        <input
                          type="text"
                          value={localSettings.platform_links.spotify}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, spotify: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                          placeholder="https://open.spotify.com/..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Apple Podcasts</label>
                        <input
                          type="text"
                          value={localSettings.platform_links.apple_podcasts}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, apple_podcasts: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Podbean Hjemmeside</label>
                        <input
                          type="text"
                          value={localSettings.platform_links.podbean || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, podbean: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Podcast RSS-feed (XML) URL</label>
                        <input
                          type="text"
                          placeholder="Standard: https://feed.podbean.com/betania-vigeland/feed.xml"
                          value={localSettings.platform_links.podcast_rss || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, podcast_rss: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* === BESØK OG KONTAKTINFO === */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-4 mt-6">
                    <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-4">Besøk & Kontaktinfo (Footer)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Epostadresse</label>
                        <input
                          type="email"
                          value={localSettings.platform_links?.email || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: {
                              ...localSettings.platform_links,
                              email: e.target.value
                            }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                          placeholder="post@betania-vigeland.no"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Adresse Linje 1</label>
                        <input
                          type="text"
                          value={localSettings.platform_links?.address_line1 || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: {
                              ...localSettings.platform_links,
                              address_line1: e.target.value
                            }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                          placeholder="Elveveien 6"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Adresse Linje 2</label>
                        <input
                          type="text"
                          value={localSettings.platform_links?.address_line2 || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: {
                              ...localSettings.platform_links,
                              address_line2: e.target.value
                            }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                          placeholder="4520 Lindesnes"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Footer Beskrivelse</label>
                        <textarea
                          rows="2"
                          value={localSettings.platform_links?.footer_description || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: {
                              ...localSettings.platform_links,
                              footer_description: e.target.value
                            }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs resize-none"
                          placeholder="En lokal menighet tilknyttet..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      className="px-6 py-3.5 bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Lagre endringer</span>
                    </button>
                    {saveStatus === 'lagrer' && <span className="text-xs text-on-surface-variant animate-pulse">Lagrer...</span>}
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Lagret!</span>}
                    {saveStatus === 'feil' && <span className="text-xs text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> Feil ved lagring: {errorMessage}</span>}
                  </div>
                </div>
              )}

              {/* === MENNESKER (LEDELSE & ANSATTE) PANEL === */}
              {activeTab === 'mennesker' && (
                <div className="space-y-6">
                  {/* UTLEIEANSVARLIG */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
                    <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-4">Utleieansvarlig Kontaktperson</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Navn</label>
                        <input
                          type="text"
                          value={localSettings.rental_contact?.name || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            rental_contact: {
                              ...localSettings.rental_contact,
                              name: e.target.value
                            }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs font-semibold text-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Telefon</label>
                        <input
                          type="text"
                          value={localSettings.rental_contact?.phone || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            rental_contact: {
                              ...localSettings.rental_contact,
                              phone: e.target.value
                            }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">E-post</label>
                        <input
                          type="email"
                          value={localSettings.rental_contact?.email || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            rental_contact: {
                              ...localSettings.rental_contact,
                              email: e.target.value
                            }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LEDERRAAD LIST */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-surface-container pb-4">
                      <div>
                        <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Menighetsledelse / Lederråd</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Styrer hvem som vises i lederråd-seksjonen på Om Oss-siden.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const leadership = [...(localSettings.leadership || [])];
                          leadership.push({ name: '', role: '', email: '', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=300&h=300&q=80' });
                          setLocalSettings({ ...localSettings, leadership });
                        }}
                        className="px-4 py-2 bg-secondary hover:bg-secondary-container text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>Legg til leder</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {(localSettings.leadership || []).map((person, idx) => (
                        <div key={idx} className="p-4 bg-surface-container-lowest rounded-2xl border border-surface-container flex flex-col md:flex-row gap-4 items-start md:items-end justify-between relative group">
                          <button
                            type="button"
                            onClick={() => {
                              const leadership = localSettings.leadership.filter((_, i) => i !== idx);
                              setLocalSettings({ ...localSettings, leadership });
                            }}
                            className="absolute top-4 right-4 text-outline hover:text-secondary transition-colors"
                            title="Slett denne lederen"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>

                          <div className="flex-1 space-y-4 min-w-0">
                            {/* Rad 1: Navn, Rolle, E-post */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Navn</label>
                                <input
                                  type="text"
                                  value={person.name}
                                  onChange={(e) => {
                                    const leadership = [...localSettings.leadership];
                                    leadership[idx].name = e.target.value;
                                    setLocalSettings({ ...localSettings, leadership });
                                  }}
                                  className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs font-semibold text-primary"
                                  placeholder="Fullt navn"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Rolle / Tittel</label>
                                <input
                                  type="text"
                                  value={person.role}
                                  onChange={(e) => {
                                    const leadership = [...localSettings.leadership];
                                    leadership[idx].role = e.target.value;
                                    setLocalSettings({ ...localSettings, leadership });
                                  }}
                                  className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs"
                                  placeholder="F.eks. Medlem av Eldsterådet"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">E-post</label>
                                <input
                                  type="email"
                                  value={person.email}
                                  onChange={(e) => {
                                    const leadership = [...localSettings.leadership];
                                    leadership[idx].email = e.target.value;
                                    setLocalSettings({ ...localSettings, leadership });
                                  }}
                                  className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs"
                                  placeholder="navn@epost.no"
                                />
                              </div>
                            </div>

                            {/* Rad 2: Bilde (Upload & URL) */}
                            <div className="pt-3 border-t border-surface-container-high/50">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Bilde</label>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl border border-surface-container bg-surface-cream shrink-0 shadow-sm flex items-center justify-center text-on-surface-variant/30 overflow-hidden">
                                  {person.image ? (
                                    <img 
                                      src={person.image} 
                                      alt="Leder" 
                                      className="w-full h-full object-cover" 
                                    />
                                  ) : (
                                    <span className="material-symbols-outlined text-[24px]">person</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`leadership-img-${idx}`}
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;
                                      compressAndSetImage(file, (compressedUrl) => {
                                        const leadership = [...localSettings.leadership];
                                        leadership[idx].image = compressedUrl;
                                        setLocalSettings({ ...localSettings, leadership });
                                      });
                                    }}
                                  />
                                  <label
                                    htmlFor={`leadership-img-${idx}`}
                                    className="cursor-pointer px-3.5 py-2.5 bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">upload</span>
                                    Last opp
                                  </label>
                                  {person.image && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const leadership = [...localSettings.leadership];
                                        leadership[idx].image = '';
                                        setLocalSettings({ ...localSettings, leadership });
                                      }}
                                      className="px-3.5 py-2.5 bg-outline-variant hover:bg-outline text-on-surface text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                                    >
                                      Fjern
                                    </button>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={person.image || ''}
                                  onChange={(e) => {
                                    const leadership = [...localSettings.leadership];
                                    leadership[idx].image = e.target.value;
                                    setLocalSettings({ ...localSettings, leadership });
                                  }}
                                  className="flex-1 p-2.5 bg-white border border-surface-container rounded-xl text-xs font-mono truncate"
                                  placeholder="Eller lim inn bilde-URL (https://...)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(localSettings.leadership || []).length === 0 && (
                        <p className="text-xs text-on-surface-variant italic py-4 text-center">Ingen personer lagt til i lederrådet ennå.</p>
                      )}
                    </div>
                  </div>

                  {/* STAFF LIST */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-surface-container pb-4">
                      <div>
                        <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Ansatte / Medarbeidere</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Styrer hvem som vises i ansatt-seksjonen på Om Oss-siden.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const staff = [...(localSettings.staff || [])];
                          staff.push({ name: '', role: '', email: '', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=300&h=300&q=80' });
                          setLocalSettings({ ...localSettings, staff });
                        }}
                        className="px-4 py-2 bg-secondary hover:bg-secondary-container text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>Legg til ansatt</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {(localSettings.staff || []).map((person, idx) => (
                        <div key={idx} className="p-4 bg-surface-container-lowest rounded-2xl border border-surface-container flex flex-col md:flex-row gap-4 items-start md:items-end justify-between relative group">
                          <button
                            type="button"
                            onClick={() => {
                              const staff = localSettings.staff.filter((_, i) => i !== idx);
                              setLocalSettings({ ...localSettings, staff });
                            }}
                            className="absolute top-4 right-4 text-outline hover:text-secondary transition-colors"
                            title="Slett denne ansatte"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>

                          <div className="flex-1 space-y-4 min-w-0">
                            {/* Rad 1: Navn, Rolle, E-post */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Navn</label>
                                <input
                                  type="text"
                                  value={person.name}
                                  onChange={(e) => {
                                    const staff = [...localSettings.staff];
                                    staff[idx].name = e.target.value;
                                    setLocalSettings({ ...localSettings, staff });
                                  }}
                                  className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs font-semibold text-primary"
                                  placeholder="Fullt navn"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Rolle / Tittel</label>
                                <input
                                  type="text"
                                  value={person.role}
                                  onChange={(e) => {
                                    const staff = [...localSettings.staff];
                                    staff[idx].role = e.target.value;
                                    setLocalSettings({ ...localSettings, staff });
                                  }}
                                  className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs"
                                  placeholder="F.eks. Barne- og ungdomsarbeider"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">E-post</label>
                                <input
                                  type="email"
                                  value={person.email}
                                  onChange={(e) => {
                                    const staff = [...localSettings.staff];
                                    staff[idx].email = e.target.value;
                                    setLocalSettings({ ...localSettings, staff });
                                  }}
                                  className="w-full p-2.5 bg-white border border-surface-container rounded-xl text-xs"
                                  placeholder="navn@epost.no"
                                />
                              </div>
                            </div>

                            {/* Rad 2: Bilde (Upload & URL) */}
                            <div className="pt-3 border-t border-surface-container-high/50">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Bilde</label>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl border border-surface-container bg-surface-cream shrink-0 shadow-sm flex items-center justify-center text-on-surface-variant/30 overflow-hidden">
                                  {person.image ? (
                                    <img 
                                      src={person.image} 
                                      alt="Ansatt" 
                                      className="w-full h-full object-cover" 
                                    />
                                  ) : (
                                    <span className="material-symbols-outlined text-[24px]">person</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`staff-img-${idx}`}
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;
                                      compressAndSetImage(file, (compressedUrl) => {
                                        const staff = [...localSettings.staff];
                                        staff[idx].image = compressedUrl;
                                        setLocalSettings({ ...localSettings, staff });
                                      });
                                    }}
                                  />
                                  <label
                                    htmlFor={`staff-img-${idx}`}
                                    className="cursor-pointer px-3.5 py-2.5 bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">upload</span>
                                    Last opp
                                  </label>
                                  {person.image && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const staff = [...localSettings.staff];
                                        staff[idx].image = '';
                                        setLocalSettings({ ...localSettings, staff });
                                      }}
                                      className="px-3.5 py-2.5 bg-outline-variant hover:bg-outline text-on-surface text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                                    >
                                      Fjern
                                    </button>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={person.image || ''}
                                  onChange={(e) => {
                                    const staff = [...localSettings.staff];
                                    staff[idx].image = e.target.value;
                                    setLocalSettings({ ...localSettings, staff });
                                  }}
                                  className="flex-1 p-2.5 bg-white border border-surface-container rounded-xl text-xs font-mono truncate"
                                  placeholder="Eller lim inn bilde-URL (https://...)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(localSettings.staff || []).length === 0 && (
                        <p className="text-xs text-on-surface-variant italic py-4 text-center">Ingen personer lagt til blant de ansatte ennå.</p>
                      )}
                    </div>
                  </div>

                  {/* SAVE BUTTON */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      className="px-6 py-3.5 bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Lagre endringer</span>
                    </button>
                    {saveStatus === 'lagrer' && <span className="text-xs text-on-surface-variant animate-pulse">Lagrer...</span>}
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Lagret!</span>}
                    {saveStatus === 'feil' && <span className="text-xs text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> Feil ved lagring: {errorMessage}</span>}
                  </div>
                </div>
              )}

              {/* === GOOGLE KALENDER PANEL === */}
              {activeTab === 'kalender' && (
                <div className="space-y-6">
                  {/* Calendar synchronization settings */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-surface-container pb-4">
                      <div>
                        <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Synkroniser fra Google Kalender</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Henter og viser arrangementer automatisk på kalendersiden.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={localSettings.calendar_sync.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...localSettings,
                              calendar_sync: { ...localSettings.calendar_sync, enabled: e.target.checked }
                            };
                            setLocalSettings(updated);
                            handleSave(updated);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-surface-container after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
                      </label>
                    </div>

                    {localSettings.calendar_sync.enabled && (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Google Calendar ID</label>
                          <input
                            type="text"
                            value={localSettings.calendar_sync.calendar_id}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              calendar_sync: { ...localSettings.calendar_sync, calendar_id: e.target.value }
                            })}
                            className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm"
                            placeholder="f.eks. menighet-kalender@gmail.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Google API Nøkkel (Calendar API enabled)</label>
                          <input
                            type="password"
                            value={localSettings.calendar_sync.api_key}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              calendar_sync: { ...localSettings.calendar_sync, api_key: e.target.value }
                            })}
                            className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm"
                            placeholder="AIzaSy..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {localSettings.calendar_sync.enabled && (
                    /* Google Calendar Sync Test Diagnostics */
                    <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
                      <h4 className="font-bold text-primary text-sm uppercase tracking-widest border-b border-surface-container pb-3">Test Kalender-tilkobling</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Test om de gitte kalendernøklene er gyldige og at kalenderen er satt til «Offentlig» i Google Calendar.
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={handleTestCalendarSync}
                          disabled={syncTestLoading}
                          className="px-4 py-2 bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {syncTestLoading ? (
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className="material-symbols-outlined text-[16px]">sync</span>
                          )}
                          <span>Kjør Test Synk</span>
                        </button>
                      </div>

                      {/* Display test result */}
                      {syncTestResult && (
                        <div className={`p-4 rounded-2xl border text-xs leading-relaxed mt-4 ${
                          syncTestResult.success 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-250/20' 
                            : 'bg-secondary/5 text-secondary border-secondary/15'
                        }`}>
                          {syncTestResult.success ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 font-bold text-sm">
                                <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                                <span>Tilkobling vellykket! Fant {syncTestResult.eventsFound} arrangementer.</span>
                              </div>
                              <div className="space-y-2 border-t border-emerald-200/30 pt-3">
                                <h5 className="font-bold uppercase tracking-wider text-[10px]">Arrangementer (første 5):</h5>
                                <ul className="list-disc pl-4 space-y-1">
                                  {syncTestResult.preview.map((evt, idx) => (
                                    <li key={idx}>
                                      <strong>{evt.title}</strong> - {new Date(evt.start).toLocaleDateString('no-NO')} (Sted: {evt.location})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-bold text-sm">
                                <span className="material-symbols-outlined text-secondary text-[18px]">error</span>
                                <span>Tilkobling feilet</span>
                              </div>
                              <p className="mt-1 font-mono text-[11px] bg-white/50 p-2 rounded-lg border border-secondary/10">{syncTestResult.error}</p>
                              <p className="mt-2 text-[10px] text-on-surface-variant">
                                Merk: Kalenderen må være delt offentlig («Gjør tilgjengelig for offentligheten») i Google Calendar-innstillingene dine.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* MÅNEDSPROGRAM CARD */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-surface-container pb-4">
                      <div>
                        <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Månedsprogram (PDF / Vedlegg / Lenke)</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Gjør det mulig å vise en nedlastbar PDF eller ekstern lenke til månedsprogrammet på kalendersiden.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={localSettings.monthly_program?.enabled || false}
                          onChange={(e) => {
                            const updated = {
                              ...localSettings,
                              monthly_program: { 
                                ...localSettings.monthly_program, 
                                enabled: e.target.checked 
                              }
                            };
                            setLocalSettings(updated);
                            handleSave(updated);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-surface-container after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
                      </label>
                    </div>

                    {(localSettings.monthly_program?.enabled) && (
                      <div className="space-y-4 pt-2">
                        {/* URL link */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Ekstern lenke til programmet (valgfritt)</label>
                          <input
                            type="url"
                            value={localSettings.monthly_program?.url || ''}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              monthly_program: {
                                ...localSettings.monthly_program,
                                url: e.target.value
                              }
                            })}
                            className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-sm"
                            placeholder="https://example.com/mitt-program"
                          />
                        </div>

                        {/* File upload */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Last opp PDF-vedlegg (valgfritt)</label>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                accept="application/pdf"
                                id="pdf-upload"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  if (file.type !== 'application/pdf') {
                                    alert('Vennligst velg en gyldig PDF-fil.');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setLocalSettings({
                                      ...localSettings,
                                      monthly_program: {
                                        ...localSettings.monthly_program,
                                        enabled: true,
                                        filename: file.name,
                                        file_data: event.target.result,
                                        url: localSettings.monthly_program?.url || ''
                                      }
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                              <label
                                htmlFor="pdf-upload"
                                className="cursor-pointer px-4 py-2.5 bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                              >
                                <span className="material-symbols-outlined text-[18px]">upload</span>
                                Velg PDF-fil
                              </label>

                              {localSettings.monthly_program?.file_data && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLocalSettings({
                                      ...localSettings,
                                      monthly_program: {
                                        ...localSettings.monthly_program,
                                        filename: '',
                                        file_data: ''
                                      }
                                    });
                                  }}
                                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                  Slett vedlegg
                                </button>
                              )}
                            </div>

                            {localSettings.monthly_program?.filename ? (
                              <p className="text-xs text-on-surface-variant font-mono flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-emerald-600">attachment</span>
                                Aktivt vedlegg: <span className="font-bold text-primary">{localSettings.monthly_program.filename}</span>
                              </p>
                            ) : (
                              <p className="text-xs text-on-surface-variant italic">Ingen PDF-fil opplastet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      className="px-6 py-3.5 bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Lagre endringer</span>
                    </button>
                    {saveStatus === 'lagrer' && <span className="text-xs text-on-surface-variant animate-pulse">Lagrer...</span>}
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Lagret!</span>}
                    {saveStatus === 'feil' && <span className="text-xs text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> Feil ved lagring: {errorMessage}</span>}
                  </div>
                </div>
              )}

              {/* === VISUELL CMS PANEL === */}
              {activeTab === 'visuell-cms' && (
                <div className="space-y-6">
                  {/* Visual editing switch */}
                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
                    <h4 className="font-bold text-primary text-sm uppercase tracking-widest border-b border-surface-container pb-3">Visuell tekstredigering (inline)</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Når denne er på, vil du se stiplede rammelinjer rundt tekster du kan redigere direkte på de vanlige nettsidene (f.eks. på kalendersiden, forsiden osv.). Klikk på en tekst, gjør endringen din, og klikk utenfor for å lagre umiddelbart.
                    </p>

                    <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl border border-surface-container mt-4">
                      <div>
                        <span className="text-xs font-bold text-primary">Slå på redigeringsmodus</span>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Dette aktiverer contentEditable på alle støttede tekstblokker.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isAdminEditing}
                          onChange={(e) => setIsAdminEditing(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-surface-container after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm">
                    <h4 className="font-bold text-primary text-sm uppercase tracking-widest border-b border-surface-container pb-3 mb-4">Redigerbare Tekst-områder</h4>
                    <ul className="space-y-2.5 text-xs text-on-surface-variant">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Forside:</strong> Velkomsttekster, slagord, bibelvers og seksjonsoverskrifter.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Kalenderside:</strong> Tittel på siden, tittel på sommerbanner, og sommerferietekstene.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Om oss:</strong> Menighetsbeskrivelser, visjonserklæringer, ledelse/ansatte og trosbekjennelsen (Hva vi tror).</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Utleie:</strong> Utleieinfo, leievilkår, prislister og kontaktinformasjon.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Gave:</strong> Giverinfo-tekster, kontonummer og Vipps-detaljer.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Barn & Unge / Virkegrener:</strong> Seksjonstekster for søndagsskole, ungdomsarbeid, og andre aktiviteter.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="px-6 py-3.5 bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">public</span>
                      <span>Gå til nettsiden for å redigere</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
