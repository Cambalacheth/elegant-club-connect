
import { useParams, useNavigate } from "react-router-dom";
import DomainPage from "./DomainPage";
import { useEffect } from "react";
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";
import { toast } from '@/components/ui/use-toast';

const VerticalDomainPage = () => {
  const { verticalPath, "*": remainingPath } = useParams();
  const navigate = useNavigate();
  
  // Special handling for forum links that should redirect to the main forum
  useEffect(() => {
    if (remainingPath === "foro") {
      console.log("Redirecting from vertical forum path to main forum");
      navigate("/forum", { replace: true });
      return;
    }
  }, [remainingPath, navigate]);
  
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
      navigate("/", { replace: true });
    }
  }, [verticalPath, navigate]);
  
  // DomainPage component will handle displaying the correct content
  // based on the current route path
  return <DomainPage />;
};

export default VerticalDomainPage;
