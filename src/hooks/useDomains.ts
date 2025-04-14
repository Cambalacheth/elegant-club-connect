
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export const useDomains = (initialStatus = "all", language = "es") => {
  const [activeTab, setActiveTab] = useState(initialStatus);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [domainsPerPage] = useState(15);
  
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
  
  const { data: domains, isLoading, error } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Domain[];
    },
  });

  // Process domains
  const domainsByStatus = domains ? {
    all: domains,
    available: domains.filter(domain => domain.status === 'available'),
    used: domains.filter(domain => domain.status === 'used'),
    reserved: domains.filter(domain => domain.status === 'reserved'),
  } : undefined;
  
  // Status texts by language
  const statusLabels = {
    available: language === "en" ? "Available" : "Disponible",
    used: language === "en" ? "In Use" : "En Uso",
    reserved: language === "en" ? "Reserved" : "Reservado"
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
  
  // Filter domains based on active tab and search query
  const filteredDomains = domainsByStatus?.[activeTab as keyof typeof domainsByStatus]?.filter(domain => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      domain.name.toLowerCase().includes(lowerCaseQuery) ||
      (domain.description?.toLowerCase().includes(lowerCaseQuery)) ||
      domain.path.toLowerCase().includes(lowerCaseQuery)
    );
  }) || [];
  
  // Pagination
  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = filteredDomains.slice(indexOfFirstDomain, indexOfLastDomain);
  const totalPages = Math.ceil(filteredDomains.length / domainsPerPage);
  
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
    domainsByStatus,
    loading: isLoading,
    error,
    isOffline,
    activeTab,
    setActiveTab,
    filteredDomains: currentDomains,
    totalDomains: filteredDomains.length,
    handleDomainAction,
    getStatusColor,
    statusLabels,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    handlePageChange
  };
};
