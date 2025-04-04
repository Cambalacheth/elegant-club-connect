
import { useState, useEffect } from "react";
import { useDomains } from "./useDomains";
import { VERTICAL_PATHS } from "./useVerticalDomains";

interface UseRotatingDomainProps {
  currentLanguage: string;
  fixedPaths: string[];
}

export const useRotatingDomain = ({ currentLanguage, fixedPaths }: UseRotatingDomainProps) => {
  const [rotatingDomain, setRotatingDomain] = useState<{ name: string; path: string } | null>(null);
  const { domains } = useDomains();

  // Update rotating domain on initial render or when domains change
  useEffect(() => {
    if (domains.length > 0) {
      // Filter domains to exclude those in fixed links, verticals, and elfotographer
      const availableDomains = domains
        .filter(domain => {
          // Exclude domains that match any fixed link path, vertical path, or elfotographer
          return !fixedPaths.some(path => path === domain.path) && 
                 !VERTICAL_PATHS.includes(domain.path) &&
                 domain.name.toLowerCase() !== "elfotographer";
        })
        .map(domain => ({ name: domain.name, path: domain.path }));
      
      // Add additional domains that might not be in the useDomains hook
      const additionalDomains = [
        { name: currentLanguage === "en" ? "Content" : "Contenido", path: "/content" },
        { name: currentLanguage === "en" ? "Events" : "Eventos", path: "/events" },
        { name: currentLanguage === "en" ? "Members" : "Miembros", path: "/members" },
        { name: currentLanguage === "en" ? "Feedback" : "Opiniones", path: "/feedback" },
        { name: "Asado", path: "/asado" },
        { name: currentLanguage === "en" ? "Vote" : "Votación", path: "/vote" }
      ].filter(domain => !fixedPaths.some(path => path === domain.path));
      
      const allDomains = [...availableDomains, ...additionalDomains];
      
      if (allDomains.length > 0) {
        // Pick a random domain from the available ones
        const randomIndex = Math.floor(Math.random() * allDomains.length);
        setRotatingDomain(allDomains[randomIndex]);
      }
    }
  }, [domains, currentLanguage, fixedPaths]);

  return rotatingDomain;
};
