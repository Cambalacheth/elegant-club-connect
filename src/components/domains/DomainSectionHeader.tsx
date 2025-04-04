
import React from "react";
import DomainSearch from "./DomainSearch";

interface DomainSectionHeaderProps {
  domainsTitle: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPlaceholder: string;
}

const DomainSectionHeader = ({ 
  domainsTitle, 
  searchQuery, 
  setSearchQuery, 
  searchPlaceholder 
}: DomainSectionHeaderProps) => {
  return (
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
  );
};

export default DomainSectionHeader;
