
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DomainSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPlaceholder: string;
}

const DomainSearch = ({ searchQuery, setSearchQuery, searchPlaceholder }: DomainSearchProps) => {
  return (
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
  );
};

export default DomainSearch;
