import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import historicalEpisodes from '@/data/historical_episodes.json';

export default function Podcast() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('Alle');
  const [podcastInfo, setPodcastInfo] = useState({
    title: 'Betania Vigeland',
    description: 'Taler i fra Betania',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?fit=crop&w=600&h=600&q=80'
  });
  
  // Audio Player State
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef(null);

  // Fetch episodes from Podbean RSS directly (bypasses CORS due to public CORS headers on Podbean feeds)
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://feed.podbean.com/betania-vigeland/feed.xml');
        if (!response.ok) {
          throw new Error('Kunne ikke laste podcast-episoder');
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Validate XML
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('Klarte ikke å tolke podcast XML-feed');
        }

        const channel = xmlDoc.querySelector('channel');
        const channelTitle = channel?.querySelector('title')?.textContent || 'Betania Vigeland';
        const channelDesc = channel?.querySelector('description')?.textContent || 'Taler i fra Betania';
        const channelImage = channel?.querySelector('image > url')?.textContent || '';

        if (channelTitle || channelDesc || channelImage) {
          setPodcastInfo({
            title: channelTitle,
            description: channelDesc,
            image: channelImage || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?fit=crop&w=600&h=600&q=80'
          });
        }

        const items = xmlDoc.querySelectorAll('item');
        const episodesList = Array.from(items).map((item, idx, arr) => {
          const rawTitle = item.querySelector('title')?.textContent || '';
          
          // Split speaker and title
          // format is typically "Speaker - Title"
          const parts = rawTitle.split(' - ');
          let speaker = '';
          let sermonTitle = rawTitle;
          if (parts.length > 1) {
            speaker = parts[0].trim();
            sermonTitle = parts.slice(1).join(' - ').replace(/[””"’‘']/g, '').trim();
          }

          const pubDateStr = item.querySelector('pubDate')?.textContent || '';
          const enclosure = item.querySelector('enclosure');
          const audioUrl = enclosure ? enclosure.getAttribute('url') : '';
          
          let description = item.querySelector('description')?.textContent || '';
          // Strip HTML tags
          description = description.replace(/<[^>]*>/g, '').trim();
          
          // Get duration
          let durationText = 'Tale';
          // Find standard duration element (namespaces can be tricky, search NS and raw tag name)
          const durationEl = item.getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'duration')[0] || item.querySelector('duration');
          if (durationEl) {
            const rawDuration = durationEl.textContent;
            if (rawDuration.includes(':')) {
              // format hh:mm:ss or mm:ss
              durationText = rawDuration;
            } else {
              // in seconds
              const secs = parseInt(rawDuration, 10);
              if (!isNaN(secs)) {
                const mins = Math.floor(secs / 60);
                durationText = `${mins} min`;
              }
            }
          }

          // Try to get specific episode cover image
          let thumbnail = channelImage;
          const imageEl = item.getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'image')[0] || item.querySelector('image');
          if (imageEl) {
            thumbnail = imageEl.getAttribute('href') || thumbnail;
          }

          return {
            id: item.querySelector('guid')?.textContent || String(idx),
            title: rawTitle,
            sermonTitle: sermonTitle,
            speaker: speaker || 'Gjestetaler',
            pubDate: pubDateStr,
            dateObj: new Date(pubDateStr),
            description: description || '',
            thumbnail: thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?fit=crop&w=600&h=600&q=80',
            audioUrl: audioUrl,
            duration: durationText,
            episodeNumber: arr.length - idx
          };
        });

        // Merge dynamically fetched RSS episodes with historical archived ones
        const mergedMap = new Map();

        // 1. Add all historical episodes
        historicalEpisodes.forEach(ep => {
          mergedMap.set(ep.audioUrl || ep.id, ep);
        });

        // 2. Add/overwrite with live RSS episodes
        episodesList.forEach(ep => {
          mergedMap.set(ep.audioUrl || ep.id, ep);
        });

        // 3. Convert back to array, standardize dates, and sort
        const finalEpisodes = Array.from(mergedMap.values()).map(ep => ({
          ...ep,
          dateObj: new Date(ep.pubDate)
        }));

        // Sort descending (newest first)
        finalEpisodes.sort((a, b) => b.dateObj - a.dateObj);

        // Re-calculate episode number sequence
        const finalWithNumbers = finalEpisodes.map((ep, idx, arr) => ({
          ...ep,
          episodeNumber: arr.length - idx
        }));

        setEpisodes(finalWithNumbers);
      } catch (err) {
        console.error('Podcast fetch error, falling back to archive:', err);
        // Fallback to historical list so the page still loads even if feed is down
        const fallbackList = historicalEpisodes.map((ep, idx, arr) => ({
          ...ep,
          dateObj: new Date(ep.pubDate),
          episodeNumber: arr.length - idx
        })).sort((a, b) => b.dateObj - a.dateObj);
        
        setEpisodes(fallbackList);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  // Helper to standardize speaker names
  const cleanSpeakerName = (name) => {
    if (!name) return 'Gjestetaler';
    let clean = name.trim();
    if (clean === 'Svein Kåre Dahl') return 'Svein-Kåre Dahl';
    if (clean === 'Reidar Walvick') return 'Reidar Walvik';
    if (clean === 'Sara van Djik') return 'Sara van Dijk';
    if (clean === 'Ruben van Djik') return 'Ruben van Dijk';
    if (clean === 'Thomas Eriksen') return 'Thomas Næss Eriksen';
    return clean;
  };

  // Collect unique speakers dynamically for filtering (alphabetical)
  const cleanedSpeakersList = Array.from(
    new Set(episodes.map(ep => cleanSpeakerName(ep.speaker)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, 'no'));

  const quickSpeakers = ['Alle', 'Gjestetaler', 'Tormod Bakkevold', 'Geir Myra', 'Magnus Næss Eriksen'];

  // Filter episodes based on search and selected speaker
  const filteredEpisodes = episodes.filter(ep => {
    const matchesSearch = ep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ep.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedSpeaker === 'Alle') return matchesSearch;
    return matchesSearch && cleanSpeakerName(ep.speaker) === selectedSpeaker;
  });

  // Audio Playback Handlers
  const handlePlayEpisode = (episode) => {
    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentEpisode(episode);
      setIsPlaying(true);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.src = episode.audioUrl;
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleScrub = (e) => {
    const scrubTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = scrubTime;
      setCurrentTime(scrubTime);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen pt-32 pb-40"
    >
      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Podcast Hero */}
      <section className="max-w-container-max mx-auto px-gutter mb-16">
        <div className="bg-gradient-to-br from-primary to-primary/85 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border border-primary/20">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          
          {/* Podcast Cover art */}
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0 bg-white/5 flex items-center justify-center relative">
            <img 
              src={podcastInfo.image} 
              alt={podcastInfo.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Content */}
          <div className="space-y-6 flex-1 text-center md:text-left">
            <span className="bg-secondary text-white font-bold uppercase tracking-wider text-[11px] px-3.5 py-1 rounded-full inline-block shadow-sm">
              Offisiell Podcast
            </span>
            <h1 className="font-headline-xl text-headline-xl leading-tight">{podcastInfo.title}</h1>
            <p className="font-body-md text-white/80 leading-relaxed max-w-2xl">
              {podcastInfo.description}
            </p>

            {/* Platform links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <a 
                href="https://podcasts.apple.com/no/podcast/betania-vigeland/id1113038676" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-label-md text-sm transition-all flex items-center gap-2.5 border border-white/10 active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px] text-white select-none">podcasts</span>
                Apple Podcasts
              </a>
              <a 
                href="https://betania-vigeland.podbean.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-label-md text-sm transition-all flex items-center gap-2.5 border border-white/10 active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px] text-white select-none">rss_feed</span>
                Podbean
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-container-max mx-auto px-gutter mb-12">
        <div className="space-y-6 pb-6 border-b border-surface-container">
          {/* Row 1: Header and Search */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">Taler og undervisning</h2>
            
            {/* Search box */}
            <div className="relative w-full sm:max-w-sm">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline select-none">search</span>
              <input
                type="text"
                placeholder="Søk i taler..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-surface-container text-on-surface placeholder-outline font-body-md text-sm focus:outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          {/* Row 2: Speaker Filters (Pills + Dropdown Selector) */}
          <div className="flex flex-wrap gap-2.5 justify-start items-center">
            {quickSpeakers.map((speaker) => (
              <button
                key={speaker}
                onClick={() => setSelectedSpeaker(speaker)}
                className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                  selectedSpeaker === speaker
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white hover:bg-surface-cream text-on-surface-variant border border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] select-none">
                  {speaker === 'Alle' ? 'group' : 'person'}
                </span>
                {speaker}
              </button>
            ))}

            {/* Custom dropdown selector for the remaining 50+ speakers */}
            <div className="relative">
              <select
                value={quickSpeakers.includes(selectedSpeaker) ? '' : selectedSpeaker}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedSpeaker(e.target.value);
                  }
                }}
                className={`pl-4 pr-10 py-2.5 rounded-full font-label-md text-sm border bg-white focus:outline-none appearance-none cursor-pointer transition-all duration-200 ${
                  !quickSpeakers.includes(selectedSpeaker)
                    ? 'border-secondary text-secondary bg-secondary/5 font-bold shadow-sm'
                    : 'border-surface-container text-on-surface-variant hover:bg-surface-cream'
                }`}
                aria-label="Velg gjestetaler"
              >
                <option value="">
                  {!quickSpeakers.includes(selectedSpeaker) ? selectedSpeaker : 'Flere talere...'}
                </option>
                {cleanedSpeakersList
                  .filter(sp => !quickSpeakers.includes(sp))
                  .map(sp => (
                    <option key={sp} value={sp} className="text-on-surface">
                      {sp}
                    </option>
                  ))
                }
              </select>
              <span className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none select-none ${
                !quickSpeakers.includes(selectedSpeaker) ? 'text-secondary' : 'text-outline'
              }`}>
                unfold_more
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-container-max mx-auto px-gutter">
        {loading ? (
          <div className="text-center py-20 space-y-4">
            <div className="inline-block w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant font-body-md">Henter taler...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-surface-container p-8 space-y-4">
            <span className="material-symbols-outlined text-secondary text-5xl select-none">error</span>
            <h3 className="font-bold text-primary text-xl">Kunne ikke laste podcasten</h3>
            <p className="text-on-surface-variant font-body-md text-sm max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-bold text-sm"
            >
              Prøv igjen
            </button>
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <span className="material-symbols-outlined text-outline text-[48px] select-none">search_off</span>
            <p className="font-semibold text-primary">Ingen taler matchet søket ditt</p>
            <p className="text-on-surface-variant font-body-sm text-[13px]">Prøv andre søkeord eller bytt taler-filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEpisodes.map((ep, idx) => {
              const isSelected = currentEpisode?.id === ep.id;
              
              return (
                <motion.div
                  key={ep.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border transition-all duration-300 flex flex-col justify-between ${
                    isSelected ? 'border-secondary/40 shadow-md shadow-secondary/5' : 'border-surface-container'
                  }`}
                >
                  <div className="p-6 space-y-5">
                    {/* Header info */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-secondary tracking-widest uppercase bg-secondary-fixed/50 px-2.5 py-0.5 rounded-full">
                        {ep.speaker}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(ep.pubDate).toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-headline-md text-headline-md text-primary line-clamp-2 hover:text-secondary transition-colors cursor-pointer font-bold" onClick={() => handlePlayEpisode(ep)}>
                      {ep.sermonTitle}
                    </h3>

                    {/* Description */}
                    {ep.description && (
                      <p className="text-on-surface-variant font-body-md leading-relaxed text-[13px] line-clamp-4">
                        {ep.description}
                      </p>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 bg-surface-cream/30 border-t border-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px] select-none">schedule</span>
                      <span>{ep.duration.replace(/^00:/, '')}</span>
                    </div>

                    <button
                      onClick={() => handlePlayEpisode(ep)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-label-md text-xs shadow-sm transition-all duration-200 active:scale-95 ${
                        isSelected && isPlaying 
                          ? 'bg-secondary text-white font-bold' 
                          : 'bg-primary text-white hover:bg-primary-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] select-none">
                        {isSelected && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      {isSelected && isPlaying ? 'Spiller av' : 'Hør tale'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Bottom Audio Player */}
      <AnimatePresence>
        {currentEpisode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-surface-container shadow-2xl backdrop-blur-md z-50 p-4 md:px-8 flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            {/* Episode details */}
            <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-surface-container shadow-sm bg-surface-cream">
                <img src={currentEpisode.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-primary text-sm truncate">{currentEpisode.sermonTitle}</h4>
                <p className="text-xs text-on-surface-variant truncate">{currentEpisode.speaker}</p>
              </div>
            </div>

            {/* Play controls and progress */}
            <div className="flex flex-col items-center gap-2 w-full md:w-2/4">
              <div className="flex items-center gap-4">
                {/* 15s Back */}
                <button 
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 15; }}
                  className="text-on-surface-variant hover:text-primary flex items-center justify-center p-1"
                  title="-15 sekunder"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                    <text x="12" y="15.5" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="system-ui, sans-serif">15</text>
                  </svg>
                </button>

                {/* Play / Pause Toggle */}
                <button
                  onClick={() => handlePlayEpisode(currentEpisode)}
                  className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[22px] select-none">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                {/* 15s Forward */}
                <button 
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime += 15; }}
                  className="text-on-surface-variant hover:text-primary flex items-center justify-center p-1"
                  title="+15 sekunder"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <text x="12" y="15.5" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="system-ui, sans-serif">15</text>
                  </svg>
                </button>
              </div>

              {/* Progress Bar Slider */}
              <div className="flex items-center gap-3 w-full">
                <span className="text-xs font-semibold text-on-surface-variant min-w-[32px] text-right">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleScrub}
                  className="w-full accent-secondary h-1 bg-surface-container rounded-lg appearance-none cursor-pointer focus:outline-none"
                />

                <span className="text-xs font-semibold text-on-surface-variant min-w-[32px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Utilities (Volume, Speed, Close) */}
            <div className="flex items-center justify-end gap-6 w-full md:w-1/4">
              {/* Playback speed */}
              <button 
                onClick={cycleSpeed}
                className="px-2.5 py-1 rounded bg-surface-cream text-primary font-bold text-xs hover:bg-surface-container transition-colors active:scale-95 border border-surface-container"
                title="Avspillingshastighet"
              >
                {playbackRate}x
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group relative">
                <button 
                  onClick={toggleMute}
                  className="text-on-surface-variant hover:text-primary"
                  title={isMuted ? "Skru på lyd" : "Mute"}
                >
                  <span className="material-symbols-outlined text-[20px] select-none">
                    {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                  </span>
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (newVol > 0) setIsMuted(false);
                  }}
                  className="w-20 accent-primary h-1 bg-surface-container rounded-lg appearance-none cursor-pointer focus:outline-none hidden md:block"
                />
              </div>

              {/* Close button */}
              <button 
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
                  setCurrentEpisode(null);
                }}
                className="text-outline hover:text-primary p-1"
                title="Lukk spiller"
              >
                <span className="material-symbols-outlined text-[20px] select-none">close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
