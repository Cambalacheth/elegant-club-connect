
import { useState, useEffect, useMemo, useRef } from 'react';
import { UseDomainProps, Domain } from '@/types/domain';
import { useDomainFetcher } from './useDomainFetcher';

export type { Domain } from '@/types/domain';

export const useDomains = ({ 
  randomize = false, 
  pageSize = 12,
  prioritizePaths = [] 
}: UseDomainProps = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds delay between retries
  
  // Prevent unnecessary retries
  const isRetrying = useRef(false);

  // Use the domain fetcher hook
  const {
    domains,
    loading,
    error,
    totalCount,
    isOffline,
    retryFetch
  } = useDomainFetcher({
    randomize,
    pageSize,
    prioritizePaths,
    currentPage
  });

  // Controlled retry logic with limits
  useEffect(() => {
    if (error && retryCount < maxRetries && !isRetrying.current) {
      isRetrying.current = true;
      
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        retryFetch().finally(() => {
          isRetrying.current = false;
        });
      }, retryDelay);
      
      return () => {
        clearTimeout(timer);
        isRetrying.current = false;
      };
    }
  }, [error, retryCount, retryFetch]);

  // Network status listeners - only retry once when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (isOffline && !isRetrying.current) {
        isRetrying.current = true;
        retryFetch().finally(() => {
          isRetrying.current = false;
        });
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isOffline, retryFetch]);

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize) || 1, [totalCount, pageSize]);

  return { 
    domains, 
    loading, 
    error, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    totalCount,
    isOffline
  };
};
