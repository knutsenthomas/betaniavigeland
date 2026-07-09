import React, { createContext, useContext, useState } from 'react';

export const SiteContext = createContext({});

export const SiteProvider = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState({
    name: 'Betania Vigeland',
    description: 'Et fellesskap for hele livet',
    address: 'Elveveien 6, 4520 Lindesnes',
    vipps: '106111',
    email: 'post@betania-vigeland.no',
    bankAccount: '3138.07.03737',
    churchAffiliation: 'Pinsebevegelsen i Norge',
  });

  return (
    <SiteContext.Provider value={{ siteConfig, setSiteConfig }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
