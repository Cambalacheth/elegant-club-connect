
import { useState } from "react";
import { Domain } from "@/hooks/useDomains";

export const useDomainHelpers = (currentLanguage: string) => {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  
  const statusLabels = {
    available: currentLanguage === "en" ? "Available" : "Disponible",
    reserved: currentLanguage === "en" ? "Reserved" : "Reservado",
    used: currentLanguage === "en" ? "In Use" : "En Uso",
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

  const handleDomainAction = (domain: Domain) => {
    if (domain.externalUrl) {
      window.open(domain.externalUrl, '_blank');
    } else if (domain.status === 'used') {
      window.location.href = domain.path;
    }
  };
  
  return {
    hoveredDomain,
    setHoveredDomain,
    statusLabels,
    getStatusColor,
    handleDomainAction
  };
};
