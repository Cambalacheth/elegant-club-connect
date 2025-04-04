
import React, { useState } from "react";
import { GlobeIcon, ExternalLink, ArrowUpRight, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Domain } from "@/hooks/useDomains";
import { cn } from "@/lib/utils";

interface DomainExpandableCardProps {
  domain: Domain;
  currentLanguage: string;
  getStatusColor: (status: string) => string;
  handleDomainAction: (domain: Domain) => void;
}

const DomainExpandableCard = ({
  domain,
  currentLanguage,
  getStatusColor,
  handleDomainAction
}: DomainExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get the status badge color and label
  const statusLabels = {
    available: currentLanguage === "en" ? "Available" : "Disponible",
    reserved: currentLanguage === "en" ? "Reserved" : "Reservado",
    used: currentLanguage === "en" ? "In Use" : "En Uso",
  };
  
  const statusColor = getStatusColor(domain.status);
  const statusLabel = statusLabels[domain.status as keyof typeof statusLabels];
  
  return (
    <Card 
      className={cn(
        "transition-all duration-300 overflow-hidden",
        isExpanded ? "max-h-[400px]" : "max-h-[200px]",
        domain.status === "used" && "border-club-orange"
      )}
    >
      <CardHeader className={cn("p-4 pb-2", statusColor.includes("bg-") ? statusColor : "")}>
        <div className="flex justify-between items-start">
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <GlobeIcon size={18} className="text-club-brown/70" />
            {domain.name}
          </CardTitle>
          <span 
            className={cn(
              "text-xs rounded-full px-3 py-1 font-medium",
              domain.status === "available" ? "bg-green-100 text-green-800" : 
              domain.status === "reserved" ? "bg-amber-100 text-amber-800" : 
              "bg-blue-100 text-blue-800"
            )}
          >
            {statusLabel}
          </span>
        </div>
        <CardDescription className="mt-2 font-mono text-xs text-club-brown/60">
          {domain.path}
        </CardDescription>
      </CardHeader>
      
      <CardContent className={cn(
        "p-4 pt-2 transition-all duration-300",
        isExpanded ? "opacity-100" : "opacity-80 line-clamp-2"
      )}>
        <p className={cn(
          "text-sm text-club-brown",
          !isExpanded && "line-clamp-2"
        )}>
          {domain.description || (currentLanguage === "en" ? "No description available." : "Descripción no disponible.")}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-club-brown/70 hover:text-club-brown"
        >
          {isExpanded ? 
            (currentLanguage === "en" ? "Show less" : "Mostrar menos") : 
            (currentLanguage === "en" ? "Show more" : "Mostrar más")
          }
        </Button>
        
        <Button 
          variant={domain.status === "available" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleDomainAction(domain)}
          disabled={domain.status === 'reserved'}
          className={cn(
            "flex items-center gap-1",
            domain.status === "available" ? "bg-club-orange hover:bg-club-orange/90" : ""
          )}
        >
          {domain.status === "available" 
            ? (currentLanguage === "en" ? "Claim" : "Reclamar")
            : (currentLanguage === "en" ? "Visit" : "Visitar")
          }
          {domain.externalUrl ? <ExternalLink size={14} /> : <ArrowUpRight size={14} />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DomainExpandableCard;
