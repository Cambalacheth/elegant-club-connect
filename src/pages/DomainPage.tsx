
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useDomains } from "@/hooks/useDomains";
import { useDomainHelpers } from "@/hooks/useDomainHelpers";
import DomainConcept from "@/components/domains/DomainConcept";
import { useParams } from "react-router-dom";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";
import DomainPageHeader from "@/components/domains/DomainPageHeader";
import DomainStatusAlerts from "@/components/domains/DomainStatusAlerts";
import DomainSectionHeader from "@/components/domains/DomainSectionHeader";
import DomainStatusTabs from "@/components/domains/DomainStatusTabs";
import { 
  getPageTitle, 
  getPageDescription, 
  getVerticalName as getVerticalNameUtil, 
  getConceptTitle, 
  getConceptDesc,
  getDomainsTitle,
  getSearchPlaceholder
} from "@/utils/domainPageUtils";

const DomainPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const currentPath = params["*"] ? `/${params["*"]}` : "/dominio";
  
  const [activeTab, setActiveTab] = useState("all");
  
  const isVerticalPage = VERTICAL_PATHS.includes(currentPath);
  
  const { 
    domains, 
    loading, 
    error,
    isOffline,
    currentPage, 
    setCurrentPage, 
    totalPages 
  } = useDomains({ 
    randomize: true, 
    pageSize: 12,
    prioritizePaths: isVerticalPage ? [currentPath] : [] 
  });
  
  const {
    statusLabels,
    getStatusColor,
    handleDomainAction
  } = useDomainHelpers(currentLanguage);
  
  const domainsByStatus = useMemo(() => {
    const available = domains.filter(d => d.status === 'available');
    const used = domains.filter(d => d.status === 'used');
    const reserved = domains.filter(d => d.status === 'reserved');
    
    return { all: domains, available, used, reserved };
  }, [domains]);
  
  const filteredDomains = useMemo(() => {
    const domainsForTab = domainsByStatus[activeTab as keyof typeof domainsByStatus] || domains;
    
    return domainsForTab.filter(domain => 
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (domain.description && domain.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [domainsByStatus, activeTab, searchQuery]);
  
  const getVerticalName = () => getVerticalNameUtil(currentPath, currentLanguage);
  
  const title = getPageTitle(currentPath, currentLanguage);
  const description = getPageDescription(isVerticalPage, currentLanguage, getVerticalName);
    
  const conceptTitle = getConceptTitle(isVerticalPage, currentLanguage, getVerticalName);
  const conceptDesc = getConceptDesc(isVerticalPage, currentLanguage, getVerticalName);
  const domainsTitle = getDomainsTitle(isVerticalPage, currentLanguage, getVerticalName);
  const searchPlaceholder = getSearchPlaceholder(currentLanguage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <Navbar currentLanguage={currentLanguage} />
      
      <div className="container mx-auto px-4 py-24">
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
      </div>
    </>
  );
};

export default DomainPage;
