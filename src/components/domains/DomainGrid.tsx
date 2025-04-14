
import React, { useState } from "react";
import { Domain } from "@/hooks/useDomains";
import DomainCard from "./DomainCard";
import DomainEmptyState from "./DomainEmptyState";
import DomainPagination from "./DomainPagination";

interface DomainGridProps {
  filteredDomains: Domain[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  handleDomainAction: (domain: Domain) => void;
  getStatusColor: (status: string) => string;
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
  error,
  isOffline,
  handleDomainAction,
  getStatusColor,
  currentLanguage,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  handlePageChange
}: DomainGridProps) => {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  
  // Status texts by language
  const statusLabels = {
    available: currentLanguage === "en" ? "Available" : "Disponible",
    used: currentLanguage === "en" ? "In Use" : "En Uso",
    reserved: currentLanguage === "en" ? "Reserved" : "Reservado"
  };
  
  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-club-orange"></div>
        <p className="mt-4 text-club-brown">
          {currentLanguage === "en" ? "Loading domains..." : "Cargando dominios..."}
        </p>
      </div>
    );
  }
  
  if (filteredDomains.length === 0) {
    return (
      <DomainEmptyState 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentLanguage={currentLanguage}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDomains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            currentLanguage={currentLanguage}
            hoveredDomain={hoveredDomain}
            setHoveredDomain={setHoveredDomain}
            handleDomainAction={handleDomainAction}
            getStatusColor={getStatusColor}
            statusLabels={statusLabels}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <DomainPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          currentLanguage={currentLanguage}
        />
      )}
    </div>
  );
};

export default DomainGrid;
