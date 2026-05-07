import React, { createContext, useContext, useState } from "react";
import en from "./locales/en.json";
import ta from "./locales/ta.json";

const translations = { en, ta };

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, setLanguage, language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
