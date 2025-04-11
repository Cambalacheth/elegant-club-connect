
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DomainGraph from "@/components/domains/DomainGraph";
import DomainChatbot from "@/components/domains/DomainChatbot";

const DomainPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const currentPath = params["*"] ? `/${params["*"]}` : "/dominio";
  
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('graph');
  
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

  const handleDomainNodeClick = (domainId: string) => {
    if (domainId === 'terreta-hub') {
      window.location.href = '/';
      return;
    }
    
    const domain = domains.find(d => d.id === domainId);
    if (domain) {
      handleDomainAction(domain);
    }
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
          <h1 className="text-3xl font-bold mb-8 text-center">
            {isVerticalPage 
              ? (currentLanguage === 'en' ? `${getVerticalName()} Domain` : `Dominio de ${getVerticalName()}`)
              : (currentLanguage === 'en' ? 'Domain Explorer' : 'Explorador de Dominios')}
          </h1>

          <Tabs defaultValue="graph" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="graph" onClick={() => setViewMode('graph')}>
                {currentLanguage === 'en' ? 'Semantic Graph' : 'Grafo Semántico'}
              </TabsTrigger>
              <TabsTrigger value="list" onClick={() => setViewMode('list')}>
                {currentLanguage === 'en' ? 'List View' : 'Vista de Lista'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="graph">
              <DomainGraph 
                domains={domains} 
                currentLanguage={currentLanguage} 
                onNodeClick={handleDomainNodeClick}
              />
            </TabsContent>
            
            <TabsContent value="list">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />
      
      <DomainChatbot currentLanguage={currentLanguage} />
    </>
  );
};

export default DomainPage;
