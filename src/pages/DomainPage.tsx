
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDomains } from "@/hooks/useDomains";
import { ExternalLink, Search, GlobeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const DomainPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [showVerticals, setShowVerticals] = useState(true);
  
  // Define the vertical paths to highlight
  const verticalPaths = ['/legal', '/arte', '/negocios', '/salud', '/comunidad', '/tech'];
  
  // Use the enhanced useDomains hook with randomized order and pagination
  const { 
    domains, 
    loading, 
    currentPage, 
    setCurrentPage, 
    totalPages 
  } = useDomains({ randomize: true, pageSize: 12, prioritizePaths: verticalPaths });
  
  // Get the vertical domains
  const verticalDomains = domains.filter(domain => verticalPaths.includes(domain.path));
  // Get the rest of the domains
  const regularDomains = domains.filter(domain => !verticalPaths.includes(domain.path));
  
  const title = currentLanguage === "en" ? "Domains - Terreta Hub" : "Dominios - Terreta Hub";
  const description = currentLanguage === "en" 
    ? "Customize your presence on Terreta Hub with branded domains"
    : "Personaliza tu presencia en Terreta Hub con dominios personalizados";
    
  const conceptTitle = currentLanguage === "en" ? "The Domains Concept" : "El Concepto de Dominios";
  const conceptDesc = currentLanguage === "en" 
    ? "At Terreta Hub, we've reimagined how community members can establish their presence." 
    : "En Terreta Hub, hemos reimaginado cómo los miembros de la comunidad pueden establecer su presencia.";
  
  const verticalsTitle = currentLanguage === "en" ? "Vertical Domains" : "Dominios Verticales";
  const domainsTitle = currentLanguage === "en" ? "Available Domains" : "Dominios Disponibles";
  const searchPlaceholder = currentLanguage === "en" ? "Search domains..." : "Buscar dominios...";
  
  const statusLabels = {
    available: currentLanguage === "en" ? "Available" : "Disponible",
    reserved: currentLanguage === "en" ? "Reserved" : "Reservado",
    used: currentLanguage === "en" ? "In Use" : "En Uso",
  };

  const filteredDomains = regularDomains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (domain.description && domain.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDomainAction = (domain: any) => {
    if (domain.externalUrl) {
      window.open(domain.externalUrl, '_blank');
    } else if (domain.status === 'used') {
      window.location.href = domain.path;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': 
        return 'bg-green-100 border-green-300 text-green-800';
      case 'reserved': 
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'used': 
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default: 
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Domain card component to reuse for both vertical and regular domains
  const DomainCard = ({ domain }: { domain: any }) => (
    <div 
      key={domain.id}
      className={cn(
        "border rounded-lg p-4 transition-all duration-300",
        getStatusColor(domain.status),
        hoveredDomain === domain.id ? "shadow-md transform -translate-y-1" : "",
        "flex flex-col justify-between"
      )}
      onMouseEnter={() => setHoveredDomain(domain.id)}
      onMouseLeave={() => setHoveredDomain(null)}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-bold text-lg flex items-center">
            <GlobeIcon size={16} className="mr-1.5 opacity-70" />
            {domain.name}
          </h3>
          <span className="text-xs rounded-full px-3 py-1 bg-white/50 font-medium">
            {statusLabels[domain.status]}
          </span>
        </div>
        
        <p className="text-sm mb-3 line-clamp-2 min-h-[40px]">{domain.description || "-"}</p>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-mono text-club-brown/60">
          {domain.path}
        </span>
        
        <Button 
          variant={domain.status === "available" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleDomainAction(domain)}
          disabled={domain.status === 'reserved'}
          className={cn(
            domain.externalUrl ? "flex items-center gap-1" : "",
            domain.status === "available" ? "bg-club-orange hover:bg-club-orange/90" : ""
          )}
        >
          {domain.status === "available" 
            ? (currentLanguage === "en" ? "Claim" : "Reclamar")
            : (currentLanguage === "en" ? "Visit" : "Visitar")
          }
          {domain.externalUrl && <ExternalLink size={14} />}
        </Button>
      </div>
    </div>
  );

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
          
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">
                {currentLanguage === "en" ? "What are Terreta Domains?" : "¿Qué son los Dominios Terreta?"}
              </CardTitle>
              <CardDescription>
                {conceptDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {currentLanguage === "en" 
                  ? "Traditional websites offer standard pages like /events or /projects. At Terreta Hub, we go beyond by allowing members to create branded domains - custom pages that represent their personal brand or project."
                  : "Los sitios web tradicionales ofrecen páginas estándar como /eventos o /proyectos. En Terreta Hub, vamos más allá al permitir a los miembros crear dominios personalizados - páginas a medida que representan su marca personal o proyecto."}
              </p>
              <p className="font-semibold">
                {currentLanguage === "en"
                  ? "This creates a unique ecosystem where each member can have their own branded space within the larger Terreta community."
                  : "Esto crea un ecosistema único donde cada miembro puede tener su propio espacio personalizado dentro de la comunidad Terreta más amplia."}
              </p>
            </CardContent>
          </Card>
          
          {/* Vertical Domains Section */}
          {verticalDomains.length > 0 && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-club-brown mb-4 md:mb-0">
                  {verticalsTitle}
                </h2>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setShowVerticals(!showVerticals)}
                  className="self-start md:self-auto"
                >
                  {showVerticals 
                    ? (currentLanguage === "en" ? "Hide Verticals" : "Ocultar Verticales") 
                    : (currentLanguage === "en" ? "Show Verticals" : "Mostrar Verticales")}
                </Button>
              </div>
              
              {showVerticals && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {verticalDomains.map((domain) => (
                    <DomainCard key={domain.id} domain={domain} />
                  ))}
                </div>
              )}
            </>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-club-brown mb-4 md:mb-0">
              {domainsTitle}
            </h2>
            
            <div className="relative w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-brown/50" size={18} />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-10 pr-4 py-2 border border-club-beige-dark focus:border-club-orange transition-all"
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2" 
                    onClick={() => setSearchQuery("")}>
                    <span className="sr-only">Clear search</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x text-club-brown/50">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-club-brown mx-auto"></div>
              <p className="mt-2 text-club-brown/70">
                {currentLanguage === "en" ? "Loading domains..." : "Cargando dominios..."}
              </p>
            </div>
          ) : filteredDomains.length === 0 ? (
            <div className="text-center py-16 bg-club-beige/50 rounded-lg">
              <Search size={48} className="mx-auto text-club-brown/30" />
              <p className="mt-4 text-club-brown/70">
                {currentLanguage === "en" 
                  ? "No domains found matching your search." 
                  : "No se encontraron dominios que coincidan con tu búsqueda."}
              </p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-club-orange"
                >
                  {currentLanguage === "en" ? "Clear search" : "Limpiar búsqueda"}
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredDomains.map((domain) => (
                  <DomainCard key={domain.id} domain={domain} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={cn(currentPage === 1 ? "pointer-events-none opacity-50" : "")}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className={cn(
                            "cursor-pointer",
                            page === currentPage ? "bg-club-orange text-white border-club-orange hover:bg-club-orange/90" : ""
                          )}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={cn(currentPage === totalPages ? "pointer-events-none opacity-50" : "")}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DomainPage;
