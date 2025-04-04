
import React from "react";
import { AlertTriangle, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DomainStatusAlertsProps {
  error: string | null;
  isOffline: boolean;
  currentLanguage: string;
}

const DomainStatusAlerts = ({ error, isOffline, currentLanguage }: DomainStatusAlertsProps) => {
  if (!error && !isOffline) return null;

  return (
    <>
      {isOffline && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <Database className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">
            {currentLanguage === "en" ? "You're offline" : "Estás sin conexión"}
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            {currentLanguage === "en" 
              ? "Using cached domain data. Connect to the internet to see the latest information." 
              : "Usando datos de dominios en caché. Conéctate a internet para ver la información más reciente."}
          </AlertDescription>
        </Alert>
      )}
      
      {error && !isOffline && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {currentLanguage === "en" ? "Connection issue" : "Problema de conexión"}
          </AlertTitle>
          <AlertDescription>
            {currentLanguage === "en" 
              ? "Using cached data. Information may not be up to date." 
              : "Usando datos en caché. La información puede no estar actualizada."}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DomainStatusAlerts;
