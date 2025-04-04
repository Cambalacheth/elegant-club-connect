
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DomainGrid from "./DomainGrid";
import { Domain } from "@/hooks/useDomains";

interface DomainStatusTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  domainsByStatus: {
    all: Domain[];
    available: Domain[];
    used: Domain[];
    reserved: Domain[];
  };
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

const DomainStatusTabs = ({
  activeTab,
  setActiveTab,
  domainsByStatus,
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
}: DomainStatusTabsProps) => {

  const getDomainCountText = (status: string) => {
    const count = domainsByStatus[status as keyof typeof domainsByStatus]?.length || 0;
    
    if (status === 'all') {
      return `(${domainsByStatus.all.length})`;
    } else if (status === 'used') {
      return `(${count})`;
    } else if (status === 'available') {
      return `(${count})`;
    } else {
      return `(${count})`;
    }
  };

  return (
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
  );
};

export default DomainStatusTabs;
