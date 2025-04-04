
import React from "react";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  currentLanguage, 
  setCurrentLanguage 
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-10">
      <Button
        variant="outline"
        size="sm"
        className="bg-white border-club-beige shadow-md"
        onClick={() => setCurrentLanguage(currentLanguage === "en" ? "es" : "en")}
      >
        {currentLanguage === "en" ? "Español" : "English"}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
