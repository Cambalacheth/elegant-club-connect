
import React from "react";
import { Globe } from "lucide-react";

interface DomainPageHeaderProps {
  conceptTitle: string;
  currentLanguage: string;
}

const DomainPageHeader = ({ conceptTitle, currentLanguage }: DomainPageHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Globe size={32} className="text-club-orange" />
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-club-brown">
        {conceptTitle}
      </h1>
    </div>
  );
};

export default DomainPageHeader;
