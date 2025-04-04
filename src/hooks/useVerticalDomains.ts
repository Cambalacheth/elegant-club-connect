
import { useMemo } from "react";
import { useDomains } from "./useDomains";

// Define vertical paths we'll always want to show
export const VERTICAL_PATHS = ['/legal', '/arte', '/negocios', '/salud', '/comunidad', '/tech'];

export const useVerticalDomains = () => {
  const { domains } = useDomains({ prioritizePaths: VERTICAL_PATHS });
  
  // Filter domains for verticals
  const verticalDomains = useMemo(() => 
    domains.filter(domain => VERTICAL_PATHS.includes(domain.path)
  ), [domains]);
  
  return { verticalDomains };
};
