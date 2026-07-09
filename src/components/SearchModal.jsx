import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import historicalEpisodes from '@/data/historical_episodes.json';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { events, siteSettings } = useContent();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const inputRef = useRef(null);

  const getFeedUrl = () => {
    const podbeanUrl = siteSettings?.platform_links?.podbean || '';
    let username = 'betania-vigeland';
    if (podbeanUrl) {
      const match = podbeanUrl.match(/(?:https?:\/\/)?([^.]+)\.podbean\.com/);
      if (match && match[1]) {
        username = match[1];
      } else {
        username = podbeanUrl.replace(/https?:\/\//, '').split('/')[0].trim();
      }
    }
    return `https://feed.podbean.com/${username}/feed.xml`;
  };

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch and merge podcast episodes when the search modal is mounted
  useEffect(() => {
    // 1. Load historical fallback immediately so search is usable offline
    const fallbackList = historicalEpisodes.map((ep, idx, arr) => ({
      ...ep,
      dateObj: new Date(ep.pubDate),
      episodeNumber: arr.length - idx
    })).sort((a, b) => b.dateObj - a.dateObj);
    setPodcastEpisodes(fallbackList);

    // 2. Fetch live episodes asynchronously
    const fetchLivePodcast = async () => {
      try {
        const feedUrl = getFeedUrl();
        const response = await fetch(feedUrl);
        if (!response.ok) return;
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) return;

        const channel = xmlDoc.querySelector('channel');
        const channelImage = channel?.querySelector('image > url')?.textContent || '';
        const items = xmlDoc.querySelectorAll('item');

        const episodesList = Array.from(items).map((item, idx, arr) => {
          const rawTitle = item.querySelector('title')?.textContent || '';
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
          description = description.replace(/<[^>]*>/g, '').trim();

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
            description: description || '',
            thumbnail: thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?fit=crop&w=600&h=600&q=80',
            audioUrl: audioUrl
          };
        });

        // Merge dynamic RSS with local historical fallback using audioUrl/id
        const mergedMap = new Map();
        fallbackList.forEach(ep => mergedMap.set(ep.audioUrl || ep.id, ep));
        episodesList.forEach(ep => mergedMap.set(ep.audioUrl || ep.id, ep));

        const finalEpisodes = Array.from(mergedMap.values()).map(ep => ({
          ...ep,
          dateObj: new Date(ep.pubDate)
        })).sort((a, b) => b.dateObj - a.dateObj);

        setPodcastEpisodes(finalEpisodes);
      } catch (err) {
        console.error('SearchModal podcast fetch error:', err);
      }
    };

    fetchLivePodcast();
  }, []);

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Static content index
  const staticIndex = [
    {
      title: 'Om oss',
      category: 'Om oss',
      path: '/about',
      text: 'Pinsemenigheten Betania Vigeland hører til De Frie Evangeliske Forsamlinger (DFEF) i Pinsebevegelsen. Visjon: Å møte, følge og dele Jesus.',
      keywords: 'om oss dfef pinsebevegelsen ledelse styre vision visjon elveveien'
    },
    {
      title: 'Trosbekjennelse & Lære',
      category: 'Om oss',
      path: '/about',
      text: 'Vår tro og lære om Bibelen, treenigheten, skapelsen, dåp, nattverd, Guds rike, og den apostoliske trosbekjennelse.',
      keywords: 'trosbekjennelse bibelen treenighet skapelsen ekteskap dåp nattverd gud tro lære'
    },
    {
      title: 'Menighetens ledelse & eldsteråd',
      category: 'Om oss',
      path: '/about',
      text: 'Oversikt over interimsstyret (Glenn Gundersen, Anja Cisilie Ødegård) og eldsterådet (Andreas Høiland, Anders Gabrielsen, Line-Anette H. Larsen, Brita Haga Gundersen).',
      keywords: 'ledelse styre eldsteråd glenn gundersen anja ødegård anders gabrielsen andreas høiland line-anette brita'
    },
    {
      title: 'Ansatte og administrasjon',
      category: 'Om oss',
      path: '/about',
      text: 'Vidar Tjomsland (administrasjon, regnskap) og Andreas Høiland (leder for ungdomsarbeidet Awake).',
      keywords: 'ansatte vidar tjomsland regnskap administrasjon awake'
    },
    {
      title: 'Medlemskap i Betania Vigeland',
      category: 'Medlem',
      path: '/medlem',
      text: 'Hvordan bli medlem, retningslinjer for medlemskap, dåp, og nedlastbare PDF-skjemaer.',
      keywords: 'medlem medlemskap bli medlem innmeldingsskjema dåp vipps bankkonto fast givetjeneste'
    },
    {
      title: 'Misjon & Hjelpearbeid',
      category: 'Misjon',
      path: '/misjon',
      text: 'Menigheten støtter to misjonsprosjekter fast: Sett og Hørt (Norge) og Høiland Misjon (Ukraina, Abkhasia, Etiopia).',
      keywords: 'misjon hjelpearbeid sett og hørt høiland norge ukraina abkhasia etiopia ordin'
    },
    {
      title: 'Utleie av lokaler',
      category: 'Utleie',
      path: '/rental',
      text: 'Informasjon om leie av Betanias lokaler til selskaper, konfirmasjon, barnedåp, minnesamvær eller møter. Se priser og leievilkår.',
      keywords: 'utleie leie pris selskaper konfirmasjon barnedåp vask regler kjøkken elveveien'
    },
    {
      title: 'Fast givetjeneste & Gaver',
      category: 'Bidrag',
      path: '/gave',
      text: 'Vipps og bankkontodetaljer for fast kollekt og givertjeneste. Bankkontonr: 3138.07.03737, Byggkonto: 3138.10.97393, Vipps: 106111.',
      keywords: 'gave kollekt vipps bankkonto penger støtte givetjeneste skatt byggkonto'
    },
    {
      title: 'Søndagsmøter / Gudstjeneste',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Våre hovedgudstjenester. Formiddagsmøte kl. 11.00 og kveldsmøte kl. 18.00 henholdsvis annenhver søndag.',
      keywords: 'søndagsmøte gudstjeneste møter formiddagsmøte kveldsmøte'
    },
    {
      title: 'Onsdagsmøter (Bønn & Bibel)',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Samling til bønn og vitnemøter, eller undervisning og bibeltimer, onsdager kl. 19.30.',
      keywords: 'onsdagsmøte bønn bibel bibelundervisning vitnemøte'
    },
    {
      title: 'Vi leser Bibelen',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Bibelgruppe på Betania hver mandag kl. 17.30.',
      keywords: 'bibel bibellesing mandag'
    },
    {
      title: 'Awake (Ungdomsarbeid)',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Aktivt barne- og ungdomsarbeid for 8. klasse og oppover. Fredager kl. 20.00.',
      keywords: 'awake ungdom tenåring fredag kiosk spill andakt'
    },
    {
      title: 'Tweens Vigeland',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Samarbeid mellom Betania og Bedehuset for 5.-7. klasse. Annenhver tirsdag kl. 18.30 - 20.00.',
      keywords: 'tweens bedehuset lek andakt tirsdag spill kiosk'
    },
    {
      title: 'Søndagsskole',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Parallel med formiddagsmøtet kl. 11.00. Sang, lek og bibelfortellinger.',
      keywords: 'søndagsskole barn lek bibelfortelling søndag'
    },
    {
      title: 'Tentro (Konfirmasjon)',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Frikirkelig konfirmasjonsopplegg. Samarbeid mellom 8 frimenigheter i Lindesnes.',
      keywords: 'tentro konfirmasjon konfirmant undervisning'
    },
    {
      title: 'Podcast: Tro og Liv',
      category: 'Podcast',
      path: '/podcast',
      text: 'Lytt til "Tro og Liv" med Hilde Karin Knutsen direkte på nettsiden, eller via Spotify, Apple Podcasts og YouTube.',
      keywords: 'podcast tro og liv hilde karin knutsen taler undervisning lydbok'
    },
    {
      title: 'GuttogJente.no',
      category: 'Våre virkegrener',
      path: '/virkegrener',
      text: 'Veiledning og svar på spørsmål knyttet til kjønn, kropp, følelser, sex og samliv basert på et kristent verdigrunnlag.',
      keywords: 'gutt og jente sex samliv bibelen veiledning kjønn kropp følelser'
    }
  ];

  // Perform search matching
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    // 1. Index static content
    const matchedStatic = staticIndex.filter(item => {
      const matchText = `${item.title} ${item.category} ${item.text} ${item.keywords}`.toLowerCase();
      return searchTerms.every(term => matchText.includes(term));
    });

    // 2. Index calendar events
    const matchedEvents = events.map(e => ({
      title: e.title,
      category: `Kalender: ${e.category}`,
      path: '/calendar',
      text: `${e.date} (${e.time}) - ${e.description}`,
      keywords: `${e.title} ${e.category} ${e.description} ${e.date}`.toLowerCase()
    })).filter(item => {
      return searchTerms.every(term => item.keywords.includes(term));
    });

    // 3. Index podcast episodes
    const matchedPodcasts = podcastEpisodes.map(ep => ({
      title: ep.sermonTitle || ep.title,
      category: `Podcast: ${ep.speaker}`,
      path: `/podcast?play=${ep.id}`,
      text: `${ep.speaker} - ${ep.description}`,
      keywords: `${ep.title} ${ep.sermonTitle} ${ep.speaker} ${ep.description} podcast`.toLowerCase()
    })).filter(item => {
      return searchTerms.every(term => item.keywords.includes(term));
    });

    // Combine results
    setResults([...matchedStatic, ...matchedEvents, ...matchedPodcasts]);
  }, [query, events, podcastEpisodes]);

  if (!isOpen) return null;

  const handleResultClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/40 backdrop-blur-md flex justify-center p-4 pt-10 md:pt-24">
      {/* Background click to close */}
      <div className="fixed inset-0 cursor-default" onClick={onClose} />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-surface-container overflow-hidden relative flex flex-col max-h-[80vh] z-10"
      >
        {/* Search Header */}
        <div className="p-5 border-b border-surface-container flex items-center gap-4 bg-surface-cream/50">
          <span className="material-symbols-outlined text-secondary text-[28px] select-none">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Søk i alt innhold (aktiviteter, tro, misjon, utleie...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-on-surface placeholder-outline font-body-lg text-lg focus:outline-none focus:ring-0"
          />
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-secondary p-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Search Results Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {query.trim() === '' ? (
            <div className="text-center py-12 space-y-3">
              <span className="material-symbols-outlined text-outline text-[48px] select-none">manage_search</span>
              <p className="font-semibold text-primary">Søk etter hva som helst på siden</p>
              <p className="text-on-surface-variant font-body-sm text-[13px]">
                Tast inn ord som "Awake", "nattverd", "utleie", "dåp", "vipps" eller "ledelse".
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-secondary uppercase tracking-widest px-2">
                Fant {results.length} treff
              </p>
              
              <div className="space-y-2">
                {results.map((res, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(res.path)}
                    className="w-full text-left p-4 rounded-2xl hover:bg-surface-cream border border-transparent hover:border-surface-container transition-all duration-200 group flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px] select-none">
                        {res.path === '/calendar' 
                          ? 'calendar_today' 
                          : res.path === '/podcast' 
                            ? 'podcasts' 
                            : 'arrow_forward'}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-primary group-hover:text-secondary transition-colors">
                          {res.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant">
                          {res.category}
                        </span>
                      </div>
                      <p className="text-[13px] text-on-surface-variant leading-relaxed">
                        {res.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <span className="material-symbols-outlined text-secondary text-[48px] select-none">sentiment_dissatisfied</span>
              <p className="font-semibold text-primary">Ingen resultater funnet</p>
              <p className="text-on-surface-variant font-body-sm text-[13px]">
                Prøv et annet søkeord, for eksempel "møte", "tweens" eller "medlem".
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer helper */}
        <div className="p-4 border-t border-surface-container bg-surface-cream/30 text-center text-outline text-[11px] font-medium flex justify-center items-center gap-2">
          <span>Tast</span>
          <kbd className="px-1.5 py-0.5 rounded border border-surface-container bg-white shadow-sm font-sans font-bold">ESC</kbd>
          <span>for å lukke</span>
        </div>
      </motion.div>
    </div>
  );
}
