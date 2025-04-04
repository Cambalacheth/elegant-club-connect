
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Domain {
  id: string;
  name: string;
  path: string;
  description: string;
  status: "available" | "reserved" | "used";
  owner?: string;
  externalUrl?: string;
  currentLanguage?: string;
}

interface UseDomainProps {
  randomize?: boolean;
  pageSize?: number;
  prioritizePaths?: string[];
}

export const useDomains = ({ 
  randomize = false, 
  pageSize = 12,
  prioritizePaths = [] 
}: UseDomainProps = {}) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const maxRetries = 3;
    const retryDelay = 1500; // 1.5 seconds delay between retries
    
    const fetchDomains = async () => {
      try {
        setLoading(true);
        
        // Use more reliable count query approach
        const { count, error: countError } = await supabase
          .from('domains')
          .select('*', { count: 'exact', head: true });
          
        if (countError && isMounted) {
          console.error('Error counting domains:', countError);
          // Continue anyway, we can still try to load domains
        }
        
        if (count !== null && isMounted) {
          setTotalCount(count);
        }
        
        // Query with pagination
        let query = supabase
          .from('domains')
          .select('*');
          
        // Add ordering - random if specified, otherwise by name
        if (randomize) {
          query = query.order('id', { ascending: false });
        } else {
          query = query.order('name');
        }
        
        // Add pagination
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        // If no error and we're still mounted, update state
        if (isMounted) {
          if (!data || data.length === 0) {
            console.log("No domains found or empty response");
            // Set fallback domains if no data is returned
            setDomains(getFallbackDomains(prioritizePaths));
          } else {
            // Format the domains
            let formattedDomains: Domain[] = (data || []).map(domain => ({
              id: domain.id,
              name: domain.name,
              path: domain.path,
              description: domain.description || '',
              status: domain.status as "available" | "reserved" | "used",
              owner: domain.owner,
              externalUrl: domain.external_url
            }));
            
            // Prioritize specific paths if needed
            if (prioritizePaths.length > 0) {
              formattedDomains = [
                ...formattedDomains.filter(d => prioritizePaths.includes(d.path)),
                ...formattedDomains.filter(d => !prioritizePaths.includes(d.path))
              ];
            }
            
            setDomains(formattedDomains);
            setError(null);
            setRetryCount(0); // Reset retry count on success
          }
        }
      } catch (err: any) {
        console.error('Error fetching domains:', err);
        
        if (isMounted) {
          if (retryCount < maxRetries) {
            // Retry after delay
            setRetryCount(prevCount => prevCount + 1);
            setTimeout(() => {
              if (isMounted) fetchDomains();
            }, retryDelay);
          } else {
            // After max retries, set error and use fallback data
            setError('Failed to load domains');
            toast({
              title: "Connection issue",
              description: "Using cached domain data. Some information may not be up to date.",
              variant: "destructive"
            });
            
            // Use fallback domains when there's an error
            setDomains(getFallbackDomains(prioritizePaths));
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDomains();
    
    return () => {
      isMounted = false;
    };
  }, [randomize, pageSize, currentPage, prioritizePaths, retryCount]);

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  return { 
    domains, 
    loading, 
    error, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    totalCount
  };
};

// Provide fallback domains when the API fails
const getFallbackDomains = (prioritizePaths: string[] = []): Domain[] => {
  const fallbackDomains: Domain[] = [
    {
      id: "legal-domain",
      name: "Legal",
      path: "/legal",
      description: "Servicios legales y consultoría jurídica",
      status: "available"
    },
    {
      id: "arte-domain",
      name: "Arte",
      path: "/arte",
      description: "Proyectos de arte",
      status: "available"
    },
    {
      id: "negocios-domain",
      name: "Negocios",
      path: "/negocios",
      description: "Recursos empresariales",
      status: "available"
    },
    {
      id: "salud-domain",
      name: "Salud",
      path: "/salud",
      description: "Recursos de salud",
      status: "available"
    },
    {
      id: "comunidad-domain",
      name: "Comunidad",
      path: "/comunidad",
      description: "El espacio central para todo lo relacionado con nuestra comunidad",
      status: "available"
    },
    {
      id: "tech-domain",
      name: "Tech",
      path: "/tech",
      description: "Información y recursos sobre ciencia y tecnología",
      status: "available"
    },
    {
      id: "dominios-domain",
      name: "Dominios",
      path: "/dominio",
      description: "Administración de dominios",
      status: "used"
    },
    {
      id: "eventos-domain",
      name: "Eventos",
      path: "/events",
      description: "Calendario de eventos de la comunidad",
      status: "used"
    }
  ];
  
  // Prioritize domains if needed
  if (prioritizePaths.length > 0) {
    return [
      ...fallbackDomains.filter(d => prioritizePaths.includes(d.path)),
      ...fallbackDomains.filter(d => !prioritizePaths.includes(d.path))
    ];
  }
  
  return fallbackDomains;
};
