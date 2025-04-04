import { useMemo } from "react";
import { useDomains } from "./useDomains";

// Define vertical paths we'll always want to show
export const VERTICAL_PATHS = ['/legal', '/arte', '/negocios', '/salud', '/comunidad', '/tech'];

export const useVerticalDomains = () => {
  const { domains } = useDomains({ prioritizePaths: VERTICAL_PATHS });
  
  // Filter domains for verticals
  const verticalDomains = useMemo(() => {
    const filteredDomains = domains.filter(domain => 
      VERTICAL_PATHS.includes(domain.path)
    );
    
    // Make sure all verticals are present even if some are missing from the domains data
    // Create a map to access existing domains by path
    const domainMap = new Map(filteredDomains.map(domain => [domain.path, domain]));
    
    // Default names for each vertical path
    const defaultVerticals = {
      '/legal': { name: 'Legal', path: '/legal' },
      '/arte': { name: 'Arte', path: '/arte' },
      '/negocios': { name: 'Negocios', path: '/negocios' },
      '/salud': { name: 'Salud', path: '/salud' },
      '/comunidad': { name: 'Comunidad', path: '/comunidad' },
      '/tech': { name: 'Tecnología', path: '/tech' }
    };
    
    // For each expected vertical path, use the domain from API if available,
    // otherwise use the default
    return VERTICAL_PATHS.map(path => {
      if (domainMap.has(path)) {
        return domainMap.get(path)!;
      } else {
        // Create a domain-like object with required properties
        return {
          id: path,
          name: defaultVerticals[path as keyof typeof defaultVerticals].name,
          path: path,
          description: '',
          status: 'used' as const
        };
      }
    });
  }, [domains]);
  
  return { verticalDomains };
};
