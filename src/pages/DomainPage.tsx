
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useDomains } from "@/hooks/useDomains";
import { useDomainHelpers } from "@/hooks/useDomainHelpers";
import { useParams } from "react-router-dom";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";
import DomainPageContent from "@/components/domains/DomainPageContent";
import LanguageSwitcher from "@/components/domains/LanguageSwitcher";
import { 
  getPageTitle, 
  getPageDescription, 
  getVerticalName as getVerticalNameUtil
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
  
  // Group domains by status
  const domainsByStatus = useMemo(() => {
    const available = domains.filter(d => d.status === 'available');
    const used = domains.filter(d => d.status === 'used');
    const reserved = domains.filter(d => d.status === 'reserved');
    
    return { all: domains, available, used, reserved };
  }, [domains]);
  
  // Filter domains based on search query and active tab
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
          handlePageChange={handlePageChange}
          isVerticalPage={isVerticalPage}
          getVerticalName={getVerticalName}
        />
      </div>
      
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />
    </>
  );
};

export default DomainPage;
