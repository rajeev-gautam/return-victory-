import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Try to get language from localStorage, default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('govr_language') || 'en';
  });

  // Persist language choice
  useEffect(() => {
    localStorage.setItem('govr_language', currentLanguage);
  }, [currentLanguage]);

  // Translation helper function
  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
