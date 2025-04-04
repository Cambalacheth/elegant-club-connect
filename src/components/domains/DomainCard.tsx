
import React from "react";
import { GlobeIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Domain } from "@/hooks/useDomains";

interface DomainCardProps {
  domain: Domain;
  hoveredDomain: string | null;
  setHoveredDomain: (id: string | null) => void;
  handleDomainAction: (domain: Domain) => void;
  getStatusColor: (status: string) => string;
  statusLabels: Record<string, string>;
}

const DomainCard = ({
  domain,
  hoveredDomain,
  setHoveredDomain,
  handleDomainAction,
  getStatusColor,
  statusLabels,
}: DomainCardProps) => {
  return (
    <div 
      key={domain.id}
      className={cn(
        "border rounded-lg p-4 transition-all duration-300",
        getStatusColor(domain.status),
        hoveredDomain === domain.id ? "shadow-md transform -translate-y-1" : "",
        "flex flex-col justify-between"
      )}
      onMouseEnter={() => setHoveredDomain(domain.id)}
      onMouseLeave={() => setHoveredDomain(null)}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-bold text-lg flex items-center">
            <GlobeIcon size={16} className="mr-1.5 opacity-70" />
            {domain.name}
          </h3>
          <span className="text-xs rounded-full px-3 py-1 bg-white/50 font-medium">
            {statusLabels[domain.status]}
          </span>
        </div>
        
        <p className="text-sm mb-3 line-clamp-2 min-h-[40px]">{domain.description || "-"}</p>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-mono text-club-brown/60">
          {domain.path}
        </span>
        
        <Button 
          variant={domain.status === "available" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleDomainAction(domain)}
          disabled={domain.status === 'reserved'}
          className={cn(
            domain.externalUrl ? "flex items-center gap-1" : "",
            domain.status === "available" ? "bg-club-orange hover:bg-club-orange/90" : ""
          )}
        >
          {domain.status === "available" 
            ? (domain.currentLanguage === "en" ? "Claim" : "Reclamar")
            : (domain.currentLanguage === "en" ? "Visit" : "Visitar")
          }
          {domain.externalUrl && <ExternalLink size={14} />}
        </Button>
      </div>
    </div>
  );
};

export default DomainCard;
