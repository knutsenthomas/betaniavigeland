import React, { createContext, useContext, useState } from 'react';

export const ContentContext = createContext({});

export const ContentProvider = ({ children }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
      title: 'Søndagsskole',
      category: 'Barn',
      date: '30. August',
      day: '30',
      month: 'AUGUST',
      time: '11:00 - 12:00',
      description: 'Søndagsskole i tilknytning til formiddagsgudstjenesten. Sang, lek og spennende bibelfortellinger tilpasset barna.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=600&h=400&q=80',
      featured: true,
    },
  ]);

  return (
    <ContentContext.Provider value={{ events, setEvents }}>
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
