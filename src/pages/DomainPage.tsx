
import { useLocation } from "react-router-dom";
import DomainPageContent from "@/components/domains/DomainPageContent";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";
import { useState } from "react";
import { useDomains } from "@/hooks/useDomains";
import { useDomainHelpers } from "@/hooks/useDomainHelpers";
import DomainGraph from "@/components/domains/DomainGraph";
import { Button } from "@/components/ui/button";
import { BarChart4, ListFilter } from "lucide-react";

const DomainPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "graph">("list");
  const currentLanguage = "es"; // This could be dynamically set from a context or hook
  
  // Extract the domain path from the current URL path
  const domainPath = location.pathname;
  
  // Determine if this is a vertical domain (legal, arte, etc.)
  const isVerticalDomain = VERTICAL_PATHS.includes(domainPath);
  
  // Fetch domains data - get all domains for the graph view
  const {
    domains,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    isOffline
  } = useDomains({
    pageSize: viewMode === "graph" ? 100 : 12, // Load more domains for graph view
    randomize: false,
    filterStatus: [], // Get all domains for graph
  });
  
  // Get domain helper functions
  const {
    getStatusColor,
    handleDomainAction,
    setHoveredDomain,
    hoveredDomain
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
      domain.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status tab
    const matchesTab = activeTab === "all" || domain.status === activeTab;
    
    return matchesSearch && matchesTab;
  }) : [];

  const handleNodeClick = (domainId: string) => {
    const selectedDomain = domains?.find(d => d.id === domainId);
    if (selectedDomain) {
      handleDomainAction(selectedDomain);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-club-brown">
          {currentLanguage === "es" ? "Explorador de Dominios" : "Domain Explorer"}
        </h1>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-1"
          >
            <ListFilter size={16} />
            {currentLanguage === "es" ? "Lista" : "List"}
          </Button>
          <Button 
            variant={viewMode === "graph" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("graph")}
            className="flex items-center gap-1"
          >
            <BarChart4 size={16} />
            {currentLanguage === "es" ? "Grafo" : "Graph"}
          </Button>
        </div>
      </div>

      {viewMode === "graph" ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-club-brown mb-4">
            {currentLanguage === "es" ? "Grafo de Dominios" : "Domain Graph"}
          </h2>
          <DomainGraph 
            domains={domains || []} 
            currentLanguage={currentLanguage}
            onNodeClick={handleNodeClick}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default DomainPage;
