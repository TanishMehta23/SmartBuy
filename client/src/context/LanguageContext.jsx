import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, categoryTranslations } from '../utils/translations';

const LanguageContext = createContext();

// In-memory cache for dynamic product translation
const translationCache = new Map();

// High-reliability translator using Google Translate public endpoint + fallback
async function fetchTranslation(text, sourceLang = 'en', targetLang = 'pt') {
  if (!text || typeof text !== 'string' || text.trim() === '') return text;
  if (sourceLang === targetLang) return text;

  const normalized = text.trim();
  const cacheKey = `${sourceLang}:${targetLang}:${normalized.toLowerCase()}`;
  
  // 1. Check in-memory cache
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // 2. Check localStorage cache
  try {
    const saved = localStorage.getItem(`sb_trans_${cacheKey}`);
    if (saved) {
      translationCache.set(cacheKey, saved);
      return saved;
    }
  } catch (e) {
    // Ignore storage errors
  }

  // 3. Check hardcoded common categories dictionary
  if (targetLang === 'pt' && categoryTranslations[normalized]) {
    const res = categoryTranslations[normalized];
    translationCache.set(cacheKey, res);
    return res;
  }

  // 4. Primary: Google Translate public API (Fast & highly accurate)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(normalized)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translated = data[0].map((item) => item[0]).filter(Boolean).join('');
        if (translated && translated.trim() !== '') {
          translationCache.set(cacheKey, translated);
          try {
            localStorage.setItem(`sb_trans_${cacheKey}`, translated);
          } catch (err) {}
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn('Google Translate API failed, attempting fallback...', err);
  }

  // 5. Fallback: MyMemory API
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(normalized)}&langpair=${sourceLang}|${targetLang}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText && data.responseData.translatedText !== 'NO QUERY SPECIFIED' && !data.responseData.translatedText.includes('MYMEMORY WARNING')) {
        const translated = data.responseData.translatedText;
        translationCache.set(cacheKey, translated);
        try {
          localStorage.setItem(`sb_trans_${cacheKey}`, translated);
        } catch (err) {}
        return translated;
      }
    }
  } catch (err) {
    console.warn('MyMemory fallback failed:', err);
  }

  return text;
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('smartbuy_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('smartbuy_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  // Static dictionary translation helper with dynamic interpolation
  const t = (key, params = {}) => {
    let template = translations[language]?.[key] || translations['en']?.[key] || key;
    
    Object.keys(params).forEach((paramKey) => {
      template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });

    return template;
  };

  // Dynamic translate helper
  const translateDynamic = async (text, targetLang = language) => {
    if (targetLang === 'en') return text;
    return await fetchTranslation(text, 'en', targetLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateDynamic,
        isPortuguese: language === 'pt',
        isEnglish: language === 'en',
      }}
    >
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
