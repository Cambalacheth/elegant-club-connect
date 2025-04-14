
import { useLanguage } from "@/contexts/LanguageContext";

interface VerticalDomain {
  path: string;
  name: string;
}

// Export the vertical paths as a constant
export const VERTICAL_PATHS = [
  "/legal",
  "/arte",
  "/negocios", 
  "/salud",
  "/comunidad",
  "/tech"
];

export const useVerticalDomains = () => {
  const { currentLanguage } = useLanguage();
  
  const verticalDomains: VerticalDomain[] = [
    { 
      path: "/legal", 
      name: currentLanguage === "en" ? "Legal" : "Legal"
    },
    { 
      path: "/arte", 
      name: currentLanguage === "en" ? "Art" : "Arte"
    },
    { 
      path: "/negocios", 
      name: currentLanguage === "en" ? "Business" : "Negocios"
    },
    { 
      path: "/salud", 
      name: currentLanguage === "en" ? "Health" : "Salud"
    },
    { 
      path: "/comunidad", 
      name: currentLanguage === "en" ? "Community" : "Comunidad"
    },
    { 
      path: "/tech", 
      name: currentLanguage === "en" ? "Technology" : "Tecnología"
    },
  ];
  
  return { verticalDomains };
};
