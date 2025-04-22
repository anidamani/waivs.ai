"use client";

import { translation } from "@/misc/translation";
import useLocalStorage from "use-local-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  getTranslation: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  language: "en_US",
  setLanguage: () => {},
  getTranslation: (key) => key,
});

const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useLocalStorage("locale", "en_US");

  const getTranslation = (key: string) => {
    const translations = translation[key as keyof typeof translation];
    const value = translations
      ? translations[language as keyof typeof translations]
      : key;
    return value;
  };

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, getTranslation }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
