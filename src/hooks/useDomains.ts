
import { useState, useEffect, useMemo } from 'react';
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

  // Retry logic
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        retryFetch();
      }, retryDelay);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, retryFetch]);

  // Network status listeners
  useEffect(() => {
    const handleOnline = () => {
      if (isOffline) {
        retryFetch();
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', () => {});
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', () => {});
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
