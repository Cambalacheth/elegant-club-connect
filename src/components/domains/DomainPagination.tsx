
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DomainPaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  currentLanguage: string;
}

const DomainPagination = ({ 
  currentPage, 
  totalPages, 
  handlePageChange,
  currentLanguage
}: DomainPaginationProps) => {
  // Helper function to generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page, last page, current page, and one page before/after current
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - 1 && i <= currentPage + 1) // Current page and neighbors
      ) {
        pageNumbers.push(i);
      } else if (
        (i === currentPage - 2 && currentPage > 3) || // Ellipsis before
        (i === currentPage + 2 && currentPage < totalPages - 2) // Ellipsis after
      ) {
        pageNumbers.push(-1); // -1 represents an ellipsis
      }
    }
    
    // Remove duplicates and consecutive ellipses
    return pageNumbers.filter((num, index, array) => {
      return index === 0 || num !== array[index - 1] || num !== -1;
    });
  };
  
  // Get array of page numbers to display
  const pageNumbers = getPageNumbers();
  
  // Translation
  const ofText = currentLanguage === "en" ? "of" : "de";
  const pageText = currentLanguage === "en" ? "Page" : "Página";
  
  return (
    <div className="flex justify-center items-center space-x-2 pt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">
          {currentLanguage === "en" ? "Previous page" : "Página anterior"}
        </span>
      </Button>
      
      {pageNumbers.map((page, i) => {
        if (page === -1) {
          return (
            <span key={`ellipsis-${i}`} className="text-club-brown/60 px-2">
              …
            </span>
          );
        }
        
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={`h-8 w-8 ${currentPage === page ? "bg-club-orange hover:bg-club-orange/90" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">
          {currentLanguage === "en" ? "Next page" : "Página siguiente"}
        </span>
      </Button>
      
      <span className="text-sm text-club-brown/60 ml-2">
        {pageText} {currentPage} {ofText} {totalPages}
      </span>
    </div>
  );
};

export default DomainPagination;
