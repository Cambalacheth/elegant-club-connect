
import React from "react";
import { Domain } from "@/hooks/useDomains";
import DomainExpandableCard from "./DomainExpandableCard";
import { Search, WifiOff, Database, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface DomainGridProps {
  filteredDomains: Domain[];
  loading: boolean;
  handleDomainAction: (domain: Domain) => void;
  getStatusColor: (status: string) => string;
  currentLanguage: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  error?: string | null;
  isOffline?: boolean;
}

const DomainGrid = ({
  filteredDomains,
  loading,
  handleDomainAction,
  getStatusColor,
  currentLanguage,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  handlePageChange,
  error,
  isOffline,
}: DomainGridProps) => {
  // Loading skeletons to show while data is loading
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isOffline) {
    return (
      <Alert variant="destructive" className="mb-6">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>
          {currentLanguage === "en" ? "You're offline" : "Estás sin conexión"}
        </AlertTitle>
        <AlertDescription>
          {currentLanguage === "en" 
            ? "Using cached domain data. Connect to the internet to see the latest information." 
            : "Usando datos de dominios en caché. Conéctate a internet para ver la información más reciente."}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {currentLanguage === "en" ? "Connection error" : "Error de conexión"}
        </AlertTitle>
        <AlertDescription>
          {currentLanguage === "en" 
            ? "We had trouble loading the domains. Using cached data instead." 
            : "Tuvimos problemas al cargar los dominios. Usando datos en caché en su lugar."}
        </AlertDescription>
      </Alert>
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
          <DomainExpandableCard 
            key={domain.id}
            domain={domain}
            currentLanguage={currentLanguage}
            getStatusColor={getStatusColor}
            handleDomainAction={handleDomainAction}
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
