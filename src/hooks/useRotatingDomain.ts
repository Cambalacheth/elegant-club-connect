
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DomainItem {
  name: string;
  path: string;
}

interface UseRotatingDomainProps {
  currentLanguage: string;
  fixedPaths: string[];
}

export const useRotatingDomain = ({ currentLanguage, fixedPaths }: UseRotatingDomainProps) => {
  const [rotatingDomain, setRotatingDomain] = useState<DomainItem | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        // Get all domains that are used (active)
        const { data, error } = await supabase
          .from('domains')
          .select('name, path')
          .eq('status', 'used')
          .limit(10);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Filter out domains that already have fixed links
          const availableDomains = data.filter(domain => 
            !fixedPaths.includes(domain.path)
          );
          
          if (availableDomains.length > 0) {
            // Select a random domain
            const randomIndex = Math.floor(Math.random() * availableDomains.length);
            const randomDomain = availableDomains[randomIndex];
            
            // Use domain name based on current language (in the future we could add translations)
            setRotatingDomain({
              name: randomDomain.name,
              path: randomDomain.path
            });
          }
        }
      } catch (error) {
        console.error("Error fetching rotating domain:", error);
        setRotatingDomain(null);
      }
    };
    
    fetchDomains();
  }, [fixedPaths, currentLanguage]);
  
  return rotatingDomain;
};
