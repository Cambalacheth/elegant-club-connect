
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VerticalDomainHeader from "@/components/verticals/VerticalDomainHeader";
import VerticalDomainContent from "@/components/verticals/VerticalDomainContent";
import { getVerticalInfo } from "@/components/verticals/VerticalDomainHeader";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";

const VerticalPage = () => {
  const { verticalPath } = useParams();
  const [currentLanguage, setCurrentLanguage] = useState("es");
  
  // Construir la ruta actual
  const currentPath = `/${verticalPath}`;
  
  // Verificar que sea una ruta vertical válida
  const isValidVertical = VERTICAL_PATHS.includes(currentPath);
  
  // Obtener información de la vertical
  const verticalInfo = getVerticalInfo(currentPath, currentLanguage);

  return (
    <>
      <Helmet>
        <title>{verticalInfo.title} - Terreta Hub</title>
        <meta name="description" content={verticalInfo.description} />
      </Helmet>
      
      <Navbar currentLanguage={currentLanguage} />
      
      <main>
        <VerticalDomainHeader 
          currentPath={currentPath} 
          currentLanguage={currentLanguage} 
        />
        <VerticalDomainContent 
          currentPath={currentPath} 
          currentLanguage={currentLanguage} 
        />
      </main>
    </>
  );
};

export default VerticalPage;
