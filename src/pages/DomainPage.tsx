
import { useLocation } from "react-router-dom";
import DomainPageContent from "@/components/domains/DomainPageContent";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";

const DomainPage = () => {
  const location = useLocation();
  
  // Extract the domain path from the current URL path
  // This will work for both /dominio, /vertical, and direct domain paths like /chatbot
  const domainPath = location.pathname;
  
  // Determine if this is a vertical domain (legal, arte, etc.)
  const isVerticalDomain = VERTICAL_PATHS.includes(domainPath);
  
  // Use the domain path as is - removing the need for special /dominio/ paths
  return (
    <DomainPageContent 
      domainPath={domainPath} 
      isVerticalDomain={isVerticalDomain} 
    />
  );
};

export default DomainPage;
