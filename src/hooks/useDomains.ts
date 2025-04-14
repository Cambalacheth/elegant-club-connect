
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseDomainProps } from "@/types/domain";
import { formatDomains, getFallbackDomains } from "@/utils/domainUtils";

export interface Domain {
  id: string;
  name: string;
  description: string | null;
  status: "available" | "used" | "reserved";
  path: string;
  externalUrl?: string | null;
  createdAt?: string;
  owner?: string | null;
}

export const useDomains = ({ 
  pageSize = 15, 
  randomize = false, 
  prioritizePaths = [],
  filterStatus = []
}: UseDomainProps = {}) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Listen for online/offline status
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
  
  const { data: domains, isLoading: loading, error } = useQuery({
    queryKey: ['domains', pageSize, randomize, filterStatus],
    queryFn: async () => {
      try {
        let query = supabase
          .from('domains')
          .select('*');
        
        if (filterStatus && filterStatus.length > 0) {
          query = query.in('status', filterStatus);
        }
        
        if (randomize) {
          // Add randomization if needed
          query = query.order('id', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }
        
        if (pageSize) {
          query = query.limit(pageSize);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return formatDomains(data || [], prioritizePaths);
      } catch (error) {
        console.error("Error fetching domains:", error);
        // Return fallback domains in case of error
        return getFallbackDomains(prioritizePaths);
      }
    },
  });

  // Process domains
  const domainsByStatus = domains ? {
    all: domains,
    available: domains.filter(domain => domain.status === 'available'),
    used: domains.filter(domain => domain.status === 'used'),
    reserved: domains.filter(domain => domain.status === 'reserved'),
  } : {
    all: [],
    available: [],
    used: [],
    reserved: []
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'available': 
        return 'border-green-100 bg-green-50/70';
      case 'used': 
        return 'border-blue-100 bg-blue-50/70';
      case 'reserved': 
        return 'border-amber-100 bg-amber-50/70';
      default: 
        return 'border-gray-100 bg-gray-50/70';
    }
  };
  
  // Pagination
  const totalPages = domains ? Math.ceil(domains.length / pageSize) : 1;
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle domain action (claim or visit)
  const handleDomainAction = (domain: Domain) => {
    if (domain.status === 'available') {
      // Claim domain logic
      console.log('Claiming domain:', domain.name);
    } else {
      // Visit domain logic
      if (domain.externalUrl) {
        window.open(domain.externalUrl, '_blank');
      } else {
        window.location.href = domain.path;
      }
    }
  };
  
  return {
    domains,
    domainsByStatus,
    loading,
    error: error as unknown as string | null,
    isOffline,
    filteredDomains: domains || [],
    handleDomainAction,
    getStatusColor,
    currentPage,
    setCurrentPage,
    totalPages,
    handlePageChange
  };
};
