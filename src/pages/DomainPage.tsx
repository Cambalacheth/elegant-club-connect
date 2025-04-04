
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useDomains } from "@/hooks/useDomains";
import { useDomainHelpers } from "@/hooks/useDomainHelpers";
import DomainConcept from "@/components/domains/DomainConcept";
import DomainSearch from "@/components/domains/DomainSearch";
import DomainGrid from "@/components/domains/DomainGrid";
import { useParams } from "react-router-dom";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";

const DomainPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const currentPath = params["*"] ? `/${params["*"]}` : "/dominio";
  
  // Check if we're on a vertical page
  const isVerticalPage = VERTICAL_PATHS.includes(currentPath);
  
  // Use the enhanced useDomains hook with randomized order and pagination
  const { 
    domains, 
    loading, 
    error,
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
    hoveredDomain,
    setHoveredDomain,
    statusLabels,
    getStatusColor,
    handleDomainAction
  } = useDomainHelpers(currentLanguage);
  
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
    : (currentLanguage === "en" ? "Available Domains" : "Dominios Disponibles");
  
  const searchPlaceholder = currentLanguage === "en" ? "Search domains..." : "Buscar dominios...";

  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (domain.description && domain.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add an effect to log domain status for debugging
  useEffect(() => {
    if (!loading) {
      console.log(`Domains loaded: ${domains.length}`, domains);
      if (error) {
        console.error("Error loading domains:", error);
      }
    }
  }, [domains, loading, error]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <Navbar currentLanguage={currentLanguage} />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-club-brown mb-8">
            {conceptTitle}
          </h1>
          
          <DomainConcept 
            conceptTitle={conceptTitle}
            conceptDesc={conceptDesc}
            currentLanguage={currentLanguage}
          />
          
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
          
          <DomainGrid 
            filteredDomains={filteredDomains}
            loading={loading}
            hoveredDomain={hoveredDomain}
            setHoveredDomain={setHoveredDomain}
            handleDomainAction={handleDomainAction}
            getStatusColor={getStatusColor}
            statusLabels={statusLabels}
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
