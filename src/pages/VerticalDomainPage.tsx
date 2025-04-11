
import { useParams } from "react-router-dom";
import DomainPage from "./DomainPage";
import { useEffect } from "react";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";
import { useNavigate } from "react-router-dom";
import { toast } from '@/components/ui/use-toast';

const VerticalDomainPage = () => {
  const { verticalPath } = useParams();
  const navigate = useNavigate();
  
  // Validate that the vertical path is valid
  useEffect(() => {
    const path = `/${verticalPath}`;
    if (!VERTICAL_PATHS.includes(path)) {
      console.error(`Invalid vertical path: ${path}`);
      toast({
        title: "Error de navegación",
        description: `La ruta ${path} no es una vertical válida.`,
        variant: "destructive"
      });
      navigate("/dominio", { replace: true });
    }
  }, [verticalPath, navigate]);
  
  // DomainPage component will handle displaying the correct content
  // based on the current route path
  return <DomainPage />;
};

export default VerticalDomainPage;
