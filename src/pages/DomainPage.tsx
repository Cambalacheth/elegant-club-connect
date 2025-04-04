
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useDomains } from "@/hooks/useDomains";
import { useDomainHelpers } from "@/hooks/useDomainHelpers";
import DomainConcept from "@/components/domains/DomainConcept";
import DomainSearch from "@/components/domains/DomainSearch";
import DomainGrid from "@/components/domains/DomainGrid";
import { useParams } from "react-router-dom";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Globe, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DomainPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const currentPath = params["*"] ? `/${params["*"]}` : "/dominio";
  const { toast } = useToast();
  
  // Default to "all" tab, but can be changed to filter domains
  const [activeTab, setActiveTab] = useState("all");
  
  // Check if we're on a vertical page
  const isVerticalPage = VERTICAL_PATHS.includes(currentPath);
  
  // Use the enhanced useDomains hook with randomized order and pagination
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
    // For vertical pages, prioritize domains in that vertical category
    prioritizePaths: isVerticalPage ? [currentPath] : [] 
  });
  
  const {
    statusLabels,
    getStatusColor,
    handleDomainAction
  } = useDomainHelpers(currentLanguage);
  
  // Group domains by status for the tabs
  const domainsByStatus = useMemo(() => {
    const available = domains.filter(d => d.status === 'available');
    const used = domains.filter(d => d.status === 'used');
    const reserved = domains.filter(d => d.status === 'reserved');
    
    return { all: domains, available, used, reserved };
  }, [domains]);
  
  // Get filtered domains based on search query and active tab
  const filteredDomains = useMemo(() => {
    const domainsForTab = domainsByStatus[activeTab as keyof typeof domainsByStatus] || domains;
    
    return domainsForTab.filter(domain => 
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (domain.description && domain.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [domainsByStatus, activeTab, searchQuery]);
  
  // Get page-specific titles based on current path
  const getPageTitle = () => {
    if (currentPath === "/legal") return currentLanguage === "en" ? "Legal - Terreta Hub" : "Legal - Terreta Hub";
    if (currentPath === "/arte") return currentLanguage === "en" ? "Art - Terreta Hub" : "Arte - Terreta Hub";
    if (currentPath === "/negocios") return currentLanguage === "en" ? "Business - Terreta Hub" : "Negocios - Terreta Hub";
    if (currentPath === "/salud") return currentLanguage === "en" ? "Health - Terreta Hub" : "Salud - Terreta Hub";
    if (currentPath === "/comunidad") return currentLanguage === "en" ? "Community - Terreta Hub" : "Comunidad - Terreta Hub";
    if (currentPath === "/tech") return currentLanguage === "en" ? "Technology - Terreta Hub" : "Tecnología - Terreta Hub";
    return currentLanguage === "en" ? "Domains - Terreta Hub" : "Dominios - Terreta Hub";
  };
  
  const getPageDescription = () => {
    if (isVerticalPage) {
      return currentLanguage === "en" 
        ? `Explore and discover content in the ${getVerticalName()} vertical`
        : `Explora y descubre contenido en la vertical de ${getVerticalName()}`;
    }
    return currentLanguage === "en" 
      ? "Customize your presence on Terreta Hub with branded domains"
      : "Personaliza tu presencia en Terreta Hub con dominios personalizados";
  };
  
  const getVerticalName = () => {
    if (currentPath === "/legal") return currentLanguage === "en" ? "Legal" : "Legal";
    if (currentPath === "/arte") return currentLanguage === "en" ? "Art" : "Arte";
    if (currentPath === "/negocios") return currentLanguage === "en" ? "Business" : "Negocios";
    if (currentPath === "/salud") return currentLanguage === "en" ? "Health" : "Salud";
    if (currentPath === "/comunidad") return currentLanguage === "en" ? "Community" : "Comunidad";
    if (currentPath === "/tech") return currentLanguage === "en" ? "Technology" : "Tecnología";
    return "";
  };
  
  const title = getPageTitle();
  const description = getPageDescription();
    
  const conceptTitle = isVerticalPage 
    ? (currentLanguage === "en" ? `The ${getVerticalName()} Vertical` : `La Vertical de ${getVerticalName()}`)
    : (currentLanguage === "en" ? "The Domains Concept" : "El Concepto de Dominios");
  
  const conceptDesc = isVerticalPage
    ? (currentLanguage === "en" 
      ? `Explore our ${getVerticalName()} vertical, a dedicated space for content and resources related to ${getVerticalName().toLowerCase()}.` 
      : `Explora nuestra vertical de ${getVerticalName()}, un espacio dedicado a contenido y recursos relacionados con ${getVerticalName().toLowerCase()}.`)
    : (currentLanguage === "en" 
      ? "At Terreta Hub, we've reimagined how community members can establish their presence." 
      : "En Terreta Hub, hemos reimaginado cómo los miembros de la comunidad pueden establecer su presencia.");
  
  const domainsTitle = isVerticalPage
    ? (currentLanguage === "en" ? `${getVerticalName()} Domains` : `Dominios de ${getVerticalName()}`)
    : (currentLanguage === "en" ? "Browse Domains" : "Explorar Dominios");
  
  const searchPlaceholder = currentLanguage === "en" ? "Search domains..." : "Buscar dominios...";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDomainCountText = (status: string) => {
    const count = domainsByStatus[status as keyof typeof domainsByStatus]?.length || 0;
    
    if (status === 'all') {
      return `(${domains.length})`;
    } else if (status === 'used') {
      return `(${count})`;
    } else if (status === 'available') {
      return `(${count})`;
    } else {
      return `(${count})`;
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
          <div className="flex items-center gap-3 mb-8">
            <Globe size={32} className="text-club-orange" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-club-brown">
              {conceptTitle}
            </h1>
          </div>
          
          <DomainConcept 
            conceptTitle={conceptTitle}
            conceptDesc={conceptDesc}
            currentLanguage={currentLanguage}
          />
          
          {isOffline && (
            <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
              <Database className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">
                {currentLanguage === "en" ? "You're offline" : "Estás sin conexión"}
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                {currentLanguage === "en" 
                  ? "Using cached domain data. Connect to the internet to see the latest information." 
                  : "Usando datos de dominios en caché. Conéctate a internet para ver la información más reciente."}
              </AlertDescription>
            </Alert>
          )}
          
          {error && !isOffline && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {currentLanguage === "en" ? "Connection issue" : "Problema de conexión"}
              </AlertTitle>
              <AlertDescription>
                {currentLanguage === "en" 
                  ? "Using cached data. Information may not be up to date." 
                  : "Usando datos en caché. La información puede no estar actualizada."}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-club-brown mb-4 md:mb-0">
              {domainsTitle}
            </h2>
            
            <DomainSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder={searchPlaceholder}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">
                {currentLanguage === "en" ? "All" : "Todos"} {getDomainCountText('all')}
              </TabsTrigger>
              <TabsTrigger value="used">
                {currentLanguage === "en" ? "In Use" : "En Uso"} {getDomainCountText('used')}
              </TabsTrigger>
              <TabsTrigger value="available">
                {currentLanguage === "en" ? "Available" : "Disponibles"} {getDomainCountText('available')}
              </TabsTrigger>
              <TabsTrigger value="reserved">
                {currentLanguage === "en" ? "Reserved" : "Reservados"} {getDomainCountText('reserved')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <DomainGrid 
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DomainPage;
