import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const ContentContext = createContext({});

const DEFAULT_EVENTS = [
  {
    id: 'def-1',
    title: 'Søndagsmøte (Oppstart)',
    category: 'Gudstjeneste',
    date: '16. August',
    day: '16',
    month: 'AUGUST',
    time: '18:00 - 19:30',
    description: 'Velkommen til vårt første søndagsmøte etter sommerferien! Vi samles til lovsang, forkynnelse og godt fellesskap.',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?fit=crop&w=600&h=400&q=80',
    featured: true,
  },
  {
    id: 'def-2',
    title: 'Awake Ungdomskveld',
    category: 'Ungdom',
    date: '21. August',
    day: '21',
    month: 'AUGUST',
    time: '20:00 - 23:00',
    description: 'Awake er menighetens samlingspunkt for tenåringer og ungdom fra 8. klasse og oppover. Fredagskveld med kiosk, spill, andakt og super stemning!',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?fit=crop&w=600&h=400&q=80',
    featured: true,
  },
  {
    id: 'def-3',
    title: 'Tweens Vigeland',
    category: 'Barn',
    date: '25. August',
    day: '25',
    month: 'AUGUST',
    time: '18:30 - 20:00',
    description: 'Tweens Vigeland er et samarbeid mellom Betania og Bedehuset på Vigeland for de i 5. til 7. klasse. Vi samles til lek, konkurranser og andakt.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?fit=crop&w=600&h=400&q=80',
    featured: false,
  },
  {
    id: 'def-4',
    title: 'Vi leser Bibelen',
    category: 'Annet',
    date: '17. August',
    day: '17',
    month: 'AUGUST',
    time: '17:30 - 19:00',
    description: 'Hver mandag møtes vi i koselige, uformelle rammer på Betania for å lese Bibelen sammen og dele erfaringer og refleksjoner.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?fit=crop&w=600&h=400&q=80',
    featured: false,
  },
  {
    id: 'def-5',
    title: 'Onsdagsmøte (Bønn/vitnemøte)',
    category: 'Annet',
    date: '19. August',
    day: '19',
    month: 'AUGUST',
    time: '19:30 - 21:00',
    description: 'Velkommen til onsdagsbønn og vitnemøte på Betania. En rolig samling midt i uken med fokus på felles bønneemner og oppbyggelse.',
    image: 'https://images.unsplash.com/photo-1444090542259-0af8fa96557e?fit=crop&w=600&h=400&q=80',
    featured: false,
  },
  {
    id: 'def-6',
    title: 'Søndagsskole',
    category: 'Barn',
    date: '30. August',
    day: '30',
    month: 'AUGUST',
    time: '11:00 - 12:00',
    description: 'Søndagsskole i tilknytning til formiddagsgudstjenesten. Sang, lek og spennende bibelfortellinger tilpasset barna.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=600&h=400&q=80',
    featured: true,
  }
];

export const ContentProvider = ({ children }) => {
  const { token } = useAuth();
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [cmsContent, setCmsContent] = useState({});
  const [siteSettings, setSiteSettings] = useState({
    show_summer_banner: true,
    summer_banner: {
      badge: "Sommerferie-info",
      title: "Sommerferie i menigheten",
      text1: "Vi har ingen ordinære arrangementer i Betania Vigeland gjennom fellesferien. Første søndagsmøte etter sommerferien er søndag 16. august kl. 18:00. Vi ønsker alle en kjempefin sommer! ☀️",
      text2: "Gjennom hele sommeren oppfordrer vi til å støtte opp under møtene og fellesskapet på Solstrand Camping.",
      links: [
        { label: "Solstrand Camping", sublabel: "Se program for møtene sommeren 2026", url: "https://www.solstrand-camping.no/arrangement-MksEf" },
        { label: "Sommerstevne (New Life)", sublabel: "På Solstrand Camping 8. - 12. juli 2026", url: "https://www.sommerstevnet.no" },
        { label: "Følg med på Facebook", sublabel: "Løpende oppdateringer gjennom sommeren", url: "https://www.facebook.com/BetaniaVigeland" }
      ]
    },
    platform_links: {
      vipps: "106111",
      konto: "3138.07.03737",
      facebook: "https://www.facebook.com/BetaniaVigeland",
      instagram: "",
      youtube: "",
      spotify: "",
      apple_podcasts: "https://podcasts.apple.com/no/podcast/betania-vigeland/id1113038676",
      podbean: "https://betania-vigeland.podbean.com"
    },
    calendar_sync: {
      enabled: false,
      calendar_id: "",
      api_key: ""
    }
  });

  const [isAdminEditing, setIsAdminEditing] = useState(() => {
    return localStorage.getItem('betania-admin-editing') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('betania-admin-editing', isAdminEditing ? 'true' : 'false');
  }, [isAdminEditing]);

  const [loading, setLoading] = useState(true);

  // 1. Fetch CMS text config & site settings from Vercel Postgres on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [cmsRes, settingsRes] = await Promise.all([
          fetch('/api/cms'),
          fetch('/api/settings')
        ]);

        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          setCmsContent(cmsData.data || {});
        }
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.data) {
            const loaded = settingsData.data;
            if (!loaded.monthly_program) {
              loaded.monthly_program = {
                enabled: false,
                url: "",
                filename: "",
                file_data: ""
              };
            }
            setSiteSettings(loaded);
          }
        }
      } catch (err) {
        console.warn("Klarte ikke laste CMS eller innstillinger fra database:", err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // 2. Fetch events from Google Calendar if sync is enabled
  useEffect(() => {
    const fetchGoogleCalendar = async () => {
      const { enabled, calendar_id, api_key } = siteSettings.calendar_sync;
      if (!enabled || !calendar_id || !api_key) {
        setEvents(DEFAULT_EVENTS);
        return;
      }

      try {
        const timeMin = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}/events?key=${encodeURIComponent(api_key)}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=50`;
        
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Google Calendar API returnerte status ${res.status}`);
        }

        const data = await res.json();
        const items = data.items || [];

        const months = [
          'JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI',
          'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
        ];

        const mappedEvents = items.map((item, index) => {
          const start = new Date(item.start.dateTime || item.start.date);
          const end = new Date(item.end.dateTime || item.end.date);
          
          const day = start.getDate().toString();
          const monthIndex = start.getMonth();
          const monthName = months[monthIndex];
          const niceMonth = monthName.charAt(0) + monthName.slice(1).toLowerCase();
          const dateStr = `${day}. ${niceMonth}`;

          let timeStr = 'Hele dagen';
          if (item.start.dateTime) {
            const startHours = start.getHours().toString().padStart(2, '0');
            const startMins = start.getMinutes().toString().padStart(2, '0');
            const endHours = end.getHours().toString().padStart(2, '0');
            const endMins = end.getMinutes().toString().padStart(2, '0');
            timeStr = `${startHours}:${startMins} - ${endHours}:${endMins}`;
          }

          const summary = item.summary || 'Arrangement';
          const description = item.description || '';
          
          // Categorize dynamically
          let category = 'Gudstjeneste';
          if (summary.toLowerCase().includes('awake') || summary.toLowerCase().includes('ungdom') || description.toLowerCase().includes('ungdom')) {
            category = 'Ungdom';
          } else if (summary.toLowerCase().includes('tweens') || summary.toLowerCase().includes('barn') || summary.toLowerCase().includes('søndagsskole') || description.toLowerCase().includes('barn')) {
            category = 'Barn';
          } else if (summary.toLowerCase().includes('bibel') || summary.toLowerCase().includes('bønn') || summary.toLowerCase().includes('onsdag') || description.toLowerCase().includes('bønn')) {
            category = 'Annet';
          }

          const images = {
            'Gudstjeneste': 'https://images.unsplash.com/photo-1438032005730-c779502df39b?fit=crop&w=600&h=400&q=80',
            'Ungdom': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?fit=crop&w=600&h=400&q=80',
            'Barn': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?fit=crop&w=600&h=400&q=80',
            'Annet': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?fit=crop&w=600&h=400&q=80'
          };
          const image = images[category] || images['Annet'];

          // First 3 events of type Gudstjeneste/Ungdom are featured
          const featured = index < 3;

          return {
            id: item.id || `gcal-${index}`,
            title: summary,
            category,
            date: dateStr,
            day,
            month: monthName,
            time: timeStr,
            description: description.replace(/<[^>]*>/g, ''), // Strip html tags if any
            image,
            featured
          };
        });

        setEvents(mappedEvents.length > 0 ? mappedEvents : DEFAULT_EVENTS);
      } catch (err) {
        console.warn("Klarte ikke hente kalenderhendelser fra Google, bruker standard:", err);
        setEvents(DEFAULT_EVENTS);
      }
    };

    fetchGoogleCalendar();
  }, [siteSettings]);

  // 3. Mutate CMS text value inline
  const updateCmsText = async (key, value) => {
    // Optimistic update
    setCmsContent(prev => ({ ...prev, [key]: value }));

    if (!token) return;

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key, value })
      });
      if (!res.ok) {
        throw new Error('Klarte ikke lagre CMS endring');
      }
    } catch (err) {
      console.error("Klarte ikke lagre CMS tekst:", err);
    }
  };

  // 4. Mutate site settings
  const updateSiteSettings = async (newSettings) => {
    setSiteSettings(newSettings);

    if (!token) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: newSettings })
      });
      if (!res.ok) {
        throw new Error('Klarte ikke lagre innstillinger');
      }
    } catch (err) {
      console.error("Klarte ikke lagre innstillinger:", err);
    }
  };

  return (
    <ContentContext.Provider value={{ 
      events, 
      cmsContent, 
      siteSettings, 
      isAdminEditing, 
      setIsAdminEditing, 
      updateCmsText, 
      updateSiteSettings,
      loading
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
