
import React, { useMemo } from "react";
import { Domain } from "@/hooks/useDomains";
import DomainConcept from "@/components/domains/DomainConcept";
import DomainPageHeader from "@/components/domains/DomainPageHeader";
import DomainStatusAlerts from "@/components/domains/DomainStatusAlerts";
import DomainSectionHeader from "@/components/domains/DomainSectionHeader";
import DomainStatusTabs from "@/components/domains/DomainStatusTabs";
import { 
  getConceptTitle, 
  getConceptDesc,
  getDomainsTitle,
  getSearchPlaceholder
} from "@/utils/domainPageUtils";

interface DomainPageContentProps {
  domains: Domain[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  currentLanguage: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  domainsByStatus: {
    all: Domain[];
    available: Domain[];
    used: Domain[];
    reserved: Domain[];
  };
  filteredDomains: Domain[];
  handleDomainAction: (domain: Domain) => void;
  getStatusColor: (status: string) => string;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  isVerticalPage: boolean;
  getVerticalName: () => string;
}

const DomainPageContent: React.FC<DomainPageContentProps> = ({
  loading,
  error,
  isOffline,
  currentLanguage,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  domainsByStatus,
  filteredDomains,
  handleDomainAction,
  getStatusColor,
  currentPage,
  totalPages,
  handlePageChange,
  isVerticalPage,
  getVerticalName
}) => {
  const conceptTitle = getConceptTitle(isVerticalPage, currentLanguage, getVerticalName);
  const conceptDesc = getConceptDesc(isVerticalPage, currentLanguage, getVerticalName);
  const domainsTitle = getDomainsTitle(isVerticalPage, currentLanguage, getVerticalName);
  const searchPlaceholder = getSearchPlaceholder(currentLanguage);

  return (
    <div className="max-w-5xl mx-auto">
      <DomainPageHeader 
        conceptTitle={conceptTitle}
        currentLanguage={currentLanguage} 
      />
      
      <DomainConcept 
        conceptTitle={conceptTitle}
        conceptDesc={conceptDesc}
        currentLanguage={currentLanguage}
      />
      
      <DomainStatusAlerts 
        error={error}
        isOffline={isOffline}
        currentLanguage={currentLanguage}
      />
      
      <DomainSectionHeader
        domainsTitle={domainsTitle}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder={searchPlaceholder}
      />
      
      <DomainStatusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        domainsByStatus={domainsByStatus}
        filteredDomains={filteredDomains}
        loading={loading}
        error={error}
        isOffline={isOffline}
        handleDomainAction={handleDomainAction}
        getStatusColor={getStatusColor}
        currentLanguage={currentLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default DomainPageContent;
