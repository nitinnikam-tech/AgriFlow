import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('agriflow_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('agriflow_lang', lang);
  }, [lang]);

  const t = (key) => {
    const keys = key.split('.');
    let current = translations[lang] || translations.en;
    for (const k of keys) {
      if (!current || current[k] === undefined) {
        // Fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          if (!fallback || fallback[fk] === undefined) return key;
          fallback = fallback[fk];
        }
        return fallback;
      }
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
