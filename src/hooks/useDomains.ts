
import { useState, useEffect, useMemo } from 'react';
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

interface UseDomainProps {
  randomize?: boolean;
  pageSize?: number;
}

export const useDomains = ({ randomize = false, pageSize = 12 }: UseDomainProps = {}) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        
        // Count total domains for pagination
        const { count, error: countError } = await supabase
          .from('domains')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        if (count !== null) setTotalCount(count);
        
        // Use a raw SQL query since the table was created via SQL
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
        
        // Transform the data to match our Domain interface
        const formattedDomains: Domain[] = (data || []).map(domain => ({
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
        setDomains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [randomize, pageSize, currentPage]);

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
