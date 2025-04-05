
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
  const maxRetries = 2; // Reduced from 3
  const retryDelay = 5000; // Increased to 5 seconds
  
  // Prevent unnecessary retries
  const isRetrying = useRef(false);
  const lastRetryTime = useRef(0);

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

  // Controlled retry logic with limits and time-based throttling
  useEffect(() => {
    if (error && retryCount < maxRetries && !isRetrying.current) {
      const now = Date.now();
      // Only retry if it's been at least retryDelay since the last retry
      if (now - lastRetryTime.current >= retryDelay) {
        isRetrying.current = true;
        lastRetryTime.current = now;
        
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
    }
  }, [error, retryCount, retryDelay, maxRetries, retryFetch]);

  // Network status listeners - only retry once when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (isOffline && !isRetrying.current) {
        isRetrying.current = true;
        const now = Date.now();
        // Only retry if it's been at least retryDelay since the last retry
        if (now - lastRetryTime.current >= retryDelay) {
          lastRetryTime.current = now;
          retryFetch().finally(() => {
            isRetrying.current = false;
          });
        } else {
          isRetrying.current = false;
        }
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isOffline, retryFetch, retryDelay]);

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
