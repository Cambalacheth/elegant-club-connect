
import { useLocation } from "react-router-dom";
import DomainPageContent from "@/components/domains/DomainPageContent";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";
import { useState } from "react";
import { useDomains } from "@/hooks/useDomains";
import { useDomainHelpers } from "@/hooks/useDomainHelpers";

const DomainPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const currentLanguage = "es"; // This could be dynamically set from a context or hook
  
  // Extract the domain path from the current URL path
  const domainPath = location.pathname;
  
  // Determine if this is a vertical domain (legal, arte, etc.)
  const isVerticalDomain = VERTICAL_PATHS.includes(domainPath);
  
  // Fetch domains data
  const {
    domains,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    isOffline
  } = useDomains();
  
  // Get domain helper functions
  const {
    getStatusColor,
    handleDomainAction
  } = useDomainHelpers(currentLanguage);
  
  // Group domains by status
  const domainsByStatus = domains ? {
    all: domains,
    available: domains.filter(d => d.status === "available"),
    used: domains.filter(d => d.status === "used"),
    reserved: domains.filter(d => d.status === "reserved")
  } : undefined;
  
  // Filter domains based on search query and active tab
  const filteredDomains = domains ? domains.filter(domain => {
    // Filter by search query if provided
    const matchesSearch = searchQuery.trim() === "" || 
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status tab
    const matchesTab = activeTab === "all" || domain.status === activeTab;
    
    return matchesSearch && matchesTab;
  }) : [];
  
  return (
    <DomainPageContent 
      domains={domains}
      loading={loading}
      error={error}
      isOffline={isOffline}
      currentLanguage={currentLanguage}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      domainsByStatus={domainsByStatus}
      filteredDomains={filteredDomains}
      handleDomainAction={handleDomainAction}
      getStatusColor={getStatusColor}
      currentPage={currentPage}
      totalPages={totalPages}
      handlePageChange={setCurrentPage}
      domainPath={domainPath} 
      isVerticalDomain={isVerticalDomain} 
    />
  );
};

export default DomainPage;
