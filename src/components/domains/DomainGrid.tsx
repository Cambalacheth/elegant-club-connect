
import React from "react";
import { Domain } from "@/hooks/useDomains";
import DomainCard from "./DomainCard";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface DomainGridProps {
  filteredDomains: Domain[];
  loading: boolean;
  hoveredDomain: string | null;
  setHoveredDomain: (id: string | null) => void;
  handleDomainAction: (domain: Domain) => void;
  getStatusColor: (status: string) => string;
  statusLabels: Record<string, string>;
  currentLanguage: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const DomainGrid = ({
  filteredDomains,
  loading,
  hoveredDomain,
  setHoveredDomain,
  handleDomainAction,
  getStatusColor,
  statusLabels,
  currentLanguage,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  handlePageChange,
}: DomainGridProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-club-brown mx-auto"></div>
        <p className="mt-2 text-club-brown/70">
          {currentLanguage === "en" ? "Loading domains..." : "Cargando dominios..."}
        </p>
      </div>
    );
  }
  
  if (filteredDomains.length === 0) {
    return (
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
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredDomains.map((domain) => (
          <DomainCard 
            key={domain.id}
            domain={{...domain, currentLanguage}}
            hoveredDomain={hoveredDomain}
            setHoveredDomain={setHoveredDomain}
            handleDomainAction={handleDomainAction}
            getStatusColor={getStatusColor}
            statusLabels={statusLabels}
          />
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
  );
};

export default DomainGrid;
