
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useDomains } from "@/hooks/useDomains";
import { useDomainHelpers } from "@/hooks/useDomainHelpers";
import DomainConcept from "@/components/domains/DomainConcept";
import DomainSearch from "@/components/domains/DomainSearch";
import DomainGrid from "@/components/domains/DomainGrid";

const DomainPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use the enhanced useDomains hook with randomized order and pagination
  const { 
    domains, 
    loading, 
    currentPage, 
    setCurrentPage, 
    totalPages 
  } = useDomains({ randomize: true, pageSize: 12 });
  
  const {
    hoveredDomain,
    setHoveredDomain,
    statusLabels,
    getStatusColor,
    handleDomainAction
  } = useDomainHelpers(currentLanguage);
  
  const title = currentLanguage === "en" ? "Domains - Terreta Hub" : "Dominios - Terreta Hub";
  const description = currentLanguage === "en" 
    ? "Customize your presence on Terreta Hub with branded domains"
    : "Personaliza tu presencia en Terreta Hub con dominios personalizados";
    
  const conceptTitle = currentLanguage === "en" ? "The Domains Concept" : "El Concepto de Dominios";
  const conceptDesc = currentLanguage === "en" 
    ? "At Terreta Hub, we've reimagined how community members can establish their presence." 
    : "En Terreta Hub, hemos reimaginado cómo los miembros de la comunidad pueden establecer su presencia.";
  
  const domainsTitle = currentLanguage === "en" ? "Available Domains" : "Dominios Disponibles";
  const searchPlaceholder = currentLanguage === "en" ? "Search domains..." : "Buscar dominios...";

  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (domain.description && domain.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
