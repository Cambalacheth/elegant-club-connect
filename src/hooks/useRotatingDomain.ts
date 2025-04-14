
interface UseRotatingDomainProps {
  currentLanguage: string;
  fixedPaths: string[];
}

interface RotatingDomain {
  name: string;
  path: string;
}

export const useRotatingDomain = ({ currentLanguage, fixedPaths }: UseRotatingDomainProps): RotatingDomain | null => {
  // Get a rotating vertical domain based on time
  // Choose one that isn't already in the fixed navigation
  const verticals = [
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
  
  // Filter out already shown domains
  const availableDomains = verticals.filter(domain => !fixedPaths.includes(domain.path));
  
  if (availableDomains.length === 0) return null;
  
  // Use date to pick a domain (changes daily)
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % availableDomains.length;
  
  return availableDomains[index];
};
