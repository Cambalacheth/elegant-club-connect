
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
import { Skeleton } from "@/components/ui/skeleton";

interface DomainPageContentProps {
  domains?: Domain[];
  loading?: boolean;
  error?: string | null;
  isOffline?: boolean;
  currentLanguage?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  domainsByStatus?: {
    all: Domain[];
    available: Domain[];
    used: Domain[];
    reserved: Domain[];
  };
  filteredDomains?: Domain[];
  handleDomainAction?: (domain: Domain) => void;
  getStatusColor?: (status: string) => string;
  currentPage?: number;
  totalPages?: number;
  handlePageChange?: (page: number) => void;
  isVerticalPage?: boolean;
  getVerticalName?: () => string;
  domainPath?: string;
  isVerticalDomain?: boolean;
}

const DomainPageContent: React.FC<DomainPageContentProps> = ({
  loading = false,
  error = null,
  isOffline = false,
  currentLanguage = "es",
  searchQuery = "",
  setSearchQuery = () => {},
  activeTab = "all",
  setActiveTab = () => {},
  domainsByStatus = { all: [], available: [], used: [], reserved: [] },
  filteredDomains = [],
  handleDomainAction = () => {},
  getStatusColor = () => "",
  currentPage = 1,
  totalPages = 1,
  handlePageChange = () => {},
  isVerticalPage = false,
  getVerticalName = () => "",
  domainPath,
  isVerticalDomain
}) => {
  const conceptTitle = useMemo(() => 
    getConceptTitle(isVerticalPage, currentLanguage, getVerticalName), 
    [isVerticalPage, currentLanguage, getVerticalName]
  );
  
  const conceptDesc = useMemo(() => 
    getConceptDesc(isVerticalPage, currentLanguage, getVerticalName),
    [isVerticalPage, currentLanguage, getVerticalName]
  );
  
  const domainsTitle = useMemo(() => 
    getDomainsTitle(isVerticalPage, currentLanguage, getVerticalName),
    [isVerticalPage, currentLanguage, getVerticalName]
  );
  
  const searchPlaceholder = useMemo(() => 
    getSearchPlaceholder(currentLanguage),
    [currentLanguage]
  );

  const renderLoadingState = () => (
    <>
      <Skeleton className="h-10 w-48 mb-4" />
      <Skeleton className="h-32 w-full mb-8" />
      <Skeleton className="h-8 w-64 mb-4" />
      <Skeleton className="h-10 w-full mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {loading && !error && !isOffline ? (
        renderLoadingState()
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default DomainPageContent;
