
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Full URL:",
      window.location.href,
      "Search params:",
      location.search
    );
  }, [location.pathname, location.search]);

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-club-beige">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-club-brown mb-4">404</h1>
          <p className="text-xl text-club-brown mb-2">Página no encontrada</p>
          <p className="text-club-brown/80 mb-6">
            La ruta <span className="font-medium">{location.pathname}</span> no existe o no está disponible.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleGoHome}
              className="w-full bg-club-orange hover:bg-club-terracotta text-white flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Volver a la página principal
            </Button>
            
            <div className="text-sm text-club-brown/60">
              <p>Si accediste directamente a esta URL o refrescaste la página, prueba navegar desde la página principal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
