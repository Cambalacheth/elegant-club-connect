
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DomainEmptyStateProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentLanguage: string;
}

const DomainEmptyState = ({ 
  searchQuery, 
  setSearchQuery,
  currentLanguage 
}: DomainEmptyStateProps) => {
  return (
    <div className="bg-white rounded-lg p-10 text-center shadow-sm border">
      <div className="flex justify-center mb-4">
        <AlertCircle className="h-12 w-12 text-club-orange/60" />
      </div>
      
      <h3 className="text-xl font-serif text-club-brown mb-2">
        {searchQuery 
          ? (currentLanguage === "en" 
              ? `No domains found for "${searchQuery}"` 
              : `No se encontraron dominios para "${searchQuery}"`) 
          : (currentLanguage === "en" 
              ? "No domains available" 
              : "No hay dominios disponibles")}
      </h3>
      
      {searchQuery && (
        <div className="mt-4">
          <p className="text-club-brown/70 mb-4">
            {currentLanguage === "en" 
              ? "Try a different search term or clear your search" 
              : "Intenta con un término diferente o limpia tu búsqueda"}
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSearchQuery("")}
          >
            {currentLanguage === "en" ? "Clear Search" : "Limpiar Búsqueda"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DomainEmptyState;
