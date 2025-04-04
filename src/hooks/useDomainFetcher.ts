
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Domain } from '@/types/domain';
import { formatDomains, getFallbackDomains } from '@/utils/domainUtils';
import { toast } from '@/components/ui/use-toast';

interface UseDomainFetcherProps {
  randomize?: boolean;
  pageSize?: number;
  prioritizePaths?: string[];
  currentPage: number;
}

interface UseDomainFetcherResult {
  domains: Domain[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  isOffline: boolean;
  retryFetch: () => Promise<void>;
}

export const useDomainFetcher = ({
  randomize = false,
  pageSize = 12,
  prioritizePaths = [],
  currentPage,
}: UseDomainFetcherProps): UseDomainFetcherResult => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if we're offline
      if (!navigator.onLine) {
        setIsOffline(true);
        throw new Error("You are offline");
      }
      
      // Use more reliable count query approach
      const { count, error: countError } = await supabase
        .from('domains')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error('Error counting domains:', countError);
        // Continue anyway, we can still try to load domains
      }
      
      if (count !== null) {
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
      
      if (!data || data.length === 0) {
        console.log("No domains found or empty response");
        // Set fallback domains if no data is returned
        setDomains(getFallbackDomains(prioritizePaths));
      } else {
        console.log("Domains loaded:", data.length, data);
        // Format the domains
        const formattedDomains = formatDomains(data, prioritizePaths);
        setDomains(formattedDomains);
        setError(null);
        setRetryCount(0); // Reset retry count on success
        setIsOffline(false);
      }
    } catch (err: any) {
      console.error('Error fetching domains:', err);
      
      setError('Failed to load domains');
      console.error("Error loading domains:", err.message || "Unknown error");
      
      // Only show toast in production - prevents dev mode flood of messages
      if (process.env.NODE_ENV !== 'development') {
        toast({
          title: "Problema de conexión",
          description: "Usando datos en caché. La información puede no estar actualizada.",
          variant: "destructive"
        });
      }
      
      // Use fallback domains when there's an error
      setDomains(getFallbackDomains(prioritizePaths));
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, randomize, prioritizePaths]);

  return {
    domains,
    loading,
    error,
    totalCount,
    isOffline,
    retryFetch: fetchDomains
  };
};
