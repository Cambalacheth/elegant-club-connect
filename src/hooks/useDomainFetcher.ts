
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Domain } from '@/types/domain';
import { formatDomains, getFallbackDomains } from '@/utils/domainUtils';
import { toast } from '@/components/ui/use-toast';

interface UseDomainFetcherProps {
  randomize?: boolean;
  pageSize?: number;
  prioritizePaths?: string[];
  filterStatus?: ("available" | "reserved" | "used")[];
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
  filterStatus = [],
  currentPage,
}: UseDomainFetcherProps): UseDomainFetcherResult => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Use these refs to prevent infinite loops
  const isFetching = useRef(false);
  const lastFetchedPage = useRef(-1);
  const hasFetchedSuccessfully = useRef(false);
  const fetchCount = useRef(0);

  // Set up network status listener for the component lifecycle
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchDomains = useCallback(async () => {
    // Prevent concurrent fetches and repeated fetches of the same page
    if (isFetching.current || lastFetchedPage.current === currentPage) {
      return;
    }
    
    // Limit fetch attempts to 3 per page to prevent infinite loops
    if (fetchCount.current >= 3) {
      console.log("Maximum fetch attempts reached, using fallback data");
      setLoading(false);
      return;
    }
    
    try {
      isFetching.current = true;
      fetchCount.current += 1;
      setLoading(true);
      
      // Check if we're offline
      if (!navigator.onLine) {
        setIsOffline(true);
        console.log("Device is offline, using fallback domains");
        // Filter the fallback domains by status if needed
        let fallbackDomains = getFallbackDomains(prioritizePaths);
        if (filterStatus.length > 0) {
          fallbackDomains = fallbackDomains.filter(d => filterStatus.includes(d.status));
        }
        setDomains(fallbackDomains);
        setTotalCount(fallbackDomains.length);
        setLoading(false);
        isFetching.current = false;
        lastFetchedPage.current = currentPage;
        return;
      }
      
      // Create the query
      let countQuery = supabase.from('domains').select('*', { count: 'exact', head: true });
      
      // Apply status filter if provided
      if (filterStatus.length > 0) {
        countQuery = countQuery.in('status', filterStatus);
      }
      
      // Get the count of matching records
      const { count, error: countError } = await countQuery;
        
      if (countError) {
        console.error('Error counting domains:', countError);
        throw countError;
      }
      
      if (count !== null) {
        setTotalCount(count);
      }
      
      // Query with pagination
      let query = supabase.from('domains').select('*');
      
      // Apply status filter if provided
      if (filterStatus.length > 0) {
        query = query.in('status', filterStatus);
      }
        
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
        // Set filtered fallback domains if no data is returned
        let fallbackDomains = getFallbackDomains(prioritizePaths);
        if (filterStatus.length > 0) {
          fallbackDomains = fallbackDomains.filter(d => filterStatus.includes(d.status));
        }
        setDomains(fallbackDomains);
      } else {
        console.log("Domains loaded:", data.length);
        // Format the domains
        const formattedDomains = formatDomains(data, prioritizePaths);
        setDomains(formattedDomains);
        setError(null);
        hasFetchedSuccessfully.current = true;
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
      
      // Use filtered fallback domains when there's an error
      let fallbackDomains = getFallbackDomains(prioritizePaths);
      if (filterStatus.length > 0) {
        fallbackDomains = fallbackDomains.filter(d => filterStatus.includes(d.status));
      }
      setDomains(fallbackDomains);
    } finally {
      setLoading(false);
      isFetching.current = false;
      lastFetchedPage.current = currentPage;
    }
  }, [currentPage, pageSize, randomize, prioritizePaths, filterStatus]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    // Prevent unnecessary fetches when dependencies haven't changed
    if (lastFetchedPage.current !== currentPage) {
      // Reset fetch count for new page
      fetchCount.current = 0;
      fetchDomains();
    }
  }, [fetchDomains, currentPage]);

  // Auto-retry on network status change but only if we haven't fetched successfully yet
  useEffect(() => {
    if (!isOffline && error && !hasFetchedSuccessfully.current && fetchCount.current < 3) {
      const timer = setTimeout(() => {
        fetchDomains();
      }, 5000); // 5 second delay before retry
      
      return () => clearTimeout(timer);
    }
  }, [isOffline, error, fetchDomains]);

  const retryFetch = useCallback(async () => {
    // Reset fetch count when manually retrying
    fetchCount.current = 0;
    lastFetchedPage.current = -1;  // Force a refetch
    await fetchDomains();
  }, [fetchDomains]);

  return {
    domains,
    loading,
    error,
    totalCount,
    isOffline,
    retryFetch
  };
};
