
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Domain {
  id: string;
  name: string;
  path: string;
  description: string;
  status: "available" | "reserved" | "used";
  owner?: string;
  externalUrl?: string;
}

export const useDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('domains')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        // Transform the data to match our Domain interface
        const formattedDomains: Domain[] = data.map(domain => ({
          id: domain.id,
          name: domain.name,
          path: domain.path,
          description: domain.description || '',
          status: domain.status as "available" | "reserved" | "used",
          owner: domain.owner,
          externalUrl: domain.external_url
        }));
        
        setDomains(formattedDomains);
        setError(null);
      } catch (err) {
        console.error('Error fetching domains:', err);
        setError('Failed to load domains');
        // Fall back to empty array
        setDomains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return { domains, loading, error };
};
