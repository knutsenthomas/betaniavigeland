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
      setLocalSettings(JSON.parse(JSON.stringify(siteSettings)));
    }
  }, [siteSettings]);

  // Save settings helper
  const [saveStatus, setSaveStatus] = useState('');
  const handleSave = async (updated) => {
    const settingsToSave = updated || localSettings;
    setSaveStatus('lagrer');
    try {
      await updateSiteSettings(settingsToSave);
      setSaveStatus('suksess');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('feil');
      setTimeout(() => setSaveStatus(''), 3000);
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
            <span className="material-symbols-outlined text-secondary text-[28px] animate-pulse">church</span>
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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-secondary-container hover:bg-secondary/10 transition-all border border-secondary/25 hover:border-secondary/40"
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
        <div className="p-8 md:p-10 flex-1 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
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
                    {saveStatus === 'feil' && <span className="text-xs text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error</span> Feil ved lagring</span>}
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
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Lagret!</span>}
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
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Podbean RSS/Hjemmeside</label>
                        <input
                          type="text"
                          value={localSettings.platform_links.podbean}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            platform_links: { ...localSettings.platform_links, podbean: e.target.value }
                          })}
                          className="w-full p-3 bg-surface-container-low border border-surface-container rounded-xl text-xs"
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
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Lagret!</span>}
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

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSave()}
                      className="px-6 py-3.5 bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Lagre endringer</span>
                    </button>
                    {saveStatus === 'suksess' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Lagret!</span>}
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
                        <span><strong>Kalenderside:</strong> Tittel på siden, tittel på sommerbanner, og sommerferietekstene.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Forside:</strong> Velkomsttekster, slagord og seksjonsoverskrifter.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        <span><strong>Om oss:</strong> Menighetsbeskrivelser og visjonserklæringer.</span>
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
