
import React, { createContext, useState, useContext, ReactNode } from "react";

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode, defaultLanguage?: string }> = ({ 
  children, 
  defaultLanguage = "es" 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
